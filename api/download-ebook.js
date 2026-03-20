import Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'
import { verifyBundleCheckoutSession } from './lib/verifyBundleEntitlement.js'

const ALLOWED_EBOOK_IDS = new Set([
  'ebook-1',
  'ebook-2',
  'ebook-3',
  'ebook-4',
  'ebook-5',
  'ebook-6',
  'bundle',
])

// PDFs are stored outside `public/` for protection.
// Expected location: `private/ebooks/<ebookId>.pdf`
//
// PDFs are stored in `private/ebooks/<ebookId>.pdf` (protected by this endpoint).

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const ebookId = (url.searchParams.get('ebookId') || '').toString().trim()
    const checkoutSessionId = (url.searchParams.get('checkout_session_id') || '').toString().trim()
    const isFreeTestEbook = ebookId === 'ebook-1'
    const allowFreeTestEbook = process.env.ALLOW_FREE_TEST_EBOOK === 'true'

    if (!ebookId || !ALLOWED_EBOOK_IDS.has(ebookId)) {
      res.status(400).json({ error: 'Invalid ebook id.' })
      return
    }

    // Dev-only: allow `ebook-1` without Stripe when ALLOW_FREE_TEST_EBOOK=true
    if (isFreeTestEbook && allowFreeTestEbook) {
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
      res.setHeader('Content-Disposition', `attachment; filename="${ebookId}.pdf"`)
      res.setHeader('Cache-Control', 'private, no-store')
      res.status(200).end(fileBuffer)
      return
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const safetyPassPriceOrProductId = process.env.STRIPE_SAFETY_PASS_PRICE_ID
    if (!stripeSecretKey || !safetyPassPriceOrProductId) {
      res.status(500).json({ error: 'Server not configured for downloads.' })
      return
    }

    if (!checkoutSessionId) {
      res.status(403).json({ error: 'Missing checkout session id.' })
      return
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' })
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId)
    const entitlementType = session?.metadata?.entitlement_type

    if (entitlementType === 'ebook') {
      if (session?.payment_status !== 'paid') {
        res.status(403).json({ error: 'Not entitled to download.' })
        return
      }
      const sessionEbookId = (session?.metadata?.ebookId || '').toString().trim()
      if (!sessionEbookId || sessionEbookId !== ebookId) {
        res.status(403).json({ error: 'Not entitled to download.' })
        return
      }
    } else {
      const bundleCheck = await verifyBundleCheckoutSession(checkoutSessionId)
      if (!bundleCheck.ok) {
        res.status(bundleCheck.status).json({ error: 'Not entitled to download.' })
        return
      }
    }

    // PDFs live outside `public/` so they can only be accessed via this protected endpoint.
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

