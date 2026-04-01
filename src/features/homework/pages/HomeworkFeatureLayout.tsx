import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import '../homework-feature.css'

export default function HomeworkFeatureLayout() {
  const { t } = useTranslation()
  return (
    <section className="lesson-page homework-feature">
      <header className="lesson-header homework-feature-header">
        <div>
          <h2>{t('homeworkFeature.layoutTitle')}</h2>
          <p className="welcome-subtitle">{t('homeworkFeature.layoutSubtitle')}</p>
        </div>
        <Link to="/tracks" className="link-back">
          {t('common.backToDashboard')}
        </Link>
      </header>
      <Outlet />
    </section>
  )
}
