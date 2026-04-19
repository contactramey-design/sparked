/**
 * Vercel serverless: POST /api/process-homework (legacy one-shot adventure).
 * Prefer the split pipeline: /api/homework/analyze → explain → story (see HOMEWORK-GENERATOR.md).
 * Body: multipart/form-data with field "image" (file).
 * Optional fields: checkout_session_id (required in production) — must be a Stripe Checkout session
 * for Adventure Academy (active or trialing subscription).
 * Dev: set ALLOW_UNAUTH_HOMEWORK=true to skip server-side entitlement (local only).
 * Returns: { title, subject, topic, steps } — homework-specific adventure JSON.
 * COPPA: Process image in memory only; do not store or log image bytes.
 */
import { isHomeworkEntitlementBypassed } from './homework/lib/multipart.js'
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'

const MAX_BODY_BYTES = 4.5 * 1024 * 1024 // 4.5 MB (Vercel limit)

export const config = {
  api: { bodyParser: false },
}

async function parseMultipart(req) {
  const { IncomingForm } = await import('formidable')
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: MAX_BODY_BYTES,
      maxTotalFileSize: MAX_BODY_BYTES,
    })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

async function loadSquadNames() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const squadPath = path.join(process.cwd(), 'public', 'adventure-assets', 'squad.json')
    const raw = await fs.promises.readFile(squadPath, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((m) => (m && typeof m.name === 'string' ? m.name.trim() : ''))
      .filter(Boolean)
  } catch {
    // If the file is missing or invalid, just skip squad behavior
    return []
  }
}

async function analyzeAndGenerateAdventure(imageBuffer, mimeType, ageHint, subjectHint, locale = 'en') {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  const base64 = imageBuffer.toString('base64')
  const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64}`

  const squadNames = await loadSquadNames()
  const squadText = squadNames.length ? ` There is a friendly teaching team: ${squadNames.join(', ')}. Weave the whole team into the adventure so the child is guided by each character. Use their names naturally in the story, but do not add any new personal details about them beyond being friendly helpers.` : ''

  const isEs = locale === 'es'

  const systemPrompt = isEs
    ? `Eres un asistente educativo. Analizas imágenes de tareas y creas pequeñas aventuras con historia y preguntas para niños de K–2.
Reglas:
- Describe solo la asignatura y el tema (por ejemplo: matemáticas, sumas hasta 20; lectura, palabras de uso frecuente). NO extraigas nombres, nombres de escuela, direcciones ni otros datos identificables.
- Genera una aventura de 5–10 minutos con EXACTAMENTE 5 pasos. Cada paso tiene: id (por ejemplo "step-1"), story (2–3 frases que cuentan la escena), prompt (lo que el niño debe hacer) y hint (una pista suave tipo Sócrates, sin dar la respuesta).
- Cada paso debe sentirse como una mini escena (inicio → intento → revisión → reto final → celebración).
- Incluye seguridad o amabilidad cuando sea natural, pero sin miedo y sin mencionar temas adultos.
- No incluyas contenido violento, sexual, de drogas, autolesiones, ni nada inseguro para niños.
- Escribe TODOS los textos (title, subject, topic, story, prompt, hint) en español sencillo y amigable para niños de 5–8 años.
${squadText}
Responde SOLO con un objeto JSON válido, sin markdown ni texto extra.`
    : `You are an educational assistant. You analyze homework images and create short Socratic story adventures for K-2 kids.
Rules:
- Describe only subject and topic (e.g. math, addition within 20; reading, sight words). Do NOT extract any names, school names, addresses, or other identifiers.
- Generate a 5-10 minute adventure with EXACTLY 5 steps. Each step has: id (e.g. "step-1"), story (2-3 sentences setting the scene), prompt (what the child should do), hint (gentle Socratic hint, no direct answers).
- Each step should feel like a mini scene (start → try → check → final challenge → celebration).
- Tie in safety or kindness where natural, but keep it calm and age-appropriate.
- Do not include violence, sexual content, drugs, self-harm, or anything unsafe for kids.
- Write all titles, subject/topic labels, and step text in simple, kid-friendly English suitable for children in the US.
${squadText}
Output ONLY valid JSON, no markdown or extra text.`

  const userTextEn = `Analyze this homework image and create an adventure. ${ageHint ? `Approximate grade: ${ageHint}.` : ''} ${subjectHint ? `Subject hint: ${subjectHint}.` : ''}
