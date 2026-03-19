import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'

const REDDIT_CHALLENGES_EN: { text: string; correct: boolean }[] = [
  { text: 'Not everything online is true', correct: true },
  { text: 'You should avoid grown-up spaces online', correct: true },
  { text: 'You should believe every comment you read', correct: false },
  { text: 'You should ask a grown-up about scary or mean posts', correct: true },
  { text: "It's good to read kind comments from nice people", correct: true },
  { text: 'You should click on unknown links from strangers', correct: false },
  { text: 'You should report bad or mean content you see', correct: true },
  { text: 'You should share your personal info in forums', correct: false },
]

const REDDIT_CHALLENGES_ES: { text: string; correct: boolean }[] = [
  { text: 'No todo lo de internet es verdad', correct: true },
  { text: 'Debes evitar espacios para adultos en linea', correct: true },
  { text: 'Debes creer todos los comentarios que leas', correct: false },
  { text: 'Debes preguntar a un adulto sobre publicaciones feas o confusas', correct: true },
  { text: 'Es bueno leer comentarios amables de personas buenas', correct: true },
  { text: 'Debes abrir enlaces desconocidos de extraños', correct: false },
  { text: 'Debes reportar contenido grosero o dañino', correct: true },
  { text: 'Debes compartir datos personales en foros', correct: false },
]

export interface RedditForumsSafetyQuizProps {
  unit: UnitConfig
  nextUnit: UnitConfig | null
  earnedSparkles: number | null
  mastered: boolean
  onComplete: (score: number) => void
}

