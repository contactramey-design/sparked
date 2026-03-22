import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

type Helper = 'ai' | 'human'

const Q_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const
const CORRECT: Record<(typeof Q_KEYS)[number], Helper> = {
  q1: 'human',
  q2: 'ai',
  q3: 'ai',
  q4: 'human',
  q5: 'human',
  q6: 'ai',
  q7: 'human',
  q8: 'ai',
}

function shuffleOrder(): (typeof Q_KEYS)[number][] {
  const arr = [...Q_KEYS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export interface CrewAiHumanHelperQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const CrewAiHumanHelperQuiz: React.FC<CrewAiHumanHelperQuizProps> = ({
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

  const total = Q_KEYS.length
  const key = order[idx]!
  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const pick = (choice: Helper) => {
    if (done) return
    setFeedback(null)
    const ok = CORRECT[key] === choice
    if (ok) {
      playBeep(1100, 0.2)
      const next = correctCount + 1
      setCorrectCount(next)
      speakPdfLine(t('crewAiHumanHelper.correctSpeech'), 0.85, 1.05)
      if (idx + 1 >= total) {
        setDone(true)
        onComplete(next)
        playBeep(1500, 0.4)
        speakPdfLine(t('crewAiHumanHelper.winSpeech'), 0.85, 1.1)
      } else {
        setIdx((i) => i + 1)
      }
    } else {
      playBeep(400, 0.22)
      const hint =
        CORRECT[key] === 'ai' ? t('crewAiHumanHelper.hintAi') : t('crewAiHumanHelper.hintHuman')
      setFeedback(hint)
      speakPdfLine(hint, 0.85, 1)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-3xl border-4 border-indigo-300/80 p-8 text-center shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <h2 className="text-3xl font-black text-indigo-100 md:text-4xl">{t('crewAiHumanHelper.winTitle')}</h2>
        <p className="mt-3 text-lg text-indigo-50">{t('crewAiHumanHelper.winBody', { score: correctCount, total })}</p>
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
      className="rounded-3xl border-4 border-indigo-400/40 p-6 shadow-2xl md:p-8"
      style={{ background: 'linear-gradient(145deg, #312e81 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      <h2 className="text-center text-2xl font-black text-white md:text-3xl">{t('crewAiHumanHelper.title')}</h2>
      <p className="mt-2 text-center text-indigo-200">{t('crewAiHumanHelper.subtitle')}</p>
      <p className="mt-2 text-center text-sm font-bold text-amber-200">
        {t('crewAiHumanHelper.progress', { current: idx + 1, total })}
      </p>

      <div className="mx-auto mt-8 max-w-lg rounded-2xl border-2 border-indigo-400/50 bg-slate-900/60 p-6 text-center shadow-inner">
        <p className="text-xl font-semibold leading-snug text-white md:text-2xl">{t(`crewAiHumanHelper.${key}`)}</p>
      </div>

      {feedback && <p className="mt-4 text-center font-bold text-amber-200">{feedback}</p>}

      <div className="mx-auto mt-8 flex max-w-lg flex-col gap-4 sm:flex-row">
        <button
          type="button"
          className="flex-1 rounded-2xl border-4 border-cyan-300 bg-cyan-600/90 px-4 py-4 text-lg font-black text-white shadow-lg active:scale-[0.98]"
          onClick={() => pick('ai')}
        >
          {t('crewAiHumanHelper.pickAi')}
        </button>
        <button
          type="button"
          className="flex-1 rounded-2xl border-4 border-fuchsia-300 bg-fuchsia-700/90 px-4 py-4 text-lg font-black text-white shadow-lg active:scale-[0.98]"
          onClick={() => pick('human')}
        >
          {t('crewAiHumanHelper.pickHuman')}
        </button>
      </div>
    </div>
  )
}

export default CrewAiHumanHelperQuiz
