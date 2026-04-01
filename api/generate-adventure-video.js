/**
 * POST /api/generate-adventure-video
 * Body: { adventure: { title, subject, topic, steps }, locale?, checkout_session_id? }
 * Returns: { videoUrl } or 403 if VIDEO_FEATURE_ENABLED !== 'true'.
 * Requires homework entitlement (same as /api/homework/*) unless ALLOW_UNAUTH_HOMEWORK=true.
 * Calls video worker with optional SPARKI_SERVICE_SECRET (Bearer) when set.
 */
import { requireHomeworkEntitlement } from './homework/lib/multipart.js'
import { bearerAuthHeaders } from './lib/serviceAuth.js'
export const config = {
  api: { responseLimit: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (process.env.VIDEO_FEATURE_ENABLED !== 'true') {
    res.status(403).json({ error: 'Video generation is not available.' })
    return
  }

  let workerUrl = (process.env.VIDEO_WORKER_URL || '').trim()
  // Fix common typo: ttps:// → https://
  if (workerUrl.startsWith('ttps://')) workerUrl = 'h' + workerUrl
  else if (workerUrl.startsWith('ttp://')) workerUrl = 'ht' + workerUrl
  if (!workerUrl) {
    res.status(503).json({ error: 'Video worker not configured.' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  const checkoutSessionId =
    typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''
  const ent = await requireHomeworkEntitlement(checkoutSessionId)
  if (!ent.ok) {
    res.status(ent.status).json({ error: ent.message })
    return
  }

  const adventure = body.adventure
  if (!adventure || !Array.isArray(adventure.steps) || adventure.steps.length === 0) {
    res.status(400).json({ error: 'Missing adventure.steps' })
    return
  }
  const generateUrl = `${workerUrl.replace(/\/$/, '')}/generate`
  const timeoutMs = 120_000 // Render free tier cold start can take 30–60s
  const maxAttempts = 3
  const retryDelayMs = 4000

  const payload = {
    adventure: {
      title: adventure.title,
      subject: adventure.subject,
      topic: adventure.topic,
      steps: adventure.steps,
    },
    locale: body.locale || 'en',
    useSquad: true,
  }

  let lastError = null
  let response = null

  const retryableStatuses = [502, 503, 504]
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
        await response.text() // consume body so connection can close
        console.warn(`[generate-adventure-video] attempt ${attempt}/${maxAttempts} got ${response.status}, retrying...`)
        response = null
        await new Promise((r) => setTimeout(r, retryDelayMs))
      } else {
        break
      }
    } catch (e) {
      clearTimeout(timeoutId)
      lastError = e
      if (attempt < maxAttempts) {
        console.warn(`[generate-adventure-video] attempt ${attempt}/${maxAttempts} failed:`, e.code || e.name, e.message)
        await new Promise((r) => setTimeout(r, retryDelayMs))
      }
    }
  }

  if (lastError && !response) {
    const e = lastError
    const code = e.code ?? e.cause?.code
    const message = e.message ?? String(e)
    const causeMessage = e.cause?.message
    const isAbort = e.name === 'AbortError'
    const isNetwork =
      code === 'ECONNREFUSED' ||
      code === 'ETIMEDOUT' ||
      code === 'ECONNRESET' ||
      code === 'ENOTFOUND' ||
      message?.includes('fetch') ||
      causeMessage?.includes('connect')

    console.error('[generate-adventure-video] worker unreachable after', maxAttempts, 'attempts', {
      code,
      message,
      cause: causeMessage,
      url: generateUrl,
    })

    const debugRequested =
      process.env.DEBUG_VIDEO_WORKER === 'true' || req.headers['x-debug-video-worker'] === 'true'
    const debug = debugRequested ? { code, message, cause: causeMessage, url: generateUrl } : undefined

    return res.status(500).json({
      error: isAbort
        ? 'Video worker is starting up. Please try again in a moment.'
        : isNetwork
          ? 'Could not reach video worker. Check VIDEO_WORKER_URL and that the Render service is running.'
          : 'Video generation failed. Please try again.',
      ...(debug && { debug }),
    })
  }

  try {
    const raw = await response.text()
    let data = {}
    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      if (!response.ok) data = { error: raw.slice(0, 200) || `Worker returned ${response.status}` }
    }
    if (!response.ok) {
      const isGatewayError = [502, 503, 504].includes(response.status)
      const isHtml = raw.trimStart().toLowerCase().startsWith('<!')
      const workerMessage = typeof data?.error === 'string' ? data.error : ''
      const userMessage =
        isGatewayError && isHtml
          ? 'Video worker is temporarily unavailable. Please try again in a moment.'
          : workerMessage || 'Video generation failed.'
      console.error('[generate-adventure-video] worker', response.status, isGatewayError && isHtml ? '(gateway error)' : workerMessage || raw.slice(0, 300))
      res.status(response.status >= 400 ? response.status : 500).json({
        error: userMessage,
      })
      return
    }
    if (data.videoUrl) {
      res.status(200).json({ videoUrl: data.videoUrl })
    } else {
      res.status(500).json({ error: 'No video URL returned.' })
    }
  } catch (e) {
    console.error('[generate-adventure-video] reading worker response', e.message || e)
    res.status(500).json({ error: 'Video generation failed. Please try again.' })
  }
}
