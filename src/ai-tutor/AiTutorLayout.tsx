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
      contentMaxWidthClassName="max-w-none w-full"
      contentPaddingClassName="px-2 py-6 sm:px-4 md:py-8 lg:px-6 xl:px-8"
    >
      <p className="w-full text-base font-medium leading-relaxed text-slate-800 md:text-lg">
        {t('aiTutor.layoutSubtitleKid')}
      </p>
      <details className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-600 shadow-sm sm:px-4">
        <summary className="cursor-pointer list-none font-semibold text-teal-900 [&::-webkit-details-marker]:hidden">
          {t('aiTutor.layoutGrownUpDetails')}
        </summary>
        <p className="mt-3 leading-relaxed">{t('aiTutor.layoutSubtitle')}</p>
      </details>
      <Outlet />
    </AscentPageChrome>
  )
}
