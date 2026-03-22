/**
 * POST /api/schools/generate-weekly-units
 * Body: multipart/form-data
 *  - pdf: File (application/pdf)
 *  - class_id: uuid string
 *  - locale: optional 'en'|'es' (defaults 'en')
 *  - generate_video: optional 'true'|'false' (defaults 'false')
 *
 * Auth:
 *  - Teacher access token must be provided as Authorization: Bearer <jwt>.
 *  - Backend uses that identity for Supabase DB + Storage writes (RLS enforced).
 */
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'

export const config = {
  api: { bodyParser: false, responseLimit: false },
}

const MAX_PDF_BYTES = 8.5 * 1024 * 1024 // ~8.5 MB (Vercel/serverless-friendly)

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

function normalizeBool(v) {
  if (v === true) return true
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1' || v.toLowerCase() === 'yes'
  return false
}

function normalizeAgeBand(v) {
  if (v === 'tots' || v === 'kids' || v === 'crew') return v
  return 'kids'
}

/** Target age for weekly PDF generator prompts (matches app age bands). */
function ageBandInstruction(band, lang) {
  const b = normalizeAgeBand(band)
  if (lang === 'es') {
    if (b === 'tots') {
      return 'Mantén todo el texto en español sencillo para niños de 3 a 5 años (frases muy cortas, vocabulario básico).'
    }
    if (b === 'crew') {
      return 'Mantén todo el texto en español claro para niños de 9 a 11 años (un poco más de detalle, aún amigable).'
    }
    return 'Mantén todo el texto en español sencillo y amigable para niños de 6 a 8 años.'
  }
  if (b === 'tots') {
    return 'Keep all text in simple English for children ages 3–5 (preschool-style, very short sentences).'
  }
  if (b === 'crew') {
    return 'Keep all text in clear English for children ages 9–11 (slightly richer detail, still kid-friendly).'
  }
  return 'Keep all text in simple, kid-friendly English for children ages 6–8.'
}

function safeJsonParse(raw) {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  // Strip possible markdown code fences
  const codeFenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const jsonStr = (codeFenceMatch?.[1] ?? trimmed).trim()
  try {
    return JSON.parse(jsonStr)
  } catch {
    return null
  }
}

async function extractPdfText(pdfBuffer) {
  // For PDF text extraction we use pdfjs-dist legacy build.
  // In Node we do not need a worker.
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

  // Normalize whitespace to help the model parse.
  return out.replace(/\s+/g, ' ').trim()
}

