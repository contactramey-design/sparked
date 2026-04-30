import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const CARDS = ['svc1', 'svc2', 'svc3', 'svc4'] as const

const CARD_LINKS: Record<(typeof CARDS)[number], string> = {
  svc1: '/track/social-safety',
  svc2: '/practice',
  svc3: '/homework',
  svc4: '/tutor',
}

export default function ServicesMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome title={t('marketingPages.servicesPageTitle')} currentLabel={t('marketingPages.servicesBreadcrumb')}>
      <p className="mx-auto max-w-3xl text-center text-lg text-slate-600">{t('marketingPages.servicesIntro')}</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {CARDS.map((id) => (
          <div
            key={id}
            className="flex flex-col rounded-2xl border border-teal-100 bg-white p-6 shadow-sm motion-safe:transition-shadow hover:shadow-md"
          >
            <h2 className="font-heading text-xl font-bold text-teal-900">{t(`marketingPages.${id}Title`)}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{t(`marketingPages.${id}Body`)}</p>
            <Link
              to={CARD_LINKS[id]}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700"
            >
              {t(`marketingPages.${id}Cta`)}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center">
        <Link to="/service-details" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
          {t('marketingPages.servicesDetailLink')}
        </Link>
      </p>
    </AscentPageChrome>
  )
}
