import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const TOOLS = [
  { id: 'paint', emoji: '🎨', name: 'Drawing App', task: 'Draw a rainbow' },
  { id: 'abc', emoji: '📚', name: 'Learning Game', task: 'Learn my ABCs' },
  { id: 'music', emoji: '🎵', name: 'Music Maker', task: 'Make a song' },
  { id: 'puzzle', emoji: '🧩', name: 'Puzzle Game', task: 'Play a puzzle' },
  { id: 'video', emoji: '📺', name: 'Video Player', task: 'Watch safe videos' },
  { id: 'sort', emoji: '📦', name: 'Sorting App', task: 'Organize my toys' },
] as const

const TOTAL = TOOLS.length

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export interface SoftwareExplorerQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const SoftwareExplorerQuiz: React.FC<SoftwareExplorerQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'game' | 'complete'>('welcome')
  const [taskOrder] = useState(() => shuffle([...TOOLS]))
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [sparkiEmotion, setSparkiEmotion] = useState('🤖')
  const [showSuccess, setShowSuccess] = useState(false)

  const shuffledTools = useMemo(() => (step === 'game' ? shuffle([...TOOLS]) : []), [step])
  const currentTool = step === 'game' ? taskOrder[currentTaskIndex] : null

  const playAgain = () => {
    setStep('welcome')
    setCurrentTaskIndex(0)
    setSuccessMessage(null)
    setSparkiEmotion('🤖')
    setShowSuccess(false)
  }

  const handleStart = () => setStep('game')

  useEffect(() => {
    if (step === 'game' && currentTaskIndex >= TOTAL) {
      onComplete(TOTAL)
      setStep('complete')
    }
  }, [step, currentTaskIndex, onComplete])

  const handleToolClick = (selected: (typeof TOOLS)[number]) => {
    if (!currentTool || showSuccess) return
    if (selected.id === currentTool.id) {
      setSuccessMessage(`✅ Perfect! "${currentTool.task}" uses ${currentTool.name}! 🎉`)
      setSparkiEmotion('🤩')
      setShowSuccess(true)
      setCurrentTaskIndex((i) => i + 1)
      setTimeout(() => {
        setShowSuccess(false)
        setSparkiEmotion('🤖')
      }, 1500)
    } else {
      setSuccessMessage("❌ Oops! That's not right. Try again!")
      setSparkiEmotion('🤔')
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setSparkiEmotion('🤖')
      }, 1500)
    }
  }

  if (step === 'welcome') {
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #8b6f47 100%)',
          borderColor: 'rgba(255, 215, 0, 0.7)',
        }}
      >
        <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#FFD700', textShadow: '0 3px 0 rgba(0,0,0,0.5)' }}>
          🗺️ Sparki&apos;s Software Explorer
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFD700' }}>
          Discover the tools that help us do amazing things!
        </p>
        <div className="mb-8 p-6 rounded-xl text-left" style={{ background: 'rgba(255,215,0,0.15)', border: '3px solid #FFD700' }}>
          <p className="text-base sm:text-lg font-semibold mb-2 text-white">
            Hi! I&apos;m Sparki! 🤖 Help me explore a treasure map and discover 6 hidden software tools! Each chest contains a different tool. Your job is to match each task (like &quot;Draw a rainbow&quot;) to the right software tool. Can you find them all?
          </p>
          <p className="text-sm sm:text-base" style={{ color: '#FFD700' }}>
            Learn how software is like a toolbox—different tools help us do different things! 🛠️✨
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

  if (step === 'game' && currentTool) {
    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-3xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #8b6f47 100%)',
          borderColor: 'rgba(255, 215, 0, 0.7)',
        }}
      >
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl my-4" aria-hidden>
            {sparkiEmotion}
          </div>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#FFD700' }}>
            What should we do?
          </p>
          <p className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#FFA500' }}>
            {currentTool.task}
          </p>
          <p className="text-base sm:text-lg" style={{ color: '#FFA500' }}>
            Matches found: <strong>{currentTaskIndex}</strong>/{TOTAL}
          </p>
        </div>

        <div
          className="mb-6 p-6 sm:p-8 rounded-xl text-center"
          style={{ background: 'rgba(255, 107, 157, 0.2)', border: '3px solid #FF6B9D' }}
        >
          <p className="text-sm font-bold mb-3" style={{ color: '#FFD700' }}>
            🎯 Current Task:
          </p>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: '#FFD700', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            {currentTool.task} {currentTool.id === 'paint' ? '🌈' : ''}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {shuffledTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => handleToolClick(tool)}
              disabled={showSuccess}
              className="w-full p-5 sm:p-6 rounded-xl font-bold text-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-80"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                border: '3px solid #FF8A3D',
                boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
              }}
            >
              <span className="block text-3xl sm:text-4xl mb-2">{tool.emoji}</span>
              <span className="block text-sm sm:text-base text-white font-bold">{tool.name}</span>
            </button>
          ))}
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

  if (step === 'complete') {
    const displaySparkles = earnedSparkles ?? unit.sparklesReward
    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3d 50%, #8b6f47 100%)',
          borderColor: 'rgba(255, 215, 0, 0.7)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-black mb-4" style={{ color: '#FFD700' }}>
          🎉 You&apos;re a Software Explorer!
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FFA500' }}>
          You explored all the tools and became a Software Explorer!
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

export default SoftwareExplorerQuiz
