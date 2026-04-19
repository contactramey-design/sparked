/**
 * POST /api/heygen-streaming-token
 * Legacy HeyGen Streaming Avatar (api.heygen.com streaming.create_token).
 * The app uses POST /api/liveavatar-session + @heygen/liveavatar-web-sdk instead; this file is kept for rollback only.
 */
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { rateLimit } from './lib/rateLimit.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'heygen-streaming-token', limit: 10, windowMs: 10 * 60 * 1000 })
  res.setHeader('X-RateLimit-Limit', '10')
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.floor(rl.resetMs / 1000)))
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetMs - Date.now()) / 1000))
    res.setHeader('Retry-After', String(retryAfterSec))
    res.status(429).json({ error: 'Too many video session requests. Please wait a moment and try again.' })
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
  if (typeof body !== 'object' || body === null) body = {}

  const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''

  if (process.env.ALLOW_UNAUTH_TUTOR !== 'true') {
    const paid = await verifyHomeworkCheckoutSession(checkoutSessionId)
    if (!paid.ok) {
      res.status(403).json({
        error:
          'Live video tutor is included with Adventure Academy. Ask a parent to subscribe from the Parent dashboard, then try again.',
      })
      return
    }
  }

  const apiKey = process.env.HEYGEN_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'Live tutor video is not configured (missing HEYGEN_API_KEY).' })
    return
  }

  try {
    const tokenRes = await fetch('https://api.heygen.com/v1/streaming.create_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({}),
    })

    const raw = await tokenRes.text()
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      data = null
    }

    if (!tokenRes.ok) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[heygen-streaming-token]', tokenRes.status, raw.slice(0, 400))
      }
      res.status(502).json({ error: 'Could not start live tutor session.' })
      return
    }

    const token = data?.data?.token
    if (typeof token !== 'string' || !token) {
      res.status(502).json({ error: 'Invalid token response from video provider.' })
      return
    }

    const avatarId = (process.env.HEYGEN_TUTOR_AVATAR_ID || 'default').trim()
    const voiceId = (process.env.HEYGEN_TUTOR_VOICE_ID || '').trim()

    res.status(200).json({
      token,
      avatarId,
      voiceId: voiceId || undefined,
      quality: (process.env.HEYGEN_TUTOR_QUALITY || 'medium').trim(),
    })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[heygen-streaming-token]', e)
    }
    res.status(502).json({ error: 'Video service unreachable.' })
  }
}
