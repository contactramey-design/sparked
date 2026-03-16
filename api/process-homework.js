/**
 * Vercel serverless: POST /api/process-homework
 * Body: multipart/form-data with field "image" (file).
 * Returns: { title, subject, topic, steps } — homework-specific adventure JSON.
 * COPPA: Process image in memory only; do not store or log. Call only after parent consent.
 */
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

async function analyzeAndGenerateAdventure(imageBuffer, mimeType, ageHint, subjectHint) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  const base64 = imageBuffer.toString('base64')
  const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64}`

  const systemPrompt = `You are an educational assistant. You analyze homework images and create short Socratic story adventures for K-2 kids.
Rules:
- Describe only subject and topic (e.g. math, addition within 20; reading, sight words). Do NOT extract any names, school names, addresses, or other identifiers.
- Generate a 5-10 minute adventure with 1-5 steps. Each step has: id (e.g. "step-1"), story (2-3 sentences setting the scene), prompt (what the child should do), hint (gentle Socratic hint, no direct answers).
- Tie in safety or kindness where natural. Output ONLY valid JSON, no markdown or extra text.`

  const userContent = [
    {
      type: 'image_url',
      image_url: { url: dataUrl },
    },
    {
      type: 'text',
      text: `Analyze this homework image and create an adventure. ${ageHint ? `Approximate grade: ${ageHint}.` : ''} ${subjectHint ? `Subject hint: ${subjectHint}.` : ''}
Respond with a single JSON object: { "title": string, "subject": string, "topic": string, "steps": [ { "id": string, "story": string, "prompt": string, "hint": string } ] }`,
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
    } catch (e) {
      if (e.code === 'LIMIT_FILE_SIZE' || e.message?.includes('maxFileSize')) {
        res.status(413).json({ error: 'Image too large. Please use an image under 4 MB.' })
        return
      }
      res.status(400).json({ error: 'Invalid upload. Please send one image as multipart field "image".' })
      return
    }

  try {
    const adventure = await analyzeAndGenerateAdventure(imageBuffer, mimeType, ageHint, subjectHint)
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

