/**
 * POST /api/tutor-lead
 * Parent/guardian email when unpaid tutor free tier is exhausted (marketing list).
 * Configure one of: Resend (RESEND_API_KEY + TUTOR_LEAD_NOTIFY_TO + RESEND_FROM_EMAIL),
 * or TUTOR_LEAD_WEBHOOK_URL (optional TUTOR_LEAD_WEBHOOK_SECRET as Bearer).
 */
import { rateLimit } from './lib/rateLimit.js'

const MAX_EMAIL_LEN = 254

function normalizeEmail(raw) {
  if (typeof raw !== 'string') return ''
  return raw.trim().toLowerCase().slice(0, MAX_EMAIL_LEN)
}

function isValidEmail(email) {
  if (!email || email.length < 5 || email.length > MAX_EMAIL_LEN) return false
  // Practical single-line check (parent inbox, not child accounts).
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function deliverViaResend({ email, locale }) {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const to = process.env.TUTOR_LEAD_NOTIFY_TO?.trim()
  const from = process.env.RESEND_FROM_EMAIL?.trim()
  if (!apiKey || !to || !from) return { ok: false, reason: 'resend_incomplete' }

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `AI Tutor lead (free limit): ${email}`,
      html: `<p><strong>Email</strong> (reply-to): ${escapeHtml(email)}</p><p><strong>Locale</strong>: ${escapeHtml(locale)}</p><p><strong>Source</strong>: tutor_free_limit</p><p><strong>Time</strong>: ${escapeHtml(new Date().toISOString())}</p>`,
    }),
  })
  if (!r.ok) {
    const errText = await r.text().catch(() => '')
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[tutor-lead] Resend', r.status, errText.slice(0, 300))
    }
    return { ok: false, reason: 'resend_failed' }
  }
  return { ok: true }
}

async function deliverViaWebhook({ email, locale }) {
  const url = process.env.TUTOR_LEAD_WEBHOOK_URL?.trim()
  if (!url) return { ok: false, reason: 'no_webhook' }

  const secret = process.env.TUTOR_LEAD_WEBHOOK_SECRET?.trim()
  const headers = { 'Content-Type': 'application/json' }
  if (secret) headers.Authorization = `Bearer ${secret}`

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      source: 'tutor_free_limit',
      email,
      locale,
      at: new Date().toISOString(),
    }),
  })
  if (!r.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[tutor-lead] Webhook', r.status)
    }
    return { ok: false, reason: 'webhook_failed' }
  }
  return { ok: true }
}

export function isTutorLeadCaptureConfigured() {
  const resendOk =
    Boolean(process.env.RESEND_API_KEY?.trim()) &&
    Boolean(process.env.TUTOR_LEAD_NOTIFY_TO?.trim()) &&
    Boolean(process.env.RESEND_FROM_EMAIL?.trim())
  const webhookOk = Boolean(process.env.TUTOR_LEAD_WEBHOOK_URL?.trim())
  return resendOk || webhookOk
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'tutor-lead', limit: 10, windowMs: 60 * 60 * 1000 })
  res.setHeader('X-RateLimit-Limit', '10')
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.floor(rl.resetMs / 1000)))
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetMs - Date.now()) / 1000))
    res.setHeader('Retry-After', String(retryAfterSec))
    res.status(429).json({ error: 'Too many requests. Try again in a little while.' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  if (typeof body !== 'object' || body === null) body = {}

  const hp =
    (typeof body.website === 'string' && body.website.trim()) ||
    (typeof body.company === 'string' && body.company.trim()) ||
    ''
  if (hp) {
    res.status(400).json({ error: 'Invalid request.' })
    return
  }

  const email = normalizeEmail(body.email)
  if (!isValidEmail(email)) {
    res.status(400).json({ error: 'Enter a valid email address.' })
    return
  }

  const localeRaw = typeof body.locale === 'string' ? body.locale.trim().toLowerCase() : 'en'
  const locale = localeRaw === 'es' || localeRaw.startsWith('es-') ? 'es' : 'en'

  if (!isTutorLeadCaptureConfigured()) {
    res.status(503).json({
      code: 'TUTOR_LEAD_NOT_CONFIGURED',
      error: 'Lead capture is not configured on the server.',
    })
    return
  }

  let delivered = false
  const resend = await deliverViaResend({ email, locale })
  if (resend.ok) delivered = true

  const webhook = await deliverViaWebhook({ email, locale })
  if (webhook.ok) delivered = true

  if (!delivered) {
    res.status(502).json({ error: 'Could not save your email. Please try again later.' })
    return
  }

  res.status(200).json({ ok: true })
}
