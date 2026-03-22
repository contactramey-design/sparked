import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

/** Sparki Tots — Game 3: Software Button Hunt. Tap all 4 color buttons to finish. */
const BUTTONS = [
  { id: 'r', emoji: '🔴', freq: 800, className: 'from-[#FF6B6B] to-[#FF4444]', border: '#DC2626' },
  { id: 'b', emoji: '🔵', freq: 600, className: 'from-[#4facfe] to-[#1e90ff]', border: '#2563EB' },
  { id: 'g', emoji: '🟢', freq: 1200, className: 'from-[#43e97b] to-[#38a169]', border: '#059669' },
  { id: 'y', emoji: '🟡', freq: 1500, className: 'from-[#FFD93D] to-[#FFC700]', border: '#CA8A04' },
] as const

export interface TotsSoftwareButtonHuntQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const TotsSoftwareButtonHuntQuiz: React.FC<TotsSoftwareButtonHuntQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [tapped, setTapped] = useState<Set<string>>(new Set())
  const [bubble, setBubble] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const onTap = (id: string, freq: number) => {
    if (done) return
    playBeep(freq, 0.18)
    const next = new Set(tapped).add(id)
    setTapped(next)
    const cheers = ['cheer1', 'cheer2', 'cheer3', 'cheer4'] as const
    const msg = t(`totsButtonHunt.${cheers[(next.size - 1) % cheers.length]}`)
    setBubble(msg)
    speakPdfLine(msg, 0.8, 1.2)
    if (next.size >= BUTTONS.length) {
      setDone(true)
      onComplete(BUTTONS.length)
      speakPdfLine(t('totsButtonHunt.winSpeech'), 0.8, 1.2)
    }
  }

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  if (done) {
    return (
      <div className="font-pdf-fredoka pdf-kind-bg relative overflow-hidden rounded-3xl border-4 border-white p-8 text-center shadow-2xl">
        <h2 className="text-4xl font-bold text-white drop-shadow">{t('totsButtonHunt.winTitle')}</h2>
        <p className="mt-3 text-xl font-semibold text-white">{t('totsButtonHunt.winBody')}</p>
        <p className="mt-4 font-bold text-amber-100">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="mt-4 inline-block primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
        <button
          type="button"
          className="mt-4 block w-full max-w-xs mx-auto rounded-full bg-white/20 px-6 py-3 font-bold text-white"
          onClick={() => {
            setTapped(new Set())
            setDone(false)
            setBubble(null)
          }}
        >
          {t('aiSortCheer.playAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className="font-pdf-fredoka pdf-kind-bg relative min-h-[420px] overflow-hidden rounded-3xl border-4 border-white p-6 shadow-xl">
      <h2 className="text-center text-4xl font-bold text-white drop-shadow">{t('totsButtonHunt.title')}</h2>
      <div className="relative z-10 mx-auto mt-4 max-w-sm rounded-2xl bg-white px-4 py-3 text-center text-lg font-bold text-slate-800 shadow-lg">
        {bubble ?? t('totsButtonHunt.tapIntro')}
      </div>
      <p className="mt-2 text-center text-lg font-bold text-white">
        {t('totsButtonHunt.progress', { n: tapped.size, total: BUTTONS.length })}
      </p>
      <div className="relative z-10 mx-auto mt-8 grid max-w-md grid-cols-2 gap-10">
        {BUTTONS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => onTap(b.id, b.freq)}
            className={`flex h-[140px] w-[140px] items-center justify-center rounded-full border-8 border-white bg-gradient-to-br ${b.className} text-7xl shadow-[0_12px_0_rgba(0,0,0,0.25)] transition-transform active:translate-y-1 active:shadow-[0_6px_0_rgba(0,0,0,0.25)]`}
            style={{ borderColor: b.border }}
          >
            {b.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TotsSoftwareButtonHuntQuiz
