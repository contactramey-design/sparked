/**
 * GET /api/config
 * Returns public feature flags (e.g. video generation). No secrets.
 */
import { isVercelProduction } from './lib/deployMode.js'

function homeworkCheckoutRequiredForClient() {
  if (process.env.ALLOW_UNAUTH_HOMEWORK === 'true') return false
  if (process.env.HOMEWORK_REQUIRE_CHECKOUT === 'false') return false
  if (process.env.HOMEWORK_REQUIRE_CHECKOUT === 'true') return true
  return isVercelProduction()
}

function aiTutorCheckoutRequiredForClient() {
  if (process.env.ALLOW_UNAUTH_TUTOR === 'true') return false
  return process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true'
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  res.status(200).json({
    videoFeatureEnabled: process.env.VIDEO_FEATURE_ENABLED === 'true',
    homeworkAdventureConfigured: Boolean(process.env.OPENAI_API_KEY),
    /** When true, homework APIs skip Stripe checkout; upload UI allows generate without Academy checkout (dev / OpenAI-only deploys). */
    homeworkAllowUnauth: process.env.ALLOW_UNAUTH_HOMEWORK === 'true',
    /**
     * Matches server homework entitlement (see `api/homework/lib/multipart.js`): Vercel Production requires
     * checkout unless HOMEWORK_REQUIRE_CHECKOUT=false or ALLOW_UNAUTH_HOMEWORK.
     */
    homeworkRequireCheckout: homeworkCheckoutRequiredForClient(),
    /** When true, AI Tutor APIs skip Stripe checkout (local dev only — do not enable in production). */
    tutorAllowUnauth: process.env.ALLOW_UNAUTH_TUTOR === 'true',
    /**
     * True only when `AI_TUTOR_REQUIRE_CHECKOUT=true`. Default off: tutor text allows 3 free messages (see tutor-chat);
     * paywall is after free tier. Live video still requires Academy server-side.
     */
    aiTutorRequireCheckout: aiTutorCheckoutRequiredForClient(),
    /** When true, Homework Adventure Video (Claude + TTS + worker) is disabled — set on Vercel while marketing other surfaces. */
    homeworkAdventurePaused: process.env.HOMEWORK_ADVENTURE_PAUSED === 'true',
    /**
     * When true, /ai-tutor can show the “3 more free messages” email modal; server accepts POST /api/tutor-lead
     * (Resend + TUTOR_LEAD_NOTIFY_TO + RESEND_FROM_EMAIL, and/or TUTOR_LEAD_WEBHOOK_URL).
     */
    tutorLeadCaptureEnabled:
      (Boolean(process.env.RESEND_API_KEY?.trim()) &&
        Boolean(process.env.TUTOR_LEAD_NOTIFY_TO?.trim()) &&
        Boolean(process.env.RESEND_FROM_EMAIL?.trim())) ||
      Boolean(process.env.TUTOR_LEAD_WEBHOOK_URL?.trim()),
    /** When true, POST /api/tutor-visual is enabled (DALL·E — costs apply; rate limited). */
    tutorVisualEnabled: process.env.TUTOR_VISUAL_ENABLED === 'true',
  })
}
