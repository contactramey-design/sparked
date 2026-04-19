/**
 * OpenAI usage → estimated USD (tune constants when OpenAI list prices change).
 * @see docs/TUTOR-UNIT-ECONOMICS.md
 */
import { createClient } from '@supabase/supabase-js'

/** gpt-4o list-style approximate $/token (USD). */
const GPT4O_INPUT_PER_TOKEN = 5 / 1_000_000
const GPT4O_OUTPUT_PER_TOKEN = 15 / 1_000_000

const GPT4O_MINI_INPUT_PER_TOKEN = 0.15 / 1_000_000
const GPT4O_MINI_OUTPUT_PER_TOKEN = 0.6 / 1_000_000

export function estimateTutorChatCostUsd(promptTokens, completionTokens) {
  const pt = Number(promptTokens) || 0
  const ct = Number(completionTokens) || 0
  return Math.round((pt * GPT4O_INPUT_PER_TOKEN + ct * GPT4O_OUTPUT_PER_TOKEN) * 1_000_000) / 1_000_000
}

export function estimateMiniCostUsd(promptTokens, completionTokens) {
  const pt = Number(promptTokens) || 0
  const ct = Number(completionTokens) || 0
  return Math.round((pt * GPT4O_MINI_INPUT_PER_TOKEN + ct * GPT4O_MINI_OUTPUT_PER_TOKEN) * 1_000_000) / 1_000_000
}

export function getServiceSupabase() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

export function getAnonSupabase() {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim()
  const key = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}

/**
 * Verify Supabase JWT and return user id, or null.
 * @param {string} accessToken
 * @returns {Promise<string|null>}
 */
export async function getUserIdFromJwt(accessToken) {
  if (!accessToken || typeof accessToken !== 'string') return null
  const admin = getServiceSupabase()
  if (!admin) return null
  const { data, error } = await admin.auth.getUser(accessToken.trim())
  if (error || !data?.user?.id) return null
  return data.user.id
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 */
export async function insertTutorApiEvent(sb, row) {
  const { error } = await sb.from('tutor_api_events').insert(row)
  if (error && process.env.NODE_ENV !== 'production') {
    console.warn('[tutorTelemetry] insertTutorApiEvent', error.message)
  }
}

/**
 * Upsert session aggregate (service role).
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 */
export async function upsertTutorSessionAggregate(sb, row) {
  const { error } = await sb.from('tutor_sessions').upsert(row, { onConflict: 'client_session_id' })
  if (error && process.env.NODE_ENV !== 'production') {
    console.warn('[tutorTelemetry] upsertTutorSessionAggregate', error.message)
  }
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} sb
 * @param {string} parentUserId
 * @returns {Promise<string[]>}
 */
export async function loadPriorSessionNotes(sb, parentUserId) {
  if (!parentUserId || !sb) return []
  const { data, error } = await sb
    .from('tutor_sessions')
    .select('summary_bullets, revisit_note, created_at')
    .eq('parent_user_id', parentUserId)
    .not('summary_bullets', 'is', null)
    .order('created_at', { ascending: false })
    .limit(3)
  if (error || !Array.isArray(data)) return []
  const notes = []
  for (const row of data) {
    const bullets = Array.isArray(row.summary_bullets) ? row.summary_bullets.filter((b) => typeof b === 'string' && b.trim()) : []
    if (bullets.length) notes.push(bullets.join(' · '))
    if (typeof row.revisit_note === 'string' && row.revisit_note.trim()) {
      notes.push(`Revisit: ${row.revisit_note.trim()}`)
    }
  }
  return notes.slice(0, 6)
}
