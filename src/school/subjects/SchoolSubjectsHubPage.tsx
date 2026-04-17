import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import ListenButton from '@/components/ListenButton'
import { usePracticeSubjectRoutes } from '@/lib/practiceRoutes'
import { SCHOOL_SUBJECT_IDS, type SchoolSubjectId } from './types'
import './school-subject.css'

const SchoolSubjectsHubPage: React.FC = () => {
  const { t } = useTranslation()
  const { isFamilyPractice, buildSubjectPath } = usePracticeSubjectRoutes()
  const { isTeacherView } = useSchoolAudience()
  const effectiveTeacherView = isTeacherView && !isFamilyPractice

  return (
    <section className={`lesson-page school-subj-page${isFamilyPractice ? ' school-subj-page--consumer' : ''}`}>
      <Link to="/" className="link-back">
        {t('practice.backToHome')}
      </Link>

      {!isFamilyPractice ? (
        <div className="school-subj-hub-audience no-print">
          <SchoolAudienceToggle />
        </div>
      ) : null}

      <header className="school-subj-hero">
        <div className="flex flex-wrap items-start gap-2">
          <h1 className="m-0 flex-1 min-w-0">{t('schools.subjectHubTitle')}</h1>
          <ListenButton
            text={
              effectiveTeacherView
                ? [
                    t('schools.subjectHubTitle'),
                    t('schools.subjectHubDesc'),
                    t('schools.subjectHubGradeBands'),
                    t('schools.subjectHubSupplemental'),
                  ].join('. ')
                : t('schools.subjectHubTitle')
            }
            ariaLabel={t('listenButton.schoolHubIntro')}
            size="sm"
            className="shrink-0 no-print"
          />
        </div>
        {effectiveTeacherView ? (
          <>
            <p>{t('schools.subjectHubDesc')}</p>
            <p className="school-subj-hub-grade-bands muted text-sm m-0 mt-2">{t('schools.subjectHubGradeBands')}</p>
            <p className="school-subj-hub-supplemental muted">{t('schools.subjectHubSupplemental')}</p>
            <p className="school-subj-hub-alignment">{t('schoolSubjects.alignmentBadge')}</p>
          </>
        ) : (
          <>
            <p className="school-subj-hub-student-lead text-slate-700 mt-2 mb-0">{t('schools.subjectHubStudentLead')}</p>
            {isFamilyPractice ? (
              <div className="school-subj-hub-family-intro mt-4 rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-left">
                <h2 className="m-0 text-base font-semibold text-slate-900">{t('practice.hubFamilyIntroTitle')}</h2>
                <ul className="mt-2 mb-0 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  <li>{t('practice.hubFamilyBullet1')}</li>
                  <li>{t('practice.hubFamilyBullet2')}</li>
                  <li>{t('practice.hubFamilyBullet3')}</li>
                </ul>
                <Link
                  to="/?view=parent"
                  className="mt-3 inline-block text-sm font-semibold text-sky-800 underline-offset-2 hover:text-sky-950 hover:underline"
                >
                  {t('practice.hubFamilyParentLink')}
                </Link>
              </div>
            ) : null}
          </>
        )}
      </header>

      <ul className="school-subj-hub-grid">
        {SCHOOL_SUBJECT_IDS.map((id: SchoolSubjectId) => (
          <li key={id}>
            <article className="school-subj-card">
              <div className="school-subj-card-thumb" aria-hidden>
                <span>{t(`schoolSubjects.tracks.${id}.hubEmoji`)}</span>
              </div>
              <div className="school-subj-card-body">
                <h2 className="school-subj-card-title">{t(`schoolSubjects.tracks.${id}.cardTitle`)}</h2>
                <p className="school-subj-card-summary">{t(`schoolSubjects.tracks.${id}.cardDesc`)}</p>
                <div className="school-subj-card-actions">
                  <Link to={buildSubjectPath(id)} className="primary-button">
                    {t('schools.openSubjectTrack', { subject: t(`schoolSubjects.tracks.${id}.cardTitle`) })}
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SchoolSubjectsHubPage
