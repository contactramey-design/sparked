import React, { useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

const ACTIONS = [
  { name: 'jump', emoji: '🚀', label: 'Jump' },
  { name: 'spin', emoji: '🌀', label: 'Spin' },
  { name: 'clap', emoji: '👏', label: 'Clap' },
  { name: 'wave', emoji: '👋', label: 'Wave' },
  { name: 'sit', emoji: '🪑', label: 'Sit' },
] as const

type ActionName = (typeof ACTIONS)[number]['name']

const ROUNDS: ActionName[][] = [
  ['jump'],
  ['jump', 'clap'],
  ['spin', 'wave', 'clap'],
  ['jump', 'sit', 'wave'],
  ['clap', 'spin', 'jump', 'wave'],
]

const TOTAL_ROUNDS = ROUNDS.length

export interface BodyCodeChainQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const BodyCodeChainQuiz: React.FC<BodyCodeChainQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const [step, setStep] = useState<'welcome' | 'game' | 'complete'>('welcome')
  const [currentRound, setCurrentRound] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [sparkiEmoji, setSparkiEmoji] = useState('🤖')
  const [sparkiAnimation, setSparkiAnimation] = useState<string | null>(null)
  const [isPerforming, setIsPerforming] = useState(false)
  const [showPlayerTurn, setShowPlayerTurn] = useState(false)
  const [playerProgress, setPlayerProgress] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [buttonStates, setButtonStates] = useState<Record<number, 'idle' | 'correct' | 'wrong'>>({})
  const performLockRef = useRef(false)

  const playAgain = () => {
    setStep('welcome')
    setCurrentRound(0)
    setCorrectCount(0)
    setSparkiEmoji('🤖')
    setSparkiAnimation(null)
    setIsPerforming(false)
    setShowPlayerTurn(false)
    setPlayerProgress(0)
    setFeedback(null)
    setButtonStates({})
  }

  const startGame = () => setStep('game')

  const getActionByName = (name: ActionName) => ACTIONS.find((a) => a.name === name)!

  const performSequence = useCallback(() => {
    if (performLockRef.current || currentRound >= TOTAL_ROUNDS) return
    performLockRef.current = true
    setIsPerforming(true)
    setFeedback(null)
    const sequence = ROUNDS[currentRound]

    const run = async () => {
      for (const actionName of sequence) {
        const action = getActionByName(actionName)
        setSparkiEmoji(action.emoji)
        if (actionName === 'jump') setSparkiAnimation('body-chain-jump 0.6s ease-in-out')
        else if (actionName === 'spin') setSparkiAnimation('body-chain-spin 1s linear')
        else if (actionName === 'wave') setSparkiAnimation('body-chain-wave 0.6s ease-in-out')
        else if (actionName === 'clap') setSparkiAnimation('body-chain-bounce 0.6s ease-in-out')
        else setSparkiAnimation('none')
        await new Promise((r) => setTimeout(r, 1000))
        setSparkiAnimation('none')
        setSparkiEmoji('🤖')
      }
      setIsPerforming(false)
      performLockRef.current = false
      setShowPlayerTurn(true)
      setPlayerProgress(0)
      setButtonStates({})
    }
    run()
  }, [currentRound])

  const handlePlayerAction = (index: number, actionName: ActionName) => {
    const sequence = ROUNDS[currentRound]
    const expected = sequence[playerProgress]
    if (expected !== actionName) {
      setButtonStates((s) => ({ ...s, [index]: 'wrong' }))
      setFeedback("❌ Oops! That's not the right order. Watch Sparki again!")
      setTimeout(() => {
        setFeedback(null)
        setShowPlayerTurn(false)
        setButtonStates({})
        setPlayerProgress(0)
        setTimeout(() => setShowPlayerTurn(true), 100)
      }, 1500)
      return
    }
    setButtonStates((s) => ({ ...s, [index]: 'correct' }))
    setPlayerProgress((p) => p + 1)
    if (playerProgress + 1 === sequence.length) {
      setFeedback(`✅ Perfect! You copied it exactly! Round ${currentRound + 1} complete!`)
      setCorrectCount((c) => c + 1)
      setTimeout(() => {
        setFeedback(null)
        setShowPlayerTurn(false)
        setButtonStates({})
        if (currentRound + 1 >= TOTAL_ROUNDS) {
          onComplete(correctCount + 1)
          setStep('complete')
        } else {
          setCurrentRound((r) => r + 1)
        }
      }, 1500)
    }
  }

  if (step === 'welcome') {
    return (
      <>
        <style>{`
          @keyframes body-chain-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes body-chain-jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-40px); } }
          @keyframes body-chain-spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
          @keyframes body-chain-wave { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
          @keyframes body-chain-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
        <div
          className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 100%)',
            borderColor: 'rgba(255, 69, 0, 0.6)',
          }}
        >
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: '#FF4500' }}>
            🤖 Sparki&apos;s Body Code Chain
          </h2>
          <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FF6D3D' }}>
            Mirror Sparki&apos;s movements to learn how code works!
          </p>
          <div className="mb-8 p-6 rounded-xl text-left" style={{ background: 'rgba(255,69,0,0.1)', border: '3px solid #FF4500' }}>
            <p className="text-base sm:text-lg font-semibold mb-2 text-white">
              Hi! I&apos;m Sparki! 🤖 In each round, I&apos;ll do a sequence of body movements. You watch and remember them, then YOU do the exact same movements!
            </p>
            <p className="text-sm sm:text-base" style={{ color: '#FF6D3D' }}>
              It&apos;s like learning code—follow the instructions step-by-step. Get it right and you level up! 💪
            </p>
          </div>
          <button
            type="button"
            onClick={startGame}
            className="px-10 py-4 text-xl sm:text-2xl font-black text-white rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
          >
            🎮 Let&apos;s Go!
          </button>
        </div>
      </>
    )
  }

  if (step === 'game') {
    const sequence = ROUNDS[currentRound]
    const roundInstruction = showPlayerTurn ? "Your turn! Tap the actions in order." : "Watch Sparki perform..."

    return (
      <>
        <style>{`
          @keyframes body-chain-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes body-chain-jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-40px); } }
          @keyframes body-chain-spin { 0% { transform: rotate(0); } 100% { transform: rotate(360deg); } }
          @keyframes body-chain-wave { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
          @keyframes body-chain-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        `}</style>
        <div
          className="rounded-3xl p-5 sm:p-6 max-w-2xl mx-auto border-2 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 100%)',
            borderColor: 'rgba(255, 69, 0, 0.6)',
          }}
        >
          <div
            className="text-center mb-6 p-6 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #4A5FC1, #5BA3F5)', border: '4px solid #FF4500' }}
          >
            <p className="text-lg font-bold mb-4 text-white">🎭 SPARKI&apos;S TURN 🎭</p>
            <div
              className="text-7xl sm:text-8xl mx-auto my-5"
              style={{
                animation: isPerforming && sparkiAnimation ? sparkiAnimation : 'body-chain-float 3s ease-in-out infinite',
              }}
              aria-hidden
            >
              {sparkiEmoji}
            </div>
          </div>

          <div
            className="text-center mb-6 p-6 rounded-xl"
            style={{ background: 'rgba(255,69,0,0.15)', border: '2px solid #FF4500' }}
          >
            <p className="text-xl sm:text-2xl font-bold" style={{ color: '#FF4500' }}>
              Round {currentRound + 1} of {TOTAL_ROUNDS}
            </p>
            <p className="text-base sm:text-lg font-semibold mt-2" style={{ color: '#FF6D3D' }}>
              {roundInstruction}
            </p>
          </div>

          {!showPlayerTurn && (
            <div className="flex justify-center flex-wrap mb-6">
              <button
                type="button"
                onClick={performSequence}
                disabled={isPerforming}
                className="px-8 py-4 text-xl font-bold text-white rounded-lg border-2 disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #32CD32, #00FF00)', borderColor: '#228B22' }}
              >
                ▶️ Watch Sparki Move!
              </button>
            </div>
          )}

          {feedback && (
            <div
              className="text-center p-4 rounded-lg font-bold text-lg mb-6"
              style={{ background: 'rgba(255,69,0,0.1)', border: '2px solid #FF4500', color: '#FF6D3D' }}
            >
              {feedback}
            </div>
          )}

          {showPlayerTurn && (
            <div className="text-center mb-6">
              <p className="text-xl font-bold mb-4" style={{ color: '#FF4500' }}>
                🎮 YOUR TURN! Do these movements:
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {sequence.map((actionName, index) => {
                  const action = getActionByName(actionName)
                  const state = buttonStates[index] ?? 'idle'
                  const isDisabled = state !== 'idle'
                  let bg = 'linear-gradient(135deg, #FF4500, #FF6D3D)'
                  if (state === 'correct') bg = 'linear-gradient(135deg, #32CD32, #00FF00)'
                  if (state === 'wrong') bg = 'linear-gradient(135deg, #FF1744, #FF5252)'
                  return (
                    <button
                      key={`${currentRound}-${index}`}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handlePlayerAction(index, actionName)}
                      className="px-6 py-3 text-lg font-bold text-white rounded-lg border-0"
                      style={{ background: bg }}
                    >
                      {index + 1}. {action.emoji} {action.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </>
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
          🎉 You&apos;re a Code Master!
        </h2>
        <p className="text-xl sm:text-2xl font-bold mb-6" style={{ color: '#FF6D3D' }}>
          You got {correctCount} out of {TOTAL_ROUNDS} rounds perfect! 🌟
        </p>
        <div className="mb-6 p-6 rounded-xl text-left" style={{ background: 'rgba(255,69,0,0.15)', border: '3px solid #FF4500' }}>
          <p className="font-semibold mb-2 text-white">🤖 Sparki says:</p>
          <p className="text-sm sm:text-base" style={{ color: '#FF6D3D' }}>
            You followed instructions perfectly! That&apos;s exactly what code is—a set of steps to follow in the right order. Amazing work, Body Coder! 🌟
          </p>
        </div>
        <p className="text-lg font-bold text-orange-200 mb-6">
          You earned <strong>{displaySparkles}</strong> sparkles!
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={playAgain}
            className="px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
          >
            🔄 Play Again
          </button>
          {mastered && nextUnit && (
            <Link
              to={`/unit/${nextUnit.id}`}
              className="inline-block px-8 py-3 rounded-lg text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)' }}
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

export default BodyCodeChainQuiz
