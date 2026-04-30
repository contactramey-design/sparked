/**
 * POST /api/newsletter-optin
 * Stores parent newsletter opt-in (best-effort).
 *
 * Env (optional):
 * - SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY: writes to table `newsletter_optins`
 *
 * Table suggestion:
 * - id uuid default gen_random_uuid() primary key
 * - email text not null unique
 * - locale text not null default 'en'
 * - source text null
 * - created_at timestamptz default now()
 * - updated_at timestamptz default now()
 */
import { rateLimit } from './lib/rateLimit.js'
import { getServiceSupabase } from './lib/tutorTelemetry.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'newsletter-optin', limit: 30, windowMs: 10 * 60 * 1000 })
  res.setHeader('X-RateLimit-Limit', '30')
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.floor(rl.resetMs / 1000)))
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetMs - Date.now()) / 1000))
    res.setHeader('Retry-After', String(retryAfterSec))
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
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

  const emailRaw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const localeRaw = typeof body.locale === 'string' ? body.locale.trim().toLowerCase() : 'en'
  const locale = localeRaw === 'es' || localeRaw.startsWith('es-') ? 'es' : 'en'
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 32) : ''

  if (!emailRaw || !EMAIL_RE.test(emailRaw)) {
    res.status(400).json({ error: 'Invalid email address.' })
    return
  }

  const sb = getServiceSupabase()
  if (!sb) {
    // Best-effort: accept so UI can proceed on deployments without Supabase.
    res.status(200).json({ ok: true, stored: false })
    return
  }

  try {
    const { error } = await sb
      .from('newsletter_optins')
      .upsert(
        {
          email: emailRaw,
          locale,
          source: source || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' },
      )
    if (error) {
      res.status(200).json({ ok: true, stored: false })
      return
    }
    res.status(200).json({ ok: true, stored: true })
  } catch {
    res.status(200).json({ ok: true, stored: false })
  }
}

