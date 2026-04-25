/**
 * POST /api/tutor-session-end
 * End-of-tab tutor session: optional GPT-4o-mini summary, upsert tutor_sessions (no raw transcript stored).
 * Body: access_token?, client_session_id, checkout_session_id?, started_at_ms, ended_at_ms, message_count,
 *       sum_estimated_cost_usd, messages (short thread), age_band, state_code, subject_tag?, child_label?, child_id?
 */
import { rateLimit } from './lib/rateLimit.js'
import {
  estimateMiniCostUsd,
  getServiceSupabase,
  getUserIdFromJwt,
  upsertTutorSessionAggregate,
} from './lib/tutorTelemetry.js'

const SUMMARY_MODEL = 'gpt-4o-mini'

function normalizeThread(raw) {
  if (!Array.isArray(raw)) return []
  const out = []
  for (const m of raw.slice(-24)) {
    if (!m || typeof m !== 'object') continue
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null
    const content = typeof m.content === 'string' ? m.content.trim().slice(0, 4000) : ''
    if (!role || !content) continue
    out.push({ role, content })
  }
  return out
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const rl = rateLimit(req, { key: 'tutor-session-end', limit: 20, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    res.status(429).json({ error: 'Too many session saves. Try again later.' })
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

  const clientSessionId = typeof body.client_session_id === 'string' ? body.client_session_id.trim() : ''
  if (!clientSessionId || clientSessionId.length > 80) {
    res.status(400).json({ error: 'client_session_id required' })
    return
  }

  const accessToken = typeof body.access_token === 'string' ? body.access_token.trim() : ''
  const parentUserId = accessToken ? await getUserIdFromJwt(accessToken) : null

  const checkoutSessionId =
    typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim().slice(0, 200) : ''
  const startedAtMs = Number(body.started_at_ms) || 0
  const endedAtMs = Number(body.ended_at_ms) || Date.now()
  const messageCount = Math.max(0, Math.min(500, Number(body.message_count) || 0))
  const sumCost = Math.max(0, Number(body.sum_estimated_cost_usd) || 0)
  const ageBand = typeof body.age_band === 'string' ? body.age_band.trim().slice(0, 20) : ''
  const stateCode = typeof body.state_code === 'string' ? body.state_code.trim().slice(0, 8) : ''
  const subjectTag = typeof body.subject_tag === 'string' ? body.subject_tag.trim().slice(0, 80) : 'general'
  const childLabel = typeof body.child_label === 'string' ? body.child_label.trim().slice(0, 80) : null
  const childIdRaw = typeof body.child_id === 'string' ? body.child_id.trim() : ''
  const childId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(childIdRaw)
    ? childIdRaw
    : null
  const messages = normalizeThread(body.messages)

  const sb = getServiceSupabase()
  if (!sb) {
    res.status(503).json({ ok: false, error: 'Telemetry not configured (SUPABASE_SERVICE_ROLE_KEY).' })
    return
  }

  let summaryBullets = null
  let revisitNote = null
  let summaryCostUsd = 0

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (apiKey && messages.length >= 2) {
    const sys =
      'You summarize a tutoring chat for a parent dashboard. Return ONLY valid JSON: {"bullets":["…","…","…"],"revisit":"one short topic to practice again or empty string"}. Bullets: exactly 3 short lines, what the child practiced or learned, no names or schools. English unless the chat is clearly Spanish — then Spanish bullets.'
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: SUMMARY_MODEL,
          messages: [
            { role: 'system', content: sys },
            {
              role: 'user',
              content: `Chat transcript (roles):\n${messages.map((m) => `${m.role}: ${m.content}`).join('\n\n')}`,
            },
          ],
          max_tokens: 220,
          temperature: 0.3,
        }),
      })
      if (r.ok) {
        const data = await r.json()
        const u = data.usage
        if (u) {
          summaryCostUsd = estimateMiniCostUsd(u.prompt_tokens, u.completion_tokens)
        }
        const raw = data.choices?.[0]?.message?.content?.trim()
        if (raw) {
          let jsonStr = raw
          const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
          if (codeMatch) jsonStr = codeMatch[1].trim()
          const parsed = JSON.parse(jsonStr)
          if (Array.isArray(parsed.bullets) && parsed.bullets.length) {
            summaryBullets = parsed.bullets
              .filter((b) => typeof b === 'string')
              .map((b) => b.trim())
              .filter(Boolean)
              .slice(0, 3)
          }
          if (typeof parsed.revisit === 'string' && parsed.revisit.trim()) {
            revisitNote = parsed.revisit.trim().slice(0, 500)
          }
        }
      }
    } catch {
      /* summary optional */
    }
  }

  const durationSeconds =
    startedAtMs > 0 && endedAtMs >= startedAtMs
      ? Math.max(0, Math.round((endedAtMs - startedAtMs) / 1000))
      : null

  const totalCost = Math.round((sumCost + summaryCostUsd) * 1_000_000) / 1_000_000

  const parentSummary =
    summaryBullets && summaryBullets.length ? summaryBullets.map((b) => String(b).trim()).filter(Boolean).join(' · ') : null

  await upsertTutorSessionAggregate(sb, {
    client_session_id: clientSessionId,
    checkout_session_id: checkoutSessionId || null,
    parent_user_id: parentUserId,
    child_label: childLabel,
    child_id: childId,
    age_band: ageBand || null,
    state_code: stateCode || null,
    started_at: startedAtMs > 0 ? new Date(startedAtMs).toISOString() : null,
    ended_at: new Date(endedAtMs).toISOString(),
    duration_seconds: durationSeconds,
    message_count: messageCount,
    sum_estimated_cost_usd: totalCost,
    summary_bullets: summaryBullets && summaryBullets.length ? summaryBullets : null,
    parent_summary: parentSummary,
    revisit_note: revisitNote,
    subject_tag: subjectTag || 'general',
    updated_at: new Date().toISOString(),
  })

  res.status(200).json({ ok: true, summarized: Boolean(summaryBullets?.length) })
}
