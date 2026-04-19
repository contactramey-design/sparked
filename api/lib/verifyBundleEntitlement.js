/**
 * Shared Stripe checks for Adventure Academy subscription (checkout session → subscription).
 * Used by download-ebook, process-homework, tutor-chat, liveavatar-session.
 */
import Stripe from 'stripe'

async function resolvePriceIdFromEnv(stripe, maybeId) {
  if (!maybeId || typeof maybeId !== 'string') return null
  const trimmed = maybeId.trim()
  if (trimmed.startsWith('price_')) return trimmed
  if (!trimmed.startsWith('prod_')) return null

  const product = await stripe.products.retrieve(trimmed, { expand: ['default_price'] }).catch(() => null)
  const defaultPrice = product?.default_price
  if (typeof defaultPrice === 'string') return defaultPrice
  if (defaultPrice?.id) return defaultPrice.id

  const prices = await stripe.prices.list({ product: trimmed, active: true, limit: 5 })
  return prices.data?.[0]?.id ?? null
}

/**
 * Homework Adventure + AI Tutor + subscriber PDF library: active Academy subscription from checkout
 * session metadata `entitlement_type` === `academy`.
 * @param {string} checkoutSessionId
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string }>}
 */
export async function verifyHomeworkCheckoutSession(checkoutSessionId) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) {
    return { ok: false, status: 500, message: 'Server not configured for entitlement checks.' }
  }
  const id = (checkoutSessionId || '').toString().trim()
  if (!id) {
    return { ok: false, status: 403, message: 'Missing checkout session id.' }
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  const session = await stripe.checkout.sessions.retrieve(id)
  const entitlementType = session?.metadata?.entitlement_type

  if (entitlementType !== 'academy') {
    return { ok: false, status: 403, message: 'Not entitled to use Homework Adventure.' }
  }

  const subscriptionId = session?.subscription
  if (!subscriptionId) {
    return { ok: false, status: 403, message: 'No active subscription for this session.' }
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const status = subscription?.status
  const subscriptionPriceId = subscription?.items?.data?.[0]?.price?.id ?? null
  const expectedFromMeta = (session?.metadata?.stripePriceId || '').toString().trim()

  const envPriceId = process.env.STRIPE_ACADEMY_PRICE_ID
  if (!envPriceId) {
    return { ok: false, status: 500, message: 'Server not configured for this entitlement type.' }
  }

  let expectedPriceId = expectedFromMeta || null
  if (!expectedPriceId) {
    expectedPriceId = await resolvePriceIdFromEnv(stripe, envPriceId)
  }

  const isEntitled =
    (status === 'active' || status === 'trialing') &&
    subscriptionPriceId &&
    expectedPriceId &&
    subscriptionPriceId === expectedPriceId

  if (!isEntitled) {
    return { ok: false, status: 403, message: 'Subscription is not active or does not match this product.' }
  }

  return { ok: true }
}
