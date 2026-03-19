import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const ROBLOX_ITEMS_EN: { text: string; correct: boolean }[] = [
  { text: 'Play with real friends only', correct: true },
  { text: 'Chat with strangers', correct: false },
  { text: 'Use chat filters', correct: true },
  { text: 'Share your address in game', correct: false },
  { text: 'Block mean players', correct: true },
  { text: 'Tell grown-up if someone asks private info', correct: true },
  { text: 'Add random people', correct: false },
  { text: 'Report bullies', correct: true },
]

const ROBLOX_ITEMS_ES: { text: string; correct: boolean }[] = [
  { text: 'Jugar solo con amigos reales', correct: true },
  { text: 'Chatear con desconocidos', correct: false },
  { text: 'Usar filtros de chat', correct: true },
  { text: 'Compartir tu direccion en el juego', correct: false },
  { text: 'Bloquear jugadores groseros', correct: true },
  { text: 'Contar a un adulto si piden datos privados', correct: true },
  { text: 'Agregar personas al azar', correct: false },
  { text: 'Reportar acoso', correct: true },
]

export interface RobloxSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const RobloxSafetyQuiz: React.FC<RobloxSafetyQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t, locale } = useTranslation()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentItem, setCurrentItem] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const items = locale === 'es' ? ROBLOX_ITEMS_ES : ROBLOX_ITEMS_EN
  const totalItems = items.length
  const item = step === 'quiz' ? items[currentItem] : null

  const handleStart = () => setStep('quiz')

  const handleSort = (isSafe: boolean) => {
    if (answered || !item) return
    setAnswered(true)
    const correct = isSafe === item.correct
    if (correct) setScore((s) => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setCurrentItem((c) => c + 1)
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
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-emerald-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 mb-2">
          🎮 {t('safetyQuiz.roblox.title')}
        </h2>
        <p className="text-base sm:text-lg text-emerald-700 font-semibold mb-4">
          {t('safetyQuiz.roblox.subtitle')}
        </p>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-lg text-emerald-800 font-bold mb-1">
          {locale === 'es' ? '¡Hola! Soy' : "Hi! I'm"} <span className="text-emerald-600">Sparki</span> 💚
        </p>
        <p className="text-emerald-700 text-base mb-6 max-w-md mx-auto font-semibold">
          {t('safetyQuiz.roblox.intro')}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          🚀 {t('safetyQuiz.common.letsGo')}
        </button>
      </div>
    )
  }

  if (step === 'quiz' && item) {
    const progressPercent = (currentItem / totalItems) * 100
    const showFeedback = feedback !== null
    const isLast = currentItem === totalItems - 1

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 border-emerald-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold text-emerald-800">
              {t('safetyQuiz.common.questionOf', { current: currentItem + 1, total: totalItems })}
            </span>
            <span className="text-base font-bold text-emerald-700">✅ {score}</span>
          </div>
          <div className="w-full h-5 rounded-full bg-white/60 overflow-hidden shadow-inner border-2 border-emerald-300">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #10b981, #34d399)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center shadow-md border-2 border-emerald-600 flex-shrink-0 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex-1 border-2 border-emerald-200">
            <p className="text-emerald-900 font-bold text-base">
              {showFeedback
                ? feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Gran trabajo! ¡Eso es seguro! 🎮✨'
                    : "Great job! That's safe! 🎮✨"
                  : locale === 'es'
                    ? 'Aprendamos e intentemos de nuevo 💙'
                    : "Let's learn and try next! 💙"
                : locale === 'es'
                  ? 'Lleva esto a la canasta correcta 🎮'
                  : 'Drag this to the right basket! 🎮'}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-300 mb-8 text-center"
          style={{ background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)' }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-emerald-900 leading-relaxed">
            {item.text}
          </p>
        </div>

        {!showFeedback ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
            <button
              type="button"
              onClick={() => handleSort(true)}
              className="basket-btn rounded-2xl p-6 border-4 border-dashed border-emerald-500 bg-gradient-to-br from-emerald-50 to-blue-50 text-emerald-900 text-xl sm:text-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform min-h-[120px] flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl">✅</span>
              <span>{locale === 'es' ? 'Seguro' : 'Safe to Do'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSort(false)}
              className="basket-btn rounded-2xl p-6 border-4 border-dashed border-red-400 bg-gradient-to-br from-red-50 to-red-100 text-red-900 text-xl sm:text-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform min-h-[120px] flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl">❌</span>
              <span>{locale === 'es' ? 'No seguro' : 'Not Safe'}</span>
            </button>
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
                {feedback === 'correct' ? '✅🎉' : '❌'}
              </div>
              <p className={`text-2xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Bien! ¡Juego seguro!'
                    : 'Yay! Safe play!'
                  : locale === 'es'
                    ? '¡Mantente seguro en Roblox!'
                    : 'Always stay safe in Roblox!'}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? 'Sparki dice: "¡Clasificacion perfecta!" 🤖💚'
                    : 'Sparki says: "Perfect sort!" 🤖💚'
                  : locale === 'es'
                    ? 'Sparki dice: "¡La seguridad importa en Roblox!" 🤖💚'
                    : 'Sparki says: "Safety matters in Roblox!" 🤖💚'}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                {isLast ? `🏆 ${t('safetyQuiz.common.seeResults')}` : `${t('safetyQuiz.common.next')} ➡️`}
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
    const sparkleEmojis = ['✨', '🎮', '🌟', '💚', '🎉', '✨', '⭐', '🌟', '⚡', '💫']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-emerald-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 mb-3">
          {locale === 'es' ? '🎉 ¡Eres una estrella de seguridad en Roblox! 🎉' : "🎉 You're a Roblox Safety Star! 🎉"}
        </h2>
        <p className="text-2xl text-emerald-800 font-bold mb-6">
          {t('safetyQuiz.common.youGotOutOf', { score: correctCount, total: totalItems })} 🎮💚
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-white font-bold text-sm mt-6">🎮 Safety</span>
            <span className="text-white font-bold text-sm">Roblox Star</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((e, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-emerald-900 mb-2">
          {t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300 to-emerald-500 flex items-center justify-center shadow-md border-2 border-emerald-600 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-emerald-200 text-left max-w-xs">
            <p className="text-emerald-900 font-bold">
              {locale === 'es'
                ? '¡Clasificaste perfecto! ¡Jugar seguro es genial! 💚🎮'
                : 'You sorted perfectly! Safe gaming rocks! 💚🎮'}
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default RobloxSafetyQuiz
