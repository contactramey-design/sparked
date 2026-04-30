/**
 * POST /api/tutor-chat
 * Body: checkout_session_id, messages, age_band, state, subject, locale,
 *       client_session_id?, access_token?, homework_quest? (optional string),
 *       tutor_focus_slug? (optional; server-resolved allowlist — see api/tutor/lib/focusPacks.js)
 */
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { buildTutorSystemPrompt } from './tutor/lib/prompts.js'
import { resolveTutorFocusQuest } from './tutor/lib/focusPacks.js'
import { rateLimit } from './lib/rateLimit.js'
import {
  estimateTutorChatCostUsd,
  getServiceSupabase,
  getUserIdFromJwt,
  insertTutorApiEvent,
  loadPriorSessionNotes,
} from './lib/tutorTelemetry.js'

const MAX_MESSAGES = 36
const MAX_CONTENT = 6000
const MODEL = 'gpt-4o'
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
  const clientSessionId = typeof body.client_session_id === 'string' ? body.client_session_id.trim().slice(0, 80) : ''
  const accessToken = typeof body.access_token === 'string' ? body.access_token.trim() : ''
  const homeworkQuest = typeof body.homework_quest === 'string' ? body.homework_quest.trim().slice(0, 8000) : ''
  const tutorFocusSlug = typeof body.tutor_focus_slug === 'string' ? body.tutor_focus_slug.trim().slice(0, 64) : ''
  const tutorFocusQuest = tutorFocusSlug ? resolveTutorFocusQuest(tutorFocusSlug, ageBand, locale) : ''
  const experienceModeRaw = typeof body.experience_mode === 'string' ? body.experience_mode.trim().toLowerCase() : ''
  const experienceMode = experienceModeRaw === 'sparki' ? 'sparki' : 'tutor'

  if (messages.length === 0) {
    res.status(400).json({ error: 'Send at least one user message.' })
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
          'You have used your 3 free tutor replies. Ask a parent to subscribe to Adventure Academy to keep chatting.',
      })
      return
    }
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'Tutor is not configured yet.' })
    return
  }

  let priorNotes = []
  const parentUserId = accessToken ? await getUserIdFromJwt(accessToken) : null
  const sb = getServiceSupabase()
  if (parentUserId && sb) {
    try {
      priorNotes = await loadPriorSessionNotes(sb, parentUserId)
    } catch {
      priorNotes = []
    }
  }

  const system = buildTutorSystemPrompt(
    {
      ageBand,
      state,
      subject,
      locale,
      homeworkQuest: homeworkQuest || undefined,
      tutorFocusQuest: tutorFocusQuest || undefined,
      experienceMode,
    },
    priorNotes,
  )
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
        max_tokens: ageBand === 'tots' ? 320 : ageBand === 'crew' ? 1200 : 900,
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

    const usage = data.usage || {}
    const promptTokens = usage.prompt_tokens ?? 0
    const completionTokens = usage.completion_tokens ?? 0
    const estimatedCostUsd = estimateTutorChatCostUsd(promptTokens, completionTokens)

    if (sb && clientSessionId) {
      await insertTutorApiEvent(sb, {
        event_type: 'tutor_chat',
        model: MODEL,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        estimated_cost_usd: estimatedCostUsd,
        checkout_session_id: checkoutSessionId || null,
        client_session_id: clientSessionId,
        parent_user_id: parentUserId,
        age_band: ageBand,
        metadata: {},
      })
    }

    res.status(200).json({
      reply: text,
      usage: {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: usage.total_tokens ?? promptTokens + completionTokens,
      },
      estimated_cost_usd: estimatedCostUsd,
    })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[tutor-chat]', e)
    }
    res.status(502).json({ error: 'Could not reach tutor service.' })
  }
}
