import Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'

const ALLOWED_EBOOK_IDS = new Set([
  'ebook-1',
  'ebook-2',
  'ebook-3',
  'ebook-4',
  'ebook-5',
  'ebook-6',
  'bundle',
])

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const safetyPassPriceId = process.env.STRIPE_SAFETY_PASS_PRICE_ID
    if (!stripeSecretKey || !safetyPassPriceId) {
      res.status(500).json({ error: 'Server not configured for downloads.' })
      return
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const ebookId = (url.searchParams.get('ebookId') || '').toString().trim()
    const checkoutSessionId = (url.searchParams.get('checkout_session_id') || '').toString().trim()

    if (!ebookId || !ALLOWED_EBOOK_IDS.has(ebookId)) {
      res.status(400).json({ error: 'Invalid ebook id.' })
      return
    }
    if (!checkoutSessionId) {
      res.status(403).json({ error: 'Missing checkout session id.' })
      return
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)
    const subscriptionId = session?.subscription
    if (!subscriptionId) {
      res.status(403).json({ error: 'Subscription not found for this checkout.' })
      return
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const status = subscription?.status

    const isEntitled =
      (status === 'active' || status === 'trialing') &&
      subscription?.items?.data?.[0]?.price?.id === safetyPassPriceId

    if (!isEntitled) {
      res.status(403).json({ error: 'Not entitled to download.' })
      return
    }

    // PDFs live outside `public/` so they can only be accessed via this protected endpoint.
    // Expected location: `private/ebooks/<ebookId>.pdf`
    const pdfPath = path.join(process.cwd(), 'private', 'ebooks', `${ebookId}.pdf`)
    const pdfExists = await fs.promises
      .access(pdfPath)
      .then(() => true)
      .catch(() => false)

    if (!pdfExists) {
      res.status(404).json({ error: 'PDF not found yet.' })
      return
    }

    const fileBuffer = await fs.promises.readFile(pdfPath)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${ebookId}.pdf"`
    )
    res.setHeader('Cache-Control', 'private, no-store')
    res.status(200).end(fileBuffer)
  } catch (e) {
    const message = e && typeof e === 'object' && 'message' in e ? e.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}

