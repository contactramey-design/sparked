import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import { SCHOOL_SUBJECT_IDS, type SchoolSubjectId } from './types'
import './school-subject.css'

const SchoolSubjectsHubPage: React.FC = () => {
  const { t } = useTranslation()
  const { isTeacherView } = useSchoolAudience()

  return (
    <section className="lesson-page school-subj-page">
      <Link to="/schools" className="link-back">
        {t('schoolSubject.backToSchools')}
      </Link>

      <div className="school-subj-hub-audience no-print">
        <SchoolAudienceToggle />
      </div>

      <header className="school-subj-hero">
        <h1>{t('schools.subjectHubTitle')}</h1>
        <p>{t('schools.subjectHubDesc')}</p>
        {isTeacherView ? (
          <>
            <p className="school-subj-hub-supplemental muted">{t('schools.subjectHubSupplemental')}</p>
            <p className="school-subj-hub-alignment">{t('schoolSubjects.alignmentBadge')}</p>
          </>
        ) : (
          <p className="school-subj-hub-student-hint muted">{t('schoolSubject.audienceStudentHubHint')}</p>
        )}
      </header>

      <div className="school-subj-hub-mission no-print rounded-2xl border-2 border-orange-200 bg-orange-50/70 p-4 md:p-6 mb-6 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-900 m-0 mb-2">{t('schools.missionTracksTitle')}</h2>
        <p className="text-slate-800 text-sm md:text-base m-0 mb-4">{t('schools.missionTracksBody')}</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/track/social-safety" className="primary-button">
            {t('schools.openSafetyTrackCta')}
          </Link>
          <Link to="/track/ai-coding" className="secondary-button">
            {t('schools.openAiTrackCta')}
          </Link>
        </div>
      </div>

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
                  <Link to={`/schools/subjects/${id}`} className="primary-button">
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
