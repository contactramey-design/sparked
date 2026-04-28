import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { getHomeworkCheckoutSessionId } from '@/progress'
import { explainWorksheet, storyFromLesson } from '../api/homeworkApi'
import { requestHomeworkVisuals } from '../lib/visualGenerator'
import { getHomeworkJob, saveHomeworkJob } from '../hooks/useHomeworkJob'
import { useHomeworkSkipCheckoutGate } from '../hooks/useHomeworkAllowUnauth'
import { getAvatarPreset } from '../constants/avatarPresets'
import type { HomeworkJob } from '../types/homework'
import { HomeworkPreview } from '../components/HomeworkPreview'
import { AnalyzeSummary } from '../components/AnalyzeSummary'
import { ExplanationCard } from '../components/ExplanationCard'
import { PracticeCard } from '../components/PracticeCard'
import { StoryCard } from '../components/StoryCard'
import { GenerateButton } from '../components/GenerateButton'
import { AdventureVisuals } from '../components/AdventureVisuals'
import { HomeworkQualityPanel } from '../components/HomeworkQualityPanel'
import { HomeworkPedagogyBanner } from '../components/HomeworkPedagogyBanner'
import {
  buildHomeworkQuestForTutor,
  bumpHomeworkQuestHandoffCount,
  canHomeworkQuestHandoffToday,
  saveHomeworkQuestForTutorSession,
} from '../lib/homeworkQuestForTutor'

function clearAutoVisualSessionFlag(jobId: string) {
  try {
    sessionStorage.removeItem(`sparki_hw_autovisual_ok_${jobId}`)
  } catch {
    /* ignore */
  }
}

