/**
 * GET /api/video-worker-health
 * Probes VIDEO_WORKER_URL/health from Vercel. Use to verify Vercel → Render connectivity.
 * Returns: { ok, workerReachable, status?, body?, error?, code?, url? }
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  let workerUrl = (process.env.VIDEO_WORKER_URL || '').trim()
  // Fix common typo: ttps:// → https://
  if (workerUrl.startsWith('ttps://')) workerUrl = 'h' + workerUrl
  else if (workerUrl.startsWith('ttp://')) workerUrl = 'ht' + workerUrl
  if (!workerUrl) {
    return res.status(200).json({
      ok: false,
      workerReachable: false,
      error: 'VIDEO_WORKER_URL is not set',
      host: null,
    })
  }

  const healthUrl = `${workerUrl.replace(/\/$/, '')}/health`
  const timeoutMs = 25_000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    clearTimeout(timeoutId)
    const raw = await response.text()
    let body = null
    try {
      body = raw ? JSON.parse(raw) : null
    } catch {
      body = raw?.slice(0, 500) ?? null
    }
    const workerReachable = response.ok && body?.ok === true
    let host = null
    try {
      host = new URL(healthUrl).host
    } catch {
      /* ignore */
    }
    return res.status(200).json({
      ok: workerReachable,
      workerReachable,
      status: response.status,
      host,
    })
  } catch (e) {
    clearTimeout(timeoutId)
    const code = e.code ?? e.cause?.code
    const message = e.message ?? String(e)
    const causeMessage = e.cause?.message
    console.error('[video-worker-health]', { code, message, cause: causeMessage })
    let host = null
    try {
      host = new URL(healthUrl).host
    } catch {
      /* ignore */
    }
    return res.status(200).json({
      ok: false,
      workerReachable: false,
      error: message,
      code: code || (e.name === 'AbortError' ? 'TIMEOUT' : undefined),
      cause: causeMessage || undefined,
      host,
    })
  }
}
