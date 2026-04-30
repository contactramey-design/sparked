import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

export default function ParentGuidePage() {
  const { t, locale } = useTranslation()

  return (
    <AscentPageChrome
      key={locale}
      title={t('parentGuide.pageTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('parentGuide.pageTitle') },
      ]}
      contentMaxWidthClassName="max-w-4xl"
    >
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link to="/?view=parent" className="secondary-button">
          {t('parentGuide.backToParentView')}
        </Link>
        <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
          {t('common.backToHome')}
        </Link>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="max-w-prose text-slate-700">{t('parentGuide.intro')}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">{t('parentGuide.sectionCoppaTitle')}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>{t('parentGuide.coppaBullet1')}</li>
              <li>{t('parentGuide.coppaBullet2')}</li>
              <li>{t('parentGuide.coppaBullet3')}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">{t('parentGuide.sectionSafetyTitle')}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>{t('parentGuide.safetyBullet1')}</li>
              <li>{t('parentGuide.safetyBullet2')}</li>
              <li>{t('parentGuide.safetyBullet3')}</li>
              <li>{t('parentGuide.safetyBullet4')}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">{t('parentGuide.sectionTutorTitle')}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>{t('parentGuide.tutorBullet1')}</li>
              <li>{t('parentGuide.tutorBullet2')}</li>
              <li>{t('parentGuide.tutorBullet3')}</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-base font-bold text-slate-900">{t('parentGuide.sectionHomeTitle')}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>{t('parentGuide.homeBullet1')}</li>
              <li>{t('parentGuide.homeBullet2')}</li>
              <li>{t('parentGuide.homeBullet3')}</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-teal-100 bg-teal-50 p-5">
          <h2 className="text-base font-bold text-slate-900">{t('parentGuide.sectionQuickScriptTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700">{t('parentGuide.quickScript')}</p>
        </div>
      </section>
    </AscentPageChrome>
  )
}

