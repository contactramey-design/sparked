import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const SCENARIO_IDS = [1, 2, 3, 4, 5, 6] as const
const TOTAL = SCENARIO_IDS.length

export interface FairCodeAdventureQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const FairCodeAdventureQuiz: React.FC<FairCodeAdventureQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const scenarios = useMemo(
    () =>
      SCENARIO_IDS.map((id) => ({
        id,
        situation: t(`aiCodingGames.fairCode.s${id}.situation`),
        fairChoice: t(`aiCodingGames.fairCode.s${id}.fairChoice`),
        unfairChoice: t(`aiCodingGames.fairCode.s${id}.unfairChoice`),
        explanation: t(`aiCodingGames.fairCode.s${id}.explanation`),
      })),
    [t],
  )

  const [step, setStep] = useState<'welcome' | 'game' | 'complete'>('welcome')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [feedback, setFeedback] = useState<{ isFair: boolean; text: string } | null>(null)
  const [sparkiEmotion, setSparkiEmotion] = useState('🤖')

  const scenario = step === 'game' && currentIndex < TOTAL ? scenarios[currentIndex] : null

  const handleStart = () => setStep('game')

  const handleChoice = (isFair: boolean) => {
    if (!scenario) return
    if (isFair) {
      setFeedback({ isFair: true, text: t('aiCodingGames.fairCode.feedbackFair', { explanation: scenario.explanation }) })
      setSparkiEmotion('🤩')
    } else {
      setFeedback({ isFair: false, text: t('aiCodingGames.fairCode.feedbackUnfair', { explanation: scenario.explanation }) })
      setSparkiEmotion('🤔')
    }
    setTimeout(() => {
      setFeedback(null)
      setSparkiEmotion('🤖')
      if (currentIndex + 1 >= TOTAL) {
        onComplete(TOTAL) // unit complete after all 6 scenarios
        setStep('complete')
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 2500)
  }

  const playAgain = () => {
    setStep('welcome')
    setCurrentIndex(0)
    setFeedback(null)
    setSparkiEmotion('🤖')
  }

  const wrapperStyle = {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7aa8d1 100%)',
    borderColor: 'rgba(255, 215, 0, 0.7)',
  }

  if (step === 'welcome') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={wrapperStyle}
      >
        <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#FFD700', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>
          {t('aiCodingGames.fairCode.title')}
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFD700' }}>
          {t('aiCodingGames.fairCode.subtitle')}
        </p>
        <div className="mb-8 p-6 rounded-xl text-left" style={{ background: 'rgba(255,215,0,0.15)', border: '3px solid #FFD700' }}>
          <p className="text-base sm:text-lg font-semibold mb-4 text-white">
            {t('aiCodingGames.fairCode.welcomeBody')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 text-xl sm:text-2xl font-black text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FF8A3D, #FFD700)' }}
        >
          {t('aiCodingGames.fairCode.startAdventure')}
        </button>
      </div>
    )
  }

  if (step === 'game' && scenario) {
    const progressPercent = (currentIndex / TOTAL) * 100
    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-3xl mx-auto border-2 shadow-xl"
        style={wrapperStyle}
      >
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl my-4" aria-hidden>
            {sparkiEmotion}
          </div>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#FFD700' }}>
            {t('aiCodingGames.fairCode.whatWouldYouDo')}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-lg font-bold mb-2" style={{ color: '#FFD700' }}>
            {t('aiCodingGames.fairCode.progress', { current: currentIndex, total: TOTAL })}
          </p>
          <div
            className="rounded-xl h-6 overflow-hidden border-2 border-slate-600"
            style={{ background: '#ddd' }}
          >
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FF8A3D, #FFD700)',
              }}
            />
          </div>
        </div>

        <div
          className="mb-6 p-6 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
            border: '3px solid #2196F3',
          }}
        >
          <p className="text-lg sm:text-xl font-bold leading-relaxed" style={{ color: '#1565C0' }}>
            {scenario.situation}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <button
            type="button"
            onClick={() => handleChoice(true)}
            disabled={!!feedback}
            className="p-6 rounded-2xl font-bold text-lg text-center transition-all hover:scale-105 active:scale-95 disabled:opacity-80 flex flex-col items-center justify-center gap-2 min-h-[120px] border-3 border-white"
            style={{
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
            }}
          >
            <span className="text-4xl">✅</span>
            <span>{scenario.fairChoice}</span>
          </button>
          <button
            type="button"
            onClick={() => handleChoice(false)}
            disabled={!!feedback}
            className="p-6 rounded-2xl font-bold text-lg text-center transition-all hover:scale-105 active:scale-95 disabled:opacity-80 flex flex-col items-center justify-center gap-2 min-h-[120px] border-3 border-white"
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FF5252)',
              color: 'white',
            }}
          >
            <span className="text-4xl">❌</span>
            <span>{scenario.unfairChoice}</span>
          </button>
        </div>

        {feedback && (
          <div
            className="text-center p-6 rounded-xl font-bold text-lg mb-6 border-2"
            style={{
              background: feedback.isFair ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 107, 107, 0.2)',
              borderColor: feedback.isFair ? '#4CAF50' : '#FF6B6B',
              color: feedback.isFair ? '#2E7D32' : '#C62828',
            }}
          >
            {feedback.text}
          </div>
        )}
      </div>
    )
  }

  if (step === 'complete') {
    const displaySparkles = earnedSparkles ?? unit.sparklesReward
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={wrapperStyle}
      >
        <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: '#FFD700' }}>
          {t('aiCodingGames.fairCode.completeTitle')}
        </h2>
        <div className="text-5xl sm:text-6xl my-6" aria-hidden style={{ textShadow: '0 3px 0 rgba(0,0,0,0.3)' }}>
          🏆🧠✨
        </div>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFA500' }}>
          {t('aiCodingGames.fairCode.completeBody')}
        </p>
        <div className="mb-6 p-6 rounded-xl text-left" style={{ background: 'rgba(255,215,0,0.15)', border: '3px solid #FFD700' }}>
          <p className="font-semibold mb-2 text-white">{t('aiCodingGames.common.sparkiSays')}</p>
          <p className="text-sm sm:text-base" style={{ color: '#FFD700' }}>
            {t('aiCodingGames.fairCode.sparkiComplete')}
          </p>
        </div>
        <p className="text-lg font-bold text-amber-200 mb-6">
          {t('aiCodingGames.common.youEarnedSparkles', { count: displaySparkles })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={playAgain}
            className="px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
          >
            {t('aiCodingGames.common.playAgain')}
          </button>
          {mastered && nextUnit && (
            <Link
              to={`/unit/${nextUnit.id}`}
              className="inline-block px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              {t('aiCodingGames.common.goToNextUnit', { title: nextUnit.title })}
            </Link>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default FairCodeAdventureQuiz
