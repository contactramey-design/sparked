/**
 * POST /api/schools/generate-weekly-units
 * Body: multipart/form-data
 *  - pdf: File (application/pdf)
 *  - class_id: uuid string
 *  - locale: optional 'en'|'es' (defaults 'en')
 *  - generate_video: optional 'true'|'false' (defaults 'false')
 *  - teacher_pacing_confirmed: required 'true' — teacher reviewed PDF pacing in the UI first.
 *
 * Auth:
 *  - Teacher access token must be provided as Authorization: Bearer <jwt>.
 *  - Backend uses that identity for Supabase DB + Storage writes (RLS enforced).
 */
import { createClient } from '@supabase/supabase-js'
import { createHash, randomUUID } from 'node:crypto'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
import { bearerAuthHeaders } from '../lib/serviceAuth.js'

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

function bandAudienceLabel(band, lang) {
  const b = normalizeAgeBand(band)
  if (lang === 'es') {
    if (b === 'tots') return 'educación infantil (3–5 años): frases muy cortas, vocabulario concreto, mucha repetición amable'
    if (b === 'crew') return 'primaria superior (9–11 años): más detalle, conexiones entre ideas, vocabulario académico accesible'
    return 'primaria temprana (6–8 años): claridad, apoyo visual en el texto, preguntas guiadas'
  }
  if (b === 'tots') return 'early childhood (ages 3–5): very short sentences, concrete vocabulary, gentle repetition'
  if (b === 'crew') return 'upper elementary (ages 9–11): richer explanations, connect ideas, age-appropriate academic language'
  return 'early elementary (ages 6–8): clear explanations, scaffolded questions, kid-friendly but precise'
}

