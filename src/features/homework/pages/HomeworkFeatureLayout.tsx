import { Link, Outlet } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import PageHeader from '@/components/PageHeader'
import '../homework-feature.css'

export default function HomeworkFeatureLayout() {
  const { t } = useTranslation()
  return (
    <section className="lesson-page homework-feature">
      <PageHeader
        className="homework-feature-header lesson-header"
        title={t('homeworkFeature.layoutTitle')}
        subtitle={t('homeworkFeature.layoutSubtitle')}
      >
        <Link to="/tracks" className="link-back">
          {t('common.backToDashboard')}
        </Link>
      </PageHeader>
      <Outlet />
    </section>
  )
}
