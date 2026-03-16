import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'
import { useTranslation } from './contexts/LocaleContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const HOMEWORK_CONSENT_KEY = 'sparki_homework_consent'

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
  const [homeworkConfigured, setHomeworkConfigured] = useState<boolean | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [hasConsent, setHasConsent] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [consentEmail, setConsentEmail] = useState('')
  const [consentCheckbox, setConsentCheckbox] = useState(false)
  const [consentError, setConsentError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(HOMEWORK_CONSENT_KEY)
      if (raw) {
        const data = JSON.parse(raw)
        if (data?.email && data?.agreedAt) setHasConsent(true)
      }
    } catch {
      setHasConsent(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((res) => res.json().catch(() => ({})))
      .then((data) => {
        if (cancelled) return
        if (typeof data.videoFeatureEnabled === 'boolean') {
          setVideoFeatureEnabled(data.videoFeatureEnabled)
        } else {
          setVideoFeatureEnabled(false)
        }
        if (typeof data.homeworkAdventureConfigured === 'boolean') {
          setHomeworkConfigured(data.homeworkAdventureConfigured)
        } else {
          setHomeworkConfigured(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setVideoFeatureEnabled(false)
          setHomeworkConfigured(null)
        }
      })
    return () => { cancelled = true }
  }, [])

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

  const doGenerate = useCallback(async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/process-homework', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json().catch(() => ({ error: t('homeworkPage.errorGeneric') }))
      if (!res.ok) {
        const msg = typeof data?.error === 'string' ? data.error : t('homeworkPage.errorGeneric')
        setError(msg)
        return
      }
      if (data?.title && data?.subject != null && Array.isArray(data?.steps) && data.steps.length > 0) {
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
  }, [file, t])

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
    if (!hasConsent) {
      setShowConsentModal(true)
      return
    }
    await doGenerate()
  }

  const handleConsentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setConsentError(null)
    const email = consentEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setConsentError('Please enter a valid email address.')
      return
    }
    if (!consentCheckbox) {
      setConsentError('Please confirm you have permission to share this homework.')
      return
    }
    try {
      sessionStorage.setItem(
        HOMEWORK_CONSENT_KEY,
        JSON.stringify({ email, agreedAt: Date.now() })
      )
      setHasConsent(true)
      setShowConsentModal(false)
      setConsentEmail('')
      setConsentCheckbox(false)
      setConsentError(null)
      doGenerate()
    } catch {
      setConsentError(t('homeworkPage.errorGeneric'))
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
        const msg = typeof data?.error === 'string' ? data.error : t('homeworkPage.videoErrorGeneric')
        setVideoError(msg)
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
      <Dialog open={showConsentModal} onOpenChange={(open) => { setShowConsentModal(open); if (!open) setConsentError(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('homeworkPage.consentTitle')}</DialogTitle>
            <DialogDescription>{t('homeworkPage.consentDesc')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConsentSubmit}>
            <label className="block text-sm font-medium mt-2 mb-1">
              {t('homeworkPage.consentEmailLabel')}
            </label>
            <input
              type="email"
              value={consentEmail}
              onChange={(e) => setConsentEmail(e.target.value)}
              placeholder={t('homeworkPage.consentEmailPlaceholder')}
              className="w-full border border-slate-300 rounded-md px-3 py-2 mb-3"
              autoComplete="email"
            />
            <label className="flex items-start gap-2 mt-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentCheckbox}
                onChange={(e) => setConsentCheckbox(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm">{t('homeworkPage.consentCheckbox')}</span>
            </label>
            {consentError && <p className="quiz-error text-sm mb-2">{consentError}</p>}
            <DialogFooter className="gap-2 sm:gap-0">
              <button
                type="button"
                className="secondary-button"
                onClick={() => { setShowConsentModal(false); setConsentError(null) }}
              >
                {t('homeworkPage.consentCancel')}
              </button>
              <button type="submit" className="primary-button">
                {t('homeworkPage.consentAgree')}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
              {homeworkConfigured === false && (
                <p className="quiz-error" role="alert">
                  {t('homeworkPage.errorNotConfigured')}
                </p>
              )}
              {error && <p className="quiz-error">{error}</p>}
              <button
                type="submit"
                className="primary-button"
                disabled={loading || homeworkConfigured === false}
              >
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
                {adventure.steps.length > 1 && (
                  <span className="homework-step-indicator" style={{ marginLeft: '0.5rem' }}>
                    (Step {currentStepIndex + 1} of {adventure.steps.length})
                  </span>
                )}
              </p>
              <div className="homework-step">
                <p className="homework-step-story">{currentStep.story ?? ''}</p>
                <p className="homework-step-prompt">{currentStep.prompt ?? ''}</p>
                {showHint ? (
                  <p className="homework-step-hint">
                    <strong>{t('homeworkPage.hintLabel')}</strong> {currentStep.hint ?? ''}
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
              {adventure.steps.length > 1 && (
                <div className="homework-step-nav" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={currentStepIndex === 0}
                    onClick={() => { setCurrentStepIndex((i) => Math.max(0, i - 1)); setShowHint(false) }}
                    aria-label={t('homeworkPage.prevStep')}
                  >
                    {t('homeworkPage.prevStep')}
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    disabled={currentStepIndex >= adventure.steps.length - 1}
                    onClick={() => { setCurrentStepIndex((i) => Math.min(adventure.steps.length - 1, i + 1)); setShowHint(false) }}
                    aria-label={t('homeworkPage.nextStep')}
                  >
                    {t('homeworkPage.nextStep')}
                  </button>
                </div>
              )}
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
                      {videoError && (
                        <p className="quiz-error">
                          {videoError}
                          <br />
                          <small style={{ opacity: 0.9 }}>Check /api/setup-status to verify all services are configured.</small>
                        </p>
                      )}
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

