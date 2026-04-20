import type { AgeBandId } from '@/ageBand'
import {
  TUTOR_CLIENT_SESSION_KEY,
  TUTOR_FREE_TURNS_LOCAL_KEY,
  TUTOR_LEAD_BONUS_CLAIMED_KEY,
  TUTOR_LEAD_MODAL_DISMISSED_SESSION_KEY,
  TUTOR_MESSAGES_KEY,
  TUTOR_SESSION_STARTED_MS_KEY,
  TUTOR_VISUAL_TURNS_KEY,
  TUTOR_STATE_CHANGED_EVENT,
  TUTOR_STATE_KEY,
  TUTOR_STATE_LOCAL_KEY,
  TUTOR_VOICE_CONSENT_KEY,
} from './sessionKeys'
import type { ChatMessage, TutorSubject } from './types'
import { stateNameFromCode } from './usStates'

export type { ChatMessage, TutorSubject }

export function readTutorStateCode(): string {
  try {
    const loc = localStorage.getItem(TUTOR_STATE_LOCAL_KEY)
    if (loc) return loc
    const sess = sessionStorage.getItem(TUTOR_STATE_KEY)
    if (sess) {
      localStorage.setItem(TUTOR_STATE_LOCAL_KEY, sess)
      return sess
    }
  } catch {
    /* ignore */
  }
  return ''
}

export function writeTutorStateCode(code: string) {
  try {
    if (code) {
      localStorage.setItem(TUTOR_STATE_LOCAL_KEY, code)
      sessionStorage.setItem(TUTOR_STATE_KEY, code)
    } else {
      localStorage.removeItem(TUTOR_STATE_LOCAL_KEY)
      sessionStorage.removeItem(TUTOR_STATE_KEY)
    }
    window.dispatchEvent(new CustomEvent(TUTOR_STATE_CHANGED_EVENT))
  } catch {
    /* ignore */
  }
}

