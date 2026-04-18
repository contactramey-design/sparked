/**
 * AI Tutor Stripe checkout gate (shared by tutor-chat and liveavatar-session).
 * By default checkout is NOT required so the tutor + avatar can be tested.
 * Set AI_TUTOR_REQUIRE_CHECKOUT=true (and Stripe env) to restore the paywall.
 */
import { verifyHomeworkCheckoutSession } from './verifyBundleEntitlement.js'

export function isTutorCheckoutRequired() {
  return process.env.AI_TUTOR_REQUIRE_CHECKOUT === 'true'
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
