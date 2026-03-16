/**
 * GET /api/setup-status
 * Returns which services are configured (no secrets). Use to verify Vercel/Railway/API setup.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    // Homework Adventure: create adventure from image
    homeworkAdventure: {
      configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      message: process.env.OPENAI_API_KEY?.trim()
        ? 'OpenAI key set — Create adventure will work.'
        : 'Add OPENAI_API_KEY in Vercel (and .env locally), then redeploy.',
    },
    // Video generation: Create video button and worker
    video: {
      featureEnabled: process.env.VIDEO_FEATURE_ENABLED === 'true',
      workerConfigured: Boolean(process.env.VIDEO_WORKER_URL?.trim()),
      message:
        process.env.VIDEO_FEATURE_ENABLED === 'true' && process.env.VIDEO_WORKER_URL
          ? 'Video feature on — worker URL set. Ensure Render worker is deployed and has TTS_URL, BLOB_READ_WRITE_TOKEN, ASSET_BASE_URL. Check GET /api/video-worker-health to test connectivity.'
          : 'Set VIDEO_FEATURE_ENABLED=true and VIDEO_WORKER_URL=<Render public URL> in Vercel, then redeploy.',
    },
    // TTS: used by worker for video narration (and Listen buttons)
    tts: {
      configured: Boolean(process.env.ELEVENLABS_API_KEY?.trim()),
      message: process.env.ELEVENLABS_API_KEY?.trim()
        ? 'ElevenLabs set — video narration and Listen will work.'
        : 'Add ELEVENLABS_API_KEY in Vercel for video narration and Listen.',
    },
    // Blob: used by Vercel cron (cleanup) and by Railway worker (upload)
    blob: {
      configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
      message: process.env.BLOB_READ_WRITE_TOKEN
        ? 'Blob token set on this app (cron cleanup). Same token must be on Railway for worker uploads.'
        : 'Add BLOB_READ_WRITE_TOKEN from Vercel Storage → Blob → Create token.',
    },
  })
}
