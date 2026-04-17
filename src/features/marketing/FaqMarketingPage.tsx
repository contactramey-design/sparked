import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const FAQ_KEYS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5', 'faq6'] as const

export default function FaqMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome title={t('marketingPages.faqPageTitle')} currentLabel={t('marketingPages.faqBreadcrumb')}>
      <p className="mx-auto max-w-3xl text-center text-lg text-slate-600">{t('marketingPages.faqIntro')}</p>
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="group rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm open:shadow-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-heading text-base font-bold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
              <span>{t(`marketingPages.${key}Q` as const)}</span>
              <span className="text-teal-700 motion-safe:transition-transform group-open:rotate-180" aria-hidden>
                ▼
              </span>
            </summary>
            <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
              {t(`marketingPages.${key}A` as const)}
            </p>
          </details>
        ))}
      </div>
    </AscentPageChrome>
  )
}
