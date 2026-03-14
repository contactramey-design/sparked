/**
 * Read-aloud for kids: uses the browser's Web Speech API (speechSynthesis), with
 * optional cloud TTS (e.g. ElevenLabs via your backend) when config.tts is set.
 * Picks a friendly, natural-sounding browser voice when available (Google, Samantha, etc.).
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { appConfig } from '../config'

const DEFAULT_RATE = 0.98
const DEFAULT_PITCH = 1.08
const LANG = 'en-US'

// Voice names (partial match) that tend to sound more natural and kid-friendly
const PREFERRED_VOICE_NAMES = [
  'Google US English',   // Chrome – natural
  'Microsoft Zira',      // Windows – friendly
  'Samantha',            // Apple – warm
  'Karen',               // Apple (AU)
  'Victoria',            // Apple
  'Daniel',              // Apple (UK)
  'Samantha (Enhanced)',
  'Alex',                // Apple
]

function pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const enUs = voices.filter((v) => v.lang.startsWith('en-US') || v.lang === 'en_US')
  const pool = enUs.length ? enUs : voices

  for (const name of PREFERRED_VOICE_NAMES) {
    const found = pool.find(
      (v) => v.name.includes(name) || v.name.toLowerCase().includes(name.toLowerCase())
    )
    if (found) return found
  }

  const defaultEn = pool.find((v) => v.default)
  if (defaultEn) return defaultEn
  return pool[0] ?? voices[0] ?? null
}

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const loadVoices = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const voices = window.speechSynthesis.getVoices()
    voiceRef.current = pickBestVoice(voices)
  }, [])

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
      abortRef.current?.abort()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [loadVoices])

  const stop = useCallback(() => {
    if (typeof window === 'undefined') return
    abortRef.current?.abort()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
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
      utterance.lang = LANG
      if (voiceRef.current) utterance.voice = voiceRef.current
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [loadVoices]
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
        abortRef.current = controller
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
          audioRef.current = audio
          setIsSpeaking(true)
          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            setIsSpeaking(false)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            setIsSpeaking(false)
          }
          await audio.play()
        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            if (process.env.NODE_ENV === 'development') {
              console.warn('TTS cloud failed, using browser voice:', (e as Error).message)
            }
            if (window.speechSynthesis) fallbackSpeak(t, options)
          }
          abortRef.current = null
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
