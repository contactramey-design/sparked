/** POST /api/homework/video — not implemented (premium / v2) */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(501).json({ error: 'Video generation is not available yet.' })
}