export function readVoiceConsent(): boolean {
  try {
    return sessionStorage.getItem(TUTOR_VOICE_CONSENT_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeVoiceConsent(ok: boolean) {
  try {
    if (ok) sessionStorage.setItem(TUTOR_VOICE_CONSENT_KEY, 'true')
    else sessionStorage.removeItem(TUTOR_VOICE_CONSENT_KEY)
  } catch {
    /* ignore */
  }
}

export function loadTutorMessages(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(TUTOR_MESSAGES_KEY)
    if (!raw) return []
    const p = JSON.parse(raw) as unknown
    if (!Array.isArray(p)) return []
    return p.filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof (m as ChatMessage).content === 'string',
    )
  } catch {
    return []
  }
}

export function saveTutorMessages(messages: ChatMessage[]) {
  try {
    sessionStorage.setItem(TUTOR_MESSAGES_KEY, JSON.stringify(messages.slice(-40)))
  } catch {
    /* ignore */
  }
}

export const FREE_TUTOR_CAP = 3

/** Count of completed tutor exchanges without subscription (each assistant reply after you send = +1; persists across “clear chat”). */
export function readTutorFreeTurnsUsed(): number {
  try {
    const raw = localStorage.getItem(TUTOR_FREE_TURNS_LOCAL_KEY)
    const n = raw ? parseInt(raw, 10) : 0
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function bumpTutorFreeTurnsUsed(): void {
  try {
    const next = Math.min(FREE_TUTOR_CAP, readTutorFreeTurnsUsed() + 1)
    localStorage.setItem(TUTOR_FREE_TURNS_LOCAL_KEY, String(next))
  } catch {
    /* ignore */
  }
}

export function hasTutorLeadBonusClaimed(): boolean {
  try {
    return localStorage.getItem(TUTOR_LEAD_BONUS_CLAIMED_KEY) === '1'
  } catch {
    return false
  }
}

export function markTutorLeadBonusClaimed(): void {
  try {
    localStorage.setItem(TUTOR_LEAD_BONUS_CLAIMED_KEY, '1')
  } catch {
    /* ignore */
  }
}

/** Clears free-turn counter so the user gets another FREE_TUTOR_CAP exchanges (new chat avoids server thread limit). */
export function resetTutorFreeTurnsAfterLeadBonus(): void {
  try {
    localStorage.removeItem(TUTOR_FREE_TURNS_LOCAL_KEY)
  } catch {
    /* ignore */
  }
}

export function readTutorLeadModalDismissedThisSession(): boolean {
  try {
    return sessionStorage.getItem(TUTOR_LEAD_MODAL_DISMISSED_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function dismissTutorLeadModalForSession(): void {
  try {
    sessionStorage.setItem(TUTOR_LEAD_MODAL_DISMISSED_SESSION_KEY, '1')
  } catch {
    /* ignore */
  }
}

export async function postTutorLeadEmail(email: string, locale: 'en' | 'es'): Promise<void> {
  const res = await fetch('/api/tutor-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), locale, website: '' }),
  })
  const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string; code?: string }
  if (!res.ok) {
    const msg =
      (typeof data.error === 'string' && data.error) ||
      (typeof data.message === 'string' && data.message) ||
      'Could not save email'
    throw new Error(msg)
  }
}

export function readOrCreateTutorClientSessionId(): string {
  try {
    let id = sessionStorage.getItem(TUTOR_CLIENT_SESSION_KEY)
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `tut-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      sessionStorage.setItem(TUTOR_CLIENT_SESSION_KEY, id)
    }
    return id
  } catch {
    return `tut-${Date.now()}`
  }
}

export function readTutorSessionStartedMs(): number | null {
  try {
    const raw = sessionStorage.getItem(TUTOR_SESSION_STARTED_MS_KEY)
    if (!raw) return null
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

export function ensureTutorSessionStartedMs() {
  try {
    if (sessionStorage.getItem(TUTOR_SESSION_STARTED_MS_KEY)) return
    sessionStorage.setItem(TUTOR_SESSION_STARTED_MS_KEY, String(Date.now()))
  } catch {
    /* ignore */
  }
}

/** New tutor tab session id + timers + optional illustration counter (call on Clear chat). */
export function resetTutorTelemetrySessionKeys() {
  try {
    sessionStorage.removeItem(TUTOR_CLIENT_SESSION_KEY)
    sessionStorage.removeItem(TUTOR_SESSION_STARTED_MS_KEY)
    sessionStorage.removeItem(TUTOR_VISUAL_TURNS_KEY)
  } catch {
    /* ignore */
  }
}

export function readTutorVisualTurnsUsed(): number {
  try {
    const n = parseInt(sessionStorage.getItem(TUTOR_VISUAL_TURNS_KEY) || '0', 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

export function bumpTutorVisualTurnsUsed() {
  try {
    const n = readTutorVisualTurnsUsed()
    sessionStorage.setItem(TUTOR_VISUAL_TURNS_KEY, String(n + 1))
  } catch {
    /* ignore */
  }
}

export type TutorChatResult = {
  reply: string
  estimated_cost_usd?: number
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
}

export async function postTutorChat(params: {
  checkoutSessionId: string | null
  messages: ChatMessage[]
  ageBand: AgeBandId
  stateCode: string
  /** Use `general` for cross-subject tutoring (default). */
  subject: TutorSubject
  /** Matches app language toggle — tutor replies (and TTS) follow this. */
  locale?: 'en' | 'es'
  clientSessionId?: string
  accessToken?: string | null
  homeworkQuest?: string
  /** Server-resolved curriculum pack slug (allowlist). */
  tutorFocusSlug?: string
}): Promise<TutorChatResult> {
  const stateName = stateNameFromCode(params.stateCode || 'CA')
  const res = await fetch('/api/tutor-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkout_session_id: params.checkoutSessionId || '',
      messages: params.messages,
      age_band: params.ageBand,
      state: stateName,
      subject: params.subject,
      locale: params.locale === 'es' ? 'es' : 'en',
      client_session_id: params.clientSessionId || readOrCreateTutorClientSessionId(),
      access_token: params.accessToken || '',
      homework_quest: params.homeworkQuest || '',
      tutor_focus_slug: params.tutorFocusSlug || '',
    }),
  })
  const data = (await res.json().catch(() => ({}))) as {
    reply?: string
    error?: string
    code?: string
    message?: string
    estimated_cost_usd?: number
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
  }
  if (!res.ok) {
    const msg =
      (typeof data.message === 'string' && data.message) ||
      (typeof data.error === 'string' && data.error) ||
      'Tutor request failed'
    const err = new Error(msg) as Error & { code?: string }
    if (typeof data.code === 'string') err.code = data.code
    throw err
  }
  if (!data.reply) throw new Error('Empty tutor reply')
  return {
    reply: data.reply,
    estimated_cost_usd: typeof data.estimated_cost_usd === 'number' ? data.estimated_cost_usd : undefined,
    usage: data.usage,
  }
}

export type TutorSessionEndParams = {
  accessToken?: string | null
  clientSessionId: string
  checkoutSessionId: string | null
  startedAtMs: number | null
  endedAtMs: number
  messageCount: number
  sumEstimatedCostUsd: number
  messages: ChatMessage[]
  ageBand: AgeBandId
  stateCode: string
  subjectTag?: string
  childLabel?: string | null
}

function serializeTutorSessionEndBody(params: TutorSessionEndParams) {
  return JSON.stringify({
    access_token: params.accessToken || '',
    client_session_id: params.clientSessionId,
    checkout_session_id: params.checkoutSessionId || '',
    started_at_ms: params.startedAtMs || 0,
    ended_at_ms: params.endedAtMs,
    message_count: params.messageCount,
    sum_estimated_cost_usd: params.sumEstimatedCostUsd,
    messages: params.messages,
    age_band: params.ageBand,
    state_code: params.stateCode,
    subject_tag: params.subjectTag || 'general',
    child_label: params.childLabel || null,
  })
}

export async function postTutorSessionEnd(params: TutorSessionEndParams): Promise<void> {
  await fetch('/api/tutor-session-end', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: serializeTutorSessionEndBody(params),
  })
}

/** Best-effort flush when the tab is closing (browser may still deliver the request). */
export function postTutorSessionEndKeepalive(params: TutorSessionEndParams) {
  try {
    void fetch('/api/tutor-session-end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: serializeTutorSessionEndBody(params),
      keepalive: true,
    })
  } catch {
    /* ignore */
  }
}

export async function fetchTutorVisual(params: {
  checkoutSessionId: string | null
  clientSessionId: string
  ageBand: AgeBandId
  tutorReplySnippet: string
}): Promise<string | null> {
  const res = await fetch('/api/tutor-visual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkout_session_id: params.checkoutSessionId || '',
      client_session_id: params.clientSessionId,
      age_band: params.ageBand,
      tutor_reply_snippet: params.tutorReplySnippet.slice(0, 1200),
    }),
  })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !data.url) return null
  return data.url
}

/** LiveAvatar: short-lived session token for @heygen/liveavatar-web-sdk (server from POST /api/liveavatar-session). */
export async function fetchLiveAvatarSession(checkoutSessionId: string | null, locale: 'en' | 'es' = 'en') {
  const res = await fetch('/api/liveavatar-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkout_session_id: checkoutSessionId || '',
      locale: locale === 'es' ? 'es' : 'en',
    }),
  })
  const data = (await res.json().catch(() => ({}))) as {
    session_id?: string
    session_token?: string
    mode?: string
    error?: string
    code?: string
    message?: string
  }
  if (!res.ok) {
    const msg =
      (typeof data.message === 'string' && data.message) ||
      (typeof data.error === 'string' && data.error) ||
      'Could not start video tutor'
    const err = new Error(msg) as Error & { code?: string }
    if (typeof data.code === 'string') err.code = data.code
    throw err
  }
  if (!data.session_token || !data.session_id) throw new Error('Missing LiveAvatar session token')
  return {
    sessionId: data.session_id,
    sessionToken: data.session_token,
    mode: data.mode ?? 'unknown',
  }
}

/** Non-streaming fallback — ephemeral in-memory playback only. */
export async function playTtsEphemeral(text: string, locale: 'en' | 'es' = 'en', signal?: AbortSignal): Promise<void> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, locale }),
    signal,
  })
  if (!res.ok) throw new Error('Voice playback failed')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      URL.revokeObjectURL(url)
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const onAbort = () => {
      audio.pause()
      URL.revokeObjectURL(url)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort)
    audio.onended = () => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = () => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      reject(new Error('Audio error'))
    }
    void audio.play().catch((e) => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      reject(e)
    })
  })
}

/** Streaming TTS: server pipes ElevenLabs; client plays full buffer (ephemeral blob). */
export async function playTtsStreamEphemeral(text: string, locale: 'en' | 'es' = 'en', signal?: AbortSignal): Promise<void> {
  const res = await fetch('/api/tts-stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, locale }),
    signal,
  })
  if (!res.ok) {
    await playTtsEphemeral(text, locale, signal)
    return
  }
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      URL.revokeObjectURL(url)
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const onAbort = () => {
      audio.pause()
      URL.revokeObjectURL(url)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort)
    audio.onended = () => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = () => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      reject(new Error('Audio error'))
    }
    void audio.play().catch((e) => {
      signal?.removeEventListener('abort', onAbort)
      URL.revokeObjectURL(url)
      reject(e)
    })
  })
}
