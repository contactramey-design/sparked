import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const TASK_PAIRS = [
  { id: 1, task: 'I need help finding a book 📚', location: 'library', emoji: '📚', locationName: 'Library' },
  { id: 2, task: 'I need help staying safe while driving 🚗', location: 'car', emoji: '🚗', locationName: 'Car' },
  { id: 3, task: 'I need help finding a good story 📖', location: 'school', emoji: '🏫', locationName: 'School' },
  { id: 4, task: 'I need help spotting sick plants 🌾', location: 'farm', emoji: '🌾', locationName: 'Farm' },
  { id: 5, task: 'I need help folding my laundry 👕', location: 'home', emoji: '🏠', locationName: 'Home' },
  { id: 6, task: 'I need help keeping people healthy 🏥', location: 'hospital', emoji: '🏥', locationName: 'Hospital' },
] as const

const ALL_LOCATIONS = [
  { id: 'library', emoji: '📚', name: 'Library' },
  { id: 'car', emoji: '🚗', name: 'Car' },
  { id: 'school', emoji: '🏫', name: 'School' },
  { id: 'farm', emoji: '🌾', name: 'Farm' },
  { id: 'home', emoji: '🏠', name: 'Home' },
  { id: 'hospital', emoji: '🏥', name: 'Hospital' },
] as const

