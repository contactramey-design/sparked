import Stripe from 'stripe'

const ALLOWED_EBOOK_IDS = new Set([
  'ebook-1',
  'ebook-2',
  'ebook-3',
  'ebook-4',
  'ebook-5',
  'ebook-6',
])

async function resolvePriceIdFromEnv(stripe, maybeId) {
  if (!maybeId || typeof maybeId !== 'string') return null
  const trimmed = maybeId.trim()
  if (trimmed.startsWith('price_')) return trimmed
  if (!trimmed.startsWith('prod_')) return null

  // If we were given a Product ID, resolve to a usable Price ID.
  // Prefer `default_price`; fall back to first active price.
  const product = await stripe.products.retrieve(trimmed, { expand: ['default_price'] }).catch(() => null)
  const defaultPrice = product?.default_price
  if (typeof defaultPrice === 'string') return defaultPrice
  if (defaultPrice?.id) return defaultPrice.id

  const prices = await stripe.prices.list({ product: trimmed, active: true, limit: 5 })
  return prices.data?.[0]?.id ?? null
}

function getEbookPriceId(ebookId) {
  switch (ebookId) {
    case 'ebook-1':
      return process.env.STRIPE_EBOOK_1_PRICE_ID
    case 'ebook-2':
      return process.env.STRIPE_EBOOK_2_PRICE_ID
    case 'ebook-3':
      return process.env.STRIPE_EBOOK_3_PRICE_ID
    case 'ebook-4':
      return process.env.STRIPE_EBOOK_4_PRICE_ID
    case 'ebook-5':
      return process.env.STRIPE_EBOOK_5_PRICE_ID
    case 'ebook-6':
      return process.env.STRIPE_EBOOK_6_PRICE_ID
    default:
      return null
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })
    }

    const ebookId = typeof req?.body?.ebookId === 'string' ? req.body.ebookId.trim() : ''
    if (!ebookId || !ALLOWED_EBOOK_IDS.has(ebookId)) {
      return res.status(400).json({ error: 'Invalid ebook id.' })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    const maybeEnvId = getEbookPriceId(ebookId)
    const priceId = await resolvePriceIdFromEnv(stripe, maybeEnvId)
    if (!priceId) {
      return res.status(500).json({ error: `Missing Stripe price id for ${ebookId}` })
    }

    const origin =
      (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
        : req.headers.origin

    const successUrlEnv = process.env.STRIPE_CHECKOUT_SUCCESS_URL
    const cancelUrlEnv = process.env.STRIPE_CHECKOUT_CANCEL_URL

    const requestedReturnTo =
      typeof req?.body?.returnTo === 'string' ? req.body.returnTo : null
    const safeReturnTo =
      requestedReturnTo && requestedReturnTo.startsWith('/ebook/')
        ? requestedReturnTo
        : null

    let success_url =
      successUrlEnv || `${origin || ''}/?view=parent&checkout=success`
    if (!success_url.includes('checkout_session_id=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}checkout_session_id={CHECKOUT_SESSION_ID}`
    }
    if (!success_url.includes('entitlement_type=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}entitlement_type=ebook`
    }
    if (safeReturnTo && !success_url.includes('returnTo=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}returnTo=${encodeURIComponent(safeReturnTo)}`
    }
    if (!success_url.includes('ebook_id=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}ebook_id=${encodeURIComponent(ebookId)}`
    }

    const cancel_url =
      cancelUrlEnv || `${origin || ''}/?view=parent&checkout=cancel&entitlement_type=ebook`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url,
      cancel_url,
      metadata: {
        entitlement_type: 'ebook',
        ebookId,
        // Helpful for debugging; not required for entitlement checks because we compare ebookId.
        stripePriceId: priceId,
      },
    })

    return res.status(200).json({ url: session.url })
  } catch (e) {
    const message = e && typeof e === 'object' && 'message' in e ? e.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}

