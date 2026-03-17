/**
 * Read-aloud for kids: uses the browser's Web Speech API (speechSynthesis), with
 * optional cloud TTS (e.g. ElevenLabs via your backend) when config.tts is set.
 * Picks a friendly voice for the current locale (en or es); cloud TTS speaks the text in its language.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { appConfig } from '../config'
import { useLocale } from '../contexts/LocaleContext'

const DEFAULT_RATE = 0.98
const DEFAULT_PITCH = 1.08

const PREFERRED_VOICE_EN = [
  'Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria', 'Daniel', 'Samantha (Enhanced)', 'Alex',
]
const PREFERRED_VOICE_ES = [
  'Google español', 'Microsoft Sabina', 'Paulina', 'Juan', 'Monica', 'Spanish',
]

// Global audio/abort so only one clip can ever play at once across the app
let globalAudio: HTMLAudioElement | null = null
let globalAbort: AbortController | null = null

function pickBestVoice(voices: SpeechSynthesisVoice[], lang: 'en' | 'es'): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const isEs = lang === 'es'
  const langMatch = isEs
    ? (v: SpeechSynthesisVoice) => v.lang.startsWith('es') || v.lang === 'es_ES'
    : (v: SpeechSynthesisVoice) => v.lang.startsWith('en-US') || v.lang === 'en_US'
  const pool = voices.filter(langMatch)
  const fallbackPool = pool.length ? pool : voices
  const names = isEs ? PREFERRED_VOICE_ES : PREFERRED_VOICE_EN
  for (const name of names) {
    const found = fallbackPool.find(
      (v) => v.name.includes(name) || v.name.toLowerCase().includes(name.toLowerCase())
    )
    if (found) return found
  }
  const defaultVoice = fallbackPool.find((v) => v.default)
  if (defaultVoice) return defaultVoice
  return fallbackPool[0] ?? voices[0] ?? null
}

export function useSpeech() {
  const { locale } = useLocale()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const voices = window.speechSynthesis.getVoices()
    voiceRef.current = pickBestVoice(voices, locale)
  }, [locale])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.speechSynthesis) {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
        window.speechSynthesis.cancel()
      }
      globalAbort?.abort()
      globalAbort = null
      if (globalAudio) {
        globalAudio.pause()
        globalAudio.currentTime = 0
        globalAudio = null
      }
    }
  }, [loadVoices])

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return
    globalAbort?.abort()
    globalAbort = null
    if (globalAudio) {
      globalAudio.pause()
      globalAudio.currentTime = 0
      globalAudio = null
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  const fallbackSpeak = useCallback(
    (t: string, options?: { rate?: number; pitch?: number }) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return
      window.speechSynthesis.cancel()
      loadVoices()
      const utterance = new SpeechSynthesisUtterance(t)
      utterance.rate = options?.rate ?? DEFAULT_RATE
      utterance.pitch = options?.pitch ?? DEFAULT_PITCH
      utterance.lang = locale === 'es' ? 'es-ES' : 'en-US'
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [loadVoices, locale],
  )

  const speak = useCallback(
    async (text: string, options?: { rate?: number; pitch?: number }) => {
      if (typeof window === 'undefined') return
      const t = text?.trim()
      if (!t) return

      stop()

      const useCloud = appConfig.tts?.useCloud && appConfig.tts?.endpoint
      if (useCloud) {
        const controller = new AbortController()
        globalAbort = controller
        try {
          const res = await fetch(appConfig.tts!.endpoint!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: t }),
            signal: controller.signal,
          })
          if (!res.ok) throw new Error('TTS request failed')
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          globalAudio = audio
          setIsSpeaking(true)
          audio.onended = () => {
            URL.revokeObjectURL(url)
            if (globalAudio === audio) {
              globalAudio = null
            }
            setIsSpeaking(false)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            if (globalAudio === audio) {
              globalAudio = null
            }
            setIsSpeaking(false)
          }
          await audio.play()
        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            if (import.meta.env.DEV) {
              console.warn('TTS cloud failed, using browser voice:', (e as Error).message)
            }
            if (window.speechSynthesis) fallbackSpeak(t, options)
          }
          if (globalAbort === controller) {
            globalAbort = null
          }
          setIsSpeaking(false)
        }
        return
      }

      if (window.speechSynthesis) fallbackSpeak(t, options)
    },
    [stop, fallbackSpeak]
  )

  return { speak, stop, isSpeaking }
}
