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
      contentPaddingClassName="px-3 py-6 sm:px-5 md:py-8 lg:px-8 lg:py-10 xl:px-10"
    >
      <div className="w-full rounded-3xl border border-teal-100/80 bg-gradient-to-r from-sky-50/90 via-white to-amber-50/50 px-4 py-4 shadow-sm md:px-6 md:py-5 lg:px-8 lg:py-6">
        <p className="text-pretty text-lg font-bold leading-snug text-teal-950 md:text-xl lg:text-2xl">
          {t('aiTutor.layoutSubtitleKid')}
        </p>
      </div>
      <details className="mt-4 w-full rounded-2xl border border-slate-200/90 bg-white/90 px-4 py-3 text-sm text-slate-600 shadow-sm md:mt-5 md:px-5 md:py-4 lg:text-base">
        <summary className="cursor-pointer list-none font-bold text-teal-900 md:text-lg [&::-webkit-details-marker]:hidden">
          {t('aiTutor.layoutGrownUpDetails')}
        </summary>
        <p className="mt-3 leading-relaxed text-slate-700">{t('aiTutor.layoutSubtitle')}</p>
      </details>
      <Outlet />
    </AscentPageChrome>
  )
}
