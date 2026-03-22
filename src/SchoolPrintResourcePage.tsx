import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { Button } from '@/components/ui/button'

/**
 * Print-friendly one-pagers: teachers use browser Print → Save as PDF.
 * Routes: /for-schools/resources/teacher-guide | parent-letter
 */
const SchoolPrintResourcePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const isTeacher = slug === 'teacher-guide'

  if (!isTeacher && slug !== 'parent-letter') {
    return (
      <div className="page page-narrow p-4">
        <p className="muted">{t('schoolResources.notFound')}</p>
        <Link to="/for-schools">{t('schoolResources.backToSchools')}</Link>
      </div>
    )
  }

  const title = isTeacher ? t('schoolResources.teacherTitle') : t('schoolResources.parentTitle')

  return (
    <div className={`school-print-resource ${isTeacher ? 'school-print-teacher' : 'school-print-parent'}`}>
      <div className="no-print mb-6 flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
        <Button type="button" variant="default" onClick={() => window.print()}>
          {t('schoolResources.printOrPdf')}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to="/for-schools">{t('schoolResources.backToSchools')}</Link>
        </Button>
        <p className="text-sm text-slate-600">{t('schoolResources.printHint')}</p>
      </div>

      <article className="school-print-sheet prose prose-slate max-w-none">
        <header className="school-print-header mb-8 border-b-2 border-amber-400 pb-4">
          <p className="text-sm font-bold uppercase tracking-wide text-amber-700">SpArki Academy</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{title}</h1>
          <p className="text-slate-600">{t('schoolResources.sheetSubtitle')}</p>
        </header>

        {isTeacher ? (
          <div className="space-y-5 text-base leading-relaxed text-slate-800">
            <section>
              <h2 className="text-xl font-bold text-slate-900">{t('schoolResources.t1')}</h2>
              <ol className="mt-2 list-decimal space-y-2 pl-6">
                <li>{t('schoolResources.t1a')}</li>
                <li>{t('schoolResources.t1b')}</li>
                <li>{t('schoolResources.t1c')}</li>
                <li>{t('schoolResources.t1d')}</li>
              </ol>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900">{t('schoolResources.t2')}</h2>
              <p>{t('schoolResources.t2body')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900">{t('schoolResources.t3')}</h2>
              <p>{t('schoolResources.t3body')}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-slate-900">{t('schoolResources.t4')}</h2>
              <p>{t('schoolResources.t4body')}</p>
            </section>
          </div>
        ) : (
          <div className="space-y-5 text-base leading-relaxed text-slate-800">
            <p className="text-lg font-semibold">{t('schoolResources.pIntro')}</p>
            <p>{t('schoolResources.p1')}</p>
            <p>{t('schoolResources.p2')}</p>
            <p>{t('schoolResources.p3')}</p>
            <p className="rounded-lg bg-amber-50 p-4 font-medium text-amber-950">{t('schoolResources.pClosing')}</p>
          </div>
        )}
      </article>
    </div>
  )
}

export default SchoolPrintResourcePage
