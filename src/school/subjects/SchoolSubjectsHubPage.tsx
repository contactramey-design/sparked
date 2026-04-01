import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { SCHOOL_SUBJECT_IDS, type SchoolSubjectId } from './types'
import './school-subject.css'

const SchoolSubjectsHubPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className="lesson-page school-subj-page">
      <Link to="/schools" className="link-back">
        {t('schoolSubject.backToSchools')}
      </Link>

      <header className="school-subj-hero">
        <h1>{t('schools.subjectHubTitle')}</h1>
        <p>{t('schools.subjectHubDesc')}</p>
        <p className="school-subj-hub-alignment">{t('schoolSubjects.alignmentBadge')}</p>
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
