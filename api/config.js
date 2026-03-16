/**
 * GET /api/config
 * Returns public feature flags (e.g. video generation). No secrets.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(200).json({
    videoFeatureEnabled: process.env.VIDEO_FEATURE_ENABLED === 'true',
    homeworkAdventureConfigured: Boolean(process.env.OPENAI_API_KEY),
  })
}
