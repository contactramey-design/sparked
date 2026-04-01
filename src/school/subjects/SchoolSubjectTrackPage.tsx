import React, { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import AgeBandSelector from '@/components/AgeBandSelector'
import { getLessonsForSubjectAndBand } from './registry'
import { isSchoolSubjectLessonMastered } from './schoolSubjectProgress'
import { isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import './school-subject.css'

const SchoolSubjectTrackPage: React.FC = () => {
  const { subjectId: rawSubject } = useParams<{ subjectId: string }>()
  const subjectId = rawSubject as SchoolSubjectId | undefined
  const { t, locale } = useTranslation()
  const { ageBand, ageBandDisplayName } = useAgeBand()

  const valid = subjectId && isSchoolSubjectId(subjectId)

  const lessons = useMemo(() => {
    if (!valid) return []
    return getLessonsForSubjectAndBand(subjectId, ageBand)
  }, [valid, subjectId, ageBand])

  if (!valid) {
    return (
      <section className="lesson-page school-subj-page">
        <Link to="/schools/subjects" className="link-back">
          {t('schoolSubject.backToSubjectList')}
        </Link>
        <p className="muted">{t('schoolSubject.unknownSubject')}</p>
      </section>
    )
  }

  return (
    <section className="lesson-page school-subj-page">
      <div className="track-age-band-toolbar">
        <AgeBandSelector variant="compact" />
      </div>

      <Link to="/schools/subjects" className="link-back">
        {t('schoolSubject.backToSubjectList')}
      </Link>

      <header className="school-subj-hero">
        <h1>{t(`schoolSubjects.tracks.${subjectId}.title`)}</h1>
        <p>{t(`schoolSubjects.tracks.${subjectId}.subtitle`)}</p>
        <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {t('schoolSubject.bandLabel', { band: ageBandDisplayName })}
        </p>
      </header>

      {lessons.length === 0 ? (
        <div className="card p-4">
          <p className="muted">{t('schoolSubject.emptyBand')}</p>
        </div>
      ) : (
        <>
          <h2 className="track-units-title" style={{ marginBottom: '1rem' }}>
            {t('schoolSubject.lessonsHeading')}
          </h2>
          <ul className="school-subj-lesson-grid">
            {lessons.map((lesson, index) => {
              const loc = lessonLocale(lesson, locale)
              const mastered = isSchoolSubjectLessonMastered(subjectId, lesson.id)
              return (
                <li key={lesson.id}>
                  <article className="school-subj-card">
                    <div className="school-subj-card-thumb" aria-hidden>
                      {lesson.cardImageUrl ? (
                        <img src={lesson.cardImageUrl} alt="" />
                      ) : (
                        <span>{lesson.cardEmoji ?? t(`schoolSubjects.tracks.${subjectId}.hubEmoji`)}</span>
                      )}
                    </div>
                    <div className="school-subj-card-body">
                      <div className="school-subj-card-meta">
                        {t('schoolSubject.lessonMeta', {
                          num: index + 1,
                          minutes: lesson.estMinutes,
                        })}
                        {lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
                      </div>
                      <h3 className="school-subj-card-title">{loc.title}</h3>
                      <p className="school-subj-card-summary">{loc.summary}</p>
                      <div>
                        {mastered ? (
                          <span className="school-subj-badge school-subj-badge--done">
                            {t('schoolSubject.masteredBadge')}
                          </span>
                        ) : (
                          <span className="school-subj-badge">{t('schoolSubject.notStartedBadge')}</span>
                        )}
                      </div>
                      <div className="school-subj-card-actions">
                        <Link
                          to={`/schools/subjects/${subjectId}/${encodeURIComponent(lesson.id)}`}
                          className="primary-button"
                        >
                          {t('schoolSubject.openLesson')}
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}

export default SchoolSubjectTrackPage
