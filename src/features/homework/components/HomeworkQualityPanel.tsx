import { useEffect, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import type { HomeworkAnalysis } from '../types/homework'

const LOW_CONFIDENCE = 0.55

type Props = {
  analysis: HomeworkAnalysis
  /** When false (demo), hide fix controls */
  allowFix: boolean
  busy: boolean
  onApplyCorrection: (next: { subject: string; topic: string }) => Promise<void>
}

export function HomeworkQualityPanel({ analysis, allowFix, busy, onApplyCorrection }: Props) {
  const { t } = useTranslation()
  const [subject, setSubject] = useState(analysis.subject)
  const [topic, setTopic] = useState(analysis.topic)
  const [fixOpen, setFixOpen] = useState(false)

  useEffect(() => {
    setSubject(analysis.subject)
    setTopic(analysis.topic)
  }, [analysis.subject, analysis.topic])

  const showReview = analysis.needsReview
  const showLowConfidence = !showReview && analysis.confidence < LOW_CONFIDENCE
  if (!showReview && !showLowConfidence) return null

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onApplyCorrection({ subject: subject.trim(), topic: topic.trim() })
    setFixOpen(false)
  }

  return (
    <div
      className="homework-quality-panel card border-amber-200 bg-amber-50/90 text-amber-950 space-y-3"
      role="region"
      aria-label={t('homeworkFeature.qualityPanelAria')}
    >
      {showReview ? (
        <>
          <p className="font-bold text-amber-900">{t('homeworkFeature.reviewBannerTitle')}</p>
          <p className="text-sm leading-relaxed">{t('homeworkFeature.reviewBannerBody')}</p>
        </>
      ) : (
        <p className="text-sm leading-relaxed">{t('homeworkFeature.lowConfidenceBanner')}</p>
      )}

      {allowFix ? (
        <>
          <button
            type="button"
            className="text-sm font-semibold text-amber-900 underline decoration-amber-600"
            onClick={() => setFixOpen((o) => !o)}
            aria-expanded={fixOpen}
          >
            {fixOpen ? t('homeworkFeature.fixTopicHide') : t('homeworkFeature.fixTopicShow')}
          </button>
          {fixOpen ? (
            <form onSubmit={onSubmit} className="space-y-3 pt-1">
              <p className="text-sm font-semibold text-amber-900">{t('homeworkFeature.fixTopicHeading')}</p>
              <label className="block text-sm">
                <span className="font-medium block mb-1">{t('homeworkFeature.subjectEditLabel')}</span>
                <input
                  type="text"
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-slate-900"
                  value={subject}
                  onChange={(ev) => setSubject(ev.target.value)}
                  disabled={busy}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium block mb-1">{t('homeworkFeature.topicEditLabel')}</span>
                <input
                  type="text"
                  className="w-full rounded-lg border border-amber-200 px-3 py-2 text-slate-900"
                  value={topic}
                  onChange={(ev) => setTopic(ev.target.value)}
                  disabled={busy}
                />
              </label>
              <button type="submit" className="primary-button" disabled={busy}>
                {busy ? t('homeworkFeature.applyTopicFixBusy') : t('homeworkFeature.applyTopicFix')}
              </button>
            </form>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
