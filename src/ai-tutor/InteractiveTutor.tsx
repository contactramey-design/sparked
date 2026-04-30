import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TutorLeadCaptureModal } from './TutorLeadCaptureModal'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { TutorConsentModal } from './TutorConsentModal'
import type { LiveAvatarSession } from '@heygen/liveavatar-web-sdk'
import { useAuth } from '@/AuthContext'
import {
  FREE_TUTOR_CAP,
  bumpTutorFreeTurnsUsed,
  bumpTutorVisualTurnsUsed,
  dismissTutorLeadModalForSession,
  ensureTutorSessionStartedMs,
  fetchLiveAvatarSession,
  fetchTutorVisual,
  hasTutorLeadBonusClaimed,
  loadTutorMessages,
  markTutorLeadBonusClaimed,
  playTtsStreamEphemeral,
  postTutorChat,
  postTutorLeadEmail,
  postTutorSessionEnd,
  postTutorSessionEndKeepalive,
  readOrCreateTutorClientSessionId,
  readTutorFreeTurnsUsed,
  readTutorLeadModalDismissedThisSession,
  readTutorSessionStartedMs,
  readTutorStateCode,
  readTutorVisualTurnsUsed,
  readVoiceConsent,
  resetTutorFreeTurnsAfterLeadBonus,
  resetTutorTelemetrySessionKeys,
  saveTutorMessages,
  writeVoiceConsent,
} from './tutorService'
import { TUTOR_STATE_CHANGED_EVENT, TUTOR_STATE_LOCAL_KEY } from './sessionKeys'
import type { ChatMessage } from './types'
import { cn } from '@/lib/utils'
import { stateNameFromCode } from './usStates'
import {
  clearHomeworkQuestForTutorSession,
  readHomeworkQuestForTutorSession,
} from '@/features/homework/lib/homeworkQuestForTutor'
import {
  clearTutorFocusSlugSession,
  normalizeTutorFocusSlug,
  readTutorFocusSlugSession,
  saveTutorFocusSlugSession,
  type TutorFocusSlug,
} from '@/ai-tutor/tutorFocusStorage'
import { TutorTopicCard } from './TutorTopicCard'
import { TutorRulesKidPanel } from './TutorRulesKidPanel'
import { startAcademyCheckout as openAcademyCheckout } from '@/lib/startAcademyCheckout'
import {
  readTutorExperienceMode,
  writeTutorExperienceMode,
  type TutorExperienceMode,
} from '@/ai-tutor/tutorExperienceMode'

/** Paid tutor sessions: max user messages per browser session (COPPA product cap). Free tier uses FREE_TUTOR_CAP server-side. */
const TUTOR_SUBSCRIBED_USER_MESSAGE_CAP = 25

type Props = {
  checkoutSessionId: string | null
  /** Adventure Academy (or dev unauth) — unlimited tutor; otherwise 3 free user messages then paywall. */
  hasActiveSubscription: boolean
  /** From GET /api/config — when true, free-limit users see email capture for +3 more messages. */
  tutorLeadCaptureEnabled: boolean
  /** Server flag TUTOR_VISUAL_ENABLED — optional illustration per reply (rate + cost capped client-side). */
  tutorVisualEnabled?: boolean
  /** Stripe `returnTo` after checkout (server allowlist). */
  checkoutReturnPath?: string
}

