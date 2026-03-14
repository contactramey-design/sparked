import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const FORTNITE_CHALLENGES: { text: string; correct: boolean }[] = [
  { text: "Mute voice chat if it's mean", correct: true },
  { text: 'Block rude players', correct: true },
  { text: 'Set kind rules for talking', correct: true },
  { text: 'Talk to strangers', correct: false },
  { text: 'Share personal info in chat', correct: false },
  { text: 'Report bad behavior', correct: true },
]

export interface FortniteSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const FortniteSafetyQuiz: React.FC<FortniteSafetyQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const totalChallenges = FORTNITE_CHALLENGES.length
  const challenge = step === 'quiz' ? FORTNITE_CHALLENGES[currentChallenge] : null

  const handleStart = () => setStep('quiz')

  const handleDecision = (isYes: boolean) => {
    if (answered || !challenge) return
    setAnswered(true)
    const correct = isYes === challenge.correct
    if (correct) setScore((s) => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setCurrentChallenge((c) => c + 1)
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
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
          borderColor: 'rgba(100, 200, 255, 0.4)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,255,200,0.3) 25%, rgba(0,255,200,0.3) 26%, transparent 27%), linear-gradient(90deg, transparent 24%, rgba(0,255,200,0.3) 25%, rgba(0,255,200,0.3) 26%, transparent 27%)', backgroundSize: '50px 50px' }} />
        <h2 className="text-3xl sm:text-4xl font-black mb-2 relative" style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(100,200,255,0.3)', textTransform: 'uppercase', letterSpacing: '2px' }}>
          🎮 Sparki&apos;s Fortnite Safety Quest
        </h2>
        <p className="text-lg sm:text-xl font-bold mb-4 relative" style={{ color: '#64C8FF' }}>
          Navigate the Safe Path!
        </p>
        <div className="my-6 flex justify-center relative">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black mb-1 relative" style={{ color: '#FFD700' }}>
          Hi! I&apos;m Sparki 💚
        </p>
        <p className="text-base sm:text-lg font-bold mb-6 max-w-md mx-auto relative" style={{ color: '#64C8FF' }}>
          Follow the safe path by making smart choices! Answer YES or NO at each fork. Let&apos;s stay safe in Fortnite!
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="relative px-10 py-4 rounded-lg text-black text-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: '#FFD700', border: '3px solid #CC9900', boxShadow: '0 6px 0 rgba(0,0,0,0.4), 0 0 20px rgba(255,215,0,0.6)' }}
        >
          🚀 Start Quest!
        </button>
      </div>
    )
  }

  if (step === 'quiz' && challenge) {
    const progressPercent = (currentChallenge / totalChallenges) * 100
    const showFeedback = feedback !== null
    const isLast = currentChallenge === totalChallenges - 1

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
          borderColor: 'rgba(100, 200, 255, 0.4)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black uppercase" style={{ color: '#FFD700' }}>Question {currentChallenge + 1} of {totalChallenges}</span>
            <span className="text-base font-black uppercase" style={{ color: '#64C8FF' }}>✅ {score} correct</span>
          </div>
          <div className="w-full h-6 rounded-sm overflow-hidden shadow-inner bg-black/30 border-2" style={{ borderColor: '#FFD700' }}>
            <div
              className="h-full rounded-sm transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FFD700, #64C8FF)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 flex-shrink-0 text-3xl" style={{ background: 'linear-gradient(135deg, #a78bfa, #9333ea)', borderColor: '#6366f1' }}>
            🤖
          </div>
          <div className="bg-white/90 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex-1 border-2 border-indigo-200">
            <p className="font-bold text-base text-indigo-700">
              {showFeedback
                ? feedback === 'correct'
                  ? 'Perfect choice! Stay safe! 🎮✨'
                  : "Let's find the safe choice! 💙"
                : 'Choose wisely at this fork! 🎮'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-indigo-300 mb-8 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-indigo-800 leading-relaxed mb-2">
            {challenge.text}
          </p>
          <p className="text-lg text-indigo-600 font-semibold">What&apos;s the safe choice?</p>
        </div>

        {!showFeedback ? (
          <div className="flex gap-4 sm:gap-6 justify-center my-8 flex-wrap">
            <button
              type="button"
              onClick={() => handleDecision(true)}
              className="px-8 sm:px-12 py-5 rounded-lg text-lg sm:text-2xl font-bold border-3 shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-transform uppercase tracking-wide"
              style={{ background: '#00FF00', color: '#000', borderColor: '#00BB00', boxShadow: '0 6px 0 rgba(0,0,0,0.3)' }}
            >
              ✅ YES
            </button>
            <button
              type="button"
              onClick={() => handleDecision(false)}
              className="px-8 sm:px-12 py-5 rounded-lg text-lg sm:text-2xl font-bold border-3 shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-transform uppercase tracking-wide text-white"
              style={{ background: '#FF3333', borderColor: '#BB0000', boxShadow: '0 6px 0 rgba(0,0,0,0.3)' }}
            >
              ❌ NO
            </button>
          </div>
        ) : (
          <>
            <div
              className={`rounded-3xl p-6 text-center shadow-xl border-4 mb-4 ${
                feedback === 'correct'
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="text-6xl mb-2">
                {feedback === 'correct' ? '✅🎉' : '❌'}
              </div>
              <p className={`text-2xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback === 'correct' ? 'Great choice!' : "Let's choose safe!"}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? 'Sparki says: "Safe path forward!" 🤖💜'
                  : 'Sparki says: "Safety in Fortnite matters!" 🤖💜'}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #6366f1, #9333ea)' }}
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
    const sparkleEmojis = ['✨', '🎮', '🌟', '💜', '🎉', '✨', '⭐', '🌟', '⚡', '💫']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)',
          borderColor: 'rgba(100, 200, 255, 0.4)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          🎉 Fortnite Safety Hero! 🎉
        </h2>
        <p className="text-2xl font-bold mb-6 text-indigo-300">
          You made {correctCount} out of {totalChallenges} safe choices! 🎮💜
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-white font-bold text-sm mt-6">🎮 Safety</span>
            <span className="text-white font-bold text-sm">Fortnite Hero</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((e, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-indigo-200 mb-2">
          You earned <strong>{displaySparkles}</strong> sparkles!
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-md border-2 text-3xl" style={{ background: 'linear-gradient(135deg, #a78bfa, #9333ea)', borderColor: '#6366f1' }}>
            🤖
          </div>
          <div className="bg-white/90 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-indigo-200 text-left max-w-xs">
            <p className="font-bold text-indigo-700">
              You completed the quest! Stay safe in Fortnite! 💜🎮
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #6366f1, #9333ea)' }}
          >
            Go to {nextUnit.title} →
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default FortniteSafetyQuiz
