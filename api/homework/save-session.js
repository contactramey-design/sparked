/**
 * POST /api/homework/save-session
 * Persist a completed homework adventure summary for the parent dashboard (no worksheet image, no transcript).
 * Body JSON: access_token, client_session_id, checkout_session_id?, child_id?, subject, topic, learning_objective, language, mode
 */
import { getServiceSupabase, getUserIdFromJwt } from '../lib/tutorTelemetry.js'

function uuidLike(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    (s || '').trim(),
  )
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
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

  const accessToken = typeof body.access_token === 'string' ? body.access_token.trim() : ''
  const parentUserId = accessToken ? await getUserIdFromJwt(accessToken) : null
  if (!parentUserId) {
    res.status(401).json({ error: 'Sign in required to save homework history.' })
    return
  }

  const clientSessionId = typeof body.client_session_id === 'string' ? body.client_session_id.trim() : ''
  if (!clientSessionId || clientSessionId.length > 120) {
    res.status(400).json({ error: 'client_session_id required' })
    return
  }

  const checkoutSessionId =
    typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim().slice(0, 200) : ''
  const childIdRaw = typeof body.child_id === 'string' ? body.child_id.trim() : ''
  const childId = uuidLike(childIdRaw) ? childIdRaw : null

  const subject = typeof body.subject === 'string' ? body.subject.trim().slice(0, 500) : ''
  const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 500) : ''
  const learningObjective =
    typeof body.learning_objective === 'string' ? body.learning_objective.trim().slice(0, 2000) : ''
  const language = body.language === 'es' ? 'es' : 'en'
  const mode = body.mode === 'story' ? 'story' : 'explain'

  if (!subject && !topic && !learningObjective) {
    res.status(400).json({ error: 'At least one of subject, topic, or learning_objective required' })
    return
  }

  const sb = getServiceSupabase()
  if (!sb) {
    res.status(503).json({ error: 'Server storage not configured.' })
    return
  }

  if (childId) {
    const { data: ch, error: chErr } = await sb
      .from('children')
      .select('id')
      .eq('id', childId)
      .eq('parent_id', parentUserId)
      .maybeSingle()
    if (chErr) {
      res.status(500).json({ error: 'Could not verify child.' })
      return
    }
    if (!ch) {
      res.status(403).json({ error: 'Child not found for this account.' })
      return
    }
  }

  const modeLabel = mode === 'story' ? (language === 'es' ? 'Aventura narrada' : 'Story adventure') : language === 'es' ? 'Explicación' : 'Explain-only'
  const bullets = [
    topic || subject || learningObjective.slice(0, 120),
    learningObjective ? learningObjective.slice(0, 240) : null,
    modeLabel,
  ].filter((b) => typeof b === 'string' && b.trim().length > 0)

  const parentSummary = [subject && topic ? `${subject}: ${topic}` : subject || topic, modeLabel]
    .filter(Boolean)
    .join(' · ')
    .slice(0, 500)

  const nowIso = new Date().toISOString()

  const { error: upErr } = await sb.from('tutor_sessions').upsert(
    {
      client_session_id: clientSessionId,
      checkout_session_id: checkoutSessionId || null,
      parent_user_id: parentUserId,
      child_id: childId,
      child_label: null,
      age_band: null,
      state_code: null,
      started_at: nowIso,
      ended_at: nowIso,
      duration_seconds: 0,
      message_count: 0,
      sum_estimated_cost_usd: 0,
      summary_bullets: bullets.length ? bullets : null,
      parent_summary: parentSummary || null,
      revisit_note: null,
      subject_tag: language === 'es' ? 'Aventura de tarea' : 'Homework adventure',
      updated_at: nowIso,
    },
    { onConflict: 'client_session_id' },
  )

  if (upErr) {
    console.error('[homework/save-session]', upErr.message)
    res.status(500).json({ error: 'Could not save session.' })
    return
  }

  res.status(200).json({ ok: true })
}
