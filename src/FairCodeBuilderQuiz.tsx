import React, { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

export type FairRule = { id: string; labelKey: string; fair: boolean }

export type FairChallenge = {
  id: number
  titleKey: string
  descKey: string
  lessonKey: string
  allRules: FairRule[]
}

/** Source: Sparki Crew Fair Code Builder (PDF). Keys use underscores so locale paths work. */
export const FAIR_CODE_BUILDER_CHALLENGES: FairChallenge[] = [
  {
    id: 1,
    titleKey: 'ch1_title',
    descKey: 'ch1_desc',
    lessonKey: 'ch1_lesson',
    allRules: [
      { id: 'gpa', labelKey: 'ch1_r_gpa', fair: true },
      { id: 'test', labelKey: 'ch1_r_test', fair: true },
      { id: 'essay', labelKey: 'ch1_r_essay', fair: true },
      { id: 'poverty', labelKey: 'ch1_r_poverty', fair: true },
      { id: 'name', labelKey: 'ch1_r_name', fair: false },
      { id: 'appearance', labelKey: 'ch1_r_appearance', fair: false },
      { id: 'gender', labelKey: 'ch1_r_gender', fair: false },
    ],
  },
  {
    id: 2,
    titleKey: 'ch2_title',
    descKey: 'ch2_desc',
    lessonKey: 'ch2_lesson',
    allRules: [
      { id: 'height', labelKey: 'ch2_r_height', fair: true },
      { id: 'speed', labelKey: 'ch2_r_speed', fair: true },
      { id: 'skill', labelKey: 'ch2_r_skill', fair: true },
      { id: 'fitness', labelKey: 'ch2_r_fitness', fair: true },
      { id: 'wealth', labelKey: 'ch2_r_wealth', fair: false },
      { id: 'accent', labelKey: 'ch2_r_accent', fair: false },
      { id: 'friends', labelKey: 'ch2_r_friends', fair: false },
    ],
  },
  {
    id: 3,
    titleKey: 'ch3_title',
    descKey: 'ch3_desc',
    lessonKey: 'ch3_lesson',
    allRules: [
      { id: 'exp', labelKey: 'ch3_r_exp', fair: true },
      { id: 'refs', labelKey: 'ch3_r_refs', fair: true },
      { id: 'math', labelKey: 'ch3_r_math', fair: true },
      { id: 'communicate', labelKey: 'ch3_r_communicate', fair: true },
      { id: 'age', labelKey: 'ch3_r_age', fair: false },
      { id: 'zip', labelKey: 'ch3_r_zip', fair: false },
      { id: 'school', labelKey: 'ch3_r_school', fair: false },
    ],
  },
  {
    id: 4,
    titleKey: 'ch4_title',
    descKey: 'ch4_desc',
    lessonKey: 'ch4_lesson',
    allRules: [
      { id: 'plays', labelKey: 'ch4_r_plays', fair: true },
      { id: 'ratings', labelKey: 'ch4_r_ratings', fair: true },
      { id: 'similar', labelKey: 'ch4_r_similar', fair: true },
      { id: 'playtime', labelKey: 'ch4_r_playtime', fair: true },
      { id: 'gender', labelKey: 'ch4_r_gender', fair: false },
      { id: 'location', labelKey: 'ch4_r_location', fair: false },
      { id: 'name', labelKey: 'ch4_r_name', fair: false },
    ],
  },
  {
    id: 5,
    titleKey: 'ch5_title',
    descKey: 'ch5_desc',
    lessonKey: 'ch5_lesson',
    allRules: [
      { id: 'borrowed', labelKey: 'ch5_r_borrowed', fair: true },
      { id: 'rated', labelKey: 'ch5_r_rated', fair: true },
      { id: 'age', labelKey: 'ch5_r_age', fair: true },
      { id: 'genre', labelKey: 'ch5_r_genre', fair: true },
      { id: 'wealth', labelKey: 'ch5_r_wealth', fair: false },
      { id: 'family', labelKey: 'ch5_r_family', fair: false },
      { id: 'looks', labelKey: 'ch5_r_looks', fair: false },
    ],
  },
]

export interface FairCodeBuilderQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (fairChallengesPassed: number) => void
}

