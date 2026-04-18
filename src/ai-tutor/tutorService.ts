import type { AgeBandId } from '@/ageBand'
import { TUTOR_MESSAGES_KEY, TUTOR_STATE_KEY, TUTOR_VOICE_CONSENT_KEY } from './sessionKeys'
import type { ChatMessage, TutorSubject } from './types'
import { stateNameFromCode } from './usStates'

export type { ChatMessage, TutorSubject }

export function readTutorStateCode(): string {
  try {
    return sessionStorage.getItem(TUTOR_STATE_KEY) || ''
  } catch {
    return ''
  }
}

export function writeTutorStateCode(code: string) {
  try {
    if (code) sessionStorage.setItem(TUTOR_STATE_KEY, code)
    else sessionStorage.removeItem(TUTOR_STATE_KEY)
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

export async function postTutorChat(params: {
  checkoutSessionId: string | null
  messages: ChatMessage[]
  ageBand: AgeBandId
  stateCode: string
  subject: TutorSubject
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
    }),
  })
  const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string }
  if (!res.ok) throw new Error(data.error || 'Tutor request failed')
  if (!data.reply) throw new Error('Empty tutor reply')
  return data.reply
}

/** LiveAvatar: short-lived session token for @heygen/liveavatar-web-sdk (server from POST /api/liveavatar-session). */
export async function fetchLiveAvatarSession(checkoutSessionId: string | null) {
  const res = await fetch('/api/liveavatar-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ checkout_session_id: checkoutSessionId || '' }),
  })
  const data = (await res.json().catch(() => ({}))) as {
    session_id?: string
    session_token?: string
    mode?: string
    error?: string
  }
  if (!res.ok) throw new Error(data.error || 'Could not start video tutor')
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