export default function HomeworkResult() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [job, setJob] = useState<HomeworkJob | null>(null)
  const [loading, setLoading] = useState<'explain' | 'story' | 'fix' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!jobId) {
      setJob(null)
      return
    }
    setJob(getHomeworkJob(jobId))
  }, [jobId])

  const persist = useCallback((next: HomeworkJob) => {
    saveHomeworkJob(next)
    setJob(next)
  }, [])

  const session = getHomeworkCheckoutSessionId()
  const homeworkSkipCheckoutGate = useHomeworkSkipCheckoutGate()

  const autoVisualKey = jobId ? `sparki_hw_autovisual_ok_${jobId}` : ''

  /** Auto-illustrate story once per job when entitled (matches product “magical” default). */
  useEffect(() => {
    if (!jobId || !autoVisualKey || !job?.story || job.isDemo) return
    if (job.storyVisuals && job.storyVisuals.length > 0) return
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(autoVisualKey) === '1') return
    } catch {
      /* ignore */
    }
    const checkoutSessionId = getHomeworkCheckoutSessionId()
    if (import.meta.env.PROD && !checkoutSessionId && !homeworkSkipCheckoutGate) return

    let cancelled = false
    ;(async () => {
      try {
        const latest = getHomeworkJob(jobId)
        if (cancelled || !latest?.story || (latest.storyVisuals && latest.storyVisuals.length > 0)) return
        const preset = getAvatarPreset(latest.avatarPresetId)
        const avatarDescription = preset.imagePromptDescription
        const images = await requestHomeworkVisuals(latest.story, {
          language: latest.language,
          checkoutSessionId,
          avatarDescription,
        })
        persist({ ...latest, storyVisuals: images })
        try {
          sessionStorage.setItem(autoVisualKey, '1')
        } catch {
          /* ignore */
        }
      } catch {
        /* user can tap “Illustrate my story” to retry */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [jobId, autoVisualKey, job?.story, job?.storyVisuals?.length, job?.isDemo, homeworkSkipCheckoutGate, persist])

  const regenerateExplain = async () => {
    if (!job) return
    setError(null)
    setLoading('explain')
    try {
      const explanation = await explainWorksheet(job.analysis, session)
      persist({ ...job, explanation })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(null)
    }
  }

  const applyTopicCorrection = async ({ subject, topic }: { subject: string; topic: string }) => {
    if (!job) return
    setError(null)
    setLoading('fix')
    try {
      const nextAnalysis = {
        ...job.analysis,
        subject: subject.trim() || job.analysis.subject,
        topic: topic.trim() || job.analysis.topic,
        needsReview: false,
      }
      setLoading('explain')
      const explanation = await explainWorksheet(nextAnalysis, session)
      let nextStory: typeof job.story = job.mode === 'story' ? job.story : undefined
      if (job.mode === 'story') {
        setLoading('story')
        nextStory = await storyFromLesson(nextAnalysis, explanation, session)
      }
      clearAutoVisualSessionFlag(job.jobId)
      persist({
        ...job,
        analysis: nextAnalysis,
        explanation,
        story: nextStory,
        storyVisuals: undefined,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(null)
    }
  }

  const regenerateStory = async () => {
    if (!job?.explanation) return
    setError(null)
    setLoading('story')
    try {
      const story = await storyFromLesson(job.analysis, job.explanation, session)
      clearAutoVisualSessionFlag(job.jobId)
      persist({ ...job, story, mode: 'story', storyVisuals: undefined })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(null)
    }
  }

  if (!jobId) {
    return null
  }

  if (!job) {
    return (
      <div className="card text-center py-10 space-y-4">
        <p>{t('homeworkFeature.resultNotFound')}</p>
        <Link to="/homework/upload" className="primary-button inline-block">
          {t('homeworkFeature.ctaUpload')}
        </Link>
        <Link to="/homework/history" className="secondary-button inline-block ml-2">
          {t('homeworkFeature.ctaHistory')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <HomeworkPedagogyBanner />

      {job.previewDataUrl ? (
        <div>
          <h3 className="text-lg font-bold text-blue-900 mb-2">{t('homeworkFeature.previewHeading')}</h3>
          <HomeworkPreview src={job.previewDataUrl} alt={t('homeworkPage.previewAlt')} />
        </div>
      ) : null}

      <HomeworkQualityPanel
        analysis={job.analysis}
        allowFix={!job.isDemo}
        busy={loading === 'fix' || loading === 'explain' || loading === 'story'}
        onApplyCorrection={applyTopicCorrection}
      />

      <div>
        <h3 className="text-lg font-bold text-blue-900 mb-2">{t('homeworkFeature.summaryHeading')}</h3>
        <AnalyzeSummary
          analysis={job.analysis}
          labels={{
            subject: t('homeworkFeature.labelSubject'),
            topic: t('homeworkFeature.labelTopic'),
            grade: t('homeworkFeature.labelGrade'),
            learning: t('homeworkFeature.labelLearning'),
            confidence: t('homeworkFeature.labelConfidence'),
            review: t('homeworkFeature.labelReview'),
            extracted: t('homeworkFeature.labelExtracted'),
          }}
        />
      </div>

      {job.explanation ? (
        <>
          <ExplanationCard
            explanation={job.explanation}
            labels={{
              title: t('homeworkFeature.explainHeading'),
              steps: t('homeworkFeature.stepsHeading'),
              parent: t('homeworkFeature.parentHeading'),
              offline: t('homeworkFeature.offlineTryHeading'),
            }}
          />
          <PracticeCard questions={job.explanation.practiceQuestions} title={t('homeworkFeature.practiceHeading')} />
        </>
      ) : null}

      {job.story ? (
        <>
          <StoryCard
            story={job.story}
            labels={{
              title: t('homeworkFeature.storyHeading'),
              scene: t('homeworkFeature.sceneLabel'),
              recap: t('homeworkFeature.recapHeading'),
              teachingPoint: t('homeworkFeature.teachingPoint'),
              fictionNote: t('homeworkFeature.storyFictionNote'),
            }}
          />
          <AdventureVisuals
            story={job.story}
            language={job.language}
            checkoutSessionId={session}
            avatarPresetId={job.avatarPresetId}
            storyVisuals={job.storyVisuals}
            onUpdateJob={(partial) => persist({ ...job, ...partial })}
          />
        </>
      ) : null}

      {job.story || job.explanation ? (
        <div className="rounded-2xl border border-teal-200/80 bg-teal-50/60 p-4 sm:p-5">
          <h3 className="text-lg font-bold text-teal-950">{t('homeworkFeature.continueWithTutorTitle')}</h3>
          <p className="mt-2 text-sm text-slate-800 sm:text-base">{t('homeworkFeature.continueWithTutorBody')}</p>
          <button
            type="button"
            className="primary-button mt-4 min-h-[52px] px-5 py-3 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canHomeworkQuestHandoffToday()}
            onClick={() => {
              if (!job || !canHomeworkQuestHandoffToday()) {
                setError(t('homeworkFeature.continueWithTutorLimit'))
                return
              }
              saveHomeworkQuestForTutorSession(buildHomeworkQuestForTutor(job))
              bumpHomeworkQuestHandoffCount()
              navigate('/ai-tutor')
            }}
          >
            {t('homeworkFeature.continueWithTutorCta')}
          </button>
          {!canHomeworkQuestHandoffToday() ? (
            <p className="mt-2 text-sm text-amber-900">{t('homeworkFeature.continueWithTutorLimit')}</p>
          ) : null}
        </div>
      ) : null}

      {!job.isDemo ? (
        <div className="flex flex-wrap gap-3">
          <GenerateButton
            onClick={regenerateExplain}
            loading={loading === 'explain'}
            disabled={loading === 'story' || loading === 'fix'}
          >
            {t('homeworkFeature.regenerateExplain')}
          </GenerateButton>
          {job.explanation ? (
            <GenerateButton
              onClick={regenerateStory}
              loading={loading === 'story'}
              disabled={loading === 'explain' || loading === 'fix'}
            >
              {t('homeworkFeature.regenerateStory')}
            </GenerateButton>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="quiz-error">{error}</p> : null}

      <div className="flex flex-wrap gap-3 pt-4">
        <Link to="/homework/upload" className="secondary-button">
          {t('homeworkFeature.newUpload')}
        </Link>
        <Link to="/homework" className="link-muted">
          {t('homeworkFeature.backHub')}
        </Link>
      </div>
    </div>
  )
}
