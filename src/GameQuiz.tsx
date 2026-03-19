import React from 'react'
import { Link } from 'react-router-dom'
import type { UnitConfig } from './curriculum'

export interface GameQuizProps {
  unit: UnitConfig
  selected: number[]
  onAnswer: (qIndex: number, optionIndex: number) => void
  onSubmit: React.FormEventHandler<HTMLFormElement>
  score: number | null
  error: string | null
  earnedSparkles: number | null
  wasAlreadyMastered: boolean
  mastered: boolean
  nextUnit: UnitConfig | null
  correctCountText: string
  /** Optional header badge (e.g. "Kid-safe apps checkup") */
  badgeLabel?: string
  /** Optional quiz title override */
  titleOverride?: string
}

const GameQuiz: React.FC<GameQuizProps> = ({
  unit,
  selected,
  onAnswer,
  onSubmit,
  score,
  error,
  earnedSparkles,
  wasAlreadyMastered,
  mastered,
  nextUnit,
  correctCountText,
  badgeLabel,
  titleOverride,
}) => {
  const hasSubmitted = score !== null
  const masteryPercent =
    hasSubmitted && unit.quizQuestions.length > 0 && score !== null
      ? Math.round((score / unit.quizQuestions.length) * 100)
      : 0

  return (
    <div className="rounded-2xl bg-amber-50/90 border-2 border-amber-200/80 shadow-xl p-5 sm:p-6 animate-pop-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-primary flex items-center justify-center text-2xl animate-float-bounce"
          aria-hidden
        >
          ✦
        </div>
        <div>
          {badgeLabel && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-200/60 px-2.5 py-1 rounded-full animate-sparkle-in">
              <span>✦</span> {badgeLabel}
            </span>
          )}
          <h3 className="text-xl font-bold text-slate-800 mt-0.5">
            {titleOverride ?? "SpArki's Quiz"}
          </h3>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-5">
        Try your best! SpArki gives sparkles for effort and careful thinking, not perfection.
      </p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {unit.quizQuestions.map((_, i) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              selected[i] !== -1 ? 'bg-primary' : 'bg-slate-300'
            }`}
            aria-hidden
          />
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {unit.quizQuestions.map((q, qIndex) => {
          const correctIndex = q.correctIndex
          const userChoice = selected[qIndex]
          return (
            <div
              key={q.id}
              className="rounded-xl border-2 border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <p className="font-semibold text-slate-800 mb-3">
                {qIndex + 1}. {q.prompt}
              </p>
              <div className="grid gap-2 sm:grid-cols-1">
                {q.options.map((option, oIndex) => {
                  const isCorrect = oIndex === correctIndex
                  const isWrong = hasSubmitted && userChoice === oIndex && userChoice !== correctIndex
                  const isChosen = userChoice === oIndex
                  return (
                    <label
                      key={oIndex}
                      className={`
                        flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all
                        ${!hasSubmitted ? 'border-slate-200 hover:border-primary hover:bg-blue-50/50' : ''}
                        ${hasSubmitted && isCorrect ? 'border-green-500 bg-green-50' : ''}
                        ${isWrong ? 'border-red-400 bg-red-50' : ''}
                        ${hasSubmitted && !isCorrect && !isWrong ? 'border-slate-200 opacity-75' : ''}
                      `}
                    >
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        value={oIndex}
                        checked={isChosen}
                        onChange={() => onAnswer(qIndex, oIndex)}
                        disabled={hasSubmitted}
                        className="w-5 h-5 text-primary accent-primary"
                      />
                      <span className={`font-medium ${hasSubmitted && isCorrect ? 'text-green-800' : isWrong ? 'text-red-800' : 'text-slate-700'}`}>
                        {option}
                      </span>
                      {hasSubmitted && isCorrect && <span className="ml-auto text-green-600" aria-hidden>✓</span>}
                      {isWrong && <span className="ml-auto text-red-600" aria-hidden>✗</span>}
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}

        {error && (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={hasSubmitted}
          className="w-full py-3 px-5 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
        >
          {hasSubmitted ? 'Submitted' : 'Check my score'}
        </button>
      </form>

      {hasSubmitted && (
        <div className="mt-5 p-4 rounded-xl bg-white/80 border border-amber-200 space-y-2 animate-pop-in">
          <p className="font-semibold text-slate-800">{correctCountText}</p>

          <div className="gamequiz-mastery-bar" aria-hidden>
            <div className="gamequiz-mastery-bar-fill" style={{ width: `${masteryPercent}%` }} />
            {masteryPercent >= 80 && <div className="gamequiz-mastery-confetti" />}
          </div>

          {earnedSparkles !== null && earnedSparkles > 0 && (
            <p className="text-amber-800">
              SpArki added <strong>{earnedSparkles}</strong> sparkles to your total!
            </p>
          )}
          {wasAlreadyMastered && (
            <p className="text-slate-600 text-sm">You&apos;ve already mastered this unit. Keep practicing anytime!</p>
          )}
          {!wasAlreadyMastered && mastered && (
            <p className="text-green-700 font-medium">Amazing work! You just mastered this unit.</p>
          )}
          {mastered && nextUnit && (
            <Link
              to={`/unit/${nextUnit.id}`}
              className="inline-block mt-3 py-2.5 px-5 rounded-xl font-bold text-white bg-primary hover:bg-blue-600 shadow-md transition-all"
            >
              Go to {nextUnit.title} →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default GameQuiz
