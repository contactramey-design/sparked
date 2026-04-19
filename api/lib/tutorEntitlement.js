/**
 * AI Tutor checkout flags (text chat uses 3 free user messages without a session; see `api/tutor-chat.js`).
 * Live video (`liveavatar-session`, legacy heygen token) always verifies Adventure Academy unless
 * `ALLOW_UNAUTH_TUTOR=true`.
 *
 * `AI_TUTOR_REQUIRE_CHECKOUT=true` — optional: `GET /api/config` sets `aiTutorRequireCheckout` for UI/analytics.
 * Production default is off so families get three free text messages before subscribing.
 */
/**
 * Opt-in strict mode. When true, `GET /api/config` reports `aiTutorRequireCheckout`.
 * Default: false everywhere, including Vercel Production.
 */
export function isTutorCheckoutRequired() {
  return process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true'
}
