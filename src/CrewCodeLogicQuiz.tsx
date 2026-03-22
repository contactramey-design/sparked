import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

const LEVELS = [1, 2, 3, 4] as const
/** Index of correct MC option (0-based) per level. */
const CORRECT_INDEX: Record<number, number> = {
  1: 0,
  2: 0,
  3: 1,
  4: 0,
}

export interface CrewCodeLogicQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const CrewCodeLogicQuiz: React.FC<CrewCodeLogicQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [levelIdx, setLevelIdx] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const level = LEVELS[levelIdx]!
  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const options = [0, 1, 2].map((i) => t(`crewCodeLogic.l${level}_o${i + 1}`))

  const check = () => {
    if (picked === null || done) return
    const ok = picked === CORRECT_INDEX[level]
    if (ok) {
      playBeep(1050, 0.2)
      const next = correctCount + 1
      setCorrectCount(next)
      setMsg(null)
      speakPdfLine(t('crewCodeLogic.correctSpeech'), 0.85, 1.05)
      if (levelIdx + 1 >= LEVELS.length) {
        setDone(true)
        onComplete(next)
        playBeep(1500, 0.4)
        speakPdfLine(t('crewCodeLogic.winSpeech'), 0.85, 1.1)
      } else {
        setLevelIdx((i) => i + 1)
        setPicked(null)
      }
    } else {
      playBeep(400, 0.2)
      setMsg(t('crewCodeLogic.tryAgain'))
      speakPdfLine(t('crewCodeLogic.tryAgain'), 0.85, 1)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-3xl border-4 border-white/90 p-8 text-center shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #14532d 0%, #166534 50%, #0f172a 100%)' }}
      >
        <h2 className="text-3xl font-black text-emerald-100 md:text-4xl">{t('crewCodeLogic.winTitle')}</h2>
        <p className="mt-3 text-lg text-emerald-50">{t('crewCodeLogic.winBody', { score: correctCount, total: LEVELS.length })}</p>
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
      className="rounded-3xl border-4 border-emerald-500/40 p-6 shadow-2xl md:p-8"
      style={{ background: 'linear-gradient(145deg, #14532d 0%, #166534 50%, #0f172a 100%)' }}
    >
      <h2 className="text-center text-2xl font-black text-white md:text-3xl">{t('crewCodeLogic.title')}</h2>
      <p className="mt-2 text-center text-emerald-100">{t('crewCodeLogic.levelOf', { n: levelIdx + 1 })}</p>

      <div className="mx-auto mt-6 max-w-xl rounded-2xl border-2 border-emerald-400/40 bg-slate-950/50 p-5 font-mono text-base text-emerald-50 md:text-lg">
        {t(`crewCodeLogic.l${level}_code`)}
      </div>
      <p className="mx-auto mt-4 max-w-xl text-center text-lg font-semibold text-white">{t(`crewCodeLogic.l${level}_prompt`)}</p>

      <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3">
        {options.map((label, i) => (
          <button
            key={i}
            type="button"
            className={`rounded-xl border-2 px-4 py-3 text-left font-bold transition ${
              picked === i ? 'border-amber-300 bg-amber-500/30 text-white' : 'border-white/30 bg-white/10 text-emerald-50'
            }`}
            onClick={() => setPicked(i)}
          >
            {label}
          </button>
        ))}
      </div>

      {msg && <p className="mt-4 text-center font-bold text-rose-300">{msg}</p>}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          disabled={picked === null}
          className="rounded-full bg-amber-400 px-10 py-3 text-lg font-black text-slate-900 shadow-lg disabled:opacity-50"
          onClick={check}
        >
          {t('crewCodeLogic.check')}
        </button>
      </div>
    </div>
  )
}

export default CrewCodeLogicQuiz
