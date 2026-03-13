import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { curriculum } from './curriculum'
import { updateUnitAfterQuiz, getUnitStatus } from './progress'
import CompletionCelebration from './CompletionCelebration'

const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const unit = curriculum.units.find((u) => u.id === unitId)

  const [selected, setSelected] = useState<number[]>(
    unit ? Array(unit.quizQuestions.length).fill(-1) : [],
  )
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [earnedSparkles, setEarnedSparkles] = useState<number | null>(null)

  const existingStatus = unit ? getUnitStatus(unit.id) : null
  const wasAlreadyMastered = !!existingStatus?.mastered
  const [mastered, setMastered] = useState<boolean>(wasAlreadyMastered)
  const [showCelebration, setShowCelebration] = useState(false)

  const nextUnit =
    unit && unit.unlocksUnitId
      ? curriculum.units.find((u) => u.id === unit.unlocksUnitId)
      : null

  if (!unit) {
    navigate('/tracks', { replace: true })
    return null
  }

  const track = curriculum.tracks.find((t) => t.id === unit.trackId)

  const handleChange = (qIndex: number, optionIndex: number) => {
    const next = [...selected]
    next[qIndex] = optionIndex
    setSelected(next)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setError(null)

    if (selected.some((i) => i === -1)) {
      setError('Please answer all questions before checking your score.')
      return
    }

    let correct = 0
    unit.quizQuestions.forEach((q, idx) => {
      if (selected[idx] === q.correctIndex) correct += 1
    })
    setScore(correct)

    const result = updateUnitAfterQuiz(unit, correct, unit.quizQuestions.length)
    setEarnedSparkles(result.earnedThisAttempt)

    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)

    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const correctCountText =
    score !== null
      ? `You got ${score} out of ${unit.quizQuestions.length} correct.`
      : ''

  return (
    <section className="lesson-page">
      {showCelebration && (
        <CompletionCelebration
          explorerName={
            typeof window !== 'undefined'
              ? window.localStorage.getItem('spark_academy_username') || 'Explorer'
              : 'Explorer'
          }
          unitTitle={unit.title}
          onClose={() => setShowCelebration(false)}
        />
      )}

      <header className="lesson-header">
        <div>
          <h2>{unit.title}</h2>
          {track && <p className="welcome-subtitle">{track.title}</p>}
        </div>
        <Link to={`/track/${unit.trackId}`} className="link-back">
          ← Back to Track
        </Link>
      </header>

      <div className="lesson-layout">
        <div className="lesson-media">
          <p>{unit.summary}</p>

          {unit.id === 'ai-1-what-is-ai' && (
            <div className="video-wrapper">
              <video controls width="100%" poster="/ai-1-poster.png">
                <source src="/Unit1b_intro_.mp4" type="video/mp4" />
                Sorry, your browser does not support embedded videos.
              </video>
            </div>
          )}

          <div className="activity-section">
            <h3>Learn with SpArki</h3>
            <ul>
              {unit.contentBlocks.map((block, index) => (
                <li key={index}>{block}</li>
              ))}
            </ul>
          </div>

          <div className="song-section">
            <h3>Unit Activity</h3>
            <p>{unit.activity.description}</p>
          </div>
        </div>

        <div className="lesson-quiz card">
          <h3>SpArki&apos;s Unit Quiz</h3>
          <p>
            Try your best! SpArki gives out sparkles for effort and careful thinking,
            not perfection.
          </p>

          <form onSubmit={handleSubmit}>
            {unit.quizQuestions.map((q, qIndex) => (
              <div key={q.id} className="quiz-question">
                <p>
                  {qIndex + 1}. {q.prompt}
                </p>
                <div className="quiz-options">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className="quiz-option">
                      <input
                        type="radio"
                        name={`q-${qIndex}`}
                        value={oIndex}
                        checked={selected[qIndex] === oIndex}
                        onChange={() => handleChange(qIndex, oIndex)}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {error && <p className="quiz-error">{error}</p>}

            <button type="submit" className="primary-button quiz-submit">
              Check my score
            </button>
          </form>

          {score !== null && (
            <div className="quiz-result">
              <p>{correctCountText}</p>
              {earnedSparkles !== null && earnedSparkles > 0 && (
                <p>
                  SpArki added <strong>{earnedSparkles}</strong> new sparkles to your
                  total!
                </p>
              )}
              {wasAlreadyMastered && (
                <p className="quiz-note">
                  You&apos;ve already mastered this unit. You can still practice as much
                  as you like.
                </p>
              )}
              {!wasAlreadyMastered && mastered && (
                <p className="quiz-note">
                  Amazing work! You just mastered this unit. You can come back any time
                  to practice again.
                </p>
              )}
              {mastered && nextUnit && (
                <div className="quiz-next">
                  <p>Ready for your next adventure with SpArki?</p>
                  <Link to={`/unit/${nextUnit.id}`} className="primary-button">
                    Go to {nextUnit.title}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default UnitPage
