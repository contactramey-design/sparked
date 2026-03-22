import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

/** Per round: label count + which indices are “software” (multi-select). */
const ROUNDS: { emoji: string; nameKey: string; labelCount: number; softwareIdx: number[] }[] = [
  { emoji: '🧮', nameKey: 'a1', labelCount: 3, softwareIdx: [0, 1] },
  { emoji: '🎵', nameKey: 'a2', labelCount: 3, softwareIdx: [0, 1] },
  { emoji: '🗺️', nameKey: 'a3', labelCount: 3, softwareIdx: [0, 2] },
  { emoji: '🎮', nameKey: 'a4', labelCount: 4, softwareIdx: [0, 1, 2] },
  { emoji: '✉️', nameKey: 'a5', labelCount: 3, softwareIdx: [0] },
]

export interface CrewSoftwareDetectiveQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false
  for (const x of a) if (!b.has(x)) return false
  return true
}

const CrewSoftwareDetectiveQuiz: React.FC<CrewSoftwareDetectiveQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const [roundIdx, setRoundIdx] = useState(0)
  const [selected, setSelected] = useState<Set<number>>(() => new Set())
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const round = ROUNDS[roundIdx]!
  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  const expected = useMemo(() => new Set(round.softwareIdx), [round])

  const toggle = (i: number) => {
    setMsg(null)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const check = () => {
    if (done) return
    if (setsEqual(selected, expected)) {
      playBeep(1100, 0.2)
      const nextScore = correctCount + 1
      setCorrectCount(nextScore)
      setMsg(null)
      speakPdfLine(t('crewSoftwareDetective.correctSpeech'), 0.85, 1.05)
      if (roundIdx + 1 >= ROUNDS.length) {
        setDone(true)
        onComplete(nextScore)
        playBeep(1500, 0.4)
        speakPdfLine(t('crewSoftwareDetective.winSpeech'), 0.85, 1.1)
      } else {
        setRoundIdx((i) => i + 1)
        setSelected(new Set())
      }
    } else {
      playBeep(400, 0.2)
      setMsg(t('crewSoftwareDetective.tryAgain'))
      speakPdfLine(t('crewSoftwareDetective.tryAgain'), 0.85, 1)
    }
  }

  if (done) {
    return (
      <div
        className="rounded-3xl border-4 border-sky-300/80 p-8 text-center shadow-2xl"
        style={{ background: 'linear-gradient(145deg, #1e3a5f 0%, #0c4a6e 50%, #0f172a 100%)' }}
      >
        <h2 className="text-3xl font-black text-sky-100 md:text-4xl">{t('crewSoftwareDetective.winTitle')}</h2>
        <p className="mt-3 text-lg text-sky-50">{t('crewSoftwareDetective.winBody', { score: correctCount, total: ROUNDS.length })}</p>
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
      className="rounded-3xl border-4 border-sky-400/50 p-6 shadow-2xl md:p-8"
      style={{ background: 'linear-gradient(145deg, #1e3a5f 0%, #0c4a6e 50%, #0f172a 100%)' }}
    >
      <h2 className="text-center text-2xl font-black text-white md:text-3xl">{t('crewSoftwareDetective.title')}</h2>
      <p className="mt-2 text-center text-sky-100">{t('crewSoftwareDetective.instruction')}</p>
      <p className="mt-1 text-center text-sm font-bold text-amber-200">
        {t('crewSoftwareDetective.progress', { current: roundIdx + 1, total: ROUNDS.length })}
      </p>

      <div className="mx-auto mt-6 flex max-w-lg flex-col items-center rounded-2xl border-2 border-sky-400/40 bg-slate-950/40 p-6">
        <span className="text-7xl">{round.emoji}</span>
        <p className="mt-2 text-2xl font-bold text-white">{t(`crewSoftwareDetective.${round.nameKey}_name`)}</p>
        <div className="mt-4 flex w-full flex-col gap-2">
          {Array.from({ length: round.labelCount }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${
                selected.has(i) ? 'border-amber-300 bg-amber-500/25 text-white' : 'border-white/25 bg-white/5 text-sky-100'
              }`}
              onClick={() => toggle(i)}
            >
              {t(`crewSoftwareDetective.${round.nameKey}_l${i}`)}
            </button>
          ))}
        </div>
      </div>

      {msg && <p className="mt-4 text-center font-bold text-rose-300">{msg}</p>}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="rounded-full bg-sky-400 px-10 py-3 text-lg font-black text-slate-900 shadow-lg"
          onClick={check}
        >
          {t('crewSoftwareDetective.check')}
        </button>
      </div>
    </div>
  )
}

export default CrewSoftwareDetectiveQuiz
