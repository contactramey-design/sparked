/**
 * AI Tutor Stripe checkout gate for **text** (`tutor-chat`): shared with `liveavatar-session` for the
 * strict “no session at all” mode only.
 *
 * - Local / Preview: open unless `AI_TUTOR_REQUIRE_CHECKOUT=true`.
 * - Vercel Production: required unless `AI_TUTOR_REQUIRE_CHECKOUT=false` (free preview) or `ALLOW_UNAUTH_TUTOR=true`.
 * - **Live video** still always requires a verified subscription in `liveavatar-session.js` when unauth is off.
 */
import { verifyHomeworkCheckoutSession } from './verifyBundleEntitlement.js'
import { isVercelProduction } from './deployMode.js'

/**
 * When true, /ai-tutor hard paywall + tutor-chat requires checkout before any messages.
 * Vercel Production defaults to required unless AI_TUTOR_REQUIRE_CHECKOUT=false (e.g. marketing preview).
 */
export function isTutorCheckoutRequired() {
  if (process.env.ALLOW_UNAUTH_TUTOR === 'true') return false
  if (process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'false') return false
  if (process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true') return true
  return isVercelProduction()
}

/**
 * @param {string} checkoutSessionId
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string }>}
 */
export async function requireTutorCheckoutOrAllow(checkoutSessionId) {
  if (process.env.ALLOW_UNAUTH_TUTOR === 'true') {
    return { ok: true }
  }
  if (!isTutorCheckoutRequired()) {
    return { ok: true }
  }
  return verifyHomeworkCheckoutSession((checkoutSessionId || '').trim())
}
