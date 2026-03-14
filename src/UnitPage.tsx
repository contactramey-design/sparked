import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { curriculum } from './curriculum'
import { updateUnitAfterQuiz, getUnitStatus, getHasSafetyPass } from './progress'
import CompletionCelebration from './CompletionCelebration'
import GameQuiz from './GameQuiz'
import InstagramSafetyQuiz from './InstagramSafetyQuiz'
import TikTokSafetyQuiz from './TikTokSafetyQuiz'
import SnapchatSafetyQuiz from './SnapchatSafetyQuiz'

function isYouTubeEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed\/|youtu\.be\//i.test(url)
}

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
  const hasSafetyPass = getHasSafetyPass()

  const [materialFinished, setMaterialFinished] = useState(false)
  const [thinkPromptOpen, setThinkPromptOpen] = useState<number | null>(null)
  const materialEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!materialEndRef.current || materialFinished) return
    const el = materialEndRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setMaterialFinished(true)
      },
      { threshold: 0.5, rootMargin: '0px 0px 100px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [materialFinished])

  const nextUnit =
    unit && unit.unlocksUnitId
      ? curriculum.units.find((u) => u.id === unit.unlocksUnitId)
      : null

  if (!unit) {
    navigate('/tracks', { replace: true })
    return null
  }

  const track = curriculum.tracks.find((t) => t.id === unit.trackId)

  const isPaidSafety =
    unit.trackId === 'social-safety' && !unit.isFree
  const lockedByPayment = isPaidSafety && !hasSafetyPass

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

  const handleSafeAppComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleTikTokComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unit.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
    if (!wasAlreadyMastered && justMastered) {
      setShowCelebration(true)
    }
  }

  const handleSnapchatComplete = (correctCount: number) => {
    const total = 8
    const result = updateUnitAfterQuiz(unit, correctCount, total)
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

  const videoSrc = unit.videoUrl ?? (unit.id === 'ai-1-what-is-ai' ? '/Unit1b_intro_.mp4' : undefined)
  const showVideo = !!videoSrc

  if (lockedByPayment) {
    return (
      <section className="lesson-page unit-page-single">
        <div className="unit-cyber-layer">
          <div className="unit-grid-plane" />
          <div className="unit-polygon" />
          <div className="unit-polygon" />
          <div className="unit-polygon" />
        </div>

        <header className="lesson-header">
          <div>
            <h2>{unit.title}</h2>
            {track && <p className="welcome-subtitle">{track.title}</p>}
          </div>
          <Link to={`/track/${unit.trackId}`} className="link-back">
            ← Back to Track
          </Link>
        </header>

        <div className="unit-material-section card">
          <h3>Locked for kids</h3>
          <p>
            This safety lesson is available when a grown-up turns on the Safety Pass
            in the Parent area. One safety unit is always free so kids can learn core
            rules without any purchase.
          </p>
          <Link to="/parent" className="secondary-button">
            Grown-up? Open Parent view
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="lesson-page unit-page-single">
      <div className="unit-cyber-layer">
        <div className="unit-grid-plane" />
        <div className="unit-polygon" />
        <div className="unit-polygon" />
        <div className="unit-polygon" />
      </div>

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

      {thinkPromptOpen !== null && unit.thinkPrompts?.[thinkPromptOpen] && (
        <div
          className="think-prompt-overlay"
          role="dialog"
          aria-label="Think about this"
          onClick={() => setThinkPromptOpen(null)}
        >
          <div
            className="think-prompt-modal card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{unit.thinkPrompts![thinkPromptOpen].label}</h3>
            <p>{unit.thinkPrompts![thinkPromptOpen].text}</p>
            <button
              type="button"
              className="primary-button"
              onClick={() => setThinkPromptOpen(null)}
            >
              OK, I thought about it!
            </button>
          </div>
        </div>
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

      <div className="unit-material-section card">
        <p className="unit-summary">{unit.summary}</p>

        {showVideo && (
          <div className="video-wrapper">
            {videoSrc && isYouTubeEmbedUrl(videoSrc) ? (
              <iframe
                src={videoSrc}
                title={`Video for ${unit.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="unit-video-iframe"
              />
            ) : (
              <video controls width="100%" poster="/ai-1-poster.png">
                <source src={videoSrc} type="video/mp4" />
                Sorry, your browser does not support embedded videos.
              </video>
            )}
          </div>
        )}

        <div className="unit-content-blocks">
          <h3>Learn with SpArki</h3>
          <ul>
            {unit.contentBlocks.map((block, index) => (
              <li key={index}>{block}</li>
            ))}
          </ul>
        </div>

        {unit.thinkPrompts && unit.thinkPrompts.length > 0 && (
          <div className="unit-think-prompts">
            <h3>Pause & think</h3>
            {unit.thinkPrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                className="think-prompt-button"
                onClick={() => setThinkPromptOpen(index)}
              >
                {prompt.label}
              </button>
            ))}
          </div>
        )}

        <div className="unit-activity card">
          <h3>Unit Activity</h3>
          <p>{unit.activity.description}</p>
        </div>

        <div ref={materialEndRef} className="unit-material-end">
          <button
            type="button"
            className="primary-button finish-material-button"
            onClick={() => setMaterialFinished(true)}
          >
            I&apos;ve finished the material — show my quiz
          </button>
        </div>
      </div>

      {materialFinished && unit.id === 'safety-instagram' && (
        <div className="unit-quiz-section mt-6">
          <InstagramSafetyQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleSafeAppComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-tiktok' && (
        <div className="unit-quiz-section mt-6">
          <TikTokSafetyQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleTikTokComplete}
          />
        </div>
      )}
      {materialFinished && unit.id === 'safety-snapchat' && (
        <div className="unit-quiz-section mt-6">
          <SnapchatSafetyQuiz
            unit={unit}
            nextUnit={nextUnit ?? null}
            earnedSparkles={earnedSparkles}
            mastered={mastered}
            onComplete={handleSnapchatComplete}
          />
        </div>
      )}
      {materialFinished && unit.id !== 'safety-instagram' && unit.id !== 'safety-tiktok' && unit.id !== 'safety-snapchat' && (
        <div className="unit-quiz-section mt-6">
          <GameQuiz
            unit={unit}
            selected={selected}
            onAnswer={handleChange}
            onSubmit={handleSubmit}
            score={score}
            error={error}
            earnedSparkles={earnedSparkles}
            wasAlreadyMastered={wasAlreadyMastered}
            mastered={mastered}
            nextUnit={nextUnit ?? null}
            correctCountText={correctCountText}
          />
        </div>
      )}
    </section>
  )
}

export default UnitPage
