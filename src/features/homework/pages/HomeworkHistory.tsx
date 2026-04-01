import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { listHomeworkJobs } from '../hooks/useHomeworkJob'

export default function HomeworkHistory() {
  const { t } = useTranslation()
  const jobs = listHomeworkJobs()

  return (
    <div className="space-y-6">
      <p className="text-slate-700">{t('homeworkFeature.historyIntro')}</p>
      {jobs.length === 0 ? (
        <div className="card text-center py-8">
          <p>{t('homeworkFeature.historyEmpty')}</p>
          <Link to="/homework/upload" className="primary-button inline-block mt-4">
            {t('homeworkFeature.ctaUpload')}
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {jobs.map((j) => (
            <li key={j.jobId} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-bold text-blue-900">
                  {j.analysis.subject} · {j.analysis.topic}
                </p>
                <p className="text-sm text-slate-600">
                  {j.isDemo ? t('homeworkFeature.demoBadge') : new Date(j.createdAt).toLocaleString()}
                </p>
              </div>
              <Link to={`/homework/result/${j.jobId}`} className="secondary-button text-center shrink-0">
                {t('homeworkFeature.openResult')}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
