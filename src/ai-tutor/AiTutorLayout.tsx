import { Outlet } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

export default function AiTutorLayout() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome
      title={t('aiTutor.layoutTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('aiTutor.layoutTitle') },
      ]}
    >
      <p className="mb-6 max-w-prose text-slate-600">{t('aiTutor.layoutSubtitle')}</p>
      <Outlet />
    </AscentPageChrome>
  )
}
