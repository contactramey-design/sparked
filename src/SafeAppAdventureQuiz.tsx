import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const SAFE_APP_QUESTIONS_EN: { text: string; answer: boolean; icon: string }[] = [
  { text: 'YouTube Kids has filters for safe videos', answer: true, icon: '🎬' },
  { text: 'I can watch anything online', answer: false, icon: '🌐' },
  { text: 'Safe apps have grown-up approval', answer: true, icon: '👨‍👩‍👧' },
  { text: 'Ads are always safe', answer: false, icon: '📢' },
  { text: 'Kind videos make me happy', answer: true, icon: '😊' },
  { text: 'Yucky videos are okay', answer: false, icon: '🙈' },
  { text: 'Ask a grown-up before opening new apps', answer: true, icon: '🙋' },
  { text: 'Share personal info in games', answer: false, icon: '🔒' },
]

const SAFE_APP_QUESTIONS_ES: { text: string; answer: boolean; icon: string }[] = [
  { text: 'YouTube Kids tiene filtros para videos seguros', answer: true, icon: '🎬' },
  { text: 'Puedo ver cualquier cosa en internet', answer: false, icon: '🌐' },
  { text: 'Las apps seguras tienen aprobacion de un adulto', answer: true, icon: '👨‍👩‍👧' },
  { text: 'Los anuncios siempre son seguros', answer: false, icon: '📢' },
  { text: 'Los videos amables me hacen sentir bien', answer: true, icon: '😊' },
  { text: 'Los videos feos estan bien', answer: false, icon: '🙈' },
  { text: 'Pregunta a un adulto antes de abrir apps nuevas', answer: true, icon: '🙋' },
  { text: 'Comparte datos personales en juegos', answer: false, icon: '🔒' },
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
  const { t, locale } = useTranslation()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const questions = locale === 'es' ? SAFE_APP_QUESTIONS_ES : SAFE_APP_QUESTIONS_EN
  const totalQuestions = questions.length
  const q = step === 'quiz' ? questions[currentQ] : null

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
          {t('safetyQuiz.safeApps.title')}
        </h2>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-blue-800 font-semibold text-lg mb-1">
          {locale === 'es' ? '¡Hola! Soy' : "Hi there! I'm"} <span className="text-pink-500 font-bold">Sparki</span> 💙
        </p>
        <p className="text-blue-700 text-base mb-6 max-w-md mx-auto">
          {locale === 'es'
            ? 'Aprendamos seguridad con apps. Toca VERDADERO o FALSO en cada pregunta.'
            : "Let's learn about staying safe with apps! Tap TRUE or FALSE for each question."}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-8 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}
        >
          🚀 {t('safetyQuiz.common.letsGo')}
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
            <span className="text-sm font-bold text-blue-700">
              {t('safetyQuiz.common.questionOf', { current: currentQ + 1, total: totalQuestions })}
            </span>
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
                  ? locale === 'es'
                    ? '¡Correcto! ¡Increible! 🎉💙'
                    : "That's right! You're amazing! 🎉💙"
                  : locale === 'es'
                    ? `La respuesta era ${q.answer ? `${t('safetyQuiz.common.true')} ✅` : `${t('safetyQuiz.common.false')} ❌`}. Elijamos seguro 💙`
                    : `The answer was ${q.answer ? `${t('safetyQuiz.common.true')} ✅` : `${t('safetyQuiz.common.false')} ❌`}. Let's choose safe! 💙`
                : locale === 'es'
                  ? '¿Esto es VERDADERO o FALSO? 🤔'
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
              ✅ {t('safetyQuiz.common.true')}
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}
            >
              ❌ {t('safetyQuiz.common.false')}
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
                {feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Bien! ¡Eleccion segura!'
                    : 'Yay! Safe choice!'
                  : locale === 'es'
                    ? 'Oops, intenta recordar esta'
                    : 'Oops! Try to remember this one!'}
              </p>
              <p className={`text-base font-semibold mt-1 ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? 'Sparki dice: "¡Eres muy inteligente!" 🤖💙'
                    : 'Sparki says: "You\'re so smart!" 🤖💙'
                  : locale === 'es'
                    ? 'Sparki dice: "¡Elijamos seguro!" 🤖'
                    : 'Sparki says: "Let\'s choose safe!" 🤖'}
              </p>
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}
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

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-amber-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #dbeafe 0%, #fce7f3 40%, #fef3c7 70%, #dbeafe 100%)',
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700 mb-3">
          {locale === 'es' ? '🎉 ¡Excelente trabajo! 🎉' : '🎉 Amazing Job! 🎉'}
        </h2>
        <p className="text-xl text-blue-700 font-bold mb-4">
          {t('safetyQuiz.common.youGotOutOf', { score: correctCount, total: totalQuestions })} ⭐
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
          {t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}
        </p>

        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 text-2xl">
            🤖
          </div>
          <div className="bg-white/90 rounded-2xl rounded-tl-sm px-4 py-3 shadow-md text-left max-w-xs">
            <p className="text-blue-800 font-semibold text-sm">
              {locale === 'es'
                ? '¡Ahora eres un Explorador de Apps Seguras! ¡Estoy muy orgulloso de ti! 💙✨'
                : "You're a Safe App Explorer now! I'm so proud of you! 💙✨"}
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default SafeAppAdventureQuiz
