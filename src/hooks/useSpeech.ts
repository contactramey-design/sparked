/**
 * Read-aloud for kids: uses the browser's Web Speech API (speechSynthesis), with
 * optional cloud TTS (e.g. ElevenLabs via your backend) when config.tts is set.
 * Picks a friendly voice for the current locale (en or es); cloud TTS speaks the text in its language.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { appConfig } from '../config'
import { useLocale } from '../contexts/LocaleContext'
import { primeWebAudioFromUserGesture } from '../lib/audioUnlock'

const DEFAULT_RATE = 0.98
const DEFAULT_PITCH = 1.08
/** ElevenLabs + cold serverless can exceed a few seconds; short timeouts cause Siri fallback. */
const CLOUD_TTS_TIMEOUT_MS = 45_000

function looksLikeMp3OrId3(bytes: Uint8Array): boolean {
  if (bytes.length < 2) return false
  // MPEG frame sync 0xFF Ex where E in 0xE0..0xFF (common: 0xFB)
  if (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0) return true
  // ID3 tag
  if (bytes.length >= 3 && bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) return true
  return false
}

const PREFERRED_VOICE_EN = [
  'Siri', 'Premium', 'Enhanced', 'Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria', 'Daniel', 'Alex',
]
const PREFERRED_VOICE_ES = [
  'Siri', 'Premium', 'Enhanced', 'Google español', 'Microsoft Sabina', 'Paulina', 'Juan', 'Monica', 'Spanish',
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
  /** True when the user hit Stop (vs. speak() clearing previous playback). Used to avoid TTS fallback after intentional abort. */
  const userInitiatedStopRef = useRef(false)

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

  const stopPlaybackOnly = useCallback(() => {
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
  }, [])

  const stop = useCallback(() => {
    userInitiatedStopRef.current = true
    stopPlaybackOnly()
    setIsSpeaking(false)
  }, [stopPlaybackOnly])

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

      userInitiatedStopRef.current = false
      // Second line of defense if anything called speak() without going through ListenButton.
      primeWebAudioFromUserGesture()
      stopPlaybackOnly()
      setIsSpeaking(false)

      // Offline: skip cloud TTS entirely and use device voice.
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        if (window.speechSynthesis) fallbackSpeak(t, options)
        return
      }

      const useCloud = appConfig.tts?.useCloud && appConfig.tts?.endpoint
      if (useCloud) {
        const controller = new AbortController()
        globalAbort = controller
        let timeoutId: number = 0
        try {
          timeoutId = window.setTimeout(() => controller.abort(), CLOUD_TTS_TIMEOUT_MS)
          const res = await fetch(appConfig.tts!.endpoint!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // ElevenLabs often responds as application/octet-stream
              Accept: 'audio/mpeg, application/octet-stream, audio/*, */*;q=0.8',
            },
            body: JSON.stringify({ text: t, locale }),
            signal: controller.signal,
          })
          if (!res.ok) {
            const errBody = await res.text().catch(() => '')
            console.warn('[TTS] HTTP', res.status, errBody.slice(0, 400))
            throw new Error(`TTS HTTP ${res.status}`)
          }
          const contentType = (res.headers.get('content-type') || '').toLowerCase()
          // API errors are often JSON; don't try to decode as audio.
          if (contentType.includes('json')) {
            const errBody = await res.text().catch(() => '')
            console.warn('[TTS] JSON body (not audio):', errBody.slice(0, 400))
            throw new Error('TTS API returned JSON (not audio)')
          }
          const blob = await res.blob()
          if (!blob.size) throw new Error('TTS empty response')
          const head = new Uint8Array(await blob.slice(0, 12).arrayBuffer())
          if (!looksLikeMp3OrId3(head)) {
            console.warn('[TTS] Response was not MP3 audio (wrong key, proxy HTML, or error page).')
            throw new Error('TTS response not valid MP3')
          }
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          globalAudio = audio
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
          setIsSpeaking(true)
          try {
            await audio.play()
          } catch (playErr) {
            // Common on iOS/Safari: user gesture is lost after await fetch(); fall back to device TTS.
            URL.revokeObjectURL(url)
            if (globalAudio === audio) globalAudio = null
            setIsSpeaking(false)
            throw playErr
          }
        } catch (e) {
          if (globalAbort === controller) {
            globalAbort = null
          }
          const aborted = (e as Error).name === 'AbortError'
          if (aborted && userInitiatedStopRef.current) {
            setIsSpeaking(false)
            return
          }
          if (!aborted) {
            console.warn('[TTS] Cloud failed, using browser voice:', (e as Error).message)
          }
          // Prefer browser speech when cloud fails, times out, or play() was blocked.
          if (window.speechSynthesis) {
            fallbackSpeak(t, options)
          } else {
            setIsSpeaking(false)
          }
        } finally {
          window.clearTimeout(timeoutId)
        }
        return
      }

      if (window.speechSynthesis) fallbackSpeak(t, options)
    },
    [stopPlaybackOnly, fallbackSpeak, locale]
  )

  return { speak, stop, isSpeaking }
}
