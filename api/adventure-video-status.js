/**
 * GET /api/adventure-video-status?jobId=...
 * Optional async job polling. Without Vercel KV, returns 501.
 * When async is implemented: return { status: 'pending'|'ready'|'failed', videoUrl?, error? }
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const jobId = req.query?.jobId
  if (!jobId) {
    res.status(400).json({ error: 'Missing jobId' })
    return
  }

  // Async job store (e.g. Vercel KV) not implemented; client should use sync flow.
  res.status(501).json({
    error: 'Async video status not configured.',
    status: 'unsupported',
  })
}
