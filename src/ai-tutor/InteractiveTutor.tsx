import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { TutorConsentModal } from './TutorConsentModal'
import type { LiveAvatarSession } from '@heygen/liveavatar-web-sdk'
import {
  fetchLiveAvatarSession,
  loadTutorMessages,
  playTtsStreamEphemeral,
  postTutorChat,
  readTutorStateCode,
  readVoiceConsent,
  saveTutorMessages,
  writeVoiceConsent,
} from './tutorService'
import { TUTOR_STATE_CHANGED_EVENT, TUTOR_STATE_LOCAL_KEY } from './sessionKeys'
import type { ChatMessage } from './types'
import { cn } from '@/lib/utils'
import { stateNameFromCode } from './usStates'

type Props = {
  checkoutSessionId: string | null
}

export default function InteractiveTutor({ checkoutSessionId }: Props) {
  const { t, locale } = useTranslation()
  const { ageBand } = useAgeBand()
  const isTots = ageBand === 'tots'

  const [stateCode, setStateCode] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [consentOpen, setConsentOpen] = useState(false)
  const [voiceOut, setVoiceOut] = useState(false)
  const [liveAvatar, setLiveAvatar] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const avatarStageRef = useRef<HTMLDivElement | null>(null)
  const avatarRef = useRef<LiveAvatarSession | null>(null)
  const audioAbortRef = useRef<AbortController | null>(null)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const prevLocaleRef = useRef(locale)
  const [avatarFullscreen, setAvatarFullscreen] = useState(false)

  useEffect(() => {
    setStateCode(readTutorStateCode())
    setMessages(loadTutorMessages())
    if (!isTots && readVoiceConsent()) {
      setVoiceOut(true)
    }
  }, [isTots])

  useEffect(() => {
    const syncState = () => setStateCode(readTutorStateCode())
    window.addEventListener(TUTOR_STATE_CHANGED_EVENT, syncState)
    const onStorage = (e: StorageEvent) => {
      if (e.key === TUTOR_STATE_LOCAL_KEY) syncState()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(TUTOR_STATE_CHANGED_EVENT, syncState)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  useEffect(() => {
    saveTutorMessages(messages)
  }, [messages])

  const stopAudio = useCallback(() => {
    audioAbortRef.current?.abort()
    audioAbortRef.current = null
  }, [])

  const teardownAvatar = useCallback(async () => {
    const session = avatarRef.current
    avatarRef.current = null
    if (session) {
      try {
        await session.stop()
      } catch {
        /* ignore */
      }
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setAvatarBusy(false)
  }, [])

  useEffect(() => {
    return () => {
      void teardownAvatar()
      stopAudio()
      recognitionRef.current?.stop()
    }
  }, [teardownAvatar, stopAudio])

  useEffect(() => {
    const onFs = () => {
      const stage = avatarStageRef.current
      const fsEl =
        document.fullscreenElement ??
        (document as unknown as { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ??
        null
      setAvatarFullscreen(Boolean(stage && fsEl === stage))
    }
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs as EventListener)
    return () => {
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs as EventListener)
    }
  }, [])

  const toggleAvatarFullscreen = useCallback(async () => {
    const el = avatarStageRef.current
    if (!el) return
    const fsEl =
      document.fullscreenElement ??
      (document as unknown as { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ??
      null
    try {
      if (fsEl === el) {
        if (document.exitFullscreen) await document.exitFullscreen()
        else
          (document as unknown as { webkitExitFullscreen?: () => void }).webkitExitFullscreen?.()
      } else if (el.requestFullscreen) {
        await el.requestFullscreen()
      } else {
        ;(el as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen?.()
      }
    } catch {
      /* ignore — user gesture required; some browsers block */
    }
  }, [])

  const startAvatarSession = useCallback(async () => {
    setAvatarMsg(null)
    setAvatarBusy(true)
    await teardownAvatar()
    try {
      const { LiveAvatarSession, SessionEvent, SessionDisconnectReason } = await import(
        '@heygen/liveavatar-web-sdk'
      )

      const cfg = await fetchLiveAvatarSession(checkoutSessionId, locale)
      /** Tots: no browser mic to LiveAvatar; parent-supervised typing + avatar lip-sync via repeat() only. */
      const session = new LiveAvatarSession(cfg.sessionToken, { voiceChat: !isTots })
      avatarRef.current = session

      const onStreamReady = () => {
        const el = videoRef.current
        if (el) {
          session.attach(el)
          void el.play().catch(() => {})
        }
      }
      session.on(SessionEvent.SESSION_STREAM_READY, onStreamReady)

      session.on(SessionEvent.SESSION_DISCONNECTED, (reason) => {
        if (reason !== SessionDisconnectReason.CLIENT_INITIATED) {
          setAvatarMsg(t('aiTutor.avatarDisconnected'))
        }
      })

      await session.start()
    } catch (e) {
      setAvatarMsg(e instanceof Error ? e.message : t('aiTutor.avatarStartFailed'))
      setLiveAvatar(false)
    } finally {
      setAvatarBusy(false)
    }
  }, [checkoutSessionId, isTots, locale, t, teardownAvatar])

  useEffect(() => {
    const prev = prevLocaleRef.current
    prevLocaleRef.current = locale
    if (prev === locale || !liveAvatar) return
    let cancelled = false
    void (async () => {
      setAvatarBusy(true)
      try {
        await teardownAvatar()
        if (cancelled) return
        await startAvatarSession()
      } catch {
        if (!cancelled) setAvatarMsg(t('aiTutor.avatarStartFailed'))
      } finally {
        if (!cancelled) setAvatarBusy(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [locale, liveAvatar, startAvatarSession, t, teardownAvatar])

  const speakReply = useCallback(
    async (text: string) => {
      stopAudio()
      const ac = new AbortController()
      audioAbortRef.current = ac
      const voiceLocale = locale === 'es' ? 'es' : 'en'

      if (liveAvatar && avatarRef.current) {
        try {
          avatarRef.current.repeat(text)
          return
        } catch {
          /* fall through to TTS when avatar speech fails */
        }
      }

      if (!isTots && voiceOut) {
        await playTtsStreamEphemeral(text, voiceLocale, ac.signal)
      }
    },
    [isTots, liveAvatar, locale, voiceOut, stopAudio],
  )

  const onToggleVoiceOut = () => {
    if (isTots) return
    if (!voiceOut) {
      if (!readVoiceConsent()) {
        setConsentOpen(true)
        return
      }
      setVoiceOut(true)
      return
    }
    setVoiceOut(false)
    stopAudio()
  }

  const onToggleLiveAvatar = async () => {
    if (!liveAvatar) {
      if (!readVoiceConsent()) {
        setConsentOpen(true)
        return
      }
      if (!isTots) {
        setVoiceOut(true)
      }
      setLiveAvatar(true)
      await startAvatarSession()
      return
    }
    setLiveAvatar(false)
    await teardownAvatar()
  }

  const onPauseAvatarSpeech = () => {
    stopAudio()
    try {
      avatarRef.current?.interrupt()
    } catch {
      /* ignore */
    }
  }

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    if (!stateCode) {
      setError(t('aiTutor.errorStateNotSet'))
      return
    }

    setError(null)
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)

    try {
      const reply = await postTutorChat({
        checkoutSessionId,
        messages: next,
        ageBand,
        stateCode,
        subject: 'general',
        locale,
      })
      const assistantMsg: ChatMessage = { role: 'assistant', content: reply }
      setMessages((m) => [...m, assistantMsg])
      await speakReply(reply)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('aiTutor.errorGeneric'))
      setMessages((m) => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    stopAudio()
    setMessages([])
    saveTutorMessages([])
  }

  const startSpeechInput = () => {
    if (isTots || !voiceOut || !readVoiceConsent()) return
    const w = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string
        interimResults: boolean
        maxAlternatives: number
        start: () => void
        stop: () => void
        onresult: ((ev: Event) => void) | null
        onerror: (() => void) | null
        onend: (() => void) | null
      }
      webkitSpeechRecognition?: new () => {
        lang: string
        interimResults: boolean
        maxAlternatives: number
        start: () => void
        stop: () => void
        onresult: ((ev: Event) => void) | null
        onerror: (() => void) | null
        onend: (() => void) | null
      }
    }
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) {
      setError(t('aiTutor.speechNotSupported'))
      return
    }
    const rec = new SR()
    rec.lang = locale === 'es' ? 'es-ES' : 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (ev: Event) => {
      const r = ev as unknown as { results: { 0: { 0: { transcript?: string } } } }
      const text = r.results?.[0]?.[0]?.transcript?.trim()
      if (text) setInput((prev) => (prev ? `${prev} ${text}` : text))
    }
    rec.onerror = () => {}
    rec.onend = () => {
      recognitionRef.current = null
    }
    recognitionRef.current = rec
    rec.start()
  }

  return (
    <div className="w-full space-y-6 pb-8 md:space-y-8">
      <TutorConsentModal
        open={consentOpen}
        title={t('aiTutor.consentTitle')}
        body={t('aiTutor.consentBody')}
        acceptLabel={t('aiTutor.consentAccept')}
        declineLabel={t('aiTutor.consentDecline')}
        onAccept={() => {
          writeVoiceConsent(true)
          if (!isTots) {
            setVoiceOut(true)
          }
          setConsentOpen(false)
        }}
        onDecline={() => setConsentOpen(false)}
      />

      <section
        className="rounded-2xl border-2 border-teal-100 bg-gradient-to-b from-teal-50/90 to-white p-3 shadow-sm sm:p-4 md:p-5"
        aria-labelledby="tutor-chat-rules-heading"
      >
        <h2 id="tutor-chat-rules-heading" className="font-heading text-lg font-bold text-teal-950 md:text-xl">
          {t('aiTutor.chatRulesTitle')}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">{t('aiTutor.chatRulesLead')}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-snug text-slate-800 md:text-base">
          <li>{t('aiTutor.chatRulesBullet1')}</li>
          <li>{t('aiTutor.chatRulesBullet2')}</li>
          <li>{t('aiTutor.chatRulesBullet3')}</li>
          <li>{t('aiTutor.chatRulesBullet4')}</li>
          <li>{t('aiTutor.chatRulesBullet5')}</li>
        </ul>
        <p className="mt-4 border-t border-teal-100/80 pt-3 text-xs leading-relaxed text-slate-600">
          {t('aiTutor.chatRulesGrownUpNote')}
        </p>
      </section>

      {stateCode ? (
        <p className="rounded-xl border border-teal-200 bg-teal-50/90 px-4 py-3 text-sm leading-relaxed text-teal-950">
          {t('aiTutor.stateBanner', { state: stateNameFromCode(stateCode) })}{' '}
          <Link to="/?view=parent" className="font-semibold text-teal-900 underline-offset-2 hover:underline">
            {t('aiTutor.stateBannerParentLink')}
          </Link>
        </p>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950">
          {t('aiTutor.stateMissingBanner')}{' '}
          <Link to="/?view=parent" className="font-semibold text-amber-900 underline-offset-2 hover:underline">
            {t('aiTutor.stateMissingLink')}
          </Link>
        </p>
      )}

      <div
        className={cn(
          'flex flex-col gap-6',
          liveAvatar &&
            'xl:grid xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,26rem)] xl:items-start xl:gap-8',
        )}
      >
        <div className="min-w-0 space-y-6">
          <details className="group rounded-2xl border border-slate-200 bg-slate-50/90 shadow-sm open:bg-slate-50">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center rounded-2xl px-3 py-3 font-semibold text-slate-800 sm:px-4 [&::-webkit-details-marker]:hidden">
              {t('aiTutor.sectionSoundVideo')}
              <span className="ml-auto text-sm font-normal text-slate-500 transition-transform group-open:-rotate-180">
                ▾
              </span>
            </summary>
            <div className="flex flex-wrap gap-2 border-t border-slate-200 px-2 pb-3 pt-2 sm:px-3 sm:pb-4 sm:pt-3">
              {!isTots && (
                <button
                  type="button"
                  className={`min-h-[48px] rounded-xl px-4 text-base font-semibold ${
                    voiceOut ? 'bg-sky-600 text-white' : 'border-2 border-slate-300 bg-white text-slate-800'
                  }`}
                  onClick={onToggleVoiceOut}
                >
                  {voiceOut ? t('aiTutor.voiceOn') : t('aiTutor.voiceOff')}
                </button>
              )}
              <button
                type="button"
                className={`min-h-[48px] rounded-xl px-4 text-base font-semibold ${
                  liveAvatar ? 'bg-indigo-600 text-white' : 'border-2 border-slate-300 bg-white text-slate-800'
                }`}
                onClick={() => void onToggleLiveAvatar()}
                disabled={avatarBusy}
              >
                {liveAvatar ? t('aiTutor.avatarOn') : t('aiTutor.avatarOff')}
              </button>
              {liveAvatar && (
                <button
                  type="button"
                  className="min-h-[48px] rounded-xl border-2 border-amber-500/80 bg-amber-50 px-4 text-base font-semibold text-amber-950 disabled:opacity-50"
                  onClick={onPauseAvatarSpeech}
                  disabled={avatarBusy}
                >
                  {t('aiTutor.avatarPauseSpeech')}
                </button>
              )}
              {!isTots && voiceOut && (
                <button
                  type="button"
                  className="min-h-[48px] rounded-xl border-2 border-slate-300 bg-white px-4 text-base font-semibold text-slate-800"
                  onClick={startSpeechInput}
                >
                  {t('aiTutor.micOnce')}
                </button>
              )}
            </div>
          </details>

          {isTots && (
            <p className="rounded-xl bg-amber-50 px-3 py-3 text-sm leading-relaxed text-amber-950 sm:px-4">
              {t('aiTutor.totsVoiceNote')}
            </p>
          )}

          {liveAvatar && (
            <div
              ref={avatarStageRef}
              className={cn(
                'overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md md:rounded-3xl md:shadow-lg',
                'supports-[height:100dvh]:[&:fullscreen]:min-h-[100dvh] [&:fullscreen]:max-h-none [&:fullscreen]:rounded-none [&:fullscreen]:border-0',
              )}
            >
              <div className="flex flex-wrap items-center justify-end gap-2 border-b border-white/10 bg-slate-950/90 px-2 py-2 sm:px-3">
                <button
                  type="button"
                  className="min-h-[44px] rounded-lg bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/20"
                  onClick={() => void toggleAvatarFullscreen()}
                >
                  {avatarFullscreen ? t('aiTutor.avatarExitFullscreen') : t('aiTutor.avatarFullscreen')}
                </button>
              </div>
              <video
                ref={videoRef}
                className="aspect-video w-full max-h-[min(72vh,720px)] object-cover object-center [&:fullscreen]:max-h-none"
                playsInline
                muted={false}
                autoPlay
              />
              {avatarMsg && (
                <p className="bg-slate-800 px-3 py-2 text-sm text-amber-200 sm:px-4">{avatarMsg}</p>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-6">
          <section className="space-y-3" aria-labelledby="tutor-chat-heading">
            <h2 id="tutor-chat-heading" className="font-heading text-base font-bold text-slate-900 md:text-lg">
              {t('aiTutor.sectionChat')}
            </h2>
            <div
              className="max-h-[min(50vh,400px)] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4 md:max-h-[min(58vh,560px)]"
              aria-live="polite"
            >
              {messages.length === 0 && <p className="text-slate-600">{t('aiTutor.emptyChat')}</p>}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[min(100%,52rem)] rounded-2xl px-4 py-3 text-base leading-relaxed md:text-lg ${
                    m.role === 'user'
                      ? 'ml-auto bg-sky-600 text-white'
                      : 'mr-auto bg-white text-slate-800 shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
          </section>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-3 text-sm text-red-900 sm:px-4" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="sr-only" htmlFor="ai-tutor-input">
              {t('aiTutor.inputLabel')}
            </label>
            <textarea
              id="ai-tutor-input"
              className="min-h-[100px] min-w-0 flex-1 resize-y rounded-2xl border-2 border-slate-300 p-3 text-lg text-slate-900 sm:p-4"
              placeholder={t('aiTutor.inputPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              disabled={loading}
            />
            <div className="flex flex-col gap-2 sm:w-44">
              <button
                type="button"
                className="min-h-[52px] rounded-xl bg-sky-600 text-lg font-bold text-white disabled:opacity-50"
                onClick={() => void send()}
                disabled={loading}
              >
                {loading ? t('aiTutor.sending') : t('aiTutor.send')}
              </button>
              <button
                type="button"
                className="min-h-[48px] rounded-xl border-2 border-slate-300 text-base text-slate-700"
                onClick={clearChat}
              >
                {t('aiTutor.clearChat')}
              </button>
            </div>
          </div>

          <p className="text-center text-xs leading-relaxed text-slate-500 sm:text-left xl:text-center">
            {t('aiTutor.footerHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
