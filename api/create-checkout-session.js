import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const priceId = process.env.STRIPE_SAFETY_PASS_PRICE_ID
    const successUrlEnv = process.env.STRIPE_CHECKOUT_SUCCESS_URL
    const cancelUrlEnv = process.env.STRIPE_CHECKOUT_CANCEL_URL

    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' })
    }
    if (!priceId) {
      return res.status(500).json({ error: 'Missing STRIPE_SAFETY_PASS_PRICE_ID' })
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    })

    const origin =
      (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-host'])
        ? `${req.headers['x-forwarded-proto']}://${req.headers['x-forwarded-host']}`
        : req.headers.origin

    let success_url =
      successUrlEnv || `${origin || ''}/?view=parent&checkout=success`
    // Let the frontend store checkout session id and use it to validate entitlement for downloads.
    if (!success_url.includes('checkout_session_id=')) {
      success_url += `${success_url.includes('?') ? '&' : '?'}checkout_session_id={CHECKOUT_SESSION_ID}`
    }
    const cancel_url =
      cancelUrlEnv || `${origin || ''}/?view=parent&checkout=cancel`

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
      success_url,
      cancel_url,
    })

    return res.status(200).json({ url: session.url })
  } catch (e) {
    const message = e && typeof e === 'object' && 'message' in e ? e.message : 'Unknown error'
    return res.status(500).json({ error: message })
  }
}

