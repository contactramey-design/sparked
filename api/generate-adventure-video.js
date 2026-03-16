/**
 * POST /api/generate-adventure-video
 * Body: { adventure: { title, subject, topic, steps }, locale? }
 * Returns: { videoUrl } or 403 if VIDEO_FEATURE_ENABLED !== 'true'.
 * Calls video worker; parent-authorized context only (enforce via consent/session in app).
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

  const workerUrl = process.env.VIDEO_WORKER_URL
  if (!workerUrl) {
    res.status(503).json({ error: 'Video worker not configured.' })
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

  try {
    const response = await fetch(`${workerUrl.replace(/\/$/, '')}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adventure: {
          title: adventure.title,
          subject: adventure.subject,
          topic: adventure.topic,
          steps: adventure.steps,
        },
        locale: body.locale || 'en',
      }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const workerMessage = typeof data?.error === 'string' ? data.error : ''
      res.status(response.status >= 400 ? response.status : 500).json({
        error: workerMessage || 'Video generation failed.',
      })
      return
    }
    if (data.videoUrl) {
      res.status(200).json({ videoUrl: data.videoUrl })
    } else {
      res.status(500).json({ error: 'No video URL returned.' })
    }
  } catch (e) {
    res.status(500).json({ error: 'Video generation failed. Please try again.' })
  }
}
