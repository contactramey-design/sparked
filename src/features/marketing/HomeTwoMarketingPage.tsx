import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

export default function HomeTwoMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome
      title={t('marketingPages.home2Title')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('marketingPages.home2Title') },
      ]}
      showKidWayfinding
    >
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-800">{t('marketingPages.home2Kicker')}</p>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">{t('marketingPages.home2Lead')}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className={cn(
              'inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-2xl bg-teal-600 px-8 text-base font-bold text-white shadow-md',
              'hover:bg-teal-700',
            )}
          >
            {t('marketingPages.home2CtaPrimary')}
          </Link>
          <Link
            to="/books"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-teal-800/25 bg-white px-8 text-sm font-bold text-teal-900 hover:bg-teal-50"
          >
            {t('marketingPages.home2CtaSecondary')}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(['home2Card1', 'home2Card2', 'home2Card3', 'home2Card4'] as const).map((key) => (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
            <h2 className="font-heading text-lg font-bold text-slate-900">{t(`marketingPages.${key}Title`)}</h2>
            <p className="mt-2 text-sm text-slate-600">{t(`marketingPages.${key}Body`)}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-3xl rounded-3xl border border-teal-100 bg-ascent-warm px-6 py-10 text-center md:px-10">
        <p className="font-heading text-xl font-bold text-teal-950">{t('marketingPages.home2NewsletterTitle')}</p>
        <p className="mt-2 text-slate-700">{t('marketingPages.home2NewsletterBody')}</p>
        <Link
          to="/?view=parent"
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal-600 px-8 text-sm font-bold text-white hover:bg-teal-700"
        >
          {t('marketingPages.home2NewsletterCta')}
        </Link>
      </div>
    </AscentPageChrome>
  )
}
