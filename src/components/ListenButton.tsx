import React from 'react'
import { useSpeech } from '../hooks/useSpeech'

export interface ListenButtonProps {
  text: string
  className?: string
  ariaLabel?: string
  size?: 'sm' | 'md'
}

/**
 * Read-aloud: uses cloud TTS when configured (e.g. ElevenLabs via /api/tts with locale),
 * otherwise the browser Web Speech API. Text is sent only to your own backend when cloud TTS is on.
 */
const ListenButton: React.FC<ListenButtonProps> = ({
  text,
  className = '',
  ariaLabel = 'Listen to this',
  size = 'md',
}) => {
  const { speak, stop, isSpeaking } = useSpeech()

  const handleClick = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text)
    }
  }

  const sizeClass = size === 'sm' ? 'p-1.5 text-sm' : 'p-2 text-base'

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${sizeClass} ${className}`}
      aria-label={isSpeaking ? 'Stop listening' : ariaLabel}
      title={isSpeaking ? 'Stop' : 'Listen'}
    >
      {isSpeaking ? (
        <span className="inline-block" aria-hidden>⏹️</span>
      ) : (
        <span className="inline-block" aria-hidden>🔊</span>
      )}
    </button>
  )
}

export default ListenButton