Respond with a single JSON object: { "title": string, "subject": string, "topic": string, "steps": [ { "id": string, "story": string, "prompt": string, "hint": string } ] }`

  const userTextEs = `Analiza esta imagen de tarea y crea una aventura. ${ageHint ? `Grado aproximado: ${ageHint}.` : ''} ${subjectHint ? `Pista de asignatura: ${subjectHint}.` : ''}
Responde con un solo objeto JSON: { "title": string, "subject": string, "topic": string, "steps": [ { "id": string, "story": string, "prompt": string, "hint": string } ] }`

  const userContent = [
    {
      type: 'image_url',
      image_url: { url: dataUrl },
    },
    {
      type: 'text',
      text: isEs ? userTextEs : userTextEn,
    },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      max_tokens: 2000,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(res.status === 429 ? 'Rate limit. Please try again in a moment.' : `OpenAI error: ${errText}`)
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content?.trim()
  if (!raw) throw new Error('No adventure generated')

  // Strip possible markdown code fence
  let jsonStr = raw
  const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeMatch) jsonStr = codeMatch[1].trim()
  const adventure = JSON.parse(jsonStr)

  if (!adventure.title || !adventure.subject || !adventure.topic || !Array.isArray(adventure.steps)) {
    throw new Error('Invalid adventure shape from model')
  }
  // Normalize steps: ensure each has id, story, prompt, hint (strings)
  const steps = adventure.steps
    .map((s, i) => ({
      id: typeof s?.id === 'string' ? s.id : `step-${i + 1}`,
      story: typeof s?.story === 'string' ? s.story : '',
      prompt: typeof s?.prompt === 'string' ? s.prompt : '',
      hint: typeof s?.hint === 'string' ? s.hint : '',
    }))
    .filter((s) => s.story || s.prompt)
  if (steps.length === 0) {
    throw new Error('Adventure had no valid steps; please try another image.')
  }
  return { ...adventure, steps }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    let imageBuffer = null
    let mimeType = 'image/jpeg'
    let ageHint = ''
    let subjectHint = ''
    let locale = 'en'
    let checkoutSessionId = ''

    try {
      const { fields, files } = await parseMultipart(req)
      const file = files?.image?.[0] ?? files?.image
      if (!file?.filepath) {
        res.status(400).json({ error: 'Missing or invalid "image" file' })
        return
      }
      const fs = await import('fs')
      imageBuffer = await fs.promises.readFile(file.filepath)
      mimeType = file.mimetype || mimeType
      ageHint = (fields?.age?.[0] ?? fields?.age ?? '').toString().trim()
      subjectHint = (fields?.subjectHint?.[0] ?? fields?.subjectHint ?? '').toString().trim()
      const rawLocale = (fields?.locale?.[0] ?? fields?.locale ?? '').toString().trim()
      if (rawLocale === 'es' || rawLocale === 'en') {
        locale = rawLocale
      }
      checkoutSessionId = (fields?.checkout_session_id?.[0] ?? fields?.checkout_session_id ?? '')
        .toString()
        .trim()
    } catch (e) {
      if (e.code === 'LIMIT_FILE_SIZE' || e.message?.includes('maxFileSize')) {
        res.status(413).json({ error: 'Image too large. Please use an image under 4 MB.' })
        return
      }
      res.status(400).json({ error: 'Invalid upload. Please send one image as multipart field "image".' })
      return
    }

    if (!isHomeworkEntitlementBypassed()) {
      const entitlement = await verifyHomeworkCheckoutSession(checkoutSessionId)
      if (!entitlement.ok) {
        res.status(entitlement.status).json({
          error:
            entitlement.status === 403
              ? 'Parent unlock required. Complete Adventure Academy checkout, then try again.'
              : entitlement.message,
        })
        return
      }
    }

  try {
    const adventure = await analyzeAndGenerateAdventure(imageBuffer, mimeType, ageHint, subjectHint, locale)
    res.status(200).json(adventure)
  } catch (e) {
    const message = e.message || 'Something went wrong.'
    console.error('[process-homework]', message)
    // User-safe messages for common cases so the UI can show them
    const safeMessage =
      message.includes('OPENAI_API_KEY') ? 'Service not configured. Please try again later.'
      : message.includes('429') || message.includes('Rate limit') ? 'Too many requests. Please try again in a moment.'
      : message.includes('Invalid adventure') || message.includes('no valid steps') ? 'Could not create adventure from this image. Try another photo.'
      : message.includes('OpenAI') || message.includes('fetch') ? 'Adventure service error. Please try again.'
      : message
    res.status(500).json({ error: safeMessage })
    return
  }
  } catch (outer) {
    try {
      res.status(500).json({ error: 'Something went wrong. Please try again.' })
    } catch (_) {}
  }
}

