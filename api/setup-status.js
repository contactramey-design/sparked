/**
 * GET /api/setup-status
 * Returns which services are configured (no secrets). Use to verify Vercel/Railway/API setup.
 */
import { checkElevenLabsApiKey } from './lib/checkElevenLabsKey.js'
import { getSparkiServiceSecret, parseTtsAllowOrigins } from './lib/serviceAuth.js'
import { isTutorCheckoutRequired } from './lib/tutorEntitlement.js'
import { isHomeworkEntitlementBypassed } from './homework/lib/multipart.js'

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
    schemaVersion: 14,
    /** Vercel injects these on deploy; use to confirm Production matches your latest Git push. */
    deployment: {
      environment: process.env.VERCEL_ENV ?? null,
      gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    },
    // Homework Adventure: create adventure from image
    homeworkAdventure: {
      configured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      /** Matches `api/homework/lib/multipart.js` — Production verifies Stripe session unless opted out. */
      requireCheckoutForHomeworkApis: !isHomeworkEntitlementBypassed(),
      videoPaused: process.env.HOMEWORK_ADVENTURE_PAUSED === 'true',
      message: (() => {
        if (process.env.HOMEWORK_ADVENTURE_PAUSED === 'true') {
          return 'HOMEWORK_ADVENTURE_PAUSED=true — Homework Adventure Video APIs return 503 until you unset it.'
        }
        return process.env.OPENAI_API_KEY?.trim()
          ? 'OpenAI key set — Create adventure will work.'
          : 'Add OPENAI_API_KEY in Vercel (and .env locally), then redeploy.'
      })(),
    },
    // Story scene stills (Flux via fal.ai) — POST /api/generate-visuals
    sceneArt: {
      configured: Boolean(process.env.FAL_KEY?.trim()),
      message: process.env.FAL_KEY?.trim()
        ? 'FAL_KEY set — homework story scene art can call fal Flux.'
        : 'Add FAL_KEY (fal.ai) in Vercel to enable optional Pixar-style scene images on homework results.',
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
    serviceAuth: {
      sparkiServiceSecretSet: Boolean(getSparkiServiceSecret()),
      ttsAllowOriginsConfigured: parseTtsAllowOrigins().length > 0,
      message: getSparkiServiceSecret()
        ? parseTtsAllowOrigins().length > 0
          ? 'SPARKI_SERVICE_SECRET set and TTS_ALLOW_ORIGINS set — worker + browser TTS should work.'
          : 'SPARKI_SERVICE_SECRET set but TTS_ALLOW_ORIGINS empty — video worker can call TTS; browser Listen needs TTS_ALLOW_ORIGINS (comma-separated https:// origins).'
        : 'SPARKI_SERVICE_SECRET unset — video worker /generate is not bearer-locked; TTS is open unless you set secret + TTS_ALLOW_ORIGINS. Recommended for production.',
    },
    // AI Tutor Academy: /ai-tutor, POST /api/tutor-chat, /api/liveavatar-session, /api/tts-stream
    aiTutor: {
      /** Effective gate for tutor chat (see `api/lib/tutorEntitlement.js`). */
      requireCheckoutForTutor: isTutorCheckoutRequired(),
      openaiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim()),
      /** @deprecated Use liveAvatar; HEYGEN_API_KEY still works as fallback API key for LiveAvatar token. */
      heygenStreamingTokenRouteLegacy: true,
      liveAvatar: (() => {
        const apiKey = Boolean(
          process.env.LIVEAVATAR_API_KEY?.trim() || process.env.HEYGEN_API_KEY?.trim(),
        )
        const avatarId = (
          process.env.LIVEAVATAR_AVATAR_ID || process.env.HEYGEN_TUTOR_AVATAR_ID || ''
        ).trim()
        const voiceId = (
          process.env.LIVEAVATAR_VOICE_ID || process.env.HEYGEN_TUTOR_VOICE_ID || ''
        ).trim()
        const contextId = (process.env.LIVEAVATAR_CONTEXT_ID || '').trim()
        const avatarOk = Boolean(avatarId) && avatarId !== 'default'
        const fullModeReady = Boolean(contextId) && Boolean(voiceId) && avatarOk
        const liteReady = avatarOk
        return {
          apiKeySet: apiKey,
          avatarIdSet: avatarOk,
          voiceIdSet: Boolean(voiceId),
          contextIdSet: Boolean(contextId),
          fullModeReady,
          liteModeReady: liteReady,
          message: !apiKey
            ? 'Set LIVEAVATAR_API_KEY (or HEYGEN_API_KEY as fallback) for POST /api/liveavatar-session.'
            : !avatarOk
              ? 'Set LIVEAVATAR_AVATAR_ID or HEYGEN_TUTOR_AVATAR_ID to a real LiveAvatar avatar UUID (not "default").'
              : fullModeReady
                ? 'LiveAvatar FULL mode: token route will use avatar + voice + context.'
                : liteReady
                  ? 'LiveAvatar LITE mode: add LIVEAVATAR_CONTEXT_ID + LIVEAVATAR_VOICE_ID (or HEYGEN_TUTOR_VOICE_ID) for FULL mode and richer tutor behavior.'
                  : 'Incomplete LiveAvatar env.',
        }
      })(),
      elevenLabsForTts: Boolean(elevenKey),
      tutorLeadCapture:
        (Boolean(process.env.RESEND_API_KEY?.trim()) &&
          Boolean(process.env.TUTOR_LEAD_NOTIFY_TO?.trim()) &&
          Boolean(process.env.RESEND_FROM_EMAIL?.trim())) ||
        Boolean(process.env.TUTOR_LEAD_WEBHOOK_URL?.trim()),
      message: !process.env.OPENAI_API_KEY?.trim()
        ? 'Add OPENAI_API_KEY for tutor chat (same as homework).'
        : !(process.env.LIVEAVATAR_API_KEY?.trim() || process.env.HEYGEN_API_KEY?.trim())
          ? 'No LiveAvatar API key — set LIVEAVATAR_API_KEY or HEYGEN_API_KEY for live avatar; text + ElevenLabs voice can still work.'
          : 'OpenAI + LiveAvatar token path configured. See liveAvatar object for FULL vs LITE readiness.',
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
    // Stripe: Adventure Academy, per-ebook purchases, homework/tutor entitlement (optional for free school-only pilots)
    stripe: {
      configured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
      academyPriceConfigured: Boolean(process.env.STRIPE_ACADEMY_PRICE_ID?.trim()),
      message: process.env.STRIPE_SECRET_KEY?.trim()
        ? 'STRIPE_SECRET_KEY set — verify STRIPE_ACADEMY_PRICE_ID, ebook price IDs, and checkout URLs in Production before promising paid flows.'
        : 'No STRIPE_SECRET_KEY — scope pilot as free-only or homework without paid entitlement until Stripe is configured.',
    },
    // Blob: used by Vercel cron (cleanup) and by Railway worker (upload)
    blob: {
      configured: Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim()),
      message: process.env.BLOB_READ_WRITE_TOKEN
        ? 'Blob token set on this app (cron cleanup). Same token must be on Railway for worker uploads.'
        : 'Add BLOB_READ_WRITE_TOKEN from Vercel Storage → Blob → Create token.',
    },
    // Vercel Cron: optional CRON_SECRET locks /api/cron/* to Bearer token (set in Vercel env + Cron job secret).
    cron: {
      secretConfigured: Boolean(process.env.CRON_SECRET?.trim()),
      message: process.env.CRON_SECRET?.trim()
        ? 'CRON_SECRET set — scheduled cleanup calls must include Authorization: Bearer (Vercel Cron does this when the secret matches).'
        : 'Optional: set CRON_SECRET in Vercel and attach the same value to the Cron job secret so cleanup is not publicly callable.',
    },
    // VITE_* vars are build-time on Vercel — not visible here. See docs/DEPLOY-CHECKLIST.md (Supabase, demo video).
    schoolFrontend: {
      supabaseAndViteNote:
        'Teacher dashboard / weekly track need VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY on Vercel (Production). Redeploy after changing. Optional: VITE_SCHOOL_DEMO_VIDEO_URL.',
    },
  })
}
