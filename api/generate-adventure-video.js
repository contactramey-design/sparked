/**
 * POST /api/generate-adventure-video
 * Body: { adventure: { title, subject, topic, steps }, locale? }
 * Returns: { videoUrl } or 403 if VIDEO_FEATURE_ENABLED !== 'true'.
 *
 * NOTE: Simplified implementation that returns a pre-rendered, generic
 * educational video asset instead of calling the external video worker.
 * This keeps the flow COPPA-safe (no extra data is sent anywhere) and avoids
 * runtime ffmpeg issues on the worker host while still giving kids a safe
 * “watch the adventure” experience.
 */
export const config = {
  api: { responseLimit: false },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (process.env.VIDEO_FEATURE_ENABLED !== 'true') {
    res.status(403).json({ error: 'Video generation is not available.' })
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
  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }

  const adventure = body.adventure
  if (!adventure || !Array.isArray(adventure.steps) || adventure.steps.length === 0) {
    res.status(400).json({ error: 'Missing adventure.steps' })
    return
  }

  // For now, always return a static, pre-rendered homework adventure video.
  // This keeps the flow functioning and COPPA-safe without relying on
  // external worker infrastructure.
  res.status(200).json({
    videoUrl: '/sparkiadventureintro.mp4',
  })
}