function buildSystemPrompt(locale, ageBand = 'kids') {
  const isEs = locale === 'es'
  const ageLine = ageBandInstruction(ageBand, isEs ? 'es' : 'en')
  const audience = bandAudienceLabel(ageBand, isEs ? 'es' : 'en')
  if (isEs) {
    return `Eres un equipo curricular (dirección académica): diseñas unidades semanales alineadas al PDF del docente y a los marcos oficiales de **California** según la edad:
- **tots (3–5):** Fundamentos de aprendizaje preescolar de California (PTKLF).
- **kids (6–8) y crew (9–11):** CA CCSS (matemáticas y ELA), NGSS de California (ciencias) y CA HSS / marco de historia y estudios sociales (2016) cuando aplique.

Audiencia: ${audience}

Reglas:
- Ignora cualquier nombre de persona, escuela, dirección, correos o datos identificables.
- Crea un nombre corto de “semana” y exactamente 3 unidades.
- Para cada unidad:
  - Titulo y resumen claros; el resumen debe decir qué aprenderá el estudiante (objetivo de aprendizaje en lenguaje sencillo).
  - contentBlocks: array de strings (8 a 12 lineas en total):
    - exactamente 1 linea "Historia:" (ancla narrativa breve ligada al tema del PDF).
    - incluye variedad pedagogica con etiquetas claras al inicio (usa varias de estas en español): "Vocabulario:", "Idea clave:", "Ejemplo:", "Pausa:", "Comprueba:", "Conexion:", "Discusion:", "Idea erronea:", "Extension:", "Regla:", "Juego:", "Escenario:".
    - al menos una linea debe ser un error comun suave ("Idea errónea:") y su correccion en la misma linea o la siguiente.
    - al menos una "Comprueba:" con una pregunta breve de comprension.
  - quizQuestions: entre 8 y 10 preguntas de opcion multiple (3 opciones cada una):
    - mezcla: recordar vocabulario, idea principal, aplicacion corta, y un mini escenario de 1-2 frases.
    - cada pregunta: id (string unico), prompt (string), options (3 strings), correctIndex (0-2).
    - evita respuestas obvias por longitud; distractores plausibles.
  - homeworkAdventure: title, subject, topic; steps: EXACTAMENTE 5 pasos (id, story 2-3 frases, prompt, hint sin dar la respuesta). La aventura debe reforzar el objetivo de esta unidad y NO introducir nuevos estándares obligatorios.
  - realWorldTip: string obligatorio (1-3 oraciones en español claro) que conecte la lección con la vida fuera de pantalla (casa, salón o comunidad). Debe incluir UNA acción concreta que las familias puedan intentar sin dispositivo. NO menciones a Sparki como entidad real; Sparki solo puede aparecer dentro de homeworkAdventure como fantasía, pero realWorldTip se mantiene anclado en la realidad.
  - standardCodes: array opcional de 0 a 12 cadenas cortas con códigos o referencias alineadas a California (ej. "1.OA.A.1", "2-PS1-1", "1.RI.2", descriptores PTKLF o HSS). Son solo para el docente: NO pongas estos códigos dentro de contentBlocks, quizQuestions ni homeworkAdventure (el texto para estudiantes debe estar sin códigos).
- ${ageLine}
- No incluyas markdown ni texto fuera del JSON.
- Responde SOLO con un JSON valido con esta forma:
{
  "weekly_track_label": string,
  "units": [
    {
      "title": string,
      "summary": string,
      "standardCodes": string[],
      "contentBlocks": string[],
      "quizQuestions": Array<{id:string,prompt:string,options:string[],correctIndex:number}>,
      "homeworkAdventure": {
        "title": string,
        "subject": string,
        "topic": string,
        "steps": Array<{id:string,story:string,prompt:string,hint:string}>
      },
      "realWorldTip": string
    }
  ]
}`
  }

  return `You are a curriculum director and instructional designer. Build weekly units grounded in the teacher’s PDF and **California** official frameworks for the class age band:
- **tots (ages 3–5):** California Preschool Learning Foundations (PTKLF).
- **kids (ages 6–8) and crew (ages 9–11):** CA CCSS (math & ELA), California NGSS (science), and CA History–Social Science (2016 framework themes) as applicable.

Audience: ${audience}

Rules:
- Ignore any personal names, school names, addresses, emails, or other identifying details.
- Create a short weekly track label and exactly 3 units.
- For each unit:
  - Kid-friendly title and summary; the summary must state a clear learning goal in plain language.
  - contentBlocks: array of strings (8–12 lines total):
    - exactly one line starting with "Story:" (short narrative hook tied to the PDF theme).
    - include a rich mix of instructional labels such as: "Vocabulary:", "Key idea:", "Worked example:", "Rule:", "Pause:", "Check:", "Connection:", "Discussion:", "Misconception:", "Extension:", "Scenario:", "Game:".
    - include at least one "Misconception:" line (gentle correction of a common mistake).
    - include at least one "Check:" line with a quick comprehension question in text.
  - quizQuestions: 8–10 multiple-choice items (3 options each):
    - mix recall, main idea, short application, and one brief scenario (1–2 sentences) per unit.
    - each item: id (unique string), prompt, options (3 strings), correctIndex (0–2).
    - use plausible distractors; avoid “longest answer is correct.”
  - homeworkAdventure: title, subject, topic; steps: EXACTLY 5 steps (id, story 2–3 sentences, prompt, Socratic hint without the final answer). The adventure must reinforce this unit’s objective and must **not** introduce new required standards.
  - realWorldTip: required string (1–3 sentences) that connects the lesson to offline, observable life (home, classroom, or community). Include ONE clear action families can try without a screen. Do **not** describe Sparki as a real entity; Sparki may only appear inside homeworkAdventure as fantasy framing, but realWorldTip stays grounded in reality.
  - standardCodes: optional array of 0–12 short strings: California-aligned codes or labels for teachers only (e.g. "3.OA.A.1", "4-ESS2-1", "1.RI.2", PTKLF or HSS descriptors). Do **not** put these codes inside student-facing contentBlocks, quizQuestions, or homeworkAdventure text (keep student text code-free).
- ${ageLine}
- No markdown or text outside JSON.
- Respond ONLY with valid JSON with this shape:
{
  "weekly_track_label": string,
  "units": [
    {
      "title": string,
      "summary": string,
      "standardCodes": string[],
      "contentBlocks": string[],
      "quizQuestions": Array<{id:string,prompt:string,options:string[],correctIndex:number}>,
      "homeworkAdventure": {
        "title": string,
        "subject": string,
        "topic": string,
        "steps": Array<{id:string,story:string,prompt:string,hint:string}>
      },
      "realWorldTip": string
    }
  ]
}`
}

