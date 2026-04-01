import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import AgeBandSelector from '@/components/AgeBandSelector'
import { getSchoolMathLessonsForBand, lessonLocale } from './schoolMathCurriculum'
import { isSchoolMathLessonMastered } from './schoolMathProgress'
import './school-math.css'

const SchoolMathTrackPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const { ageBand, ageBandDisplayName } = useAgeBand()

  const lessons = useMemo(() => getSchoolMathLessonsForBand(ageBand), [ageBand])

  return (
    <section className="lesson-page school-math-page">
      <div className="track-age-band-toolbar">
        <AgeBandSelector variant="compact" />
      </div>

      <Link to="/schools" className="link-back">
        {t('schoolMath.backToSchools')}
      </Link>

      <header className="school-math-hero">
        <h1>{t('schoolMath.trackTitle')}</h1>
        <p>{t('schoolMath.trackSubtitle')}</p>
        <p className="muted" style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          {t('schoolMath.bandLabel', { band: ageBandDisplayName })}
        </p>
      </header>

      {lessons.length === 0 ? (
        <div className="card p-4">
          <p className="muted">{t('schoolMath.emptyBand')}</p>
        </div>
      ) : (
        <>
          <h2 className="track-units-title" style={{ marginBottom: '1rem' }}>
            {t('schoolMath.lessonsHeading')}
          </h2>
          <ul className="school-math-lesson-grid">
            {lessons.map((lesson, index) => {
              const loc = lessonLocale(lesson, locale)
              const mastered = isSchoolMathLessonMastered(lesson.id)
              return (
                <li key={lesson.id}>
                  <article className="school-math-card">
                    <div className="school-math-card-thumb" aria-hidden>
                      {lesson.cardImageUrl ? (
                        <img src={lesson.cardImageUrl} alt="" />
                      ) : (
                        <span>{lesson.cardEmoji ?? '🔢'}</span>
                      )}
                    </div>
                    <div className="school-math-card-body">
                      <div className="school-math-card-meta">
                        {t('schoolMath.lessonMeta', {
                          num: index + 1,
                          minutes: lesson.estMinutes,
                        })}
                        {lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
                      </div>
                      <h3 className="school-math-card-title">{loc.title}</h3>
                      <p className="school-math-card-summary">{loc.summary}</p>
                      <div>
                        {mastered ? (
                          <span className="school-math-badge school-math-badge--done">
                            {t('schoolMath.masteredBadge')}
                          </span>
                        ) : (
                          <span className="school-math-badge">{t('schoolMath.notStartedBadge')}</span>
                        )}
                      </div>
                      <div className="school-math-card-actions">
                        <Link to={`/schools/math/${encodeURIComponent(lesson.id)}`} className="primary-button">
                          {t('schoolMath.openLesson')}
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

export default SchoolMathTrackPage