const FairCodeBuilderQuiz: React.FC<FairCodeBuilderQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const challenges = FAIR_CODE_BUILDER_CHALLENGES
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [feedback, setFeedback] = useState<'fair' | 'biased' | 'incomplete' | null>(null)
  const winsRef = useRef(0)
  const [winsDisplay, setWinsDisplay] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const challenge = challenges[challengeIndex]

  const toggleRule = useCallback((id: string) => {
    setSelected((prev) => {
      const n = new Set(prev)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
    setFeedback(null)
  }, [])

  const analyze = () => {
    const selectedObjs = challenge.allRules.filter((r) => selected.has(r.id))
    const fairCount = selectedObjs.filter((r) => r.fair).length
    const biasCount = selectedObjs.filter((r) => !r.fair).length

    if (biasCount === 0 && fairCount >= 3) {
      setFeedback('fair')
      winsRef.current += 1
      setWinsDisplay(winsRef.current)
    } else if (biasCount === 0 && fairCount < 3) {
      setFeedback('incomplete')
    } else {
      setFeedback('biased')
    }
  }

  const advance = () => {
    if (challengeIndex >= challenges.length - 1) {
      onComplete(winsRef.current)
      setShowSummary(true)
      return
    }
    setChallengeIndex((i) => i + 1)
    setSelected(new Set())
    setFeedback(null)
  }

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  if (showSummary) {
    const pct = Math.round((winsDisplay / challenges.length) * 100)
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 max-w-xl mx-auto border-2 shadow-xl text-center"
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7aa8d1 100%)',
          borderColor: 'rgba(255, 215, 0, 0.6)',
        }}
      >
        <h2 className="text-3xl font-black mb-2" style={{ color: '#FFD700' }}>
          {t('fairCodeBuilder.summaryTitle')}
        </h2>
        <p className="text-white text-lg font-bold mb-2">
          {t('fairCodeBuilder.summaryScore', { wins: winsDisplay, total: challenges.length })}
        </p>
        <p className="text-slate-200 mb-4">{t('fairCodeBuilder.summaryPct', { pct })}</p>
        <p className="text-amber-200 font-bold mb-4">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="inline-block primary-button">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div
      className="rounded-3xl p-4 sm:p-6 max-w-xl mx-auto border-2 shadow-xl"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderColor: 'rgba(100,200,255,0.5)',
      }}
    >
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {challenges.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
              i < challengeIndex
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : i === challengeIndex
                  ? 'bg-cyan-600 border-cyan-300 text-white animate-pulse'
                  : 'bg-slate-800 border-slate-600 text-slate-400'
            }`}
          >
            {i < challengeIndex ? '✓' : i + 1}
          </div>
        ))}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-cyan-300 text-center mb-2">
        {t(`fairCodeBuilder.${challenge.titleKey}`)}
      </h2>
      <p className="text-slate-200 text-sm mb-4 text-left bg-slate-900/50 p-3 rounded-lg border-l-4 border-cyan-500">
        {t(`fairCodeBuilder.${challenge.descKey}`)}
      </p>
      <p className="text-slate-400 text-xs text-center mb-2">{t('fairCodeBuilder.pickRules')}</p>

      <div className="flex flex-col gap-2 mb-4">
        {challenge.allRules.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => toggleRule(r.id)}
            className={`text-left rounded-lg px-3 py-2 text-sm font-semibold border-2 transition-all ${
              selected.has(r.id)
                ? 'bg-emerald-800/80 border-emerald-400 text-white'
                : 'bg-slate-800/80 border-slate-600 text-slate-200 hover:border-cyan-500/50'
            }`}
          >
            {t(`fairCodeBuilder.${r.labelKey}`)}
          </button>
        ))}
      </div>

      {feedback && (
        <div
          className={`rounded-xl p-4 mb-4 text-left text-sm ${
            feedback === 'fair'
              ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-100'
              : feedback === 'incomplete'
                ? 'bg-amber-950/80 border border-amber-500 text-amber-100'
                : 'bg-red-950/80 border border-red-500 text-red-100'
          }`}
        >
          <p className="font-bold mb-1">{t(`fairCodeBuilder.feedback.${feedback}.title`)}</p>
          <p className="mb-2">{t(`fairCodeBuilder.feedback.${feedback}.body`)}</p>
          <p className="text-slate-300">{t(`fairCodeBuilder.${challenge.lessonKey}`)}</p>
        </div>
      )}

      {!feedback && (
        <button type="button" className="w-full primary-button mb-2" disabled={selected.size === 0} onClick={analyze}>
          {t('fairCodeBuilder.checkRules')}
        </button>
      )}

      {feedback && (
        <button type="button" className="w-full primary-button" onClick={advance}>
          {challengeIndex >= challenges.length - 1 ? t('fairCodeBuilder.seeResults') : t('fairCodeBuilder.nextChallenge')}
        </button>
      )}
    </div>
  )
}

export default FairCodeBuilderQuiz
