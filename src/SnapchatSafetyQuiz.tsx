import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const SNAP_SCENARIOS_EN: { text: string; correct: boolean }[] = [
  { text: 'Send a snap with your full name', correct: false },
  { text: 'Keep streaks with real friends only', correct: true },
  { text: 'Send mean snaps to someone', correct: false },
  { text: 'Streaks are more important than feelings', correct: false },
  { text: 'Ask a grown-up before sending snaps', correct: true },
  { text: 'Snaps disappear forever (safe to save)', correct: false },
  { text: 'Share private photos with strangers', correct: false },
  { text: 'Be kind in snaps', correct: true },
]

const SNAP_SCENARIOS_ES: { text: string; correct: boolean }[] = [
  { text: 'Enviar un snap con tu nombre completo', correct: false },
  { text: 'Mantener rachas solo con amigos reales', correct: true },
  { text: 'Enviar snaps hirientes a alguien', correct: false },
  { text: 'Las rachas son mas importantes que los sentimientos', correct: false },
  { text: 'Preguntar a un adulto antes de enviar snaps', correct: true },
  { text: 'Los snaps desaparecen para siempre (es seguro guardarlos)', correct: false },
  { text: 'Compartir fotos privadas con desconocidos', correct: false },
  { text: 'Ser amable en los snaps', correct: true },
]

export interface SnapchatSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const SnapchatSafetyQuiz: React.FC<SnapchatSafetyQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t, locale } = useTranslation()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const scenarios = locale === 'es' ? SNAP_SCENARIOS_ES : SNAP_SCENARIOS_EN
  const totalScenarios = scenarios.length
  const scenario = step === 'quiz' ? scenarios[currentScenario] : null

  const handleStart = () => setStep('quiz')

  const handleDecision = (isYes: boolean) => {
    if (answered || !scenario) return
    setAnswered(true)
    const correct = isYes === scenario.correct
    if (correct) setScore((s) => s + 1)
    setFeedback(correct ? 'correct' : 'wrong')
  }

  const handleNext = () => {
    setCurrentScenario((c) => c + 1)
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
          background: 'linear-gradient(135deg, #dbeafe 0%, #fef3c7 50%, #fce7f3 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-2">
          👻 {t('safetyQuiz.snapchat.title')}
        </h2>
        <p className="text-base sm:text-lg text-blue-700 font-semibold mb-4">
          {t('safetyQuiz.snapchat.subtitle')}
        </p>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-lg text-blue-800 font-bold mb-1">
          {locale === 'es' ? '¡Hola! Soy' : "Hi! I'm"} <span className="text-blue-600">Sparki</span> 💙
        </p>
        <p className="text-blue-700 text-base mb-6 max-w-md mx-auto font-semibold">
          {t('safetyQuiz.snapchat.intro')}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
        >
          🚀 {t('safetyQuiz.common.letsGo')}
        </button>
      </div>
    )
  }

  if (step === 'quiz' && scenario) {
    const progressPercent = (currentScenario / totalScenarios) * 100
    const showFeedback = feedback !== null
    const isLast = currentScenario === totalScenarios - 1

    return (
      <div
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 border-blue-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fef3c7 50%, #fce7f3 100%)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold text-blue-800">
              {t('safetyQuiz.common.questionOf', { current: currentScenario + 1, total: totalScenarios })}
            </span>
            <span className="text-base font-bold text-green-700">✅ {score}</span>
          </div>
          <div className="w-full h-5 rounded-full bg-white/60 overflow-hidden shadow-inner border-2 border-blue-300">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #0ea5e9, #fbbf24)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 flex-shrink-0 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex-1 border-2 border-blue-200">
            <p className="text-blue-900 font-bold text-base">
              {showFeedback
                ? feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Perfecto! ¡Eleccion segura! 👻✨'
                    : 'Perfect! Safe choice! 👻✨'
                  : locale === 'es'
                    ? 'Aprendamos e intentemos la siguiente 💙'
                    : "Let's learn and try the next one! 💙"
                : locale === 'es'
                  ? '¿Snap o no? Elige SI o NO 👻'
                  : 'Snap or Not? Pick YES or NO! 👻'}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-blue-300 mb-8 text-center"
          style={{ background: 'linear-gradient(to bottom right, #dbeafe, #cffafe)' }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-blue-900 leading-relaxed">
            {scenario.text}
          </p>
        </div>

        {!showFeedback ? (
          <div className="flex gap-4 justify-center mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => handleDecision(true)}
              className="rounded-full px-12 py-5 text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform border-0"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              ✅ {t('safetyQuiz.common.yes')}
            </button>
            <button
              type="button"
              onClick={() => handleDecision(false)}
              className="rounded-full px-12 py-5 text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform border-0"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              ❌ {t('safetyQuiz.common.no')}
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
                    ? '¡Bien! ¡Snaps seguros!'
                    : 'Yay! Safe snaps!'
                  : locale === 'es'
                    ? '¡Intentemos con seguridad!'
                    : "Let's try safe!"}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? 'Sparki dice: "¡Eres muy inteligente!" 🤖💙'
                    : 'Sparki says: "You\'re so smart!" 🤖💙'
                  : locale === 'es'
                    ? 'Sparki dice: "¡Mantener snaps seguros importa!" 🤖💙'
                    : 'Sparki says: "Keeping snaps safe matters!" 🤖💙'}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)' }}
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
    const sparkleEmojis = ['✨', '👻', '🌟', '💙', '🎉', '✨', '💛', '🌟', '⭐', '💫']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-blue-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fef3c7 50%, #fce7f3 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-3">
          {locale === 'es' ? '🎉 ¡Eres un heroe de snaps seguros! 🎉' : "🎉 You're a Safe Snap Hero! 🎉"}
        </h2>
        <p className="text-2xl text-blue-800 font-bold mb-6">
          {t('safetyQuiz.common.youGotOutOf', { score: correctCount, total: totalScenarios })} 👻💙
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-white font-bold text-sm mt-6">👻 Safe</span>
            <span className="text-white font-bold text-sm">Snap Hero</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((e, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-blue-900 mb-2">
          {t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-blue-200 text-left max-w-xs">
            <p className="text-blue-900 font-bold">
              {locale === 'es'
                ? '¡Mantuviste tus snaps seguros! ¡Eres genial! 💙👻'
                : "You kept your snaps safe! You're awesome! 💙👻"}
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}
          >
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default SnapchatSafetyQuiz
