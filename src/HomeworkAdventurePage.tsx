import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface HomeworkAdventureStep {
  id: string
  story: string
  prompt: string
  hint: string
}

interface HomeworkAdventure {
  title: string
  subject: string
  topic: string
  steps: HomeworkAdventureStep[]
}

const LOCAL_MOCK_ADVENTURE: HomeworkAdventure = {
  title: 'The Lost Math Treasure',
  subject: 'math',
  topic: 'addition within 20',
  steps: [
    {
      id: 'step-1',
      story:
        'SpArki and you find a treasure map with numbers on it. The first clue says: "Solve the first addition problem on your worksheet to light up the map."',
      prompt:
        'Look at the first addition problem on your homework. Solve it on your paper, then say your answer out loud.',
      hint:
        'Add the two numbers slowly. You can count on your fingers or draw dots to help you.',
    },
  ],
}

const HomeworkAdventurePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adventure, setAdventure] = useState<HomeworkAdventure | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const chosen = event.target.files?.[0] ?? null
    setError(null)
    setAdventure(null)
    setCurrentStepIndex(0)
    setShowHint(false)

    if (!chosen) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    if (!chosen.type.startsWith('image/')) {
      setError('Please choose a JPG or PNG homework photo.')
      setFile(null)
      setPreviewUrl(null)
      return
    }

    setFile(chosen)
    const url = URL.createObjectURL(chosen)
    setPreviewUrl(url)
  }

  const handleGenerate: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setError(null)
    setAdventure(null)
    setCurrentStepIndex(0)
    setShowHint(false)

    if (!file) {
      setError('Please choose a homework image first.')
      return
    }

    setLoading(true)
    try {
      // In this rebuild we fall back to a local mock.
      // You can later swap this for a real /api/homework call.
      setAdventure(LOCAL_MOCK_ADVENTURE)
      setCurrentStepIndex(0)
    } finally {
      setLoading(false)
    }
  }

  const currentStep =
    adventure && adventure.steps.length > 0 ? adventure.steps[currentStepIndex] : null

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <div>
          <h2>Homework Adventure (K–2)</h2>
          <p className="welcome-subtitle">
            Turn a homework page into a safe, guided story adventure with SpArki.
          </p>
        </div>
        <Link to="/dashboard" className="link-back">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="lesson-layout">
        <div className="lesson-media">
          <p>
            Grown-ups can upload a K–2 homework page, and SpArki will turn it into a short,
            story-based quest that guides (but never gives away the answers).
          </p>

          <div className="video-wrapper">
            <video
              controls
              style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
            >
              <source src="/homeworkIntro.mp4" type="video/mp4" />
              Sorry, your browser doesn’t support the video tag.
            </video>
          </div>

          <div className="activity-section">
            <h3>Grown-Up Upload</h3>
            <p>
              This tool is designed for grown-ups. Please make sure you have permission to share
              the homework page and avoid including full names, addresses, or school details in
              the photo.
            </p>
            <form className="homework-upload-form" onSubmit={handleGenerate}>
              <label className="file-input-label">
                Homework image (JPG/PNG)
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-label="Upload homework image"
                />
              </label>
              {previewUrl && (
                <div className="homework-preview">
                  <img
                    src={previewUrl}
                    alt="Selected homework preview"
                    className="homework-preview-image"
                  />
                </div>
              )}
              {error && <p className="quiz-error">{error}</p>}
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Creating adventure…' : 'Create adventure'}
              </button>
            </form>
          </div>
        </div>

        <div className="lesson-quiz card">
          <h3>SpArki&apos;s Homework Adventure</h3>
          {!adventure && (
            <>
              <p>
                After you create an adventure, you&apos;ll see SpArki&apos;s story steps and gentle
                hints here. You can already explore SpArki&apos;s core units and quizzes today.
              </p>
              <Link to="/tracks" className="secondary-button">
                Explore K–2 Units
              </Link>
            </>
          )}

          {adventure && currentStep && (
            <div className="homework-adventure">
              <h4>{adventure.title}</h4>
              <p className="homework-adventure-meta">
                {adventure.subject} · {adventure.topic}
              </p>
              <div className="homework-step">
                <p className="homework-step-story">{currentStep.story}</p>
                <p className="homework-step-prompt">{currentStep.prompt}</p>
                {showHint ? (
                  <p className="homework-step-hint">
                    <strong>SpArki&apos;s hint:</strong> {currentStep.hint}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowHint(true)}
                  >
                    Need a gentle hint?
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeworkAdventurePage

