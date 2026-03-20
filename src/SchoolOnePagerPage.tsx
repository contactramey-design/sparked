import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import SparkiAvatar from './components/SparkiAvatar'

/** Print-friendly one-pager for pilots: open in browser → Print → Save as PDF. */
const SchoolOnePagerPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="page school-one-pager">
      <div className="no-print mb-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={() => window.print()}>
          {t('onePager.printButton')}
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/for-schools">{t('onePager.backToForSchools')}</Link>
        </Button>
      </div>

      <article className="school-one-pager-sheet rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-lg md:p-10">
        <header className="flex flex-wrap items-center gap-4 border-b border-orange-100 pb-6 mb-6">
          <img src="/sparkiacademylogo.webp" alt="" width={88} height={88} className="shrink-0" />
          <SparkiAvatar size="md" />
          <div>
            <h1 className="text-2xl font-black text-orange-950 md:text-3xl">{t('onePager.headline')}</h1>
            <p className="text-orange-900/90 font-medium">{t('onePager.tagline')}</p>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-orange-950 mb-2">{t('onePager.coursesHeader')}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-slate-800">
            <li>
              <strong>{t('onePager.course1Name')}</strong> — {t('onePager.course1Desc')}
            </li>
            <li>
              <strong>{t('onePager.course2Name')}</strong> — {t('onePager.course2Desc')}
            </li>
            <li>
              <strong>{t('onePager.course3Name')}</strong> — {t('onePager.course3Desc')}
            </li>
          </ol>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-orange-50/80 p-4 border border-orange-100">
            <h3 className="font-bold text-orange-950 mb-1">{t('onePager.spanishTitle')}</h3>
            <p className="text-sm text-slate-800">{t('onePager.spanishBody')}</p>
          </div>
          <div className="rounded-xl bg-sky-50/80 p-4 border border-sky-100">
            <h3 className="font-bold text-sky-950 mb-1">{t('onePager.pwaTitle')}</h3>
            <p className="text-sm text-slate-800">{t('onePager.pwaBody')}</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-bold text-orange-950 mb-2">{t('onePager.complianceHeader')}</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
            <li>{t('onePager.compliance1')}</li>
            <li>{t('onePager.compliance2')}</li>
            <li>{t('onePager.compliance3')}</li>
            <li>{t('onePager.compliance4')}</li>
          </ul>
        </section>

        <footer className="border-t border-orange-100 pt-4 text-center text-sm text-slate-600">
          <p className="font-semibold text-orange-900">{t('onePager.siteUrl')}</p>
          <p className="mt-1">{t('onePager.footerNote')}</p>
        </footer>
      </article>
    </div>
  )
}

export default SchoolOnePagerPage
