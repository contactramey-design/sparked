/** POST /api/homework/images — legacy alias; use POST /api/generate-visuals */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(501).json({ error: 'Use POST /api/generate-visuals for story scene art.' })
}
