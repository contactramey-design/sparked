import { useState } from 'react'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import { useTranslation } from '@/contexts/LocaleContext'
import { startAcademyCheckout } from '@/lib/startAcademyCheckout'

export default function PricingPage() {
  const { t, locale } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const bullets = t('marketingFunnel.pricingBullets')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <AscentPageChrome
      key={locale}
      title={t('marketingFunnel.pricingTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('marketingFunnel.navPricing') },
      ]}
      contentMaxWidthClassName="max-w-xl"
    >
      <div className="rounded-3xl border border-teal-100/90 bg-white p-6 shadow-sm md:p-8">
        <p className="text-center font-heading text-3xl font-extrabold text-slate-900">{t('marketingFunnel.pricingPrice')}</p>
        <p className="mt-3 text-center text-base text-slate-600">{t('marketingFunnel.pricingTrial')}</p>
        <p className="mt-2 text-center text-xs text-slate-500">{t('marketingFunnel.pricingTrialStripeNote')}</p>
        <ul className="mt-8 space-y-3 text-base leading-relaxed text-slate-800">
          {bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-8 flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white hover:bg-teal-700 disabled:opacity-60"
          disabled={loading}
          onClick={() => {
            setError(null)
            setLoading(true)
            void startAcademyCheckout('/pricing')
              .catch((e) => setError(e instanceof Error ? e.message : 'Checkout failed'))
              .finally(() => setLoading(false))
          }}
        >
          {loading ? t('parentDashboard.openingCheckout') : t('marketingFunnel.pricingCta')}
        </button>
        {error ? (
          <p className="mt-3 text-center text-sm font-medium text-red-700" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </AscentPageChrome>
  )
}
