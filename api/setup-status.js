/**
 * GET /api/setup-status
 * Returns which services are configured (no secrets). Use to verify Vercel/Railway/API setup.
 */
import { checkElevenLabsApiKey } from './lib/checkElevenLabsKey.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const elevenKey = process.env.ELEVENLABS_API_KEY?.trim() || ''
  let ttsKeyCheck = { checked: false, accepted: null, httpStatus: null, detail: null }
  if (elevenKey) {
    const el = await checkElevenLabsApiKey(elevenKey)
    ttsKeyCheck = {
      checked: true,
      accepted: el.ok,
      httpStatus: el.status ?? null,
      detail: el.ok ? null : (el.detail || '').slice(0, 400),
    }
  }

  res.setHeader('Cache-Control', 'no-store, max-age=0')
  res.status(200).json({
    // Bump when setup-status shape changes — if missing in production, you are NOT on this deploy.
    schemaVersion: 3,
    /** Vercel injects these on deploy; use to confirm Production matches your latest Git push. */
    deployment: {
      environment: process.env.VERCEL_ENV ?? null,
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
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
          ? 'Video feature on — worker URL set. Ensure worker (Railway/Render/etc.) is deployed with TTS_URL, BLOB_READ_WRITE_TOKEN, ASSET_BASE_URL. Check GET /api/video-worker-health to test connectivity.'
          : 'Set VIDEO_FEATURE_ENABLED=true and VIDEO_WORKER_URL=<public worker URL> in Vercel, then redeploy.',
    },
    // TTS: used by worker for video narration (and Listen buttons)
    tts: {
      configured: Boolean(elevenKey),
      /** Live check against ElevenLabs (GET /v1/voices). If false, /api/tts will fail until the key is fixed. */
      keyAcceptedByElevenLabs: ttsKeyCheck.accepted,
      elevenLabsHttpStatus: ttsKeyCheck.httpStatus,
      elevenLabsDetail: ttsKeyCheck.detail,
      /** Voices list can succeed while generation is out of credits — see BILLING-AND-QUOTAS.md */
      generationQuotaNote:
        'This check only calls GET /v1/voices. If Listen or video TTS returns quota_exceeded, add credits or upgrade in ElevenLabs (dashboard usage).',
      message: !elevenKey
        ? 'Add ELEVENLABS_API_KEY in Vercel (Production + Preview if needed), then redeploy.'
        : ttsKeyCheck.accepted === true
          ? 'ElevenLabs accepted this API key — /api/tts should work for valid requests. If the browser still shows 401, redeploy so the latest api/tts.js is live (old builds forwarded ElevenLabs 401).'
          : ttsKeyCheck.accepted === false
            ? `ElevenLabs rejected this key (HTTP ${ttsKeyCheck.httpStatus ?? '?'}) — paste a fresh xi-api-key from elevenlabs.io → Developers/API keys. Remove quotes/spaces; use Production env on Vercel; Redeploy.`
            : 'Could not verify key (network).',
    },
    // Stripe: paid bundle, ebooks, homework entitlement (optional for free school-only pilots)
    stripe: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      message: process.env.STRIPE_SECRET_KEY?.trim()
        ? 'STRIPE_SECRET_KEY set — verify price IDs and checkout URLs in Production before promising paid flows.'
        : 'No STRIPE_SECRET_KEY — scope pilot as free-only or homework without paid entitlement until Stripe is configured.',
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
