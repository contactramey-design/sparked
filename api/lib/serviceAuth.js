/**
 * Shared secret for server-to-server calls (Vercel ↔ video worker, worker → /api/tts).
 * When SPARKI_SERVICE_SECRET is set, workers require Authorization: Bearer <secret>.
 * /api/tts accepts browser requests if Origin matches TTS_ALLOW_ORIGINS (comma-separated).
 */

/** @returns {string} */
export function getSparkiServiceSecret() {
  return (process.env.SPARKI_SERVICE_SECRET || '').trim()
}

/** Headers for Vercel or worker when calling another service that checks the secret. */
export function bearerAuthHeaders() {
  const secret = getSparkiServiceSecret()
  if (!secret) return {}
  return { Authorization: `Bearer ${secret}` }
}

/**
 * Parse comma-separated absolute origins (e.g. https://app.com,https://www.app.com).
 * @returns {string[]}
 */
export function parseTtsAllowOrigins() {
  const raw = (process.env.TTS_ALLOW_ORIGINS || '').trim()
  if (!raw) return []
  return [...new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))]
}

/**
 * @param {import('http').IncomingMessage} req
 * @returns {string | null}
 */
export function getBrowserOrigin(req) {
  const origin = typeof req.headers.origin === 'string' ? req.headers.origin.trim() : ''
  if (origin) return origin
  const referer = typeof req.headers.referer === 'string' ? req.headers.referer.trim() : ''
  if (!referer) return null
  try {
    return new URL(referer).origin
  } catch {
    return null
  }
}

/**
 * @param {import('http').IncomingMessage} req
 * @returns {{ ok: true } | { ok: false, status: number, message: string }}
 */
export function authorizeTtsRequest(req) {
  const secret = getSparkiServiceSecret()
  const auth = typeof req.headers.authorization === 'string' ? req.headers.authorization.trim() : ''
  if (secret && auth === `Bearer ${secret}`) {
    return { ok: true }
  }

  const allowList = parseTtsAllowOrigins()
  if (allowList.length > 0) {
    const o = getBrowserOrigin(req)
    if (o && allowList.includes(o)) {
      return { ok: true }
    }
    return {
      ok: false,
      status: 403,
      message:
        'TTS request not allowed from this origin. Add your exact https:// origin to TTS_ALLOW_ORIGINS in Vercel, or use Authorization: Bearer with SPARKI_SERVICE_SECRET from trusted servers.',
    }
  }

  if (secret) {
    return {
      ok: false,
      status: 403,
      message:
        'TTS requires browser Origin to match TTS_ALLOW_ORIGINS, or Authorization: Bearer SPARKI_SERVICE_SECRET from the video worker.',
    }
  }

  // Legacy: no secret and empty allowlist — open (cost/abuse risk in production).
  return { ok: true }
}
