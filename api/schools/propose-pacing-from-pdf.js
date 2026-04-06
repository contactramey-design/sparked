/**
 * POST /api/schools/propose-pacing-from-pdf
 * Multipart: pdf, class_id. Auth: Bearer teacher JWT.
 * Returns pacing hints for human confirmation before full weekly generation.
 */
import { createClient } from '@supabase/supabase-js'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

export const config = {
  api: { bodyParser: false, responseLimit: false },
}

const MAX_PDF_BYTES = 8.5 * 1024 * 1024

function getBearerToken(req) {
  const header = req?.headers?.authorization || req?.headers?.Authorization
  if (!header || typeof header !== 'string') return null
  const m = header.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? null
}

async function parseMultipart(req) {
  const { IncomingForm } = await import('formidable')
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: MAX_PDF_BYTES,
      maxTotalFileSize: MAX_PDF_BYTES,
    })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

function safeJsonParse(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const jsonStr = (codeFenceMatch?.[1] ?? trimmed).trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

async function extractPdfText(pdfBuffer) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = ''
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise
  const maxPages = Math.min(pdf.numPages || 0, 10)
  const maxChars = 12000
  let out = ''
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const content = await page.getTextContent()
    const strings = (content?.items || []).map((i) => (i && typeof i.str === 'string' ? i.str : '')).filter(Boolean)
    const pageText = strings.join(' ')
    out += `\n${pageText}`
    if (out.length >= maxChars) break
  }
  return out.replace(/\s+/g, ' ').trim()
}

async function proposePacing({ pdfText, locale }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const trimmed = pdfText.slice(0, 6000)
  const isEs = locale === 'es'
  const system = isEs
    ? `Eres un asistente curricular. A partir del texto extraído de un PDF de planeación escolar, identifica temas centrales y posibles semanas/unidades SIN inventar texto que no esté implícito.
Reglas:
- Ignora nombres de personas, escuelas o datos identificables.
- Responde SOLO JSON válido con esta forma exacta:
{"detectedThemes": string[], "weeklyFocusSummary": string, "pacingNotes": string[], "confidence": "high"|"medium"|"low"}
- detectedThemes: máximo 8 frases cortas (4–8 palabras).
- weeklyFocusSummary: 2–4 oraciones en español claro para el docente sobre qué cubre probablemente el PDF esta semana.
- pacingNotes: 0–6 notas sobre lagunas o texto poco claro (ej. “fechas no visibles”).
- confidence: alta solo si el PDF parece una agenda/semana clara; media o baja si es escaneo pobre o muy genérico.`
    : `You are a curriculum assistant. From extracted planning PDF text, infer central themes and likely week focus without inventing content not implied by the text.
Rules:
- Ignore personal names, school names, or identifiable details.
- Respond ONLY with valid JSON shaped exactly as:
{"detectedThemes": string[], "weeklyFocusSummary": string, "pacingNotes": string[], "confidence": "high"|"medium"|"low"}
- detectedThemes: at most 8 short phrases (4–8 words).
- weeklyFocusSummary: 2–4 plain sentences for a teacher about what this PDF likely emphasizes this week.
- pacingNotes: 0–6 notes about gaps or ambiguity (e.g. “no visible dates”).
- confidence: high only if the PDF looks like a clear weekly plan; medium/low if vague or thin text.`

  const user = `PDF_TEXT:\n${trimmed}\n\nReturn the JSON object now.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: 900,
      temperature: 0.35,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(res.status === 429 ? 'Rate limit. Please try again in a moment.' : `OpenAI error: ${errText}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content?.trim()
  const parsed = safeJsonParse(raw || '')
  if (!parsed || !Array.isArray(parsed.detectedThemes) || typeof parsed.weeklyFocusSummary !== 'string') {
    throw new Error('Invalid pacing proposal from model')
  }
  const pacingNotes = Array.isArray(parsed.pacingNotes) ? parsed.pacingNotes.filter((x) => typeof x === 'string') : []
  const confidence = ['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium'
  const themes = parsed.detectedThemes.filter((x) => typeof x === 'string').slice(0, 8)
  return {
    detectedThemes: themes,
    weeklyFocusSummary: parsed.weeklyFocusSummary.trim(),
    pacingNotes,
    confidence,
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const accessToken = getBearerToken(req)
    if (!accessToken) {
      res.status(401).json({ error: 'Missing teacher access token.' })
      return
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      res.status(500).json({ error: 'Supabase is not configured on the server.' })
      return
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    })

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user?.id) {
      res.status(401).json({ error: 'Invalid teacher session.' })
      return
    }
    const teacherId = userData.user.id

    const { fields, files } = await parseMultipart(req)
    const pdfFile = files?.pdf?.[0] ?? files?.pdf
    const classId = (fields?.class_id?.[0] ?? fields?.class_id ?? '').toString().trim()
    const locale = (fields?.locale?.[0] ?? fields?.locale ?? 'en').toString().trim()

    if (!classId) {
      res.status(400).json({ error: 'Missing class_id.' })
      return
    }
    if (!pdfFile?.filepath) {
      res.status(400).json({ error: 'Missing or invalid pdf file. Use multipart field "pdf".' })
      return
    }

    const { data: classRow, error: classErr } = await supabase
      .from('school_classes')
      .select('id, teacher_id')
      .eq('id', classId)
      .maybeSingle()

    if (classErr || !classRow || classRow.teacher_id !== teacherId) {
      res.status(403).json({ error: 'Class not found or access denied.' })
      return
    }

    const fs = await import('node:fs')
    const pdfBuffer = await fs.promises.readFile(pdfFile.filepath)
    const pdfText = await extractPdfText(pdfBuffer)
    if (!pdfText || pdfText.length < 50) {
      res.status(400).json({ error: 'Could not extract enough text from the PDF.' })
      return
    }

    const proposal = await proposePacing({ pdfText, locale: locale === 'es' ? 'es' : 'en' })
    res.status(200).json(proposal)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Something went wrong.'
    const safeMessage =
      message.includes('OPENAI_API_KEY') ? 'Service not configured. Please try again later.'
      : message.includes('Rate limit') ? 'Too many requests. Please try again in a moment.'
      : message
    res.status(500).json({ error: safeMessage })
  }
}