export default function InteractiveTutor({
  checkoutSessionId,
  hasActiveSubscription,
  tutorLeadCaptureEnabled,
  tutorVisualEnabled = false,
  checkoutReturnPath = '/tutor',
}: Props) {
  const { t, locale } = useTranslation()
  const { ageBand, setAgeBand } = useAgeBand()
  const location = useLocation()
  const isStandaloneTutor = location.pathname === '/tutor'
  const [searchParams] = useSearchParams()
  const { accessToken } = useAuth()
  const isTots = ageBand === 'tots'
  const isCrew = ageBand === 'crew'

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
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const [leadBonusClaimed, setLeadBonusClaimed] = useState(() => hasTutorLeadBonusClaimed())
  /** Start expanded so phones see live video / voice controls without hunting for a collapsed panel. */
  const [soundVideoExpanded, setSoundVideoExpanded] = useState(true)

  const [topicUser, setTopicUser] = useState('')
  const [topicAssistant, setTopicAssistant] = useState('')
  const [tutorImageUrl, setTutorImageUrl] = useState<string | null>(null)

  const [experienceMode, setExperienceModeState] = useState<TutorExperienceMode>(() =>
    readTutorExperienceMode(),
  )
  const setExperienceMode = (m: TutorExperienceMode) => {
    writeTutorExperienceMode(m)
    setExperienceModeState(m)
  }

  const homeworkQuestRef = useRef(readHomeworkQuestForTutorSession())
  const tutorFocusSlugRef = useRef(readTutorFocusSlugSession())
  const [focusBannerSlug, setFocusBannerSlug] = useState<TutorFocusSlug | ''>(() => readTutorFocusSlugSession())
  const sumCostRef = useRef(0)
  const sessionFlushedRef = useRef(false)
  const messagesRef = useRef<ChatMessage[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    const bandParam = searchParams.get('band')?.trim().toLowerCase()
    if (bandParam === 'tots' || bandParam === 'kids' || bandParam === 'crew') {
      setAgeBand(bandParam)
    }
    const focus = normalizeTutorFocusSlug(searchParams.get('focus'))
    if (focus) {
      saveTutorFocusSlugSession(focus)
      tutorFocusSlugRef.current = focus
      setFocusBannerSlug(focus)
    }
    if (focus || bandParam === 'tots' || bandParam === 'kids' || bandParam === 'crew') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.delete('focus')
        url.searchParams.delete('band')
        window.history.replaceState({}, '', url.toString())
      } catch {
        /* ignore */
      }
    }
  }, [searchParams, setAgeBand])

  function tutorFocusPackLabel(slug: TutorFocusSlug): string {
    switch (slug) {
      case 'ai-literacy':
        return t('aiTutor.focusPackAiLiteracy')
      case 'internet-safety':
        return t('aiTutor.focusPackInternetSafety')
      case 'ai-media-trust':
        return t('aiTutor.focusPackAiMediaTrust')
      default:
        return ''
    }
  }

  const buildSessionEndPayload = useCallback(() => {
    const msgs = messagesRef.current
    const clientSessionId = readOrCreateTutorClientSessionId()
    return {
      accessToken,
      clientSessionId,
      checkoutSessionId,
      startedAtMs: readTutorSessionStartedMs(),
      endedAtMs: Date.now(),
      messageCount: msgs.length,
      sumEstimatedCostUsd: sumCostRef.current,
      messages: msgs,
      ageBand,
      stateCode,
      subjectTag: 'general' as const,
      childLabel: null as string | null,
    }
  }, [accessToken, checkoutSessionId, ageBand, stateCode])

  const flushTutorSessionIfNeeded = useCallback(
    (mode: 'keepalive' | 'await') => {
      if (sessionFlushedRef.current) return
      const msgs = messagesRef.current
      if (msgs.length < 2) return
      sessionFlushedRef.current = true
      const payload = buildSessionEndPayload()
      if (mode === 'keepalive') {
        postTutorSessionEndKeepalive(payload)
      } else {
        void postTutorSessionEnd(payload)
      }
    },
    [buildSessionEndPayload],
  )

  useEffect(() => {
    const onPageHide = () => flushTutorSessionIfNeeded('keepalive')
    window.addEventListener('pagehide', onPageHide)
    return () => {
      window.removeEventListener('pagehide', onPageHide)
    }
  }, [flushTutorSessionIfNeeded])

  useEffect(() => {
    return () => {
      flushTutorSessionIfNeeded('keepalive')
    }
  }, [flushTutorSessionIfNeeded])

  useEffect(() => {
    setStateCode(readTutorStateCode())
    const loaded = loadTutorMessages()
    if (isStandaloneTutor && loaded.length === 0) {
      const mode = readTutorExperienceMode()
      const line =
        mode === 'sparki' ? t('aiTutor.sparkiOpeningLine') : t('aiTutor.tutorOpeningLine')
      setMessages([{ role: 'assistant', content: line }])
    } else {
      setMessages(loaded)
    }
    if (!isTots && readVoiceConsent()) {
      setVoiceOut(true)
    }
  }, [isTots, isStandaloneTutor, t])

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
    if (experienceMode !== 'sparki' || !liveAvatar) return
    void (async () => {
      await teardownAvatar()
      setLiveAvatar(false)
    })()
  }, [experienceMode, liveAvatar, teardownAvatar])

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
          const tryPlay = () => void el.play().catch(() => {})
          tryPlay()
          window.setTimeout(tryPlay, 150)
          window.setTimeout(tryPlay, 600)
          window.setTimeout(tryPlay, 1200)
        }
        if (window.location.pathname === '/tutor' && readTutorExperienceMode() === 'tutor') {
          try {
            session.repeat(t('aiTutor.tutorOpeningAvatarLine'))
          } catch {
            /* ignore */
          }
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

  const onDismissTutorLeadModal = () => {
    dismissTutorLeadModalForSession()
    setLeadModalOpen(false)
  }

  const onSubmitTutorLead = async (email: string) => {
    await postTutorLeadEmail(email, locale === 'es' ? 'es' : 'en')
    markTutorLeadBonusClaimed()
    setLeadBonusClaimed(true)
    resetTutorFreeTurnsAfterLeadBonus()
    setMessages([])
    saveTutorMessages([])
    setError(null)
    setLeadModalOpen(false)
  }

  const startAcademyCheckout = async () => {
    if (checkoutLoading) return
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      await openAcademyCheckout(checkoutReturnPath)
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Unable to open checkout.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const freeTurnsUsed = readTutorFreeTurnsUsed()
  const freeLocked = !hasActiveSubscription && freeTurnsUsed >= FREE_TUTOR_CAP
  const freeRemaining = Math.max(0, FREE_TUTOR_CAP - freeTurnsUsed)

  const onToggleLiveAvatar = async () => {
    if (!liveAvatar) {
      if (freeLocked) {
        setAvatarMsg(t('aiTutor.freeLimitReached'))
        return
      }
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

    if (hasActiveSubscription) {
      const userTurnsSoFar = messages.filter((m) => m.role === 'user').length
      if (userTurnsSoFar >= TUTOR_SUBSCRIBED_USER_MESSAGE_CAP) {
        setError(t('aiTutor.sessionUserCapReached'))
        return
      }
    }

    if (!hasActiveSubscription && readTutorFreeTurnsUsed() >= FREE_TUTOR_CAP) {
      setError(t('aiTutor.freeLimitReached'))
      return
    }

    setError(null)
    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)

    try {
      ensureTutorSessionStartedMs()
      const clientSessionId = readOrCreateTutorClientSessionId()
      const questPayload = homeworkQuestRef.current.trim() || undefined
      const { reply, estimated_cost_usd } = await postTutorChat({
        checkoutSessionId,
        messages: next,
        ageBand,
        stateCode,
        subject: 'general',
        locale,
        clientSessionId,
        accessToken,
        homeworkQuest: questPayload,
        tutorFocusSlug: tutorFocusSlugRef.current || undefined,
        experienceMode: isStandaloneTutor ? experienceMode : 'tutor',
      })
      if (typeof estimated_cost_usd === 'number' && Number.isFinite(estimated_cost_usd)) {
        sumCostRef.current += estimated_cost_usd
      }
      if (questPayload) {
        homeworkQuestRef.current = ''
        clearHomeworkQuestForTutorSession()
      }
      const assistantMsg: ChatMessage = { role: 'assistant', content: reply }
      setMessages((m) => [...m, assistantMsg])
      setTopicUser(trimmed)
      setTopicAssistant(reply.slice(0, 400))
      if (!hasActiveSubscription) {
        bumpTutorFreeTurnsUsed()
      }
      if (
        tutorVisualEnabled &&
        hasActiveSubscription &&
        readTutorVisualTurnsUsed() < 6 &&
        reply.trim().length > 12
      ) {
        const url = await fetchTutorVisual({
          checkoutSessionId,
          clientSessionId,
          ageBand,
          tutorReplySnippet: reply,
        })
        if (url) {
          bumpTutorVisualTurnsUsed()
          setTutorImageUrl(url)
        }
      }
      await speakReply(reply)
    } catch (e) {
      const err = e as Error & { code?: string }
      if (err.code === 'TUTOR_FREE_LIMIT') {
        setError(t('aiTutor.freeLimitReached'))
      } else {
        setError(err instanceof Error ? err.message : t('aiTutor.errorGeneric'))
      }
      setMessages((m) => m.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    stopAudio()
    setMessages([])
    saveTutorMessages([])
    setTopicUser('')
    setTopicAssistant('')
    setTutorImageUrl(null)
    sumCostRef.current = 0
    sessionFlushedRef.current = false
    resetTutorTelemetrySessionKeys()
    homeworkQuestRef.current = readHomeworkQuestForTutorSession()
    clearTutorFocusSlugSession()
    tutorFocusSlugRef.current = ''
    setFocusBannerSlug('')
  }

  useEffect(() => {
    if (!tutorLeadCaptureEnabled || hasActiveSubscription) return
    if (!freeLocked || leadBonusClaimed) return
    if (readTutorLeadModalDismissedThisSession()) return
    setLeadModalOpen(true)
  }, [freeLocked, tutorLeadCaptureEnabled, hasActiveSubscription, leadBonusClaimed])

  const startSpeechInput = () => {
    if (isTots || !voiceOut || !readVoiceConsent() || freeLocked) return
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

  const bubbleText = isTots ? 'text-xl leading-relaxed md:text-xl' : isCrew ? 'text-base leading-relaxed md:text-lg' : 'text-lg leading-relaxed md:text-lg'
  const chatMaxH = isTots
    ? 'max-h-[min(44vh,420px)] md:max-h-[min(52vh,520px)] lg:max-h-[min(68vh,640px)]'
    : isCrew
      ? 'max-h-[min(56vh,520px)] md:max-h-[min(62vh,600px)] lg:max-h-[min(72vh,680px)]'
      : 'max-h-[min(50vh,400px)] md:max-h-[min(58vh,560px)] lg:max-h-[min(70vh,660px)]'
  const inputMaxLen = isTots ? 240 : isCrew ? 8000 : 2000

  return (
    <div
      className={cn(
        'w-full space-y-5 pb-10 md:space-y-6 md:pb-12 lg:space-y-7',
        isTots && 'space-y-6 md:space-y-8 [&_section]:rounded-3xl',
        isCrew && 'md:space-y-6',
      )}
    >
      {isStandaloneTutor ? (
        <div
          className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-1 shadow-sm sm:flex-row sm:items-stretch"
          role="group"
          aria-label={t('aiTutor.modeToggleAria')}
        >
          <button
            type="button"
            className={cn(
              'min-h-[48px] flex-1 rounded-xl px-4 text-base font-bold transition-colors',
              experienceMode === 'sparki'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-transparent text-slate-700 hover:bg-slate-50',
            )}
            onClick={() => setExperienceMode('sparki')}
          >
            {t('aiTutor.modeSparki')}
          </button>
          <button
            type="button"
            className={cn(
              'min-h-[48px] flex-1 rounded-xl px-4 text-base font-bold transition-colors',
              experienceMode === 'tutor'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-transparent text-slate-700 hover:bg-slate-50',
            )}
            onClick={() => setExperienceMode('tutor')}
          >
            {t('aiTutor.modeTutor')}
          </button>
        </div>
      ) : null}

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

      <TutorLeadCaptureModal
        open={leadModalOpen}
        title={t('aiTutor.leadModalTitle')}
        body={t('aiTutor.leadModalBody')}
        parentNote={t('aiTutor.leadModalParentNote')}
        privacyNote={t('aiTutor.leadModalPrivacy')}
        emailLabel={t('aiTutor.leadModalEmailLabel')}
        emailPlaceholder={t('aiTutor.leadModalEmailPlaceholder')}
        submitLabel={t('aiTutor.leadModalSubmit')}
        submittingLabel={t('aiTutor.leadModalSubmitting')}
        dismissLabel={t('aiTutor.leadModalDismiss')}
        onSubmit={onSubmitTutorLead}
        onDismiss={onDismissTutorLeadModal}
      />

      {!isStandaloneTutor ? <TutorRulesKidPanel /> : null}

      {!isStandaloneTutor && focusBannerSlug ? (
        <p className="rounded-2xl border border-violet-200/90 bg-violet-50/95 px-4 py-4 text-base leading-relaxed text-violet-950 md:px-5 md:text-lg">
          <span className="font-bold">{t('aiTutor.focusSessionLabel')}</span>{' '}
          {tutorFocusPackLabel(focusBannerSlug)}
        </p>
      ) : null}

      {!isStandaloneTutor && stateCode ? (
        <p className="rounded-2xl border border-teal-200/90 bg-teal-50/95 px-4 py-4 text-base leading-relaxed text-teal-950 md:px-5 md:py-4 md:text-lg">
          {t('aiTutor.stateBanner', { state: stateNameFromCode(stateCode) })}{' '}
          <Link to="/?view=parent" className="font-semibold text-teal-900 underline-offset-2 hover:underline">
            {t('aiTutor.stateBannerParentLink')}
          </Link>
        </p>
      ) : null}
      {!isStandaloneTutor && !stateCode ? (
        <p className="rounded-2xl border border-amber-200/90 bg-amber-50/95 px-4 py-4 text-base leading-relaxed text-amber-950 md:px-5 md:text-lg">
          {t('aiTutor.stateMissingBanner')}{' '}
          <Link to="/?view=parent" className="font-semibold text-amber-900 underline-offset-2 hover:underline">
            {t('aiTutor.stateMissingLink')}
          </Link>
        </p>
      ) : null}

      {!hasActiveSubscription ? (
        <div className="rounded-2xl border border-indigo-200/90 bg-indigo-50/95 px-4 py-4 text-base text-indigo-950 sm:px-5 md:text-lg">
          <p>
            {freeLocked
              ? t('aiTutor.freeLimitReached')
              : t('aiTutor.freeTeaserBanner', { remaining: freeRemaining })}
          </p>
          {freeLocked ? (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-teal-600 px-6 text-lg font-bold text-white shadow-md hover:bg-teal-700 disabled:opacity-60 lg:min-h-[60px]"
                onClick={() => void startAcademyCheckout()}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? t('parentDashboard.openingCheckout') : t('parentDashboard.unlockAcademyButton')}
              </button>
              <Link
                to="/?view=parent"
                className="inline-flex min-h-[52px] items-center text-lg font-semibold text-indigo-900 underline-offset-2 hover:underline"
              >
                {t('aiTutor.freeLimitParentCta')}
              </Link>
            </div>
          ) : null}
          {freeLocked && checkoutError ? (
            <p className="mt-2 text-sm font-semibold text-red-700" role="alert">
              {checkoutError}
            </p>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-col gap-6 lg:gap-8',
          'lg:grid lg:items-start',
          isStandaloneTutor && experienceMode === 'sparki'
            ? 'lg:grid-cols-1'
            : liveAvatar
              ? 'lg:grid-cols-[minmax(0,1.12fr)_minmax(280px,28rem)]'
              : 'lg:grid-cols-[minmax(280px,38%)_minmax(0,1fr)]',
        )}
      >
        <div className="min-w-0 space-y-6 lg:sticky lg:top-3 lg:z-[1] lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pb-2 lg:pr-1">
          {isStandaloneTutor && experienceMode === 'sparki' ? (
            <section className="rounded-3xl border border-indigo-500/35 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-6 text-center shadow-lg md:px-6">
              <img
                src="/adventure-assets/sparki-default.svg"
                alt=""
                className="mx-auto h-36 w-36 max-w-[min(100%,11rem)] object-contain md:h-44 md:w-44"
              />
              <p className="mt-4 font-heading text-xl font-bold text-amber-100">{t('aiTutor.sparkiModeTitle')}</p>
              <p className="mt-2 text-base leading-relaxed text-amber-100/90">{t('aiTutor.sparkiModePlaceholder')}</p>
              <p className="mt-4 text-2xl font-bold tabular-nums text-amber-200">
                {t('aiTutor.sparkiStarsStub')}: 0
              </p>
            </section>
          ) : null}
          <section className="rounded-3xl border border-slate-200/90 bg-slate-50/95 shadow-md">
            <button
              type="button"
              className="flex min-h-[56px] w-full cursor-pointer list-none items-center rounded-3xl px-4 py-3.5 text-left text-lg font-bold text-slate-800 sm:px-5 lg:min-h-[60px] lg:text-xl"
              aria-expanded={soundVideoExpanded}
              onClick={() => setSoundVideoExpanded((v) => !v)}
            >
              {t('aiTutor.sectionSoundVideo')}
              <span
                className={cn(
                  'ml-auto text-sm font-normal text-slate-500 transition-transform',
                  soundVideoExpanded && '-rotate-180',
                )}
                aria-hidden
              >
                ▾
              </span>
            </button>
            {soundVideoExpanded ? (
            <div className="flex flex-wrap items-end gap-3 border-t border-slate-200/80 px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4 lg:gap-4">
              {!isTots && (
                <button
                  type="button"
                  aria-pressed={voiceOut}
                  className={`inline-flex min-h-[56px] min-w-[11rem] flex-col items-center justify-center rounded-2xl px-4 py-2.5 text-center text-base font-bold leading-tight lg:min-h-[60px] lg:text-lg ${
                    voiceOut ? 'bg-sky-600 text-white shadow-md' : 'border-2 border-slate-300 bg-white text-slate-800'
                  }`}
                  onClick={onToggleVoiceOut}
                >
                  <span>{t('aiTutor.voiceToggleTitle')}</span>
                  <span className="mt-0.5 text-xs font-bold tracking-wide">
                    {voiceOut ? t('aiTutor.toggleStateOn') : t('aiTutor.toggleStateOff')}
                  </span>
                </button>
              )}
              <button
                type="button"
                aria-pressed={liveAvatar}
                className={`inline-flex min-h-[56px] min-w-[11rem] flex-col items-center justify-center rounded-2xl px-4 py-2.5 text-center text-base font-bold leading-tight lg:min-h-[60px] lg:text-lg ${
                  liveAvatar ? 'bg-indigo-600 text-white shadow-md' : 'border-2 border-slate-300 bg-white text-slate-800'
                }`}
                onClick={() => void onToggleLiveAvatar()}
                disabled={avatarBusy || (isStandaloneTutor && experienceMode === 'sparki')}
              >
                <span>
                  {liveAvatar
                    ? t('aiTutor.avatarStop')
                    : freeLocked
                      ? t('aiTutor.avatarLockedShort')
                      : t('aiTutor.avatarStart')}
                </span>
                <span className="mt-0.5 text-xs font-bold tracking-wide">
                  {liveAvatar ? t('aiTutor.toggleStateOn') : t('aiTutor.toggleStateOff')}
                </span>
              </button>
              {liveAvatar && (
                <button
                  type="button"
                  className="min-h-[52px] rounded-2xl border-2 border-amber-500/80 bg-amber-50 px-5 text-base font-bold text-amber-950 disabled:opacity-50 lg:min-h-[56px] lg:text-lg"
                  onClick={onPauseAvatarSpeech}
                  disabled={avatarBusy}
                >
                  {t('aiTutor.avatarPauseSpeech')}
                </button>
              )}
              {!isTots && voiceOut && (
                <div className="flex min-w-[min(100%,14rem)] flex-col gap-1">
                  <button
                    type="button"
                    className="min-h-[52px] rounded-2xl border-2 border-slate-300 bg-white px-5 text-base font-bold text-slate-800 lg:min-h-[56px] lg:text-lg"
                    onClick={startSpeechInput}
                  >
                    {t('aiTutor.micOnce')}
                  </button>
                  <span className="text-xs leading-snug text-slate-600">{t('aiTutor.micOnceSub')}</span>
                </div>
              )}
              {avatarMsg ? (
                <p
                  className="mt-1 w-full rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-950"
                  role="status"
                >
                  {avatarMsg}
                </p>
              ) : null}
            </div>
            ) : null}
          </section>

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
                isStandaloneTutor &&
                  experienceMode === 'tutor' &&
                  'ring-4 ring-teal-300/70 shadow-xl shadow-teal-900/20',
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
              <div
                className="relative block w-full cursor-pointer bg-black"
                role="presentation"
                tabIndex={-1}
                onClick={() => {
                  const el = videoRef.current
                  if (el) void el.play().catch(() => {})
                }}
              >
                <video
                  ref={videoRef}
                  className="aspect-video w-full max-h-[min(72vh,720px)] object-cover object-center [&:fullscreen]:max-h-none"
                  playsInline
                  // iOS Safari: inline playback in webviews / older WKWebView
                  {...{ 'webkit-playsinline': 'true' } as React.HTMLAttributes<HTMLVideoElement>}
                  muted={false}
                  autoPlay
                />
              </div>
              <p className="bg-slate-800 px-3 py-2 text-center text-xs text-slate-300 sm:px-4">
                {t('aiTutor.videoTapToPlayHint')}
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-6 lg:min-h-0">
          {(topicUser || topicAssistant) && (
            <TutorTopicCard
              title={t('aiTutor.topicCardHeading')}
              userSnippet={topicUser}
              assistantSnippet={topicAssistant}
            />
          )}
          {tutorImageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={tutorImageUrl}
                alt=""
                className="mx-auto max-h-[min(40vh,320px)] w-full object-contain"
              />
            </div>
          ) : null}

          <section className="space-y-3 lg:space-y-4" aria-labelledby="tutor-chat-heading">
            <h2
              id="tutor-chat-heading"
              className={cn(
                'font-heading font-extrabold tracking-tight text-slate-900',
                isTots ? 'text-xl md:text-2xl' : isCrew ? 'text-lg md:text-xl' : 'text-lg md:text-2xl',
              )}
            >
              {t('aiTutor.sectionChat')}
            </h2>
            <div
              className={cn(
                'space-y-3 overflow-y-auto rounded-3xl border-2 border-slate-200/90 bg-gradient-to-b from-white to-slate-50/90 p-4 shadow-inner sm:p-5',
                chatMaxH,
              )}
              aria-live="polite"
            >
              {messages.length === 0 && (
                <p className={cn('text-slate-600', isTots ? 'text-xl' : 'text-base')}>{t('aiTutor.emptyChat')}</p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[min(100%,52rem)] rounded-2xl px-4 py-3.5 shadow-sm md:px-5 md:py-4',
                    bubbleText,
                    m.role === 'user'
                      ? 'ml-auto bg-sky-600 text-white'
                      : 'mr-auto bg-white text-slate-800 shadow-sm',
                  )}
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

          <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-4">
            <label className="sr-only" htmlFor="ai-tutor-input">
              {t('aiTutor.inputLabel')}
            </label>
            <textarea
              id="ai-tutor-input"
              className={cn(
                'min-h-[120px] min-w-0 flex-1 resize-y rounded-3xl border-2 border-slate-300/90 bg-white p-4 text-slate-900 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 sm:p-5 lg:min-h-[140px]',
                isTots ? 'min-h-[140px] text-xl' : isCrew ? 'text-lg' : 'text-xl',
              )}
              placeholder={t('aiTutor.inputPlaceholder')}
              maxLength={inputMaxLen}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void send()
                }
              }}
              disabled={loading || freeLocked}
            />
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:justify-end lg:w-52 lg:flex-col lg:justify-stretch xl:w-56">
              <button
                type="button"
                className="min-h-[56px] rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 px-6 text-xl font-extrabold text-white shadow-md transition hover:from-sky-600 hover:to-sky-800 disabled:opacity-50 lg:min-h-[60px] lg:flex-1 lg:text-2xl"
                onClick={() => void send()}
                disabled={loading || freeLocked}
              >
                {loading ? t('aiTutor.sending') : t('aiTutor.send')}
              </button>
              <button
                type="button"
                className="min-h-[52px] rounded-2xl border-2 border-slate-300 bg-white text-lg font-bold text-slate-700 shadow-sm lg:min-h-[52px]"
                onClick={clearChat}
              >
                {t('aiTutor.clearChat')}
              </button>
            </div>
          </div>

          <p className="text-center text-sm leading-relaxed text-slate-500 sm:text-left lg:text-base xl:text-center">
            {t('aiTutor.footerHint')}
          </p>
        </div>
      </div>
    </div>
  )
}
