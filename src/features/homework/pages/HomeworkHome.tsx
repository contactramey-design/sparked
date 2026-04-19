import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { saveHomeworkJob } from '../hooks/useHomeworkJob'
import { buildDemoHomeworkJob, DEMO_JOB_ID } from '../demo/demoJob'

export default function HomeworkHome() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [adventurePaused, setAdventurePaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { homeworkAdventurePaused?: boolean }) => {
        if (!cancelled) setAdventurePaused(Boolean(data.homeworkAdventurePaused))
      })
      .catch(() => {
        if (!cancelled) setAdventurePaused(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const tryDemo = () => {
    const demo = buildDemoHomeworkJob()
    saveHomeworkJob(demo)
    navigate(`/homework/result/${DEMO_JOB_ID}`)
  }

  return (
    <div className="space-y-8">
      <p className="text-lg text-slate-700">{t('homeworkFeature.homeIntro')}</p>
      <div className="homework-cta-grid">
        <Link to="/homework/upload" className="primary-button text-center text-lg py-4">
          {t('homeworkFeature.ctaUpload')}
        </Link>
        <button type="button" className="secondary-button text-lg py-4" onClick={tryDemo}>
          {t('homeworkFeature.ctaDemo')}
        </button>
        <Link to="/homework/history" className="secondary-button text-center text-lg py-4">
          {t('homeworkFeature.ctaHistory')}
        </Link>
      </div>

      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          adventurePaused
            ? 'border-slate-200 bg-slate-100/90 text-slate-600'
            : 'border-sky-200/80 bg-sky-50/90'
        }`}
      >
        <p className={`m-0 text-base font-semibold ${adventurePaused ? 'text-slate-800' : 'text-sky-950'}`}>
          {adventurePaused ? t('homeworkFeature.adventureVideoPausedTitle') : t('homeworkFeature.adventureVideoCta')}
        </p>
        <p className="mt-2 mb-4 text-sm leading-relaxed text-slate-700">
          {adventurePaused ? t('homeworkFeature.adventureVideoPausedBody') : t('homeworkFeature.adventureVideoIntro')}
        </p>
        {adventurePaused ? (
          <span className="inline-block rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
            {t('homeworkFeature.adventureVideoPausedBadge')}
          </span>
        ) : (
          <Link to="/homework/adventure-video" className="primary-button inline-block text-center">
            {t('homeworkFeature.adventureVideoOpen')}
          </Link>
        )}
      </div>
    </div>
  )
}
