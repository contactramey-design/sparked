/**
 * Minimal in-memory rate limiter for Vercel serverless functions.
 *
 * Notes:
 * - Best-effort only (per-instance). Good enough for v1; upgrade to KV/Upstash for strict global limits.
 * - Uses IP from x-forwarded-for when present.
 */
const BUCKETS = new Map()

function nowMs() {
  return Date.now()
}

function getIp(req) {
  const xff = req?.headers?.['x-forwarded-for']
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim()
  const realIp = req?.headers?.['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim()
  return 'unknown'
}

/**
 * Fixed-window limiter.
 * @param {import('http').IncomingMessage} req
 * @param {{ key: string, limit: number, windowMs: number }} opts
 * @returns {{ ok: true, remaining: number, resetMs: number } | { ok: false, status: 429, remaining: 0, resetMs: number }}
 */
export function rateLimit(req, opts) {
  const ip = getIp(req)
  const key = `${opts.key}:${ip}`
  const t = nowMs()
  const windowStart = t - (t % opts.windowMs)

  const cur = BUCKETS.get(key)
  if (!cur || cur.windowStart !== windowStart) {
    const next = { windowStart, count: 1 }
    BUCKETS.set(key, next)
    return { ok: true, remaining: Math.max(0, opts.limit - 1), resetMs: windowStart + opts.windowMs }
  }

  cur.count += 1
  if (cur.count > opts.limit) {
    return { ok: false, status: 429, remaining: 0, resetMs: cur.windowStart + opts.windowMs }
  }
  return { ok: true, remaining: Math.max(0, opts.limit - cur.count), resetMs: cur.windowStart + opts.windowMs }
}