const TOTAL = TASK_PAIRS.length

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export interface WorldAIHelperQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const WorldAIHelperQuiz: React.FC<WorldAIHelperQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'game' | 'question' | 'complete'>('welcome')
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [tasksCompleted, setTasksCompleted] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [sparkiEmotion, setSparkiEmotion] = useState('🤖')
  const [questionAnswered, setQuestionAnswered] = useState(false)
  const [questionFeedback, setQuestionFeedback] = useState<{ correct: boolean; text: string } | null>(null)

  const currentTask = step === 'game' && currentTaskIndex < TOTAL ? TASK_PAIRS[currentTaskIndex] : null
  const locationButtons = useMemo(() => shuffle([...ALL_LOCATIONS]), [currentTaskIndex])

  const handleStart = () => setStep('game')

  useEffect(() => {
    if (step === 'game' && currentTaskIndex >= TOTAL) {
      setStep('question')
    }
  }, [step, currentTaskIndex])

  const handleLocationClick = (locationId: string) => {
    if (!currentTask || showSuccess) return
    if (locationId === currentTask.location) {
      setTasksCompleted((c) => c + 1)
      setSuccessMessage(`✅ YES! AI helps with that at the ${currentTask.locationName}! 🎉`)
      setSparkiEmotion('🤩')
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSuccessMessage(null)
        setSparkiEmotion('🤖')
        setCurrentTaskIndex((i) => i + 1)
      }, 1500)
    } else {
      setSuccessMessage('❌ Hmm, not quite! Think about where AI would help with that... Try again!')
      setSparkiEmotion('🤔')
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSuccessMessage(null)
        setSparkiEmotion('🤖')
      }, 1500)
    }
  }

  const handleAnswerQuestion = (isYes: boolean) => {
    if (questionAnswered) return
    setQuestionAnswered(true)
    if (isYes) {
      setQuestionFeedback({
        correct: true,
        text: "✅ Right! AI learns from examples, so sometimes it makes mistakes. That's why we ALWAYS check with a grown-up! 🧠 You're thinking critically! 💡",
      })
      setSparkiEmotion('🤩')
    } else {
      setQuestionFeedback({
        correct: false,
        text: "❌ Actually, AI can sometimes be wrong! AI learns from examples, so it might make mistakes. That's why we ALWAYS check with a grown-up first! 🧠 Great learning moment! 💡",
      })
      setSparkiEmotion('🤔')
    }
    onComplete(TOTAL)
    setTimeout(() => setStep('complete'), 3000)
  }

  const playAgain = () => {
    setStep('welcome')
    setCurrentTaskIndex(0)
    setTasksCompleted(0)
    setSuccessMessage(null)
    setShowSuccess(false)
    setQuestionAnswered(false)
    setQuestionFeedback(null)
    setSparkiEmotion('🤖')
  }

  const wrapperStyle = {
    background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #8b6f47 100%)',
    borderColor: 'rgba(255, 215, 0, 0.7)',
  }

  if (step === 'welcome') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={wrapperStyle}
      >
        <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#FFD700', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>
          🌍 Sparki&apos;s World AI Helper
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFD700' }}>
          Discover where AI helpers work around the world!
        </p>
        <div className="mb-8 p-6 rounded-xl text-left" style={{ background: 'rgba(255,215,0,0.15)', border: '3px solid #FFD700' }}>
          <p className="text-base sm:text-lg font-semibold mb-4 text-white">
            Hi! I&apos;m Sparki! 🤖 AI is all around us! It helps at schools, hospitals, farms, and homes. Your job? Read what someone needs help with, then pick the RIGHT place where AI can help! 🌍 Think carefully—sometimes AI can make mistakes, so we need to be smart about it! Ready to become an AI Expert? 🧠✨
          </p>
          <p className="text-sm sm:text-base" style={{ color: '#FFD700' }}>
            Learn how AI helpers around the world make places better—and why it&apos;s important to check their work! 🧠🌟
          </p>
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 text-xl sm:text-2xl font-black text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
        >
          🎮 Start Exploring!
        </button>
      </div>
    )
  }

  if (step === 'game' && currentTask) {
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
            Read the need, pick the place! 🌍
          </p>
          <p className="text-lg" style={{ color: '#FFA500' }}>
            Task <strong>{tasksCompleted}</strong>/{TOTAL}
          </p>
        </div>

        <div
          className="mb-6 p-6 rounded-xl"
          style={{ background: 'rgba(100, 200, 255, 0.15)', border: '3px solid #64C8FF' }}
        >
          <div
            className="rounded-2xl p-6 sm:p-8 text-center flex items-center justify-center min-h-[100px]"
            style={{
              background: 'linear-gradient(135deg, #FF6B9D, #FF8A3D)',
              border: '3px solid #FFD700',
            }}
          >
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentTask.task}
            </p>
          </div>
        </div>

        <div
          className="mb-6 p-6 rounded-xl"
          style={{ background: 'rgba(255, 107, 157, 0.15)', border: '3px solid #FF6B9D' }}
        >
          <p className="text-lg font-bold mb-4 text-center" style={{ color: '#FFD700' }}>
            🌍 Pick Where AI Helps:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {locationButtons.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleLocationClick(loc.id)}
                disabled={showSuccess}
                className="p-5 sm:p-6 rounded-xl text-center font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-80"
                style={{
                  background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                  border: '3px solid #FFD700',
                  color: 'white',
                }}
              >
                <span className="block text-3xl sm:text-4xl mb-2">{loc.emoji}</span>
                <span className="block text-sm sm:text-base">{loc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {showSuccess && successMessage && (
          <div
            className="text-center p-4 rounded-lg font-bold text-lg"
            style={{ background: 'rgba(50,205,50,0.2)', border: '2px solid #32CD32', color: '#32CD32' }}
          >
            {successMessage}
          </div>
        )}
      </div>
    )
  }

  if (step === 'question') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-2xl mx-auto border-2 shadow-xl"
        style={wrapperStyle}
      >
        <div className="text-5xl sm:text-6xl my-4" aria-hidden>
          {sparkiEmotion}
        </div>
        <h2 className="text-3xl font-black mb-6" style={{ color: '#FFD700' }}>
          Important Question!
        </h2>
        <div className="mb-6 p-6 sm:p-8 rounded-xl mx-auto max-w-xl" style={{ background: 'rgba(255, 215, 0, 0.15)', border: '3px solid #FFD700' }}>
          <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFA500' }}>
            Can AI sometimes be wrong?
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => handleAnswerQuestion(true)}
              disabled={questionAnswered}
              className="px-8 py-4 text-xl font-bold text-white rounded-lg disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #32CD32, #228B22)' }}
            >
              ✅ Yes!
            </button>
            <button
              type="button"
              onClick={() => handleAnswerQuestion(false)}
              disabled={questionAnswered}
              className="px-8 py-4 text-xl font-bold text-white rounded-lg disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #FF8A3D, #FF6B9D)' }}
            >
              ❌ No
            </button>
          </div>
        </div>
        {questionFeedback && (
          <div
            className="p-6 rounded-xl text-lg font-bold mb-6 max-w-xl mx-auto"
            style={{
              background: questionFeedback.correct ? 'rgba(50, 205, 50, 0.2)' : 'rgba(255, 165, 0, 0.2)',
              border: '2px solid ' + (questionFeedback.correct ? '#32CD32' : '#FFA500'),
              color: questionFeedback.correct ? '#32CD32' : '#FFA500',
            }}
          >
            {questionFeedback.text}
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
          🎉 You&apos;re a Software Explorer!
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFA500' }}>
          You explored all the AI helpers around the world!
        </p>
        <div className="mb-6 p-6 rounded-xl text-left" style={{ background: 'rgba(255,215,0,0.15)', border: '3px solid #FFD700' }}>
          <p className="font-semibold mb-2 text-white">🤖 Sparki says:</p>
          <p className="text-sm sm:text-base" style={{ color: '#FFD700' }}>
            Awesome! You found all 6 tools! You now understand that software is like a toolbox—each tool helps us do different things. You&apos;re officially a Software Explorer! 🌟
          </p>
        </div>
        <p className="text-lg font-bold text-amber-200 mb-6">
          You earned <strong>{displaySparkles}</strong> sparkles!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={playAgain}
            className="px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
          >
            🔄 Play Again
          </button>
          {mastered && nextUnit && (
            <Link
              to={`/unit/${nextUnit.id}`}
              className="inline-block px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}
            >
              Go to {nextUnit.title} →
            </Link>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default WorldAIHelperQuiz