function buildSystemPrompt(locale, ageBand = 'kids') {
  const isEs = locale === 'es'
  const ageLine = ageBandInstruction(ageBand, isEs ? 'es' : 'en')
  if (isEs) {
    return `Eres un asistente educativo. Vas a crear material para K–2 basandote en el contenido de un PDF de un profesor.

Reglas:
- Ignora cualquier nombre de persona, escuela, dirección, correos o datos identificables.
- Crea un nombre corto de “semana” y 3 unidades.
- Para cada unidad:
  - Produce un titulo y un resumen para niños.
  - Produce contentBlocks como un array de strings:
    - incluye exactamente 1 linea de historia que empiece con "Historia:"
    - incluye 3 a 6 lineas adicionales que empiecen con etiquetas como "Regla:", "Pausa:" o "Idea:" (pueden variar), sin comillas adicionales.
  - Produce quizQuestions como array con 3 a 5 preguntas:
    - cada pregunta tiene: id (string), prompt (string), options (array de 3 strings) y correctIndex (numero 0-2).
  - Produce homeworkAdventure con:
    - title, subject, topic
    - steps: EXACTAMENTE 5 pasos
      cada step tiene: id (string), story (2-3 frases), prompt (frase corta) y hint (pista suave sin dar la respuesta).
- ${ageLine}
- No incluyas markdown ni texto extra.
- Responde SOLO con un JSON valido con esta forma:
{
  "weekly_track_label": string,
  "units": [
    {
      "title": string,
      "summary": string,
      "contentBlocks": string[],
      "quizQuestions": Array<{id:string,prompt:string,options:string[],correctIndex:number}>,
      "homeworkAdventure": {
        "title": string,
        "subject": string,
        "topic": string,
        "steps": Array<{id:string,story:string,prompt:string,hint:string}>
      }
    }
  ]
}`
  }

  return `You are an educational assistant. You will create K–2 material based on a teacher PDF.

Rules:
- Ignore any personal names, school names, addresses, emails, or other identifying details.
- Create a short weekly track label and 3 units.
- For each unit:
  - Provide a kid-friendly title and summary.
  - Provide contentBlocks as an array of strings:
    - include exactly 1 story line that starts with "Story:"
    - include 3 to 6 additional lines starting with labels like "Rule:", "Pause:", "Idea:" or similar (labels can vary).
  - Provide quizQuestions as an array of 3 to 5 questions:
    - each question has: id (string), prompt (string), options (array of 3 strings), and correctIndex (number 0-2).
  - Provide homeworkAdventure with:
    - title, subject, topic
    - steps: EXACTLY 5 steps
      each step has: id (string), story (2-3 sentences), prompt (short phrase), and hint (gentle Socratic hint without giving the answer).
- ${ageLine}
- Do not include markdown or any extra text.
- Respond ONLY with valid JSON with this shape:
{
  "weekly_track_label": string,
  "units": [
    {
      "title": string,
      "summary": string,
      "contentBlocks": string[],
      "quizQuestions": Array<{id:string,prompt:string,options:string[],correctIndex:number}>,
      "homeworkAdventure": {
        "title": string,
        "subject": string,
        "topic": string,
        "steps": Array<{id:string,story:string,prompt:string,hint:string}>
      }
    }
  ]
}`
}

async function generateWeeklyUnits({ pdfText, locale, ageBand = 'kids' }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const maxPdfLen = 6000
  const trimmed = pdfText.slice(0, maxPdfLen)

  const systemPrompt = buildSystemPrompt(locale, normalizeAgeBand(ageBand))
  const userPrompt = `Here is the teacher PDF content (possibly extracted text). Use it as source material.\n\nPDF_TEXT:\n${trimmed}\n\nNow generate the requested weekly label and 3 units JSON.`

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1700,
      temperature: 0.7,
    }),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(res.status === 429 ? 'Rate limit. Please try again in a moment.' : `OpenAI error: ${errText}`)
  }

  const data = await res.json()
  const raw = data?.choices?.[0]?.message?.content?.trim()
  const parsed = safeJsonParse(raw || '')
  if (!parsed?.weekly_track_label || !Array.isArray(parsed?.units) || parsed.units.length !== 3) {
    throw new Error('Invalid generator response shape from model')
  }
  return parsed
}

function validateQuizQuestions(quizQuestions) {
  if (!Array.isArray(quizQuestions) || quizQuestions.length < 3) return false
  return quizQuestions.every((q) => {
    const ok =
      q &&
      typeof q.id === 'string' &&
      typeof q.prompt === 'string' &&
      Array.isArray(q.options) &&
      q.options.length === 3 &&
      q.options.every((o) => typeof o === 'string') &&
      typeof q.correctIndex === 'number' &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 2
    return ok
  })
}

function validateHomeworkSteps(steps) {
  if (!Array.isArray(steps) || steps.length !== 5) return false
  return steps.every((s) => {
    const ok =
      s &&
      typeof s.id === 'string' &&
      typeof s.story === 'string' &&
      s.story.trim().length > 0 &&
      typeof s.prompt === 'string' &&
      s.prompt.trim().length > 0 &&
      typeof s.hint === 'string'
    return ok
  })
}

