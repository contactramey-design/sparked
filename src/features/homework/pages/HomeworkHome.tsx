import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { saveHomeworkJob } from '../hooks/useHomeworkJob'
import { buildDemoHomeworkJob, DEMO_JOB_ID } from '../demo/demoJob'

export default function HomeworkHome() {
  const { t } = useTranslation()
  const navigate = useNavigate()

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
    </div>
  )
}
