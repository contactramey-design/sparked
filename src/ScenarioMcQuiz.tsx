import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

export type ScenarioQuestion = {
  prompt: string
  options: string[]
  correctIndex: number
}

export interface ScenarioMcQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
  title: string
  subtitle?: string
  intro?: string
  questions: ScenarioQuestion[]
  accentClassName?: string
}

/**
 * Multi-choice scenario quiz (Sparki Crew safety/AI units + Sparki Tots AI mini-games).
 */
const ScenarioMcQuiz: React.FC<ScenarioMcQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
  title,
  subtitle,
  intro,
  questions,
  accentClassName = 'from-slate-800 to-slate-900',
}) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'done'>('welcome')
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const total = questions.length
  const q = step === 'quiz' ? questions[idx] : null
  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const start = () => {
    setStep('quiz')
    setIdx(0)
    setScore(0)
    setFinalScore(0)
    setPicked(null)
    setShowFeedback(false)
  }

  const pick = (optionIndex: number) => {
    if (!q || showFeedback) return
    setPicked(optionIndex)
    setShowFeedback(true)
  }

  const advance = () => {
    if (!showFeedback || picked === null || !q) return
    const delta = picked === q.correctIndex ? 1 : 0
    const nextScore = score + delta
    const isLast = idx + 1 >= total
    if (isLast) {
      setFinalScore(nextScore)
      onComplete(nextScore)
      setStep('done')
      return
    }
    setScore(nextScore)
    setIdx((i) => i + 1)
    setPicked(null)
    setShowFeedback(false)
  }

  if (step === 'welcome') {
    return (
      <div className={`rounded-3xl p-6 sm:p-8 max-w-xl mx-auto border-2 border-slate-600 shadow-xl text-center bg-gradient-to-br ${accentClassName} text-white`}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{title}</h2>
        {subtitle && <p className="text-lg font-semibold text-white/90 mb-4">{subtitle}</p>}
        {intro && <p className="text-sm text-white/80 mb-6">{intro}</p>}
        <button type="button" className="primary-button bg-white text-slate-900 hover:bg-slate-100" onClick={start}>
          {t('scenarioMc.start')}
        </button>
      </div>
    )
  }

  if (step === 'quiz' && q) {
    return (
      <div className={`rounded-3xl p-4 sm:p-6 max-w-xl mx-auto border-2 border-slate-600 shadow-xl bg-gradient-to-br ${accentClassName} text-white`}>
        <p className="text-sm font-bold text-cyan-200 mb-2">
          {t('scenarioMc.progress', { current: idx + 1, total })}
        </p>
        <p className="text-lg sm:text-xl font-bold mb-4 leading-snug">{q.prompt}</p>
        <div className="flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              disabled={showFeedback}
              onClick={() => pick(i)}
              className={`text-left rounded-xl px-4 py-3 font-semibold border-2 transition-all ${
                showFeedback
                  ? i === q.correctIndex
                    ? 'bg-emerald-600/90 border-emerald-300'
                    : picked === i
                      ? 'bg-red-700/80 border-red-400'
                      : 'bg-white/10 border-white/20 opacity-60'
                  : 'bg-white/15 border-white/30 hover:bg-white/25'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        {showFeedback && (
          <button type="button" className="mt-4 w-full primary-button bg-white text-slate-900" onClick={advance}>
            {idx + 1 >= total ? t('scenarioMc.seeResults') : t('scenarioMc.next')}
          </button>
        )}
      </div>
    )
  }

  if (step === 'done') {
    return (
      <div className={`rounded-3xl p-6 sm:p-8 max-w-xl mx-auto border-2 border-slate-600 shadow-xl text-center bg-gradient-to-br ${accentClassName} text-white`}>
        <h2 className="text-2xl font-extrabold mb-2">{t('scenarioMc.completeTitle')}</h2>
        <p className="text-xl font-bold mb-4">{t('scenarioMc.scoreLine', { score: finalScore, total })}</p>
        <p className="text-amber-200 font-bold mb-4">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="inline-block primary-button bg-white text-slate-900">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
        <button type="button" className="secondary-button mt-3 block w-full max-w-xs mx-auto border-white text-white" onClick={start}>
          {t('scenarioMc.playAgain')}
        </button>
      </div>
    )
  }

  return null
}

export default ScenarioMcQuiz
