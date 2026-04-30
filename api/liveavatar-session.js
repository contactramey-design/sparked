/**
 * POST /api/liveavatar-session
 * LiveAvatar v1 session token (api.liveavatar.com). Key stays server-side.
 * Client starts the session with @heygen/liveavatar-web-sdk (not deprecated streaming-avatar).
 * Warmer “Ms. Maya” look: swap LIVEAVATAR_AVATAR_ID / persona in HeyGen (wardrobe + background), not in this file.
 */
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { rateLimit } from './lib/rateLimit.js'

const TOKEN_URL = 'https://api.liveavatar.com/v1/sessions/token'
const SPARKI_AVATAR_ID_FALLBACK = 'f38cdfe96a2c4e03b2d1437d3176f8d3'

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
  const experienceModeRaw = typeof body.experience_mode === 'string' ? body.experience_mode.trim().toLowerCase() : ''
  const experienceMode = experienceModeRaw === 'sparki' ? 'sparki' : 'tutor'
  const isDev = process.env.NODE_ENV !== 'production'
  const debug = isDev || process.env.LIVEAVATAR_DEBUG === 'true'

  /**
   * Unpaid live preview (empty checkout_session_id) burns LiveAvatar quota — extra per-IP hourly cap.
   */
  if (process.env.ALLOW_UNAUTH_TUTOR !== 'true' && !checkoutSessionId) {
    const freeLimit = isDev ? 250 : 50
    const freeRl = rateLimit(req, { key: 'liveavatar-free-preview', limit: freeLimit, windowMs: 60 * 60 * 1000 })
    if (!freeRl.ok) {
      const retryAfterSec = Math.max(1, Math.ceil((freeRl.resetMs - Date.now()) / 1000))
      res.setHeader('Retry-After', String(retryAfterSec))
      res.status(429).json({
        error: 'Too many free live video starts. Try again later or subscribe to Adventure Academy.',
      })
      return
    }
  }

  const sessionLimit = isDev ? 120 : 30
  const rl = rateLimit(req, { key: 'liveavatar-session', limit: sessionLimit, windowMs: 10 * 60 * 1000 })
  res.setHeader('X-RateLimit-Limit', String(sessionLimit))
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.floor(rl.resetMs / 1000)))
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetMs - Date.now()) / 1000))
    res.setHeader('Retry-After', String(retryAfterSec))
    res.status(429).json({ error: 'Too many video session requests. Please wait a moment and try again.' })
    return
  }

  /**
   * Paid: non-empty checkout_session_id must pass Adventure Academy verification.
   * Unpaid preview: empty id issues a token (same “free tier” window as text tutor; client limits turns; abuse bounded by rate limit).
   */
  if (process.env.ALLOW_UNAUTH_TUTOR !== 'true') {
    if (checkoutSessionId) {
      const paid = await verifyHomeworkCheckoutSession(checkoutSessionId)
      if (!paid.ok) {
        res.status(403).json({
          error:
            'Live video could not verify Adventure Academy. Ask a parent to subscribe from the Parent dashboard, or open Tutor from a device that still has free tries.',
        })
        return
      }
    }
  }

  const apiKey =
    experienceMode === 'sparki'
      ? firstNonEmptyEnv('LIVEAVATAR_SPARKI_API_KEY', 'LIVEAVATAR_API_KEY', 'HEYGEN_API_KEY')
      : firstNonEmptyEnv('LIVEAVATAR_TUTOR_API_KEY', 'LIVEAVATAR_API_KEY', 'HEYGEN_API_KEY')
  if (!apiKey) {
    res.status(503).json({
      error:
        'Live tutor video is not configured. Set LIVEAVATAR_API_KEY (preferred) or HEYGEN_API_KEY in Vercel. Optional: LIVEAVATAR_TUTOR_API_KEY and LIVEAVATAR_SPARKI_API_KEY.',
    })
    return
  }

  const avatarId =
    experienceMode === 'sparki'
      ? firstNonEmptyEnv('LIVEAVATAR_SPARKI_AVATAR_ID') || SPARKI_AVATAR_ID_FALLBACK
      : firstNonEmptyEnv('LIVEAVATAR_TUTOR_AVATAR_ID', 'LIVEAVATAR_AVATAR_ID', 'HEYGEN_TUTOR_AVATAR_ID')

  const voiceIdDefault =
    experienceMode === 'sparki'
      ? firstNonEmptyEnv('LIVEAVATAR_SPARKI_VOICE_ID', 'LIVEAVATAR_VOICE_ID', 'HEYGEN_TUTOR_VOICE_ID')
      : firstNonEmptyEnv('LIVEAVATAR_TUTOR_VOICE_ID', 'LIVEAVATAR_VOICE_ID', 'HEYGEN_TUTOR_VOICE_ID')

  const voiceIdEs =
    experienceMode === 'sparki'
      ? firstNonEmptyEnv('LIVEAVATAR_SPARKI_VOICE_ID_ES', 'LIVEAVATAR_VOICE_ID_ES', 'HEYGEN_TUTOR_VOICE_ID_ES')
      : firstNonEmptyEnv('LIVEAVATAR_TUTOR_VOICE_ID_ES', 'LIVEAVATAR_VOICE_ID_ES', 'HEYGEN_TUTOR_VOICE_ID_ES')
  const voiceId = useSpanish && voiceIdEs ? voiceIdEs : voiceIdDefault
  const contextId =
    experienceMode === 'sparki'
      ? firstNonEmptyEnv('LIVEAVATAR_SPARKI_CONTEXT_ID', 'LIVEAVATAR_CONTEXT_ID')
      : firstNonEmptyEnv('LIVEAVATAR_TUTOR_CONTEXT_ID', 'LIVEAVATAR_CONTEXT_ID')

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
      const baseError = parsed.ok ? 'Could not create LiveAvatar session.' : parsed.error
      const hint =
        typeof baseError === 'string' && baseError.toLowerCase().includes('avatar')
          ? experienceMode === 'sparki'
            ? 'LiveAvatar says the Sparki avatar was not found for this API key. Set LIVEAVATAR_SPARKI_AVATAR_ID in Vercel to the correct avatar id for Sparki.'
            : 'LiveAvatar says the Tutor avatar was not found for this API key. Set LIVEAVATAR_TUTOR_AVATAR_ID (or LIVEAVATAR_AVATAR_ID) in Vercel to the correct avatar id for Maya.'
          : ''
      res.status(502).json({
        error: baseError,
        message: hint || undefined,
        debug: debug
          ? {
              experience_mode: experienceMode,
              requested_mode: payload.mode,
              avatar_id: avatarId,
              has_voice: Boolean(voiceId),
              has_context: Boolean(contextId),
            }
          : undefined,
      })
      return
    }

    res.status(200).json({
      session_id: parsed.session_id,
      session_token: parsed.session_token,
      mode: payload.mode,
      debug: debug
        ? {
            experience_mode: experienceMode,
            avatar_id: avatarId,
          }
        : undefined,
    })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[liveavatar-session]', e)
    }
    res.status(502).json({ error: 'LiveAvatar service unreachable.' })
  }
}
