import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const SAFE_APP_QUESTIONS: { text: string; answer: boolean; icon: string }[] = [
  { text: 'YouTube Kids has filters for safe videos', answer: true, icon: '🎬' },
  { text: 'I can watch anything online', answer: false, icon: '🌐' },
  { text: 'Safe apps have grown-up approval', answer: true, icon: '👨‍👩‍👧' },
  { text: 'Ads are always safe', answer: false, icon: '📢' },
  { text: 'Kind videos make me happy', answer: true, icon: '😊' },
  { text: 'Yucky videos are okay', answer: false, icon: '🙈' },
  { text: 'Ask a grown-up before opening new apps', answer: true, icon: '🙋' },
  { text: 'Share personal info in games', answer: false, icon: '🔒' },
]

export interface SafeAppAdventureQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const SafeAppAdventureQuiz: React.FC<SafeAppAdventureQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const totalQuestions = SAFE_APP_QUESTIONS.length
  const q = step === 'quiz' ? SAFE_APP_QUESTIONS[currentQ] : null

  const handleStart = () => setStep('quiz')

  const handleAnswer = (userAnswer: boolean) => {
    if (answered || !q) return
    setAnswered(true)
    const correct = userAnswer === q.answer
    if (correct) setScore((s) => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setCurrentQ((c) => c + 1)
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
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-blue-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 40%, #ede9fe 70%, #dbeafe 100%)',
        }}
      >
        <div className="text-5xl sm:text-6xl mb-3">📱</div>
        <h2
          className="text-2xl sm:text-3xl font-extrabold mb-4 bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(135deg, #2563eb, #7c3aed, #ec4899)',
            WebkitBackgroundClip: 'text',
          }}
        >
          Sparki&apos;s Safe App Adventure
        </h2>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-blue-800 font-semibold text-lg mb-1">
          Hi there! I&apos;m <span className="text-pink-500 font-bold">Sparki</span> 💙
        </p>
        <p className="text-blue-700 text-base mb-6 max-w-md mx-auto">
          Let&apos;s learn about staying safe with apps! Tap <strong>TRUE</strong> or <strong>FALSE</strong> for each question.
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-8 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}
        >
          🚀 Let&apos;s Go!
        </button>
      </div>
    )
  }

  if (step === 'quiz' && q) {
    const progressPercent = (currentQ / totalQuestions) * 100
    const showFeedback = feedback !== null
    const isLast = currentQ === totalQuestions - 1

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 border-blue-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 30%, #ede9fe 60%, #dbeafe 100%)',
        }}
      >
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-bold text-blue-700">Question {currentQ + 1} of {totalQuestions}</span>
            <span className="text-sm font-bold text-pink-600">⭐ {score}</span>
          </div>
          <div className="w-full h-4 rounded-full bg-white/70 overflow-hidden shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 flex-shrink-0 text-2xl">
            🤖
          </div>
          <div className="bg-white/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md flex-1">
            <p className="text-blue-800 font-semibold text-sm">
              {showFeedback
                ? feedback === 'correct'
                  ? "That's right! You're amazing! 🎉💙"
                  : `The answer was ${q.answer ? 'TRUE ✅' : 'FALSE ❌'}. Let's choose safe! 💙`
                : 'Is this TRUE or FALSE? Think carefully! 🤔'}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-blue-100 mb-5 bg-white/95"
        >
          <div className="text-center text-4xl mb-3">{q.icon}</div>
          <p className="text-center text-xl sm:text-2xl font-bold text-blue-900 leading-relaxed">
            &ldquo;{q.text}&rdquo;
          </p>
        </div>

        {!showFeedback ? (
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
            >
              ✅ TRUE
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
            >
              ❌ FALSE
            </button>
          </div>
        ) : (
          <>
            <div
              className={`rounded-3xl p-6 text-center shadow-xl border-2 mb-4 ${
                feedback === 'correct'
                  ? 'bg-green-100 border-green-400'
                  : 'bg-red-50 border-red-400'
              }`}
            >
              <div className="text-5xl mb-2">
                {feedback === 'correct' ? '✅👍' : '❌'}
              </div>
              {feedback === 'correct' && <div className="text-2xl mb-2">✨🌟💫⭐✨</div>}
              <p className={`text-xl font-bold ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback === 'correct' ? 'Yay! Safe choice!' : 'Oops! Try to remember this one!'}
              </p>
              <p className={`text-base font-semibold mt-1 ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct' ? 'Sparki says: "You\'re so smart!" 🤖💙' : 'Sparki says: "Let\'s choose safe!" 🤖'}
              </p>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
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

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-amber-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 40%, #fef3c7 70%, #dbeafe 100%)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-3">🎉 Amazing Job! 🎉</h2>
        <p className="text-xl text-blue-700 font-bold mb-4">
          You got {correctCount} out of {totalQuestions} correct! ⭐
        </p>

        <div className="mb-5 flex justify-center">
          <div
            className="w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 border-amber-500 shadow-xl bg-gradient-to-br from-amber-100 to-amber-200"
            style={{ animation: 'badgeSpin 0.8s ease-out forwards' }}
          >
            <span className="text-4xl mb-0">🛡️</span>
            <span className="text-sm font-bold text-amber-900">Safe App</span>
            <span className="text-sm font-bold text-amber-900">Explorer</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4 text-3xl">
          {['✨', '🌟', '💫', '⭐', '🎇', '✨', '🌟', '💫', '⭐', '🎇'].map((emoji, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.08}s` }}>
              {emoji}
            </span>
          ))}
        </div>
        <p className="text-lg font-bold text-amber-800 mb-2">
          You earned <strong>{displaySparkles}</strong> sparkles!
        </p>

        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 text-2xl">
            🤖
          </div>
          <div className="bg-white/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md text-left max-w-xs">
            <p className="text-blue-800 font-semibold text-sm">
              You&apos;re a <span className="text-pink-500">Safe App Explorer</span> now! I&apos;m so proud of you! 💙✨
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            Go to {nextUnit.title} →
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default SafeAppAdventureQuiz
