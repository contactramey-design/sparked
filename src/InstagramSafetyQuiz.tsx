import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const INSTAGRAM_QUESTIONS_EN: { text: string; answer: boolean }[] = [
  { text: 'You should keep your Instagram account private', answer: true },
  { text: "It's okay to share your full name in your bio", answer: false },
  { text: 'Always ask a grown-up before posting a photo', answer: true },
  { text: 'Strangers can follow you if your account is public', answer: true },
  { text: 'You should share your school name online', answer: false },
  { text: "It's fine to post photos without grown-up permission", answer: false },
  { text: 'Use privacy settings to control who sees your photos', answer: true },
  { text: 'Tell a grown-up if someone asks for your address', answer: true },
]

const INSTAGRAM_QUESTIONS_ES: { text: string; answer: boolean }[] = [
  { text: 'Debes mantener tu cuenta de Instagram privada', answer: true },
  { text: 'Está bien compartir tu nombre completo en tu biografía', answer: false },
  { text: 'Siempre pide permiso a un adulto antes de publicar una foto', answer: true },
  { text: 'Si tu cuenta es pública, extraños pueden seguirte', answer: true },
  { text: 'Debes compartir el nombre de tu escuela en internet', answer: false },
  { text: 'Está bien publicar fotos sin permiso de un adulto', answer: false },
  { text: 'Usa la privacidad para controlar quién ve tus fotos', answer: true },
  { text: 'Dile a un adulto si alguien te pide tu dirección', answer: true },
]

export interface InstagramSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const InstagramSafetyQuiz: React.FC<InstagramSafetyQuizProps> = ({
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

  const questions = useMemo(
    () => (locale === 'es' ? INSTAGRAM_QUESTIONS_ES : INSTAGRAM_QUESTIONS_EN),
    [locale],
  )

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
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-pink-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-2">
          📱 {t('safetyQuiz.instagram.title')}
        </h2>
        <p className="text-base sm:text-lg text-blue-700 font-semibold mb-4">
          {t('safetyQuiz.instagram.subtitle')}
        </p>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-lg text-blue-800 font-bold mb-1">
          {locale === 'es' ? '¡Hola! Soy' : "Hi! I'm"} <span className="text-pink-600">Sparki</span> 💙
        </p>
        <p className="text-blue-700 text-base mb-6 max-w-md mx-auto font-semibold">
          {t('safetyQuiz.instagram.intro')}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 rounded-full text-white text-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
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
        className="rounded-3xl p-5 sm:p-6 max-w-xl mx-auto border-2 border-pink-200 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-bold text-blue-800">
              {t('safetyQuiz.common.questionOf', { current: currentQ + 1, total: totalQuestions })}
            </span>
            <span className="text-base font-bold text-pink-700">
              ✅ {score} {locale === 'es' ? 'correctas' : 'correct'}
            </span>
          </div>
          <div className="w-full h-5 rounded-full bg-white/60 overflow-hidden shadow-inner border-2 border-pink-300">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #ec4899, #fbbf24)',
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
                  ? `${t('safetyQuiz.instagram.feedbackCorrect')} 🎉💖`
                  : `${t('safetyQuiz.instagram.feedbackWrong')} 💙`
                : locale === 'es'
                  ? '¿Esto es verdadero o falso? 💭'
                  : 'Is this true or false? 💭'}
            </p>
          </div>
        </div>

        <div
          className="rounded-3xl p-8 shadow-xl border-4 border-pink-300 mb-6 text-center"
          style={{ background: 'linear-gradient(to bottom right, #fef9c3, #fce7f3)' }}
        >
          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
            {q.text}
          </p>
        </div>

        {!showFeedback ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              className="rounded-3xl py-6 px-4 text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              ✅ {t('safetyQuiz.common.true')}
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              className="rounded-3xl py-6 px-4 text-white text-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
            >
              ❌ {t('safetyQuiz.common.false')}
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
                {feedback === 'correct' ? '✅💚' : '❌'}
              </div>
              <p className={`text-2xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                {feedback === 'correct' ? t('safetyQuiz.instagram.safeChoice') : t('safetyQuiz.common.wrong')}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? 'Sparki dice: "¡Increible! ¡Sigue aprendiendo!" 🤖💗'
                    : 'Sparki says: "Amazing! Keep learning!" 🤖💗'
                  : locale === 'es'
                    ? `Sparki dice: "Primero pregunta a un adulto. La respuesta es ${q.answer ? t('safetyQuiz.common.true') : t('safetyQuiz.common.false')}." 🤖`
                    : `Sparki says: "Always ask a grown-up first! The answer is ${q.answer ? t('safetyQuiz.common.true') : t('safetyQuiz.common.false')}." 🤖`}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #ec4899)' }}
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
    const sparkleEmojis = ['✨', '💗', '🌟', '📱', '💙', '✨', '💛', '🌟', '⭐', '💫']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 border-pink-200 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #fef3c7 100%)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-pink-900 mb-3">
          {locale === 'es' ? '🎉 ¡Eres una estrella de seguridad en Instagram! 🎉' : "🎉 You're an Instagram Safety Star! 🎉"}
        </h2>
        <p className="text-2xl text-blue-800 font-bold mb-6">
          {t('safetyQuiz.common.youGotOutOf', { score: correctCount, total: totalQuestions })} 🛡️
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-amber-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #f472b6, #ec4899)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-white font-bold text-sm mt-6">📱 Safety</span>
            <span className="text-white font-bold text-sm">Star</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((emoji, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {emoji}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-pink-900 mb-2">
          {t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center shadow-md border-2 border-blue-600 text-3xl">
            🤖
          </div>
          <div className="bg-white/85 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-pink-200 text-left max-w-xs">
            <p className="text-blue-900 font-bold">
              {locale === 'es' ? '¡Increible! ¡Estas seguro en Instagram! 💙📱' : "Amazing! You're safe on Instagram! 💙📱"}
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}
          >
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default InstagramSafetyQuiz
