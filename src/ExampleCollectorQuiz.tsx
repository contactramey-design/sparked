import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const ITEM_SET: { emoji: string; category: 0 | 1 }[] = [
  { emoji: '🐱', category: 0 },
  { emoji: '🐈', category: 0 },
  { emoji: '😺', category: 0 },
  { emoji: '😻', category: 0 },
  { emoji: '🐆', category: 0 },
  { emoji: '🐶', category: 1 },
  { emoji: '🐕', category: 1 },
  { emoji: '🐩', category: 1 },
  { emoji: '🐕‍🦺', category: 1 },
  { emoji: '🦮', category: 1 },
]

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export interface ExampleCollectorQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const ExampleCollectorQuiz: React.FC<ExampleCollectorQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t } = useTranslation()
  const category1 = t('aiCodingGames.exampleCollector.categoryCat')
  const category2 = t('aiCodingGames.exampleCollector.categoryDog')
  const [step, setStep] = useState<'welcome' | 'game' | 'complete'>('welcome')
  const [items, setItems] = useState(() => shuffle(ITEM_SET))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const playAgain = () => {
    setItems(shuffle(ITEM_SET))
    setStep('welcome')
    setCurrentIndex(0)
    setCorrectCount(0)
    setFeedback(null)
    setShowFeedback(false)
  }

  const totalItems = items.length
  const item = step === 'game' ? items[currentIndex] : null

  const handleStart = () => setStep('game')

  const handleSort = (isCategory1: boolean) => {
    if (!item || showFeedback) return
    const correct = (isCategory1 && item.category === 0) || (!isCategory1 && item.category === 1)
    if (correct) setCorrectCount((c) => c + 1)
    setFeedback(correct ? 'correct' : 'wrong')
    setShowFeedback(true)

    setTimeout(() => {
      setShowFeedback(false)
      setFeedback(null)
      setCurrentIndex((i) => i + 1)
    }, 800)
  }

  // When currentIndex advances past last item, show completion
  React.useEffect(() => {
    if (step === 'game' && currentIndex >= totalItems) {
      onComplete(correctCount)
      setStep('complete')
    }
  }, [step, currentIndex, totalItems, correctCount, onComplete])

  if (step === 'welcome') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 100%)',
          borderColor: 'rgba(255, 69, 0, 0.6)',
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#FF4500' }}>
          {t('aiCodingGames.exampleCollector.title')}
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FF6D3D' }}>
          {t('aiCodingGames.exampleCollector.subtitle')}
        </p>
        <div className="mb-8 p-6 rounded-xl text-left" style={{ background: 'rgba(255,69,0,0.1)', border: '3px solid #FF4500' }}>
          <p className="text-base sm:text-lg font-semibold mb-2 text-white">
            {t('aiCodingGames.exampleCollector.intro')}
          </p>
          <p className="text-sm sm:text-base" style={{ color: '#FF6D3D' }}>
            {t('aiCodingGames.exampleCollector.pilesLinePrefix')}
            <strong>{category1}</strong>
            {t('aiCodingGames.exampleCollector.pilesLineMid')}
            <strong>{category2}</strong>
            {t('aiCodingGames.exampleCollector.pilesLineSuffix')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 text-xl sm:text-2xl font-black text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
        >
          {t('aiCodingGames.exampleCollector.startGame')}
        </button>
      </div>
    )
  }

  if (step === 'game' && item) {
    const progressPercent = (currentIndex / totalItems) * 100

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-2xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 100%)',
          borderColor: 'rgba(255, 69, 0, 0.6)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-bold" style={{ color: '#FF4500' }}>
              Item {currentIndex + 1} of {totalItems}
            </span>
            <span className="font-bold" style={{ color: '#32CD32' }}>
              ✅ {correctCount}/{totalItems}
            </span>
          </div>
          <div className="h-4 rounded-lg overflow-hidden bg-white/20 border-2 border-orange-500">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FF4500, #FF6D3D)',
              }}
            />
          </div>
        </div>

        <div
          className="text-center mb-8 p-6 rounded-lg"
          style={{ background: 'rgba(255,69,0,0.15)', border: '3px solid #FF4500' }}
        >
          <p className="text-sm font-bold mb-3" style={{ color: '#FF6D3D' }}>
            {t('aiCodingGames.exampleCollector.whichCategory')}
          </p>
          <div className="text-6xl sm:text-7xl mb-6" aria-hidden>
            {item.emoji}
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => handleSort(true)}
              disabled={showFeedback}
              className="px-6 py-3 font-bold text-lg rounded-lg text-white border-2 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #4A5FC1, #5BA3F5)', borderColor: '#2E5CB8' }}
            >
              {category1} ➡️
            </button>
            <button
              type="button"
              onClick={() => handleSort(false)}
              disabled={showFeedback}
              className="px-6 py-3 font-bold text-lg rounded-lg text-white border-2 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #D946A6, #E86FD8)', borderColor: '#B8167E' }}
            >
              {category2} ➡️
            </button>
          </div>
        </div>

        {showFeedback && feedback && (
          <div
            className="text-center p-4 rounded-lg font-bold text-lg border-2"
            style={{
              borderColor: feedback === 'correct' ? '#32CD32' : '#FF69B4',
              color: feedback === 'correct' ? '#32CD32' : '#FF69B4',
            }}
          >
            {feedback === 'correct'
              ? t('aiCodingGames.exampleCollector.feedbackCorrect')
              : t('aiCodingGames.exampleCollector.feedbackWrong')}
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
        style={{
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 100%)',
          borderColor: 'rgba(255, 69, 0, 0.6)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: '#FF4500' }}>
          {t('aiCodingGames.exampleCollector.completeTitle')}
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FF6D3D' }}>
          {t('aiCodingGames.exampleCollector.completeBody', { correct: correctCount, total: totalItems })}
        </p>
        <div className="mb-6 p-6 rounded-xl text-left" style={{ background: 'rgba(255,69,0,0.15)', border: '3px solid #FF4500' }}>
          <p className="font-semibold mb-2 text-white">{t('aiCodingGames.common.sparkiSays')}</p>
          <p className="text-sm sm:text-base" style={{ color: '#FF6D3D' }}>
            {t('aiCodingGames.exampleCollector.sparkiComplete')}
          </p>
        </div>
        <p className="text-lg font-bold text-orange-200 mb-6">
          {t('aiCodingGames.common.youEarnedSparkles', { count: displaySparkles })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={playAgain}
            className="px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
          >
            {t('aiCodingGames.common.playAgain')}
          </button>
          {mastered && nextUnit && (
            <Link
              to={`/unit/${nextUnit.id}`}
              className="inline-block px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
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

export default ExampleCollectorQuiz