async function generateHomeworkVideoForUnit({ homeworkAdventure, locale }) {
  if (process.env.VIDEO_FEATURE_ENABLED !== 'true') return null
  const workerUrlRaw = (process.env.VIDEO_WORKER_URL || '').trim()
  if (!workerUrlRaw) return null

  let workerUrl = workerUrlRaw
  // Fix common typo: ttps:// → https://
  if (workerUrl.startsWith('ttps://')) workerUrl = 'h' + workerUrl
  else if (workerUrl.startsWith('ttp://')) workerUrl = 'ht' + workerUrl

  const generateUrl = `${workerUrl.replace(/\/$/, '')}/generate`
  const timeoutMs = 120_000
  const maxAttempts = 3
  const retryDelayMs = 4000
  const retryableStatuses = [502, 503, 504]

  const payload = {
    adventure: {
      title: homeworkAdventure.title,
      subject: homeworkAdventure.subject,
      topic: homeworkAdventure.topic,
      steps: homeworkAdventure.steps,
    },
    locale: locale || 'en',
    useSquad: true,
  }

  let lastError = null
  let response = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    try {
      response = await fetch(generateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      const retryable = retryableStatuses.includes(response.status) && attempt < maxAttempts
      if (retryable) {
        await response.text().catch(() => '')
        response = null
        await new Promise((r) => setTimeout(r, retryDelayMs))
      } else {
        break
      }
    } catch (e) {
      clearTimeout(timeoutId)
      lastError = e
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, retryDelayMs))
      }
    }
  }

  if (!response || !response.ok) {
    // Treat video errors as non-fatal for content generation.
    return null
  }

  const raw = await response.text().catch(() => '')
  const data = safeJsonParse(raw) || {}
  if (typeof data?.videoUrl === 'string') return data.videoUrl
  return null
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

    // Ensure token maps to an actual user (RLS uses auth.uid()).
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
    const generateVideo = normalizeBool(fields?.generate_video?.[0] ?? fields?.generate_video ?? false)

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
      .select('id, teacher_id, age_band')
      .eq('id', classId)
      .maybeSingle()

    if (classErr || !classRow || classRow.teacher_id !== teacherId) {
      res.status(403).json({ error: 'Class not found or access denied.' })
      return
    }

    const ageBand = normalizeAgeBand(classRow.age_band)

    const fs = await import('node:fs')
    const pdfBuffer = await fs.promises.readFile(pdfFile.filepath)

    const pdfText = await extractPdfText(pdfBuffer)
    if (!pdfText || pdfText.length < 50) {
      res.status(400).json({ error: 'Could not extract enough text from the PDF.' })
      return
    }

    const { weekly_track_label: weeklyTrackLabel, units } = await generateWeeklyUnits({
      pdfText,
      locale: locale === 'es' ? 'es' : 'en',
      ageBand,
    })

    // Validate the model output shape enough to prevent broken downstream UI.
    const normalizedUnits = units.map((u, idx) => {
      const title = typeof u?.title === 'string' ? u.title.trim() : `Generated Unit ${idx + 1}`
      const summary = typeof u?.summary === 'string' ? u.summary.trim() : ''
      const contentBlocks = Array.isArray(u?.contentBlocks) ? u.contentBlocks.filter((x) => typeof x === 'string') : []
      const quizQuestions = Array.isArray(u?.quizQuestions) ? u.quizQuestions : []
      const homeworkAdventure = u?.homeworkAdventure

      return { title, summary, contentBlocks, quizQuestions, homeworkAdventure }
    })

    for (const [i, u] of normalizedUnits.entries()) {
      if (!u.summary || u.summary.length < 5) {
        res.status(500).json({ error: `Model returned an invalid summary for unit ${i + 1}.` })
        return
      }
      if (!Array.isArray(u.contentBlocks) || u.contentBlocks.length < 3) {
        res.status(500).json({ error: `Model returned invalid contentBlocks for unit ${i + 1}.` })
        return
      }
      if (!validateQuizQuestions(u.quizQuestions)) {
        res.status(500).json({ error: `Model returned invalid quizQuestions for unit ${i + 1}.` })
        return
      }
      if (!u.homeworkAdventure || typeof u.homeworkAdventure !== 'object') {
        res.status(500).json({ error: `Model returned invalid homeworkAdventure for unit ${i + 1}.` })
        return
      }
      const stepsOk = validateHomeworkSteps(u.homeworkAdventure.steps)
      if (!stepsOk) {
        res.status(500).json({ error: `Model returned invalid homeworkAdventure.steps for unit ${i + 1}.` })
        return
      }
    }

    const generatorId = randomUUID()
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()

    const pdfStorageBucket = 'school-generated-curriculum'
    const pdfStoragePath = `teacher/${teacherId}/class/${classId}/generators/${generatorId}/source.pdf`

    // 1) Generate optional videos per unit (non-fatal).
    const homeworkVideoUrls = []
    if (generateVideo) {
      for (const u of normalizedUnits) {
        const url = await generateHomeworkVideoForUnit({
          homeworkAdventure: u.homeworkAdventure,
          locale,
        })
        homeworkVideoUrls.push(url)
      }
    }

    // 2) Persist generator + units.
    // We supply generator_id explicitly so we can also upload the PDF to a deterministic path.
    const { data: generatorRow, error: genErr } = await supabase
      .from('school_weekly_generators')
      .insert({
        id: generatorId,
        class_id: classId,
        teacher_id: teacherId,
        weekly_track_label: weeklyTrackLabel.trim(),
        pdf_storage_bucket: pdfStorageBucket,
        pdf_storage_path: pdfStoragePath,
        expires_at: expiresAt,
      })
      .select('id')
      .single()

    if (genErr || !generatorRow?.id) {
      res.status(500).json({ error: 'Failed to create generator.' })
      return
    }

    // Upload PDF (RLS via storage.objects policies).
    // This should be non-fatal for the MVP: even if Storage policies/bucket aren't fully set up
    // yet, the generator tables (weekly label + units) are what students consume.
    try {
      await supabase.storage.from(pdfStorageBucket).upload(pdfStoragePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })
    } catch (e) {
      console.warn('[generate-weekly-units] PDF upload failed (non-fatal):', e?.message || e)
    }

    const unitIds = ['u1', 'u2', 'u3'].map((suffix) => `gen-${generatorId}-${suffix}`)

    const rows = normalizedUnits.map((u, i) => {
      const unitId = unitIds[i]
      const homeworkVideoUrl = generateVideo ? homeworkVideoUrls[i] : null
      return {
        generator_id: generatorId,
        unit_id: unitId,
        track_label: weeklyTrackLabel.trim(),
        unit_json: {
          id: unitId,
          title: u.title,
          summary: u.summary,
          estMinutes: 20,
          ageGroup: 'age2',
          ageBand,
          isFree: true,
          sparklesReward: 10,
          contentBlocks: u.contentBlocks,
          quizQuestions: u.quizQuestions,
          homeworkAdventure: u.homeworkAdventure,
          homeworkAdventureVideoUrl: typeof homeworkVideoUrl === 'string' ? homeworkVideoUrl : undefined,
        },
      }
    })

    const { error: unitsErr } = await supabase.from('school_weekly_generator_units').insert(rows)
    if (unitsErr) {
      res.status(500).json({ error: 'Failed to create generated units.' })
      return
    }

    res.status(200).json({
      generatorId,
      weeklyTrackLabel: weeklyTrackLabel.trim(),
      units: rows.map((r) => ({ unitId: r.unit_id, title: r.unit_json.title })),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Something went wrong.'
    const safeMessage =
      message.includes('OPENAI_API_KEY') ? 'Service not configured. Please try again later.'
      : message.includes('Rate limit') ? 'Too many requests. Please try again in a moment.'
      : message.includes('Invalid generator response') ? 'Could not generate content from this PDF. Please try a different PDF.'
      : message
    res.status(500).json({ error: safeMessage })
  }
}

