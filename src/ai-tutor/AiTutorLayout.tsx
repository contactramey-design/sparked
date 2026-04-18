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
      <p className="max-w-prose text-base font-medium leading-relaxed text-slate-800">{t('aiTutor.layoutSubtitleKid')}</p>
      <details className="mt-3 max-w-prose rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
        <summary className="cursor-pointer list-none font-semibold text-teal-900 [&::-webkit-details-marker]:hidden">
          {t('aiTutor.layoutGrownUpDetails')}
        </summary>
        <p className="mt-3 leading-relaxed">{t('aiTutor.layoutSubtitle')}</p>
      </details>
      <Outlet />
    </AscentPageChrome>
  )
}
