/**
 * COPPA-safe read-aloud: uses only the browser's Web Speech API (speechSynthesis).
 * All speech runs on the device; no text is sent to our servers or third parties.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const DEFAULT_RATE = 0.95
const DEFAULT_PITCH = 1

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: { rate?: number; pitch?: number }) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return
      const t = text?.trim()
      if (!t) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(t)
      utterance.rate = options?.rate ?? DEFAULT_RATE
      utterance.pitch = options?.pitch ?? DEFAULT_PITCH
      utterance.lang = 'en-US'

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    []
  )

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return { speak, stop, isSpeaking }
}
