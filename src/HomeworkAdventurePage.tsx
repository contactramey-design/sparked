import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'
import { useTranslation } from './contexts/LocaleContext'

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

const HomeworkAdventurePage: React.FC = () => {
  const { t, locale } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [adventure, setAdventure] = useState<HomeworkAdventure | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [videoFeatureEnabled, setVideoFeatureEnabled] = useState<boolean | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  useEffect(() => {
    if (!adventure) return
    let cancelled = false
    fetch('/api/config')
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (!cancelled && typeof data.videoFeatureEnabled === 'boolean') {
          setVideoFeatureEnabled(data.videoFeatureEnabled)
        } else {
          setVideoFeatureEnabled(false)
        }
      })
      .catch(() => {
        if (!cancelled) setVideoFeatureEnabled(false)
      })
    return () => { cancelled = true }
  }, [adventure])

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const chosen = event.target.files?.[0] ?? null
    setError(null)
    setAdventure(null)
    setCurrentStepIndex(0)
    setShowHint(false)
    setVideoUrl(null)
    setVideoError(null)

    if (!chosen) {
      setFile(null)
      setPreviewUrl(null)
      return
    }

    if (!chosen.type.startsWith('image/')) {
      setError(t('homeworkPage.errorFileType'))
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
    setVideoUrl(null)
    setVideoError(null)

    if (!file) {
      setError(t('homeworkPage.errorChooseFirst'))
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/process-homework', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : t('homeworkPage.errorGeneric')
        setError(msg)
        return
      }
      if (data?.title && data?.subject != null && Array.isArray(data?.steps)) {
        setAdventure(data as HomeworkAdventure)
        setCurrentStepIndex(0)
      } else {
        setError(t('homeworkPage.errorCreate'))
      }
    } catch {
      setError(t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const currentStep =
    adventure && adventure.steps.length > 0 ? adventure.steps[currentStepIndex] : null

  const handleCreateVideo = async () => {
    if (!adventure) return
    setVideoError(null)
    setVideoLoading(true)
    try {
      const res = await fetch('/api/generate-adventure-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adventure }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 403) {
          setVideoFeatureEnabled(false)
        }
        setVideoError(typeof data?.error === 'string' ? data.error : t('homeworkPage.videoErrorGeneric'))
        return
      }
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl)
      } else {
        setVideoError(t('homeworkPage.videoErrorNoUrl'))
      }
    } catch {
      setVideoError(t('homeworkPage.errorGeneric'))
    } finally {
      setVideoLoading(false)
    }
  }

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <div>
          <h2>{t('homeworkPage.title')}</h2>
          <p className="welcome-subtitle">
            {t('homeworkPage.subtitle')}
          </p>
        </div>
        <Link to="/dashboard" className="link-back">
          {t('common.backToDashboard')}
        </Link>
      </header>

      <div className="lesson-layout">
        <div className="lesson-media">
          <p>{t('homeworkPage.intro')}</p>

          <div className="video-wrapper">
            <p className="video-caption">{t('homeworkPage.videoCaption')}</p>
            <video
              controls
              preload="metadata"
              poster={VIDEO_POSTER_DATA_URL}
              style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              aria-label="SpArki Homework Adventure intro video"
            >
              <source src="/sparkiadventureintro.mp4" type="video/mp4" />
              Sorry, your browser doesn’t support the video tag.
            </video>
          </div>

          <div className="activity-section">
            <h3>{t('homeworkPage.grownUpUpload')}</h3>
            <p>{t('homeworkPage.grownUpUploadDesc')}</p>
            <form className="homework-upload-form" onSubmit={handleGenerate}>
              <label className="file-input-label">
                {t('homeworkPage.fileLabel')}
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
                {loading ? t('homeworkPage.creatingButton') : t('homeworkPage.createButton')}
              </button>
            </form>
          </div>
        </div>

        <div className="lesson-quiz card">
          <h3>{t('homeworkPage.sparkiAdventureTitle')}</h3>
          {!adventure && (
            <>
              <p>{t('homeworkPage.afterCreateDesc')}</p>
              <Link to="/tracks" className="secondary-button">
                {t('homeworkPage.exploreUnits')}
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
                    <strong>{t('homeworkPage.hintLabel')}</strong> {currentStep.hint}
                  </p>
                ) : (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setShowHint(true)}
                  >
                    {t('homeworkPage.hintButton')}
                  </button>
                )}
              </div>
              {videoFeatureEnabled === true && (
                <div className="homework-video-section" style={{ marginTop: '1.5rem' }}>
                  {!videoUrl ? (
                    <>
                      <p>{t('homeworkPage.videoSectionIntro')}</p>
                      <button
                        type="button"
                        className="primary-button"
                        disabled={videoLoading}
                        onClick={handleCreateVideo}
                      >
                        {videoLoading ? t('homeworkPage.creatingVideo') : t('homeworkPage.createVideo')}
                      </button>
                      {videoError && <p className="quiz-error">{videoError}</p>}
                    </>
                  ) : (
                    <>
                      <p>{t('homeworkPage.videoSectionTitle')}</p>
                      <video
                        src={videoUrl}
                        controls
                        preload="metadata"
                        style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
                        aria-label="SpArki adventure video"
                      >
                        Your browser does not support the video tag.
                      </video>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HomeworkAdventurePage

