/**
 * POST /api/liveavatar-session
 * LiveAvatar v1 session token (api.liveavatar.com). Key stays server-side.
 * Client starts the session with @heygen/liveavatar-web-sdk (not deprecated streaming-avatar).
 */
import { requireTutorCheckoutOrAllow } from './lib/tutorEntitlement.js'
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { rateLimit } from './lib/rateLimit.js'

const TOKEN_URL = 'https://api.liveavatar.com/v1/sessions/token'

function firstNonEmptyEnv(...names) {
  for (const name of names) {
    const v = process.env[name]?.trim()
    if (v) return v
  }
  return ''
}

function parseTokenResponse(raw, status) {
  let json
  try {
    json = raw ? JSON.parse(raw) : null
  } catch {
    return { ok: false, error: `Non-JSON response (HTTP ${status})` }
  }
  const data = json && typeof json === 'object' ? json.data : null
  const sid = data && typeof data.session_id === 'string' ? data.session_id : ''
  const tok = data && typeof data.session_token === 'string' ? data.session_token : ''
  if (!sid || !tok) {
    const msg = json && typeof json.message === 'string' ? json.message : 'Invalid LiveAvatar token response'
    return { ok: false, error: msg }
  }
  return { ok: true, session_id: sid, session_token: tok }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'liveavatar-session', limit: 10, windowMs: 10 * 60 * 1000 })
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
  const localeRaw = typeof body.locale === 'string' ? body.locale.trim().toLowerCase() : 'en'
  const useSpanish = localeRaw === 'es' || localeRaw.startsWith('es-')

  const ent = await requireTutorCheckoutOrAllow(checkoutSessionId)
  if (!ent.ok) {
    res.status(ent.status).json({
      error:
        ent.status === 403
          ? 'Adventure Academy unlock required for live tutor video.'
          : ent.message || 'Not allowed.',
    })
    return
  }

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

  const apiKey = firstNonEmptyEnv('LIVEAVATAR_API_KEY', 'HEYGEN_API_KEY')
  if (!apiKey) {
    res.status(503).json({
      error:
        'Live tutor video is not configured. Set LIVEAVATAR_API_KEY (preferred) or HEYGEN_API_KEY in Vercel.',
    })
    return
  }

  const avatarId = firstNonEmptyEnv('LIVEAVATAR_AVATAR_ID', 'HEYGEN_TUTOR_AVATAR_ID')
  const voiceIdDefault = firstNonEmptyEnv('LIVEAVATAR_VOICE_ID', 'HEYGEN_TUTOR_VOICE_ID')
  const voiceIdEs = firstNonEmptyEnv('LIVEAVATAR_VOICE_ID_ES', 'HEYGEN_TUTOR_VOICE_ID_ES')
  const voiceId = useSpanish && voiceIdEs ? voiceIdEs : voiceIdDefault
  const contextId = firstNonEmptyEnv('LIVEAVATAR_CONTEXT_ID')

  /** FULL mode when context + voice + non-placeholder avatar exist. */
  const useFull =
    Boolean(contextId) &&
    Boolean(voiceId) &&
    Boolean(avatarId) &&
    avatarId !== 'default'

  const useLite = Boolean(avatarId) && avatarId !== 'default'

  if (!useFull && !useLite) {
    res.status(503).json({
      error:
        'LiveAvatar: set LIVEAVATAR_AVATAR_ID or HEYGEN_TUTOR_AVATAR_ID to a real avatar UUID (not "default"). For FULL mode, add LIVEAVATAR_CONTEXT_ID and LIVEAVATAR_VOICE_ID (or HEYGEN_TUTOR_VOICE_ID).',
    })
    return
  }

  const payload = useFull
    ? {
        mode: 'FULL',
        avatar_id: avatarId,
        avatar_persona: {
          voice_id: voiceId,
          context_id: contextId,
          language: useSpanish ? 'es' : 'en',
        },
      }
    : {
        mode: 'LITE',
        avatar_id: avatarId,
      }

  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify(payload),
    })

    const raw = await tokenRes.text()
    const parsed = parseTokenResponse(raw, tokenRes.status)

    if (!tokenRes.ok || !parsed.ok) {
      console.error('[liveavatar-session]', tokenRes.status, raw.slice(0, 500))
      res.status(502).json({
        error: parsed.ok ? 'Could not create LiveAvatar session.' : parsed.error,
      })
      return
    }

    res.status(200).json({
      session_id: parsed.session_id,
      session_token: parsed.session_token,
      mode: payload.mode,
    })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[liveavatar-session]', e)
    }
    res.status(502).json({ error: 'LiveAvatar service unreachable.' })
  }
}
