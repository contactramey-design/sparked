import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

type Verdict = 'right' | 'mistake'

const CARD_KEYS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const
const CORRECT: Record<(typeof CARD_KEYS)[number], Verdict> = {
  s1: 'right',
  s2: 'mistake',
  s3: 'right',
  s4: 'mistake',
  s5: 'right',
  s6: 'mistake',
}

function shuffleOrder(): (typeof CARD_KEYS)[number][] {
  const arr = [...CARD_KEYS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = arr[i]!
    const b = arr[j]!
    arr[i] = b
    arr[j] = a
  }
  return arr
}

export interface CrewAiFactOrMistakeQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const CrewAiFactOrMistakeQuiz: React.FC<CrewAiFactOrMistakeQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const order = useMemo(() => shuffleOrder(), [])
  const [idx, setIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const total = CARD_KEYS.length
  const key = order[idx]!
  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const pick = (choice: Verdict) => {
    if (done) return
    setFeedback(null)
    const ok = CORRECT[key] === choice
    if (ok) {
      playBeep(1100, 0.2)
      const nextCorrect = correctCount + 1
      setCorrectCount(nextCorrect)
      speakPdfLine(t('crewAiFactOrMistake.correctSpeech'), 0.85, 1.05)
      if (idx + 1 >= total) {
        setDone(true)
        onComplete(nextCorrect)
        playBeep(1500, 0.4)
        speakPdfLine(t('crewAiFactOrMistake.winSpeech'), 0.85, 1.1)
      } else {
        setIdx((i) => i + 1)
      }
    } else {
      playBeep(380, 0.22)
      setFeedback(t('crewAiFactOrMistake.tryAgain'))
      speakPdfLine(t('crewAiFactOrMistake.tryAgain'), 0.85, 1)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-3xl border-4 border-white/90 p-8 text-center shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #164e63 45%, #0f172a 100%)' }}
      >
        <h2 className="text-3xl font-black text-cyan-100 drop-shadow md:text-4xl">{t('crewAiFactOrMistake.winTitle')}</h2>
        <p className="mt-3 text-lg text-cyan-50">{t('crewAiFactOrMistake.winBody', { score: correctCount, total })}</p>
        <p className="mt-4 font-bold text-amber-200">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="mt-4 inline-block primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl border-4 border-white/80 p-6 shadow-2xl md:p-8"
      style={{ background: 'linear-gradient(145deg, #0c4a6e 0%, #164e63 45%, #0f172a 100%)' }}
    >
      <h2 className="text-center text-2xl font-black text-white drop-shadow md:text-3xl">{t('crewAiFactOrMistake.title')}</h2>
      <p className="mt-2 text-center text-cyan-100">{t('crewAiFactOrMistake.subtitle')}</p>
      <p className="mt-2 text-center text-sm font-bold text-amber-200">
        {t('crewAiFactOrMistake.progress', { current: idx + 1, total })}
      </p>

      <div className="mx-auto mt-8 max-w-lg rounded-2xl border-2 border-cyan-400/50 bg-slate-900/60 p-6 text-center shadow-inner">
        <p className="text-xl font-semibold leading-snug text-white md:text-2xl">{t(`crewAiFactOrMistake.${key}`)}</p>
      </div>

      {feedback && <p className="mt-4 text-center font-bold text-rose-300">{feedback}</p>}

      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          type="button"
          className="flex-1 rounded-2xl border-4 border-emerald-400 bg-emerald-600/90 px-4 py-4 text-lg font-black text-white shadow-lg transition active:scale-[0.98]"
          onClick={() => pick('right')}
        >
          {t('crewAiFactOrMistake.bucketRight')}
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl border-4 border-rose-400 bg-rose-600/90 px-4 py-4 text-lg font-black text-white shadow-lg transition active:scale-[0.98]"
          onClick={() => pick('mistake')}
        >
          {t('crewAiFactOrMistake.bucketMistake')}
        </button>
      </div>
    </div>
  )
}

export default CrewAiFactOrMistakeQuiz