function validateRealWorldTip(tip) {
  if (typeof tip !== 'string') return false
  const s = tip.trim()
  if (s.length < 20) return false
  return true
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
      max_tokens: 4500,
      temperature: 0.55,
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
  if (!Array.isArray(quizQuestions) || quizQuestions.length < 7 || quizQuestions.length > 12) return false
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

/** Optional teacher-facing CA-aligned codes from the model; omit if empty. */
function normalizeStandardCodes(raw) {
  if (!Array.isArray(raw)) return undefined
  const out = raw
    .filter((x) => typeof x === 'string')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map((s) => (s.length > 120 ? s.slice(0, 120) : s))
  return out.length ? out : undefined
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
        headers: { 'Content-Type': 'application/json', ...bearerAuthHeaders() },
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
  /** @type {string | null} */
  let runId = null
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
    const teacherPacingConfirmed = normalizeBool(
      fields?.teacher_pacing_confirmed?.[0] ?? fields?.teacher_pacing_confirmed ?? false,
    )

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

    if (!teacherPacingConfirmed) {
      res.status(400).json({
        error:
          'Confirm PDF pacing before generating. Use “Review PDF pacing” in the weekly generator, then generate.',
      })
      return
    }

    runId = randomUUID()
    const pdfTextHash = createHash('sha256').update(pdfText).digest('hex').slice(0, 40)
    const { error: runInsErr } = await supabase.from('weekly_generation_runs').insert({
      id: runId,
      teacher_id: teacherId,
      class_id: classId,
      pdf_text_hash: pdfTextHash,
      model: 'gpt-4o',
      prompt_version: 'weekly-v2-realworld-pacing',
      locale: locale === 'es' ? 'es' : 'en',
      status: 'started',
    })
    if (runInsErr) {
      console.warn('[generate-weekly-units] weekly_generation_runs insert skipped:', runInsErr.message)
      runId = null
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
      const realWorldTip = typeof u?.realWorldTip === 'string' ? u.realWorldTip.trim() : ''
      const standardCodes = normalizeStandardCodes(u?.standardCodes)
      const contentBlocks = Array.isArray(u?.contentBlocks) ? u.contentBlocks.filter((x) => typeof x === 'string') : []
      let quizQuestions = Array.isArray(u?.quizQuestions) ? u.quizQuestions : []
      if (quizQuestions.length > 12) quizQuestions = quizQuestions.slice(0, 12)
      const homeworkAdventure = u?.homeworkAdventure

      return { title, summary, realWorldTip, standardCodes, contentBlocks, quizQuestions, homeworkAdventure }
    })

    for (const [i, u] of normalizedUnits.entries()) {
      if (!u.summary || u.summary.length < 5) {
        res.status(500).json({ error: `Model returned an invalid summary for unit ${i + 1}.` })
        return
      }
      if (!Array.isArray(u.contentBlocks) || u.contentBlocks.length < 6) {
        res.status(500).json({ error: `Model returned invalid contentBlocks for unit ${i + 1}.` })
        return
      }
      if (!validateQuizQuestions(u.quizQuestions)) {
        res.status(500).json({ error: `Model returned invalid quizQuestions for unit ${i + 1}.` })
        return
      }
      if (!validateRealWorldTip(u.realWorldTip)) {
        res.status(500).json({ error: `Model returned an invalid realWorldTip for unit ${i + 1}.` })
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
          realWorldTip: u.realWorldTip,
          ...(u.standardCodes?.length ? { standardCodes: u.standardCodes } : {}),
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
      if (runId) {
        await supabase
          .from('weekly_generation_runs')
          .update({
            status: 'error',
            error_message: 'Failed to create generated units.',
            updated_at: new Date().toISOString(),
          })
          .eq('id', runId)
      }
      res.status(500).json({ error: 'Failed to create generated units.' })
      return
    }

    if (runId) {
      const nowIso = new Date().toISOString()
      await supabase
        .from('weekly_generation_runs')
        .update({
          status: 'success',
          generator_id: generatorId,
          updated_at: nowIso,
        })
        .eq('id', runId)
      const { error: auditErr } = await supabase.from('governance_audit_log').insert({
        actor_uid: teacherId,
        action: 'generate_weekly',
        metadata: { run_id: runId, generator_id: generatorId, class_id: classId },
      })
      if (auditErr) console.warn('[generate-weekly-units] governance_audit_log:', auditErr.message)
    }

    res.status(200).json({
      generatorId,
      weeklyTrackLabel: weeklyTrackLabel.trim(),
      classAgeBand: ageBand,
      units: rows.map((r) => ({ unitId: r.unit_id, title: r.unit_json.title })),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Something went wrong.'
    const safeMessage =
      message.includes('OPENAI_API_KEY') ? 'Service not configured. Please try again later.'
      : message.includes('Rate limit') ? 'Too many requests. Please try again in a moment.'
      : message.includes('Invalid generator response') ? 'Could not generate content from this PDF. Please try a different PDF.'
      : message

    try {
      const accessToken = getBearerToken(req)
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
      const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
      if (runId && accessToken && supabaseUrl && supabaseAnonKey) {
        const supabaseErr = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false },
          global: { headers: { Authorization: `Bearer ${accessToken}` } },
        })
        await supabaseErr
          .from('weekly_generation_runs')
          .update({
            status: 'error',
            error_message: safeMessage.slice(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq('id', runId)
      }
    } catch {
      /* ignore logging failures */
    }

    res.status(500).json({ error: safeMessage })
  }
}