const RedditForumsSafetyQuiz: React.FC<RedditForumsSafetyQuizProps> = ({
  unit,
  nextUnit,
  earnedSparkles,
  mastered,
  onComplete,
}) => {
  const { t, locale } = useTranslation()
  const [step, setStep] = useState<'welcome' | 'quiz' | 'complete'>('welcome')
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  const challenges = locale === 'es' ? REDDIT_CHALLENGES_ES : REDDIT_CHALLENGES_EN
  const totalChallenges = challenges.length
  const challenge = step === 'quiz' ? challenges[currentChallenge] : null

  const handleStart = () => setStep('quiz')

  const handleDecision = (isTrue: boolean) => {
    if (answered || !challenge) return
    setAnswered(true)
    const correct = isTrue === challenge.correct
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
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 50%, #0F0F0F 100%)',
          borderColor: 'rgba(255, 69, 0, 0.5)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-black mb-2 uppercase tracking-wide" style={{ color: '#FF4500', textShadow: '0 3px 0 rgba(255, 69, 0, 0.4)' }}>
          📱 {t('safetyQuiz.reddit.title')} 📱
        </h2>
        <p className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#D946A6' }}>
          {t('safetyQuiz.reddit.subtitle')}
        </p>
        <div className="my-6 flex justify-center">
          <span className="text-6xl sm:text-7xl animate-[floatBounce_3s_ease-in-out_infinite]" role="img" aria-label="Sparki robot">
            🤖
          </span>
        </div>
        <p className="text-xl sm:text-2xl font-black mb-1" style={{ color: '#4A5FC1' }}>
          {locale === 'es' ? '¡Hola! Soy Sparki! 💙' : "Hi! I'm Sparki! 💙"}
        </p>
        <p className="text-base sm:text-lg font-bold mb-6 max-w-2xl mx-auto" style={{ color: '#D946A6' }}>
          {locale === 'es'
            ? 'Estoy aqui para ayudarte a leer con seguridad en Reddit y foros. Responde VERDADERO o FALSO a 8 preguntas. ¿Listo?'
            : "I'm here to help you learn how to read safely on Reddit and Forums! Answer TRUE or FALSE to 8 fun questions. Ready?"}
        </p>
        <button
          type="button"
          onClick={handleStart}
          className="px-10 py-4 rounded-xl text-white text-xl font-black shadow-lg hover:scale-105 active:scale-95 transition-transform uppercase tracking-wide"
          style={{ background: 'linear-gradient(135deg, #4A90E2, #5BA3F5)', border: '3px solid #2E5CB8', boxShadow: '0 6px 0 rgba(0,0,0,0.3)' }}
        >
          🚀 {t('safetyQuiz.common.letsGo')}
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
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 50%, #0F0F0F 100%)',
          borderColor: 'rgba(255, 69, 0, 0.5)',
        }}
      >
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base font-black uppercase" style={{ color: '#FF4500' }}>
              {t('safetyQuiz.common.questionOf', { current: currentChallenge + 1, total: totalChallenges })}
            </span>
            <span className="text-base font-black uppercase" style={{ color: '#32CD32' }}>✅ {score}</span>
          </div>
          <div className="w-full h-6 rounded-lg overflow-hidden shadow-inner bg-white/20 border-2 border-orange-500">
            <div
              className="h-full rounded-lg transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #FF4500, #FF6D3D)',
              }}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md border-2 flex-shrink-0 text-3xl sm:text-4xl" style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)', borderColor: '#D63300' }}>
            🤖
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3 shadow-md flex-1 border-2 border-orange-500">
            <p className="font-bold text-base text-orange-700">
              {showFeedback
                ? feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Eleccion perfecta! ¡Eres muy inteligente! ✨'
                    : "Perfect choice! You're so smart! ✨"
                  : locale === 'es'
                    ? 'No pasa nada, aprendamos juntos 📚'
                    : "It's okay! Let's learn together! 📚"
                : locale === 'es'
                  ? 'Lee con cuidado y elige VERDADERO o FALSO 📖'
                  : 'Read carefully and choose TRUE or FALSE! 📖'}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-6 sm:p-8 shadow-lg border-4 border-orange-500 mb-8 text-center">
          <p className="text-2xl sm:text-3xl font-bold leading-relaxed mb-3" style={{ color: '#D63300' }}>
            {challenge.text}
          </p>
          <p className="text-lg font-semibold" style={{ color: '#FF4500' }}>
            📖 {locale === 'es' ? '¿Esto es verdadero o falso?' : 'Is this true or false?'}
          </p>
        </div>

        {!showFeedback ? (
          <div className="flex gap-4 sm:gap-6 justify-center my-8 flex-wrap">
            <button
              type="button"
              onClick={() => handleDecision(true)}
              className="px-8 sm:px-10 py-5 rounded-xl text-white text-xl font-black border-3 shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-transform uppercase tracking-wide"
              style={{ background: '#FF4500', borderColor: '#D63300', boxShadow: '0 6px 0 rgba(0,0,0,0.2)' }}
            >
              ✓ {t('safetyQuiz.common.true')}
            </button>
            <button
              type="button"
              onClick={() => handleDecision(false)}
              className="px-8 sm:px-10 py-5 rounded-xl text-white text-xl font-black border-3 shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 transition-transform uppercase tracking-wide"
              style={{ background: '#FF6D3D', borderColor: '#E63400', boxShadow: '0 6px 0 rgba(0,0,0,0.2)' }}
            >
              ✗ {t('safetyQuiz.common.false')}
            </button>
          </div>
        ) : (
          <>
            <div
              className={`rounded-2xl p-6 text-center shadow-xl border-4 mb-4 ${
                feedback === 'correct'
                  ? 'bg-green-100 border-green-600'
                  : 'bg-pink-50 border-pink-600'
              }`}
            >
              <div className="text-6xl mb-2">
                {feedback === 'correct' ? '✅ 👍' : '❌'}
              </div>
              <p className={`text-2xl font-bold mb-2 ${feedback === 'correct' ? 'text-green-800' : 'text-pink-800'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? '¡Bien! ¡Lectura inteligente!'
                    : 'Yay! Smart reading!'
                  : t('safetyQuiz.common.wrong')}
              </p>
              <p className={`text-lg font-semibold ${feedback === 'correct' ? 'text-green-700' : 'text-pink-700'}`}>
                {feedback === 'correct'
                  ? locale === 'es'
                    ? 'Sparki dice: "¡Estas leyendo con seguridad!" 🤖💙'
                    : 'Sparki says: "You\'re reading safely!" 🤖💙'
                  : locale === 'es'
                    ? 'Sparki dice: "¡Siempre pregunta a un adulto!" 🤖💙'
                    : 'Sparki says: "Always ask a grown-up!" 🤖💙'}
              </p>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={isLast ? handleSeeResults : handleNext}
                className="px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #4A90E2, #D946A6)' }}
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
    const sparkleEmojis = ['✨', '📚', '🌟', '💙', '🎉', '✨', '⭐', '📖', '⚡', '🎀']

    return (
      <div
        className="rounded-3xl p-6 sm:p-8 text-center max-w-xl mx-auto border-2 shadow-xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1A1A1B 0%, #2C2C2D 50%, #0F0F0F 100%)',
          borderColor: 'rgba(255, 69, 0, 0.5)',
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
          {locale === 'es' ? '🌟 ¡Estrella de lectura segura! 🌟' : '🌟 Safe Reader Star! 🌟'}
        </h2>
        <p className="text-2xl font-bold mb-6" style={{ color: '#FF4500' }}>
          {t('safetyQuiz.common.youGotOutOf', { score: correctCount, total: totalChallenges })} 🌟
        </p>

        <div className="mb-6 flex justify-center">
          <div
            className="w-48 h-48 flex flex-col items-center justify-center border-4 border-indigo-400 shadow-xl rounded-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFED4E, #FFB347)',
              animation: 'badgeSpin 0.8s ease-out forwards',
            }}
          >
            <span className="text-indigo-700 font-bold text-sm mt-6">📖 Safe</span>
            <span className="text-indigo-700 font-bold text-sm">Reader Star</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6 text-4xl">
          {sparkleEmojis.map((e, i) => (
            <span key={i} className="animate-[sparkleIn_0.6s_ease-out_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
              {e}
            </span>
          ))}
        </div>

        <p className="text-lg font-bold text-orange-200 mb-2">
          {t('safetyQuiz.common.youEarnedSparkles', { count: displaySparkles })}
        </p>

        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-md border-2 text-3xl sm:text-4xl" style={{ background: 'linear-gradient(135deg, #FF4500, #FF6D3D)', borderColor: '#D63300' }}>
            🤖
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3 shadow-md border-2 border-blue-400 text-left max-w-xs">
            <p className="font-bold text-indigo-700">
              {locale === 'es'
                ? '¡Eres un lector seguro increible! Sigue preguntando a adultos sobre internet 💙📚'
                : "You're an amazing safe reader! Keep asking grown-ups about things online! 💙📚"}
            </p>
          </div>
        </div>

        {mastered && nextUnit && (
          <Link
            to={`/unit/${nextUnit.id}`}
            className="inline-block px-8 py-3 rounded-full text-white text-lg font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform uppercase tracking-wide"
            style={{ background: 'linear-gradient(135deg, #4A90E2, #D946A6)' }}
          >
            {t('safetyQuiz.instagram.ctaNextUnit', { unitTitle: nextUnit.title })}
          </Link>
        )}
      </div>
    )
  }

  return null
}

export default RedditForumsSafetyQuiz
