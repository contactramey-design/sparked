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
    /** When true, homework APIs skip Stripe checkout; upload UI allows generate without Safety Pass (dev / OpenAI-only deploys). */
    homeworkAllowUnauth: process.env.ALLOW_UNAUTH_HOMEWORK === 'true',
    /**
     * When true, homework pipeline + legacy process-homework require a valid checkout session (unless homeworkAllowUnauth).
     * Unset/false: homework works without Adventure Academy checkout (same default idea as AI_TUTOR_REQUIRE_CHECKOUT).
     */
    homeworkRequireCheckout: process.env.HOMEWORK_REQUIRE_CHECKOUT === 'true',
    /** When true, AI Tutor APIs skip Stripe checkout (local dev only — do not enable in production). */
    tutorAllowUnauth: process.env.ALLOW_UNAUTH_TUTOR === 'true',
    /**
     * When true, /ai-tutor paywall is shown and tutor-chat + liveavatar-session require a valid checkout session.
     * Default false: tutor + avatar work without Adventure Academy checkout (set to true when billing is ready).
     */
    aiTutorRequireCheckout: process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true',
  })
}
