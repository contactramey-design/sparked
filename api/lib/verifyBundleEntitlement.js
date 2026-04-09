/**
 * Shared Stripe checks for the Safety Pass / bundle subscription (checkout session → subscription).
 * Used by download-ebook and process-homework.
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
 * @param {string} checkoutSessionId
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string }>}
 */
export async function verifyBundleCheckoutSession(checkoutSessionId) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const safetyPassPriceOrProductId = process.env.STRIPE_SAFETY_PASS_PRICE_ID
  if (!stripeSecretKey || !safetyPassPriceOrProductId) {
    return { ok: false, status: 500, message: 'Server not configured for entitlement checks.' }
  }
  const id = (checkoutSessionId || '').toString().trim()
  if (!id) {
    return { ok: false, status: 403, message: 'Missing checkout session id.' }
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
  const session = await stripe.checkout.sessions.retrieve(id)
  const entitlementType = session?.metadata?.entitlement_type

  if (entitlementType !== 'bundle') {
    return { ok: false, status: 403, message: 'Not entitled to use Homework Adventure.' }
  }

  const subscriptionId = session?.subscription
  if (!subscriptionId) {
    return { ok: false, status: 403, message: 'No active subscription for this session.' }
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const status = subscription?.status
  const subscriptionPriceId = subscription?.items?.data?.[0]?.price?.id ?? null
  const expectedPriceIdFromCheckoutMeta = (session?.metadata?.stripePriceId || '').toString().trim()

  let expectedPriceId = expectedPriceIdFromCheckoutMeta || null
  if (!expectedPriceId) {
    expectedPriceId = await resolvePriceIdFromEnv(stripe, safetyPassPriceOrProductId)
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

/**
 * Homework Adventure: active subscription from checkout session metadata `bundle` (legacy Safety Pass) or `academy`.
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

  if (entitlementType !== 'bundle' && entitlementType !== 'academy') {
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

  const envPriceId =
    entitlementType === 'academy'
      ? process.env.STRIPE_ACADEMY_PRICE_ID
      : process.env.STRIPE_SAFETY_PASS_PRICE_ID
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
