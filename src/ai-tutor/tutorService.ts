import type { AgeBandId } from '@/ageBand'
import {
  TUTOR_FREE_TURNS_LOCAL_KEY,
  TUTOR_LEAD_BONUS_CLAIMED_KEY,
  TUTOR_LEAD_MODAL_DISMISSED_SESSION_KEY,
  TUTOR_MESSAGES_KEY,
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

export async function postTutorChat(params: {
  checkoutSessionId: string | null
  messages: ChatMessage[]
  ageBand: AgeBandId
  stateCode: string
  /** Use `general` for cross-subject tutoring (default). */
  subject: TutorSubject
  /** Matches app language toggle — tutor replies (and TTS) follow this. */
  locale?: 'en' | 'es'
}): Promise<string> {
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
    }),
  })
  const data = (await res.json().catch(() => ({}))) as {
    reply?: string
    error?: string
    code?: string
    message?: string
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
  return data.reply
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
