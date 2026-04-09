import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { getHomeworkCheckoutSessionId } from '@/progress'
import { explainWorksheet, storyFromLesson } from '../api/homeworkApi'
import { getHomeworkJob, saveHomeworkJob } from '../hooks/useHomeworkJob'
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

export default function HomeworkResult() {
  const { jobId } = useParams<{ jobId: string }>()
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
