import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

export default function ServiceDetailsMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome title={t('marketingPages.serviceDetailPageTitle')} currentLabel={t('marketingPages.serviceDetailBreadcrumb')}>
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="whitespace-pre-line text-base leading-relaxed text-slate-700">{t('marketingPages.serviceDetailBody')}</div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to="/?view=parent"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-teal-600 px-6 text-sm font-bold text-white hover:bg-teal-700"
          >
            {t('marketingPages.serviceDetailCtaParent')}
          </Link>
          <Link
            to="/services"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border-2 border-teal-700/30 bg-white px-6 text-sm font-bold text-teal-900 hover:bg-teal-50"
          >
            {t('marketingPages.serviceDetailCtaBack')}
          </Link>
        </div>
      </div>
    </AscentPageChrome>
  )
}
