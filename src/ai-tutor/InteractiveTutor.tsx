import { useCallback, useEffect, useRef, useState } from 'react'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { TutorConsentModal } from './TutorConsentModal'
import {
  fetchHeyGenSession,
  loadTutorMessages,
  playTtsStreamEphemeral,
  postTutorChat,
  readTutorStateCode,
  readVoiceConsent,
  saveTutorMessages,
  writeTutorStateCode,
  writeVoiceConsent,
} from './tutorService'
import type { ChatMessage, TutorSubject } from './types'
import { US_STATES_PLUS_DC } from './usStates'

const SUBJECTS: { id: TutorSubject; labelKey: string }[] = [
  { id: 'math', labelKey: 'aiTutor.subjectMath' },
  { id: 'english', labelKey: 'aiTutor.subjectEnglish' },
  { id: 'science', labelKey: 'aiTutor.subjectScience' },
  { id: 'history', labelKey: 'aiTutor.subjectHistory' },
]

type Props = {
  checkoutSessionId: string | null
}

export default function InteractiveTutor({ checkoutSessionId }: Props) {
  const { t } = useTranslation()
  const { ageBand } = useAgeBand()
  const isTots = ageBand === 'tots'

  const [stateCode, setStateCode] = useState('')
  const [subject, setSubject] = useState<TutorSubject>('math')
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
  /** HeyGen StreamingAvatar instance (loaded dynamically). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const avatarRef = useRef<any>(null)
  const audioAbortRef = useRef<AbortController | null>(null)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    setStateCode(readTutorStateCode())
    setMessages(loadTutorMessages())
    if (!isTots && readVoiceConsent()) {
      setVoiceOut(true)
    }
  }, [isTots])

  useEffect(() => {
    saveTutorMessages(messages)
  }, [messages])

  const stopAudio = useCallback(() => {
    audioAbortRef.current?.abort()
    audioAbortRef.current = null
  }, [])

  const teardownAvatar = useCallback(async () => {
    const a = avatarRef.current
    avatarRef.current = null
    if (a) {
      try {
        await a.stopAvatar()
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

  const startAvatarSession = useCallback(async () => {
    setAvatarMsg(null)
    setAvatarBusy(true)
    await teardownAvatar()
    try {
      const {
        default: StreamingAvatar,
        AvatarQuality,
        StreamingEvents,
        VoiceEmotion,
      } = await import('@heygen/streaming-avatar')

      const cfg = await fetchHeyGenSession(checkoutSessionId)
      const avatar = new StreamingAvatar({ token: cfg.token })
      avatarRef.current = avatar

      avatar.on(StreamingEvents.STREAM_READY, (evt: Event & { detail?: MediaStream }) => {
        const stream = evt?.detail
        const el = videoRef.current
        if (el && stream instanceof MediaStream) {
          el.srcObject = stream
          void el.play().catch(() => {})
        }
      })

      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        setAvatarMsg(t('aiTutor.avatarDisconnected'))
      })

      const q =
        cfg.quality === 'high'
          ? AvatarQuality.High
          : cfg.quality === 'low'
            ? AvatarQuality.Low
            : AvatarQuality.Medium

      const voiceOpts =
        cfg.voiceId && cfg.voiceId.length > 0
          ? { voiceId: cfg.voiceId, rate: 1 as const, emotion: VoiceEmotion.SOOTHING }
          : { rate: 1 as const, emotion: VoiceEmotion.SOOTHING }

      await avatar.createStartAvatar({
        quality: q,
        avatarName: cfg.avatarId,
        voice: voiceOpts,
        activityIdleTimeout: 600,
      })
    } catch (e) {
      setAvatarMsg(e instanceof Error ? e.message : t('aiTutor.avatarStartFailed'))
      setLiveAvatar(false)
    } finally {
      setAvatarBusy(false)
    }
  }, [checkoutSessionId, t, teardownAvatar])

  const speakReply = useCallback(
    async (text: string) => {
      stopAudio()
      const ac = new AbortController()
      audioAbortRef.current = ac

      if (liveAvatar && avatarRef.current && !isTots && voiceOut) {
        try {
          await avatarRef.current.speak({
            text,
            task_type: 'repeat',
            taskMode: 'sync',
          })
        } catch {
          await playTtsStreamEphemeral(text, 'en', ac.signal)
        }
        return
      }

      if (!isTots && voiceOut) {
        await playTtsStreamEphemeral(text, 'en', ac.signal)
      }
    },
    [isTots, liveAvatar, voiceOut, stopAudio],
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
    if (isTots) return
    if (!liveAvatar) {
      if (!readVoiceConsent()) {
        setConsentOpen(true)
        return
      }
      setVoiceOut(true)
      setLiveAvatar(true)
      await startAvatarSession()
      return
    }
    setLiveAvatar(false)
    await teardownAvatar()
  }

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    if (!stateCode) {
      setError(t('aiTutor.errorPickState'))
      return
    }
    writeTutorStateCode(stateCode)

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
        subject,
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
    rec.lang = 'en-US'
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
    <div className="mx-auto max-w-4xl space-y-6 px-2 pb-10">
      <TutorConsentModal
        open={consentOpen}
        title={t('aiTutor.consentTitle')}
        body={t('aiTutor.consentBody')}
        acceptLabel={t('aiTutor.consentAccept')}
        declineLabel={t('aiTutor.consentDecline')}
        onAccept={() => {
          writeVoiceConsent(true)
          setVoiceOut(true)
          setConsentOpen(false)
        }}
        onDecline={() => setConsentOpen(false)}
      />

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <label className="flex min-h-[52px] flex-col gap-1">
          <span className="text-sm font-semibold text-slate-800">{t('aiTutor.stateLabel')}</span>
          <select
            className="min-h-[48px] rounded-xl border border-slate-300 px-3 text-lg text-slate-900"
            value={stateCode}
            onChange={(e) => {
              setStateCode(e.target.value)
              writeTutorStateCode(e.target.value)
            }}
          >
            <option value="">{t('aiTutor.statePlaceholder')}</option>
            {US_STATES_PLUS_DC.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="min-h-[52px]">
          <legend className="text-sm font-semibold text-slate-800">{t('aiTutor.subjectLabel')}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBJECTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`min-h-[48px] min-w-[100px] rounded-xl border-2 px-3 text-base font-medium ${
                  subject === s.id ? 'border-sky-600 bg-sky-50 text-sky-900' : 'border-slate-200 bg-white text-slate-700'
                }`}
                onClick={() => setSubject(s.id)}
              >
                {t(s.labelKey)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {!isTots && (
        <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4">
          <button
            type="button"
            className={`min-h-[48px] rounded-xl px-4 text-base font-semibold ${
              voiceOut ? 'bg-sky-600 text-white' : 'border-2 border-slate-300 bg-white text-slate-800'
            }`}
            onClick={onToggleVoiceOut}
          >
            {voiceOut ? t('aiTutor.voiceOn') : t('aiTutor.voiceOff')}
          </button>
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
          {voiceOut && (
            <button
              type="button"
              className="min-h-[48px] rounded-xl border-2 border-slate-300 bg-white px-4 text-base font-semibold text-slate-800"
              onClick={startSpeechInput}
            >
              {t('aiTutor.micOnce')}
            </button>
          )}
        </div>
      )}

      {isTots && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">{t('aiTutor.totsVoiceNote')}</p>}

      {liveAvatar && !isTots && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
          <video ref={videoRef} className="aspect-video w-full object-cover" playsInline muted={false} autoPlay />
          {avatarMsg && <p className="bg-slate-800 px-3 py-2 text-sm text-amber-200">{avatarMsg}</p>}
        </div>
      )}

      <div
        className="max-h-[min(50vh,420px)] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4"
        aria-live="polite"
      >
        {messages.length === 0 && <p className="text-slate-600">{t('aiTutor.emptyChat')}</p>}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[95%] rounded-2xl px-4 py-3 text-base leading-relaxed ${
              m.role === 'user' ? 'ml-auto bg-sky-600 text-white' : 'mr-auto bg-white text-slate-800 shadow-sm'
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-900" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="sr-only" htmlFor="ai-tutor-input">
          {t('aiTutor.inputLabel')}
        </label>
        <textarea
          id="ai-tutor-input"
          className="min-h-[120px] flex-1 resize-y rounded-2xl border-2 border-slate-300 p-4 text-lg text-slate-900"
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
          <button type="button" className="min-h-[48px] rounded-xl border-2 border-slate-300 text-base text-slate-700" onClick={clearChat}>
            {t('aiTutor.clearChat')}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">{t('aiTutor.footerHint')}</p>
    </div>
  )
}
