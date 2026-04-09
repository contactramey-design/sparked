import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { getLessonsForSubjectAndBand } from './registry'
import { isSchoolSubjectLessonMastered } from './schoolSubjectProgress'
import { parseStandardsNote } from './subjectStandards'
import { PageHeader } from '@/design-system/components/PageHeader'
import { StandardsBadge } from '@/design-system/components/StandardsBadge'
import { GradeBandTabs } from '@/features/school-curriculum/GradeBandTabs'
import { ClassroomGuideAside } from '@/features/school-curriculum/ClassroomGuideAside'
import { SUBJECT_TRACK_VISUAL } from './subjectTrackVisuals'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import ListenButton from '@/components/ListenButton'
import { lessonTypicalGradesLine } from './lessonGradeSpan'
import { isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import { buildPracticeHubPath, usePracticeSubjectRoutes } from '@/lib/practiceRoutes'
import { hasFullSubjectPracticeAccess } from '@/progress'
import './school-subject.css'

const HERO_ALT_KEYS: Record<SchoolSubjectId, string> = {
  'internet-safety': 'schoolSubjects.heroAlt.internetSafety',
  'ai-literacy': 'schoolSubjects.heroAlt.aiLiteracy',
  math: 'schoolSubjects.heroAlt.math',
  english: 'schoolSubjects.heroAlt.english',
  science: 'schoolSubjects.heroAlt.science',
  history: 'schoolSubjects.heroAlt.history',
}

/** Default track-card thumbnails when `lesson.cardImageUrl` is unset */
const SUBJECT_CARD_THUMB: Record<SchoolSubjectId, string> = {
  'internet-safety': '/safety-card.png',
  'ai-literacy': '/sparkiaicodingcardhomepage.png',
  math: '/tots-video-thumbnails/found-3-numbers.png',
  english: '/tots-video-thumbnails/found-4-letters.png',
  science: '/tots-video-thumbnails/found-2-shapes.png',
  history: '/weekly/season1/sparkis-two-world-bridge.png',
}

const SchoolSubjectTrackPage: React.FC = () => {
  const { subjectId: rawSubject } = useParams<{ subjectId: string }>()
  const subjectId = rawSubject as SchoolSubjectId | undefined
  const { t, locale } = useTranslation()
  const { ageBand, ageBandDisplayName } = useAgeBand()
  const { isTeacherView } = useSchoolAudience()
  const { isFamilyPractice, hubPath, buildLessonPath } = usePracticeSubjectRoutes()
  const effectiveTeacherView = isTeacherView && !isFamilyPractice
  const fullSubjectAccess = hasFullSubjectPracticeAccess()
  const [heroImgFailed, setHeroImgFailed] = useState(false)

  const valid = subjectId && isSchoolSubjectId(subjectId)

  const lessons = useMemo(() => {
    if (!valid) return []
    return getLessonsForSubjectAndBand(subjectId, ageBand)
  }, [valid, subjectId, ageBand])

  const totalMinutes = useMemo(() => lessons.reduce((sum, l) => sum + l.estMinutes, 0), [lessons])

  const visual = valid ? SUBJECT_TRACK_VISUAL[subjectId] : null

  const trackIntroSpeak = useMemo(() => {
    if (!valid) return ''
    const title = t(`schoolSubjects.tracks.${subjectId}.title`)
    if (!effectiveTeacherView) return title
    return `${title}. ${t(`schoolSubjects.tracks.${subjectId}.subtitle`)}`
  }, [valid, subjectId, t, effectiveTeacherView])

  const sequenceOverviewSpeak = useMemo(() => {
    if (!valid || lessons.length === 0) return ''
    if (!effectiveTeacherView) {
      return [
        t('schoolSubjects.sequenceTitle'),
        t('schoolSubjects.sequenceSummary', { count: lessons.length, minutes: totalMinutes }),
      ].join('. ')
    }
    return [
      t('schoolSubjects.sequenceTitle'),
      t('schoolSubjects.sequenceSummary', { count: lessons.length, minutes: totalMinutes }),
      t('schoolSubjects.sequenceLead'),
      t('schoolSubjects.sequenceGradeNote'),
    ].join('. ')
  }, [valid, lessons.length, totalMinutes, t, effectiveTeacherView])

  if (!valid) {
    return (
      <section className="lesson-page school-subj-page">
        <Link to={hubPath} className="link-back">
          {t('schoolSubject.backToSubjectList')}
        </Link>
        <p className="muted">{t('schoolSubject.unknownSubject')}</p>
      </section>
    )
  }

  return (
    <section className="lesson-page school-subj-page school-subj-track-page">
      <PageHeader
        breadcrumb={
          isFamilyPractice
            ? [
                { label: t('practice.breadcrumbHome'), to: '/' },
                { label: t('practice.breadcrumbPractice'), to: buildPracticeHubPath() },
                { label: t(`schoolSubjects.tracks.${subjectId}.title`) },
              ]
            : [
                { label: t('header.schools'), to: '/schools/parent' },
                { label: t('schools.subjectHubTitle'), to: hubPath },
                { label: t(`schoolSubjects.tracks.${subjectId}.title`) },
              ]
        }
        title={t(`schoolSubjects.tracks.${subjectId}.title`)}
        description={effectiveTeacherView ? t(`schoolSubjects.tracks.${subjectId}.subtitle`) : undefined}
        className="school-subj-track-page-header"
        actions={
          <ListenButton
            text={trackIntroSpeak}
            ariaLabel={t('listenButton.schoolTrackIntro')}
            size="sm"
            className="no-print"
          />
        }
      />

      <Link to={hubPath} className="link-back school-subj-track-back">
        {t('schoolSubject.backToSubjectList')}
      </Link>

      <div className="track-age-band-toolbar school-subj-track-toolbar flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-600 font-school">
            {t(effectiveTeacherView ? 'ageBand.forThisSession' : 'ageBand.forSchoolStudent')}
          </p>
          <GradeBandTabs />
        </div>
        {!isFamilyPractice ? (
          <SchoolAudienceToggle compact className="school-subj-track-audience self-start sm:self-center" />
        ) : null}
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
          {effectiveTeacherView ? (
            <span className="school-subj-alignment-pill">{t('schoolSubjects.alignmentBadge')}</span>
          ) : null}
          <p className="school-subj-track-hero__sr-title sr-only">{t(`schoolSubjects.tracks.${subjectId}.title`)}</p>
          {effectiveTeacherView ? (
            <>
              <p className="school-subj-track-hero__band">
                {t('schoolSubject.bandLabel', { band: ageBandDisplayName })}
              </p>
              <p className="school-subj-track-hero__grades muted text-sm m-0">
                {t(`ageBand.names.${ageBand}.gradesUs`)}
              </p>
            </>
          ) : (
            <p className="school-subj-track-hero__band m-0 text-base font-semibold text-slate-800 font-school">
              {t('schoolSubject.trackPickLesson')}
            </p>
          )}
        </div>
      </header>

      {effectiveTeacherView ? (
        <div className="school-subj-supplemental-banner" role="region" aria-label={t('schoolSubjects.supplementalScopeTitle')}>
          <div className="flex flex-wrap items-start gap-2">
            <h2 className="school-subj-supplemental-banner__title m-0 flex-1 min-w-0">
              {t('schoolSubjects.supplementalScopeTitle')}
            </h2>
            <ListenButton
              text={`${t('schoolSubjects.supplementalScopeTitle')}. ${t('schoolSubjects.supplementalScopeBody')}`}
              ariaLabel={t('listenButton.schoolSupplementalScope')}
              size="sm"
              className="shrink-0 no-print"
            />
          </div>
          <p className="school-subj-supplemental-banner__body">{t('schoolSubjects.supplementalScopeBody')}</p>
        </div>
      ) : null}

      {lessons.length === 0 ? (
        <div className="school-subj-track-empty card p-4">
          <p className="muted">{t('schoolSubject.emptyBand')}</p>
        </div>
      ) : (
        <div className="school-subj-track-body">
          <main className="school-subj-track-main">
            <div className="school-subj-sequence-head">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="school-subj-sequence-head__title m-0 flex-1 min-w-0">
                  {t('schoolSubjects.sequenceTitle')}
                </h2>
                <ListenButton
                  text={sequenceOverviewSpeak}
                  ariaLabel={t('listenButton.schoolSequenceOverview')}
                  size="sm"
                  className="shrink-0 no-print"
                />
              </div>
              <p className="school-subj-sequence-head__summary">
                {t('schoolSubjects.sequenceSummary', { count: lessons.length, minutes: totalMinutes })}
              </p>
              {effectiveTeacherView ? (
                <>
                  <p className="school-subj-sequence-head__lead muted">{t('schoolSubjects.sequenceLead')}</p>
                  <p className="school-subj-sequence-head__grades muted text-sm m-0">{t('schoolSubjects.sequenceGradeNote')}</p>
                </>
              ) : null}
            </div>

            <ul className="school-subj-track-card-grid">
              {lessons.map((lesson, index) => {
                const loc = lessonLocale(lesson, locale)
                const mastered = isSchoolSubjectLessonMastered(subjectId, lesson.id)
                const { scopeLine } = parseStandardsNote(lesson.standardsNote)
                const primaryObjective = loc.objectives[0] ?? loc.summary
                const showGame = lesson.includesGameQuiz !== false
                const toLesson = buildLessonPath(subjectId, lesson.id)
                const lessonLocked = isFamilyPractice && index > 0 && !fullSubjectAccess
                const cardThumb = lesson.cardImageUrl ?? SUBJECT_CARD_THUMB[subjectId]

                return (
                  <li key={lesson.id}>
                    <article
                      className={`school-subj-track-card${lessonLocked ? ' school-subj-track-card--locked opacity-90' : ''}`}
                    >
                      <div className="school-subj-track-card__head">
                        <span className="school-subj-track-card__step" aria-hidden>
                          {index + 1}
                        </span>
                        <div className="school-subj-track-card__emoji" aria-hidden>
                          {cardThumb ? (
                            <img src={cardThumb} alt="" className="school-subj-track-card__emoji-img" />
                          ) : (
                            <span>{lesson.cardEmoji ?? t(`schoolSubjects.tracks.${subjectId}.hubEmoji`)}</span>
                          )}
                        </div>
                      </div>

                      <h3 className="school-subj-track-card__title">
                        {lessonLocked ? (
                          <span>{loc.title}</span>
                        ) : (
                          <Link to={toLesson}>{loc.title}</Link>
                        )}
                      </h3>

                      <div className="school-subj-track-card__objective">
                        <span className="school-subj-track-card__objective-label">
                          {t('schoolSubjects.cardObjectiveLabel')}
                        </span>
                        <p>{primaryObjective}</p>
                      </div>

                      <div className="flex justify-end no-print">
                        <ListenButton
                          text={`${loc.title}. ${t('schoolSubjects.cardObjectiveLabel')}: ${primaryObjective}`}
                          ariaLabel={t('listenButton.schoolLessonCard')}
                          size="sm"
                        />
                      </div>

                      {effectiveTeacherView && scopeLine ? <p className="school-subj-track-card__scope muted">{scopeLine}</p> : null}

                      <div className="school-subj-track-card__badges" aria-label={t('schoolSubjects.cardStandardsLabel')}>
                        {effectiveTeacherView ? <StandardsBadge lesson={lesson} compact className="max-w-full" /> : null}
                        {effectiveTeacherView ? (
                          <span className="school-subj-time-pill">
                            {t('schoolSubjects.cardTimeLabel', { minutes: lesson.estMinutes })}
                          </span>
                        ) : null}
                        {effectiveTeacherView ? (
                          <span className="school-subj-grade-pill" title={lessonTypicalGradesLine(lesson, locale, t)}>
                            {lessonTypicalGradesLine(lesson, locale, t)}
                          </span>
                        ) : null}
                        {showGame && effectiveTeacherView ? (
                          <span className="school-subj-game-pill">{t('schoolSubjects.gameBadge')}</span>
                        ) : null}
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
                        {lessonLocked ? (
                          <Link to="/?view=parent" className="school-subj-start-lesson-btn school-subj-start-lesson-btn--locked">
                            {t('schoolSubject.unlockMoreLessonsCta')}
                          </Link>
                        ) : (
                          <Link to={toLesson} className="school-subj-start-lesson-btn">
                            {t('schoolSubjects.startLesson')}
                          </Link>
                        )}
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>

            {effectiveTeacherView ? (
              <footer className="school-subj-track-planner-footer">
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="school-subj-track-planner-footer__title m-0 flex-1 min-w-0">
                    {t('schoolSubjects.plannerTitle')}
                  </h3>
                  <ListenButton
                    text={`${t('schoolSubjects.plannerTitle')}. ${t('schoolSubjects.plannerBody')}`}
                    ariaLabel={t('listenButton.summary')}
                    size="sm"
                    className="shrink-0 no-print"
                  />
                </div>
                <p className="school-subj-track-planner-footer__body muted">{t('schoolSubjects.plannerBody')}</p>
                <Link to={`/schools/alignment/${subjectId}`} className="school-subj-planner-link no-print">
                  {t('schoolSubjects.plannerCta')}
                </Link>
              </footer>
            ) : null}
          </main>

          <aside
            className="school-subj-track-aside"
            aria-labelledby={effectiveTeacherView ? 'school-subj-how-to-heading' : undefined}
            aria-label={effectiveTeacherView ? undefined : t('schoolSubjects.sequenceTitle')}
          >
            {effectiveTeacherView ? <ClassroomGuideAside /> : null}

            <nav className="school-subj-aside-block" aria-label={t('schoolSubjects.sequenceTitle')}>
              <h3 className="school-subj-aside-block__title">{t('schoolSubjects.sequenceTitle')}</h3>
              <ol className="school-subj-progress-list">
                {lessons.map((lesson, index) => {
                  const loc = lessonLocale(lesson, locale)
                  const toLesson = buildLessonPath(subjectId, lesson.id)
                  const lessonLocked = isFamilyPractice && index > 0 && !fullSubjectAccess
                  return (
                    <li key={lesson.id}>
                      {lessonLocked ? (
                        <span className="school-subj-progress-list__link school-subj-progress-list__link--locked">
                          <span className="school-subj-progress-list__num">{index + 1}</span>
                          <span className="school-subj-progress-list__text">{loc.title}</span>
                        </span>
                      ) : (
                        <Link to={toLesson} className="school-subj-progress-list__link">
                          <span className="school-subj-progress-list__num">{index + 1}</span>
                          <span className="school-subj-progress-list__text">{loc.title}</span>
                        </Link>
                      )}
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
