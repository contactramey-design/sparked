import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const TIKTOK_PAIRS: { action: string; emoji: string }[] = [
  { action: 'Say nice things in comments', emoji: '❤️😊' },
  { action: 'Call someone mean names', emoji: '😠🚫' },
  { action: 'Turn off messages from strangers', emoji: '🔒' },
  { action: "Make fun of someone's video", emoji: '😢' },
  { action: 'Cheer someone on', emoji: '🎉🙌' },
  { action: 'Be rude in comments', emoji: '😡' },
  { action: 'Use kind words', emoji: '🌟😄' },
  { action: 'Block mean people', emoji: '🛑' },
]

const WRONG_EMOJIS = ['🎮', '🍕', '📚']

export interface TikTokSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const TikTokSafetyQuiz: React.FC<TikTokSafetyQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentPair, setCurrentPair] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const totalPairs = TIKTOK_PAIRS.length
  const pair = step === 'quiz' ? TIKTOK_PAIRS[currentPair] : null

  const options = useMemo(() => {
    if (!pair) return []
    const opts = [pair.emoji, ...WRONG_EMOJIS]
    return [...opts].sort(() => Math.random() - 0.5)
  }, [pair])

  const handleStart = () => setStep('quiz')

  const handleSelect = (selected: string) => {
    if (answered || !pair) return
    setAnswered(true)
    const correct = selected === pair.emoji
    if (correct) setScore((s) => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setCurrentPair((c) => c + 1)
    setAnswered(false)
    setFeedback(null)
  }

  const handleSeeResults = () => {
    onComplete(score)
    setStep('complete')
  }

  if (step === 'welcome') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-pink-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-2">
          🎵 Sparki&apos;s Kind &amp; Safe TikTok Adventure
        </h2>
        <p className="text-base sm:text-lg text-blue-700 font-semibold mb-4">
          Learn to be kind and safe on TikTok!
        </p>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-lg text-blue-800 font-bold mb-1">
          Hi! I&apos;m <span className="text-pink-600">Sparki</span> 💙
        </p>
        <p className="text-blue-700 text-base mb-6 max-w-md mx-auto font-semibold">
          Match actions to emojis! Can you find all the kind choices?
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
        >
          🚀 Let&apos;s Go!
        </button>
      </div>
    )
  }

  if (step === 'quiz' && pair) {
    const progressPercent = (currentPair / totalPairs) * 100
    const showFeedback = feedback !== null
    const isLast = currentPair === totalPairs - 1

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 border-pink-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold text-blue-800">Match {currentPair + 1} of {totalPairs}</span>
            <span className="text-base font-bold text-pink-700">💗 {score} matched</span>
          </div>
          <div className="w-full h-5 rounded-full bg-white/60 overflow-hidden shadow-inner border-2 border-pink-300">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #ec4899, #25f4ee)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 flex-shrink-0 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex-1 border-2 border-pink-200">
            <p className="text-blue-900 font-bold text-base">
              {showFeedback
                ? feedback === 'correct'
                  ? 'Perfect match! 🎉💕'
                  : 'Try another emoji! 💙'
                : 'Match the action to its emoji! 🎵'}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl p-6 shadow-xl border-4 border-pink-300 mb-6 text-center"
          style={{ background: 'linear-gradient(to bottom right, #fef9c3, #fce7f3)' }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {pair.action}
          </p>
        </div>

        {!showFeedback ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {options.map((emoji, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(emoji)}
                className="match-card-btn rounded-2xl p-4 shadow-lg border-4 border-blue-300 font-bold text-5xl hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(to bottom right, #dbeafe, #fce7f3)' }}
              >
                {emoji}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div
              className={`rounded-3xl p-6 text-center shadow-xl border-4 mb-4 ${
                feedback === 'correct'
                  ? 'bg-green-100 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}
            >
              <div className="text-6xl mb-2">
                {feedback === 'correct' ? '✅💚' : '❌'}
              </div>
              <p className={`text-2xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback === 'correct' ? 'Kind words make TikTok fun!' : "Let's try kind!"}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? 'Sparki says: "You\'re so kind!" 🤖💗'
                  : 'Sparki says: "Always be safe and kind!" 🤖'}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #ec4899)' }}
              >
                {isLast ? '🏆 See Results!' : 'Next ➡️'}
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  if (step === 'complete') {
    const correctCount = score
    const displaySparkles = earnedSparkles ?? unit.sparklesReward
    const sparkleEmojis = ['✨', '💗', '🌟', '🎵', '🎉', '✨', '💛', '🌟', '⭐', '💫']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-pink-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-3">
          🎉 You&apos;re a Kind TikTok Star! 🎉
        </h2>
        <p className="text-2xl text-blue-800 font-bold mb-6">
          You matched {correctCount} out of {totalPairs} perfectly! 🎵💗
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f472b6, #ec4899)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-white font-bold text-sm mt-6">🎵 Kind</span>
            <span className="text-white font-bold text-sm">TikTok Star</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((e, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-pink-900 mb-2">
          You earned <strong>{displaySparkles}</strong> sparkles!
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-pink-200 text-left max-w-xs">
            <p className="text-blue-900 font-bold">
              Amazing! You&apos;re kind and safe on TikTok! 💙🎵
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
          >
            Go to {nextUnit.title} →
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default TikTokSafetyQuiz
