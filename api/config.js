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
  if (process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'false') return false
  if (process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true') return true
  return isVercelProduction()
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
     * Matches `api/lib/tutorEntitlement.js`: Vercel Production requires checkout for tutor chat unless opted out.
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
  })
}
