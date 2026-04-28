import { Outlet } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import '../homework-feature.css'

export default function HomeworkFeatureLayout() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome
      title={t('homeworkFeature.layoutTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('homeworkFeature.layoutTitle') },
      ]}
      className="homework-feature"
    >
      <p className="-mt-2 mb-2 max-w-prose text-base text-slate-700">{t('homeworkFeature.layoutSubtitle')}</p>
      <p className="homework-feature-reward-note mb-2 max-w-prose text-sm text-slate-600">{t('homeworkFeature.layoutRewardNote')}</p>
      <p className="mb-6 max-w-prose text-sm text-slate-600">{t('productTiers.academyLine')}</p>
      <Outlet />
    </AscentPageChrome>
  )
}
