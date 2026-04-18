/**
 * POST /api/tutor-chat
 * Premium AI Tutor: GPT-4o with state- and age-aware system prompt.
 * Body JSON: { checkout_session_id, messages, age_band, state, subject }
 */
import { requireTutorCheckoutOrAllow } from './lib/tutorEntitlement.js'
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { buildTutorSystemPrompt } from './tutor/lib/prompts.js'
import { rateLimit } from './lib/rateLimit.js'

const MAX_MESSAGES = 36
const MAX_CONTENT = 6000
const MODEL = 'gpt-4o'
/** Free preview: max user turns without an active Adventure Academy / bundle subscription (server-enforced). */
const FREE_TUTOR_USER_MESSAGES = 3

function normalizeMessages(raw) {
  if (!Array.isArray(raw)) return []
  const out = []
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') continue
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null
    if (!role) continue
    let content = typeof m.content === 'string' ? m.content.trim() : ''
    if (!content) continue
    if (content.length > MAX_CONTENT) content = content.slice(0, MAX_CONTENT)
    out.push({ role, content })
  }
  return out
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'tutor-chat', limit: 30, windowMs: 10 * 60 * 1000 })
  res.setHeader('X-RateLimit-Limit', '30')
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining))
  res.setHeader('X-RateLimit-Reset', String(Math.floor(rl.resetMs / 1000)))
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetMs - Date.now()) / 1000))
    res.setHeader('Retry-After', String(retryAfterSec))
    res.status(429).json({ error: 'Too many tutor requests. Please wait a moment and try again.' })
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

  const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''
  const ageBand = typeof body.age_band === 'string' ? body.age_band.trim() : 'kids'
  const state = typeof body.state === 'string' ? body.state.trim() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : 'general'
  const localeRaw = typeof body.locale === 'string' ? body.locale.trim().toLowerCase() : 'en'
  const locale = localeRaw === 'es' || localeRaw.startsWith('es-') ? 'es' : 'en'
  const messages = normalizeMessages(body.messages)

  if (messages.length === 0) {
    res.status(400).json({ error: 'Send at least one user message.' })
    return
  }

  const ent = await requireTutorCheckoutOrAllow(checkoutSessionId)
  if (!ent.ok) {
    res.status(ent.status).json({
      error:
        ent.status === 403
          ? 'Adventure Academy unlock required. Ask a parent to subscribe, then try again.'
          : ent.message || 'Not allowed.',
    })
    return
  }

  if (process.env.ALLOW_UNAUTH_TUTOR !== 'true') {
    const paid = await verifyHomeworkCheckoutSession(checkoutSessionId)
    const userTurns = messages.filter((m) => m.role === 'user').length
    if (!paid.ok && userTurns > FREE_TUTOR_USER_MESSAGES) {
      res.status(403).json({
        code: 'TUTOR_FREE_LIMIT',
        error: 'TUTOR_FREE_LIMIT',
        message:
          'You have used your free tutor questions. Ask a parent to subscribe to Adventure Academy to keep chatting.',
      })
      return
    }
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'Tutor is not configured yet.' })
    return
  }

  const system = buildTutorSystemPrompt({ ageBand, state, subject, locale })
  const openaiMessages = [{ role: 'system', content: system }, ...messages]

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: openaiMessages,
        max_tokens: 900,
        temperature: 0.65,
      }),
    })

    if (!r.ok) {
      const errText = await r.text()
      if (process.env.NODE_ENV !== 'production') {
        console.error('[tutor-chat] OpenAI', r.status, errText.slice(0, 400))
      }
      res.status(r.status === 429 ? 429 : 502).json({
        error:
          r.status === 429
            ? 'Too many requests. Please wait a moment.'
            : 'The tutor had a hiccup. Please try again.',
      })
      return
    }

    const data = await r.json()
    const text = data.choices?.[0]?.message?.content?.trim()
    if (!text) {
      res.status(502).json({ error: 'No reply from tutor.' })
      return
    }

    res.status(200).json({ reply: text })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[tutor-chat]', e)
    }
    res.status(502).json({ error: 'Could not reach tutor service.' })
  }
}
