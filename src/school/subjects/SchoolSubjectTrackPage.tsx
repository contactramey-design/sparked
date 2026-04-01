import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import AgeBandSelector from '@/components/AgeBandSelector'
import { getLessonsForSubjectAndBand } from './registry'
import { isSchoolSubjectLessonMastered } from './schoolSubjectProgress'
import { formatCaStandardsBadge, caStandardsReferenceUrl } from './caStandardsDisplay'
import { parseStandardsNote } from './subjectStandards'
import { SUBJECT_TRACK_VISUAL } from './subjectTrackVisuals'
import { isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import './school-subject.css'

const HERO_ALT_KEYS: Record<SchoolSubjectId, string> = {
  math: 'schoolSubjects.heroAlt.math',
  english: 'schoolSubjects.heroAlt.english',
  science: 'schoolSubjects.heroAlt.science',
  history: 'schoolSubjects.heroAlt.history',
}

const SchoolSubjectTrackPage: React.FC = () => {
  const { subjectId: rawSubject } = useParams<{ subjectId: string }>()
  const subjectId = rawSubject as SchoolSubjectId | undefined
  const { t, locale } = useTranslation()
  const { ageBand, ageBandDisplayName } = useAgeBand()
  const [heroImgFailed, setHeroImgFailed] = useState(false)

  const valid = subjectId && isSchoolSubjectId(subjectId)

  const lessons = useMemo(() => {
    if (!valid) return []
    return getLessonsForSubjectAndBand(subjectId, ageBand)
  }, [valid, subjectId, ageBand])

  const totalMinutes = useMemo(() => lessons.reduce((sum, l) => sum + l.estMinutes, 0), [lessons])

  const visual = valid ? SUBJECT_TRACK_VISUAL[subjectId] : null

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
    <section className="lesson-page school-subj-page school-subj-track-page">
      <Link to="/schools/subjects" className="link-back school-subj-track-back">
        {t('schoolSubject.backToSubjectList')}
      </Link>

      <div className="track-age-band-toolbar school-subj-track-toolbar">
        <AgeBandSelector variant="compact" />
      </div>

      <header className="school-subj-track-hero">
        <div
          className={`school-subj-track-hero__visual school-subj-hero-fallback--${visual!.fallbackModifier}${heroImgFailed ? ' school-subj-track-hero__visual--fallback' : ''}`}
        >
          {!heroImgFailed ? (
            <img
              src={visual!.heroImage}
              alt={t(HERO_ALT_KEYS[subjectId])}
              className="school-subj-track-hero__img"
              onError={() => setHeroImgFailed(true)}
            />
          ) : null}
        </div>
        <div className="school-subj-track-hero__copy">
          <span className="school-subj-alignment-pill">{t('schoolSubjects.alignmentBadge')}</span>
          <h1 className="school-subj-track-hero__title">{t(`schoolSubjects.tracks.${subjectId}.title`)}</h1>
          <p className="school-subj-track-hero__subtitle">{t(`schoolSubjects.tracks.${subjectId}.subtitle`)}</p>
          <p className="school-subj-track-hero__band">
            {t('schoolSubject.bandLabel', { band: ageBandDisplayName })}
          </p>
        </div>
      </header>

      {lessons.length === 0 ? (
        <div className="school-subj-track-empty card p-4">
          <p className="muted">{t('schoolSubject.emptyBand')}</p>
        </div>
      ) : (
        <div className="school-subj-track-body">
          <main className="school-subj-track-main">
            <div className="school-subj-sequence-head">
              <h2 className="school-subj-sequence-head__title">{t('schoolSubjects.sequenceTitle')}</h2>
              <p className="school-subj-sequence-head__summary">
                {t('schoolSubjects.sequenceSummary', { count: lessons.length, minutes: totalMinutes })}
              </p>
              <p className="school-subj-sequence-head__lead muted">{t('schoolSubjects.sequenceLead')}</p>
            </div>

            <ul className="school-subj-track-card-grid">
              {lessons.map((lesson, index) => {
                const loc = lessonLocale(lesson, locale)
                const mastered = isSchoolSubjectLessonMastered(subjectId, lesson.id)
                const ca = lesson.caStandards
                const { scopeLine, codeBadge } = parseStandardsNote(lesson.standardsNote)
                const primaryObjective = loc.objectives[0] ?? loc.summary
                const showGame = lesson.includesGameQuiz !== false
                const toLesson = `/schools/subjects/${subjectId}/${encodeURIComponent(lesson.id)}`

                return (
                  <li key={lesson.id}>
                    <article className="school-subj-track-card">
                      <div className="school-subj-track-card__head">
                        <span className="school-subj-track-card__step" aria-hidden>
                          {index + 1}
                        </span>
                        <div className="school-subj-track-card__emoji" aria-hidden>
                          {lesson.cardImageUrl ? (
                            <img src={lesson.cardImageUrl} alt="" className="school-subj-track-card__emoji-img" />
                          ) : (
                            <span>{lesson.cardEmoji ?? t(`schoolSubjects.tracks.${subjectId}.hubEmoji`)}</span>
                          )}
                        </div>
                      </div>

                      <h3 className="school-subj-track-card__title">
                        <Link to={toLesson}>{loc.title}</Link>
                      </h3>

                      <div className="school-subj-track-card__objective">
                        <span className="school-subj-track-card__objective-label">
                          {t('schoolSubjects.cardObjectiveLabel')}
                        </span>
                        <p>{primaryObjective}</p>
                      </div>

                      {scopeLine ? <p className="school-subj-track-card__scope muted">{scopeLine}</p> : null}

                      <div className="school-subj-track-card__badges" aria-label={t('schoolSubjects.cardStandardsLabel')}>
                        {ca ? (
                          <a
                            href={caStandardsReferenceUrl(ca)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="school-subj-ca-pill"
                            title={formatCaStandardsBadge(ca)}
                          >
                            {ca.codes.slice(0, 2).join(' · ')}
                            {ca.codes.length > 2 ? '…' : ''}
                          </a>
                        ) : codeBadge ? (
                          <span className="school-subj-tek-pill" title={lesson.standardsNote}>
                            {codeBadge}
                          </span>
                        ) : null}
                        <span className="school-subj-time-pill">
                          {t('schoolSubjects.cardTimeLabel', { minutes: lesson.estMinutes })}
                        </span>
                        {showGame ? <span className="school-subj-game-pill">{t('schoolSubjects.gameBadge')}</span> : null}
                      </div>

                      <div className="school-subj-track-card__status">
                        {mastered ? (
                          <span className="school-subj-badge school-subj-badge--done">
                            {t('schoolSubject.masteredBadge')}
                          </span>
                        ) : (
                          <span className="school-subj-badge">{t('schoolSubject.notStartedBadge')}</span>
                        )}
                      </div>

                      <div className="school-subj-track-card__actions">
                        <Link to={toLesson} className="school-subj-start-lesson-btn">
                          {t('schoolSubjects.startLesson')}
                        </Link>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>

            <footer className="school-subj-track-planner-footer">
              <h3 className="school-subj-track-planner-footer__title">{t('schoolSubjects.plannerTitle')}</h3>
              <p className="school-subj-track-planner-footer__body muted">{t('schoolSubjects.plannerBody')}</p>
              <Link to={`/schools/alignment/${subjectId}`} className="school-subj-planner-link no-print">
                {t('schoolSubjects.plannerCta')}
              </Link>
            </footer>
          </main>

          <aside className="school-subj-track-aside" aria-labelledby="school-subj-how-to-heading">
            <div className="school-subj-aside-block">
              <h3 id="school-subj-how-to-heading" className="school-subj-aside-block__title">
                {t('schoolSubjects.howToTitle')}
              </h3>
              <ol className="school-subj-howto-list">
                <li>{t('schoolSubjects.howToStep1')}</li>
                <li>{t('schoolSubjects.howToStep2')}</li>
                <li>{t('schoolSubjects.howToStep3')}</li>
              </ol>
            </div>

            <nav className="school-subj-aside-block" aria-label={t('schoolSubjects.sequenceTitle')}>
              <h3 className="school-subj-aside-block__title">{t('schoolSubjects.sequenceTitle')}</h3>
              <ol className="school-subj-progress-list">
                {lessons.map((lesson, index) => {
                  const loc = lessonLocale(lesson, locale)
                  const toLesson = `/schools/subjects/${subjectId}/${encodeURIComponent(lesson.id)}`
                  return (
                    <li key={lesson.id}>
                      <Link to={toLesson} className="school-subj-progress-list__link">
                        <span className="school-subj-progress-list__num">{index + 1}</span>
                        <span className="school-subj-progress-list__text">{loc.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </aside>
        </div>
      )}
    </section>
  )
}

export default SchoolSubjectTrackPage
