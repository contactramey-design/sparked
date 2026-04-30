/**
 * POST /api/newsletter-send-digest
 *
 * Sends a simple digest email to all `newsletter_optins` using Resend.
 * Intended to be called by a weekly cron (Vercel Cron) or manual admin trigger.
 *
 * Env:
 * - RESEND_API_KEY (required to send)
 * - NEWSLETTER_FROM (required, e.g. "Sparki Academy <hello@sparkiedu.com>")
 * - SITE_URL (optional; defaults to https://sparkiedu.com)
 * - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (required to load recipients)
 */
import { rateLimit } from './lib/rateLimit.js'
import { getServiceSupabase } from './lib/tutorTelemetry.js'

const RESEND_URL = 'https://api.resend.com/emails'

const POSTS = [
  { slug: 'internet-safety', titleKey: 'marketingPages.post1Title' },
  { slug: 'ai-in-schools', titleKey: 'marketingPages.post4Title' },
  { slug: 'coppa-ai-parent-controls', titleKey: 'marketingPages.post5Title' },
]

function safeText(s) {
  return typeof s === 'string' ? s : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'newsletter-send-digest', limit: 6, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    res.status(429).json({ error: 'Too many requests. Try again later.' })
    return
  }

  const resendKey = safeText(process.env.RESEND_API_KEY).trim()
  const from = safeText(process.env.NEWSLETTER_FROM).trim()
  const siteUrl = safeText(process.env.SITE_URL).trim() || 'https://sparkiedu.com'

  if (!resendKey || !from) {
    res.status(503).json({ error: 'Newsletter sending is not configured (RESEND_API_KEY + NEWSLETTER_FROM).' })
    return
  }

  const sb = getServiceSupabase()
  if (!sb) {
    res.status(503).json({ error: 'Newsletter sending requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.' })
    return
  }

  const { data, error } = await sb.from('newsletter_optins').select('email, locale').order('created_at', { ascending: true }).limit(5000)
  if (error || !Array.isArray(data)) {
    res.status(502).json({ error: 'Could not load recipients.' })
    return
  }

  const recipients = data
    .map((row) => ({ email: safeText(row.email).trim().toLowerCase(), locale: safeText(row.locale).trim().toLowerCase() }))
    .filter((row) => row.email)

  if (recipients.length === 0) {
    res.status(200).json({ ok: true, sent: 0 })
    return
  }

  let sent = 0
  for (const r of recipients) {
    const locale = r.locale === 'es' ? 'es' : 'en'
    const subject = locale === 'es' ? 'Actualizaciones de Sparki: IA y escuela' : 'Sparki updates: AI & school'
    const heading = locale === 'es' ? 'Actualizaciones para familias' : 'Updates for families'
    const intro =
      locale === 'es'
        ? 'Ideas cortas y seguras sobre IA, escuela y hábitos digitales — pensadas para adultos.'
        : 'Short, practical, safety-first notes on AI, school, and digital habits — built for grown-ups.'

    const links = POSTS.map((p) => {
      const href = `${siteUrl.replace(/\/$/, '')}/blog/${p.slug}`
      return `<li><a href="${href}" target="_blank" rel="noreferrer">${href}</a></li>`
    }).join('')

    const html = `
      <div style="font-family: ui-sans-serif, system-ui, -apple-system; line-height: 1.5; color: #0f172a;">
        <h2 style="margin: 0 0 8px 0;">${heading}</h2>
        <p style="margin: 0 0 16px 0; color: #334155;">${intro}</p>
        <p style="margin: 0 0 8px 0; font-weight: 700;">${locale === 'es' ? 'Lecturas recientes' : 'Recent reads'}</p>
        <ul style="margin: 0 0 16px 18px; padding: 0;">${links}</ul>
        <p style="margin: 0; color: #64748b; font-size: 12px;">
          ${locale === 'es' ? 'Recibiste este correo porque te suscribiste a actualizaciones para familias.' : 'You received this email because you subscribed to parent updates.'}
        </p>
      </div>
    `

    try {
      const sendRes = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from,
          to: r.email,
          subject,
          html,
        }),
      })
      if (sendRes.ok) sent += 1
    } catch {
      // ignore per-recipient failures
    }
  }

  res.status(200).json({ ok: true, sent })
}

