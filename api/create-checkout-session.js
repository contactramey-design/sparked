import Stripe from 'stripe'

async function resolvePriceIdFromEnv(stripe, maybeId) {
  if (!maybeId || typeof maybeId !== 'string') return null
  const trimmed = maybeId.trim()
  if (trimmed.startsWith('price_')) return trimmed
  if (!trimmed.startsWith('prod_')) return null

  // If we were given a Product ID, resolve to a usable Price ID.
  const product = await stripe.products.retrieve(trimmed, { expand: ['default_price'] }).catch(() => null)
  const defaultPrice = product?.default_price
  if (typeof defaultPrice === 'string') return defaultPrice
  if (defaultPrice?.id) return defaultPrice.id

  const prices = await stripe.prices.list({ product: trimmed, active: true, limit: 5 })
  return prices.data?.[0]?.id ?? null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const priceOrProductId = process.env.STRIPE_SAFETY_PASS_PRICE_ID
    const successUrlEnv = process.env.STRIPE_CHECKOUT_SUCCESS_URL
    const cancelUrlEnv = process.env.STRIPE_CHECKOUT_CANCEL_URL

    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })
    }
    if (!priceOrProductId) {
      return res.status(500).json({ error: 'Missing STRIPE_SAFETY_PASS_PRICE_ID' })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    const priceId = await resolvePriceIdFromEnv(stripe, priceOrProductId)
    if (!priceId) {
      return res.status(500).json({ error: 'Could not resolve Stripe price for bundle' })
    }

    const origin =
      (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
        : req.headers.origin

    const body = req?.body && typeof req.body === 'object' ? req.body : {}
    const requestedReturnTo = typeof body?.returnTo === 'string' ? body.returnTo : null
    const safeReturnTo =
      requestedReturnTo && requestedReturnTo.startsWith('/ebook/')
        ? requestedReturnTo
        : null

    let success_url =
      successUrlEnv || `${origin || ''}/?view=parent&checkout=success`
    // Let the frontend store checkout session id and use it to validate entitlement for downloads.
    if (!success_url.includes('checkout_session_id=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}checkout_session_id={CHECKOUT_SESSION_ID}`
    }
    if (!success_url.includes('entitlement_type=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}entitlement_type=bundle`
    }
    if (safeReturnTo && !success_url.includes('returnTo=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}returnTo=${encodeURIComponent(safeReturnTo)}`
    }
    const cancel_url =
      cancelUrlEnv || `${origin || ''}/?view=parent&checkout=cancel&entitlement_type=bundle`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
      success_url,
      cancel_url,
      metadata: {
        entitlement_type: 'bundle',
        stripePriceId: priceId,
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (e) {
    const message = e && typeof e === 'object' && 'message' in e ? e.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}

