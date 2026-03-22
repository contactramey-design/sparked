import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { playBeep, speakPdfLine } from './utils/pdfGameFx'

/** Sparki Tots — Game 2: Clap & Hop (PDF). 5 rounds; tap CLAP each round. */
const MAX_ROUNDS = 5

export interface ClapHopQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (correctCount: number) => void
}

const ClapHopQuiz: React.FC<ClapHopQuizProps> = ({ unit, nextUnit, earnedSparkles, mastered, onComplete }) => {
  const { t } = useTranslation()
  const [round, setRound] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'clap' | 'hop' | 'won'>('idle')
  const [busy, setBusy] = useState(false)
  const [won, setWon] = useState(false)

  const runRound = useCallback(() => {
    if (busy || won) return
    setBusy(true)
    setPhase('clap')
    playBeep(900, 0.15)
    speakPdfLine(t('clapHop.speakYay'), 0.7, 1.1)
    window.setTimeout(() => {
      setPhase('hop')
      speakPdfLine(t('clapHop.speakHop'), 0.7, 1.1)
      window.setTimeout(() => {
        playBeep(600, 0.12)
        setRound((r) => {
          const next = r + 1
          if (next >= MAX_ROUNDS) {
            window.setTimeout(() => {
              setPhase('won')
              setWon(true)
              onComplete(MAX_ROUNDS)
              playBeep(1500, 0.45)
              speakPdfLine(t('clapHop.speakWin'), 0.75, 1.1)
            }, 0)
          } else {
            setPhase('idle')
          }
          return next
        })
        setBusy(false)
      }, 700)
    }, 650)
  }, [busy, onComplete, t, won])

  const reset = () => {
    setRound(0)
    setPhase('idle')
    setBusy(false)
    setWon(false)
    speakPdfLine(t('clapHop.speakReady'), 0.7, 1.1)
  }

  const displaySparkles = earnedSparkles ?? unit.sparklesReward

  if (won) {
    return (
      <div className="font-pdf-fredoka pdf-ai-sort-bg relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 p-8 text-center shadow-xl">
        <div className="pdf-sparki-idle mb-6 text-8xl">🎉</div>
        <h2 className="mb-4 text-5xl font-bold text-white drop-shadow-lg">{t('clapHop.youDidIt')}</h2>
        <p className="mb-6 text-2xl font-semibold text-white">{t('clapHop.winSub')}</p>
        <p className="mb-4 font-bold text-amber-100">{t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}</p>
        {mastered && nextUnit && (
          <Link to={`/unit/${nextUnit.id}`} className="primary-button mb-3 bg-white text-slate-900">
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
        <button
          type="button"
          className="rounded-full px-10 py-4 text-2xl font-bold text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)', boxShadow: '0 8px 0 rgba(0,0,0,0.2)' }}
          onClick={reset}
        >
          {t('clapHop.playAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className="font-pdf-fredoka pdf-ai-sort-bg relative flex min-h-[480px] flex-col items-center justify-center overflow-hidden rounded-3xl border-4 border-white/80 p-6 shadow-xl">
      <div className="absolute left-1/2 top-5 z-40 -translate-x-1/2 text-center">
        <p className="text-2xl font-bold text-white drop-shadow">{t('clapHop.roundOf', { current: round + 1, total: MAX_ROUNDS })}</p>
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: MAX_ROUNDS }, (_, i) => (
            <span
              key={i}
              className={`h-5 w-5 rounded-full ${i < round ? 'bg-[#FFD93D] shadow-[0_0_10px_rgba(255,217,61,0.8)]' : 'bg-white/60'}`}
            />
          ))}
        </div>
      </div>

      <div className="pdf-sparki-idle z-50 my-8">
        <div
          className={`mx-auto ${phase === 'clap' ? 'pdf-sparki-cheer-once' : phase === 'hop' ? 'pdf-sparki-hop-step' : ''}`}
          style={{ width: 140, height: 140 }}
        >
          <svg viewBox="0 0 100 100" width={140} height={140} aria-hidden>
            <circle cx="50" cy="55" r="32" fill="#FFD93D" stroke="#F4A623" strokeWidth="3" />
            <circle cx="38" cy="48" r="6" fill="#333" />
            <circle cx="62" cy="48" r="6" fill="#333" />
            <circle cx="40" cy="46" r="2" fill="#fff" />
            <circle cx="64" cy="46" r="2" fill="#fff" />
            <path d="M 35 62 Q 50 78 65 62" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="28" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
            <circle cx="72" cy="58" r="5" fill="#FFB5B5" opacity={0.6} />
            <line x1="50" y1="23" x2="50" y2="10" stroke="#F4A623" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="8" r="5" fill="#FF6B6B" />
            <path d="M 20 55 Q 8 50 5 40" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 80 55 Q 92 50 95 40" stroke="#F4A623" strokeWidth="4" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {phase !== 'hop' ? (
        <button
          type="button"
          disabled={busy}
          onClick={runRound}
          className="instruction-bubble pdf-pop-in z-30 mb-8 rounded-3xl bg-white/95 px-8 py-6 text-5xl font-bold text-[#FF6B6B] shadow-xl backdrop-blur transition-transform active:scale-95 disabled:opacity-60"
        >
          👏 {t('clapHop.clap')} 👏
        </button>
      ) : (
        <div className="instruction-bubble pdf-pop-in z-30 mb-8 rounded-3xl bg-white/95 px-8 py-6 text-5xl font-bold text-sky-500 shadow-xl backdrop-blur">
          🦘 {t('clapHop.hop')} 🦘
        </div>
      )}

      <p className="max-w-sm text-center text-sm text-white/90">{t('clapHop.hint')}</p>
    </div>
  )
}

export default ClapHopQuiz
