import Stripe from 'stripe'
import fs from 'node:fs'
import path from 'node:path'
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'

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

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    const ebookId = (url.searchParams.get('ebookId') || '').toString().trim()
    const checkoutSessionId = (url.searchParams.get('checkout_session_id') || '').toString().trim()
    const isFreeTestEbook = ebookId === 'ebook-1'
    const allowFreeTestEbook = process.env.ALLOW_FREE_TEST_EBOOK === 'true'

    if (!ebookId || !ALLOWED_EBOOK_IDS.has(ebookId)) {
      res.status(400).json({ error: 'Invalid ebook id.' })
      return
    }

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
    if (!stripeSecretKey) {
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
      const academyCheck = await verifyHomeworkCheckoutSession(checkoutSessionId)
      if (!academyCheck.ok) {
        res.status(academyCheck.status).json({ error: 'Not entitled to download.' })
        return
      }
    }

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
      `attachment; filename="${ebookId}.pdf"`,
    )
    res.setHeader('Cache-Control', 'private, no-store')
    res.status(200).end(fileBuffer)
  } catch (e) {
    const message = e && typeof e === 'object' && 'message' in e ? e.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}
