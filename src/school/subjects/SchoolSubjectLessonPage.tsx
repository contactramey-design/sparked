import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { Button } from '@/components/ui/button'
import { getLessonsForSubjectAndBand, getSubjectLessonById } from './registry'
import { recordSchoolSubjectPracticeComplete, recordSchoolSubjectQuizResult } from './schoolSubjectProgress'
import { LessonPractice } from './games/LessonPractice'
import { getSchoolSubjectTeacherPack } from './schoolSubjectTeacherPack'
import { getSchoolSubjectQuizFeedback } from './schoolSubjectQuizFeedback'
import { Stepper } from '@/design-system/components/Stepper'
import { StandardsBadge } from '@/design-system/components/StandardsBadge'
import { LessonPlayerLayout } from '@/features/school-curriculum/LessonPlayerLayout'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import ListenButton from '@/components/ListenButton'
import { lessonTypicalGradesLine } from './lessonGradeSpan'
import { isLessonInBand, isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import { usePracticeSubjectRoutes } from '@/lib/practiceRoutes'
import { hasFullSubjectPracticeAccess } from '@/progress'
import './school-subject.css'

type StepId = 'learn' | 'practice' | 'quiz' | 'tip'

const SchoolSubjectLessonPage: React.FC = () => {
  const { subjectId: rawSubject, lessonId: rawId } = useParams<{ subjectId: string; lessonId: string }>()
  const subjectId = rawSubject as SchoolSubjectId | undefined
  const lessonId = rawId ? decodeURIComponent(rawId) : ''
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { ageBand } = useAgeBand()
  const { isTeacherView } = useSchoolAudience()
  const { isFamilyPractice, hubPath, buildSubjectPath } = usePracticeSubjectRoutes()
  const effectiveTeacherView = isTeacherView && !isFamilyPractice

  const validSubject = subjectId && isSchoolSubjectId(subjectId)

  const lesson = useMemo(() => {
    if (!validSubject) return undefined
    return getSubjectLessonById(subjectId, lessonId)
  }, [validSubject, subjectId, lessonId])
  const loc = lesson ? lessonLocale(lesson, locale) : null
  const inBand = !!(lesson && isLessonInBand(lesson, ageBand))

  const [step, setStepState] = useState<StepId>('learn')
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [quizCorrect, setQuizCorrect] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const resetQuiz = useCallback(() => {
    setQIndex(0)
    setSelected(null)
    setQuizCorrect(0)
    setQuizFinished(false)
    setRevealed(false)
  }, [])

  const trackPath = validSubject ? buildSubjectPath(subjectId) : hubPath

  const lessonsInBand = useMemo(() => {
    if (!validSubject) return []
    return getLessonsForSubjectAndBand(subjectId, ageBand)
  }, [validSubject, subjectId, ageBand])

  const lessonIndexInBand = useMemo(() => {
    if (!lesson) return -1
    return lessonsInBand.findIndex((l) => l.id === lesson.id)
  }, [lesson, lessonsInBand])

  const questions = useMemo(() => (loc?.quiz.length ? loc.quiz : []), [loc])
  const currentQ = questions[qIndex]
  const isLastQ = qIndex >= questions.length - 1

  const teacherPack = useMemo(() => {
    if (!lesson || !inBand) return null
    return getSchoolSubjectTeacherPack(lesson.id, locale)
  }, [lesson, inBand, locale])

  const showPractice =
    !!(lesson && inBand && lesson.includesGameQuiz !== false && lesson.includesPracticeStep !== false)
  const practiceGameId = lesson?.practiceGameId ?? 'sparki-ordered-tap'
  const lessonSteps = useMemo(() => {
    return showPractice ? (['learn', 'practice', 'quiz', 'tip'] as const) : (['learn', 'quiz', 'tip'] as const)
  }, [showPractice])

  const [searchParams, setSearchParams] = useSearchParams()

  const resolvedUrlStep = useMemo((): StepId | null => {
    const raw = searchParams.get('step')
    if (!raw) return null
    const allSteps: StepId[] = ['learn', 'practice', 'quiz', 'tip']
    if (!allSteps.includes(raw as StepId)) return null
    if (!(lessonSteps as readonly StepId[]).includes(raw as StepId)) return null
    if (raw === 'practice' && !showPractice) return null
    return raw as StepId
  }, [searchParams, lessonSteps, showPractice])

  useLayoutEffect(() => {
    if (resolvedUrlStep == null) return
    setStepState((prev) => (prev === resolvedUrlStep ? prev : resolvedUrlStep))
  }, [resolvedUrlStep])

  const setStep = useCallback(
    (s: StepId) => {
      setStepState(s)
      setSearchParams(
        (prev) => {
          const n = new URLSearchParams(prev)
          if (s === 'learn') n.delete('step')
          else n.set('step', s)
          return n
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    if (step === 'practice' && !showPractice) setStep('learn')
  }, [step, showPractice, setStep])

  const quizTeachingNote = useMemo(() => {
    if (!currentQ) return ''
    if (!effectiveTeacherView) {
      return currentQ.feedback?.trim() || ''
    }
    return (
      currentQ.feedback?.trim() ||
      getSchoolSubjectQuizFeedback(currentQ.id, locale)?.trim() ||
      ''
    )
  }, [currentQ?.id, currentQ?.feedback, locale, effectiveTeacherView])

  const quizProgressPct = useMemo(() => {
    if (questions.length === 0) return 0
    const stepped = qIndex + (revealed ? 1 : 0)
    return Math.min(100, Math.round((stepped / questions.length) * 100))
  }, [qIndex, revealed, questions.length])

  const quizPromptSpeakText = useMemo(() => {
    if (!currentQ) return ''
    const opts = currentQ.options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join('. ')
    return `${currentQ.prompt} ${opts}`
  }, [currentQ])

  const quizFeedbackSpeakText = useMemo(() => {
    if (!currentQ || selected === null || !revealed) return ''
    const parts: string[] = []
    parts.push(
      selected === currentQ.correctIndex ? t('schoolSubject.quizStatusCorrect') : t('schoolSubject.quizStatusWrong'),
    )
    parts.push(`${t('schoolSubject.quizCorrectIs')}: ${currentQ.options[currentQ.correctIndex]}`)
    if (selected !== currentQ.correctIndex) {
      parts.push(`${t('schoolSubject.quizYourAnswer')}: ${currentQ.options[selected]}`)
    }
    parts.push(`${t('schoolSubject.quizWhyHeading')}.`)
    const explain =
      quizTeachingNote ||
      t(
        effectiveTeacherView ? 'schoolSubject.quizExplainFallback' : 'schoolSubject.quizExplainFallbackStudent',
        { answer: currentQ.options[currentQ.correctIndex] },
      )
    parts.push(explain)
    if (effectiveTeacherView) {
      if (selected !== currentQ.correctIndex) {
        parts.push(t('schoolSubject.quizWrongCoach'))
      }
      parts.push(t('schoolSubject.quizReviewLearn'))
    }
    return parts.join(' ')
  }, [currentQ, revealed, selected, quizTeachingNote, effectiveTeacherView, t])

  const tipSpeakText = useMemo(() => {
    if (!loc) return ''
    if (!effectiveTeacherView) {
      if (loc.offlineApplication) {
        return [loc.offlineApplication, loc.realWorldTip].filter(Boolean).join('. ')
      }
      return loc.realWorldTip
    }
    const parts: string[] = [t('schoolSubject.tipHeading'), t('schoolSubject.tipSublead')]
    if (ageBand === 'tots' || ageBand === 'kids') {
      parts.push(t('schoolSubject.tipImaginationNote'))
    }
    if (loc.offlineApplication) {
      parts.push(`${t('schoolSubject.tipTryHeading')}. ${loc.offlineApplication}`)
      parts.push(`${t('schoolSubject.tipWhyHeading')}. ${loc.realWorldTip}`)
    } else {
      parts.push(loc.realWorldTip)
    }
    return parts.filter(Boolean).join('. ')
  }, [t, ageBand, effectiveTeacherView, loc])

  if (!validSubject || !lesson || !loc) {
    return (
      <section className={`school-subj-lesson${isFamilyPractice ? ' school-subj-lesson--consumer' : ''}`}>
        <Link to={validSubject ? trackPath : hubPath} className="link-back">
          {t('schoolSubject.backToSubjectTrack')}
        </Link>
        <p className="muted">{t('schoolSubject.lessonNotFound')}</p>
      </section>
    )
  }

  if (!inBand) {
    return (
      <section className={`school-subj-lesson${isFamilyPractice ? ' school-subj-lesson--consumer' : ''}`}>
        <Link to={trackPath} className="link-back">
          {t('schoolSubject.backToSubjectTrack')}
        </Link>
        <div className="card p-4 space-y-3">
          <p>{t('schoolSubject.wrongBand')}</p>
          <Button type="button" variant="secondary" onClick={() => navigate(trackPath)}>
            {t('schoolSubject.chooseBand')}
          </Button>
        </div>
      </section>
    )
  }

  const fullSubjectAccess = hasFullSubjectPracticeAccess()
  if (isFamilyPractice && lessonIndexInBand > 0 && !fullSubjectAccess) {
    return (
      <section className="school-subj-lesson school-subj-lesson--consumer">
        <Link to={trackPath} className="link-back">
          {t('schoolSubject.backToSubjectTrack')}
        </Link>
        <div className="card p-4 space-y-3 max-w-prose">
          <h2 className="text-lg font-semibold text-slate-900 m-0">{t('schoolSubject.lessonPaywallTitle')}</h2>
          <p className="text-slate-700 m-0">{t('schoolSubject.lessonPaywallBody')}</p>
          <Link to="/?view=parent" className="primary-button inline-block mt-2">
            {t('schoolSubject.lessonPaywallCta')}
          </Link>
        </div>
      </section>
    )
  }

  const pickOption = (idx: number) => {
    if (revealed || !currentQ) return
    setSelected(idx)
    setRevealed(true)
    const ok = idx === currentQ.correctIndex
    if (ok) setQuizCorrect((c) => c + 1)
  }

  const onQuizNext = () => {
    if (!revealed || selected === null || !currentQ) return
    if (isLastQ) {
      const total = questions.length
      recordSchoolSubjectQuizResult(subjectId, lesson.id, quizCorrect, total)
      setQuizFinished(true)
    } else {
      setQIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  return (
    <section
      className={`school-subj-lesson${isFamilyPractice ? ' school-subj-lesson--consumer' : ''}${step === 'practice' && showPractice ? ' school-subj-lesson--practice-immersive' : ''}`}
    >
      <Link to={trackPath} className="link-back">
        {t('schoolSubject.backToSubjectTrack')}
      </Link>

      {!isFamilyPractice ? (
        <div className="school-subj-lesson-audience-row no-print">
          <SchoolAudienceToggle compact />
        </div>
      ) : null}

      <header className="school-subj-lesson__header">
        <div className="flex flex-wrap items-start gap-2">
          <h1 className="school-subj-lesson__title min-w-0 flex-1">{loc.title}</h1>
          <ListenButton text={loc.title} ariaLabel={t('listenButton.schoolLessonTitle')} size="sm" className="shrink-0" />
        </div>
        <p className="school-subj-lesson__meta muted text-sm">
          {t('schoolSubject.durationLine', { minutes: lesson.estMinutes })}
          {effectiveTeacherView ? (
            <>
              {' · '}
              {lessonTypicalGradesLine(lesson, locale, t)}
              {lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
            </>
          ) : null}
        </p>
      </header>

      {effectiveTeacherView ? (
        <div className="school-subj-lesson-standards-callout no-print mx-auto mb-4 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600 font-school m-0 flex-1 min-w-0">
              {t('schoolSubjects.caStandardsHeading')}
            </h2>
            {lesson.standardsNote?.trim() ? (
              <ListenButton
                text={`${t('schoolSubjects.caStandardsHeading')}. ${lesson.standardsNote.trim()}`}
                ariaLabel={t('listenButton.summary')}
                size="sm"
                className="shrink-0"
              />
            ) : null}
          </div>
          <StandardsBadge lesson={lesson} />
        </div>
      ) : null}

      <LessonPlayerLayout
        immersive={step === 'practice' && showPractice}
        stepper={
          <Stepper
            steps={lessonSteps.map((s) => ({
              id: s,
              label:
                s === 'learn'
                  ? t('schoolSubject.stepLearn')
                  : s === 'practice'
                    ? t('schoolSubject.stepPractice')
                    : s === 'quiz'
                      ? t('schoolSubject.stepQuiz')
                      : t('schoolSubject.stepTip'),
            }))}
            currentId={step}
            onStepClick={(id) => setStep(id as StepId)}
            ariaLabel={t('schoolSubject.stepsAria')}
          />
        }
      >
        {step === 'learn' && (
        <div className="school-subj-learn px-4 py-4 md:px-6 md:pb-6">
          {effectiveTeacherView ? (
            <div className="school-subj-supplemental-callout" role="note">
              <div className="flex flex-wrap items-start gap-2">
                <p className="m-0 flex-1 min-w-0">{t('schoolSubject.lessonSupplementalNote')}</p>
                <ListenButton
                  text={t('schoolSubject.lessonSupplementalNote')}
                  ariaLabel={t('listenButton.schoolSupplementalNote')}
                  size="sm"
                  className="shrink-0"
                />
              </div>
            </div>
          ) : null}

          <div className="school-subj-summary-box">
            {effectiveTeacherView ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="school-subj-summary-box__title m-0 flex-1 min-w-0">{t('schoolSubject.summaryHeading')}</h2>
                  <ListenButton
                    text={`${t('schoolSubject.summaryHeading')}. ${loc.summary}`}
                    ariaLabel={t('listenButton.schoolLessonSummary')}
                    size="sm"
                    className="shrink-0"
                  />
                </div>
                <p className="school-subj-summary-box__body">{loc.summary}</p>
              </>
            ) : (
              <div className="flex flex-wrap items-start gap-2">
                <p className="school-subj-summary-box__body m-0 flex-1 min-w-0 text-base leading-relaxed">{loc.summary}</p>
                <ListenButton text={loc.summary} ariaLabel={t('listenButton.schoolLessonSummary')} size="sm" className="shrink-0" />
              </div>
            )}
          </div>

          {effectiveTeacherView && teacherPack ? (
            <div className="school-subj-teacher-toolkit">
              <div className="flex flex-wrap items-start gap-2">
                <h2 className="school-subj-teacher-toolkit__title m-0 flex-1 min-w-0">
                  {t('schoolSubject.teacherToolkitTitle')}
                </h2>
                <ListenButton
                  text={`${t('schoolSubject.teacherToolkitTitle')}. ${t('schoolSubject.teacherToolkitSub')}`}
                  ariaLabel={t('listenButton.schoolTeacherToolkitIntro')}
                  size="sm"
                  className="shrink-0"
                />
              </div>
              <p className="school-subj-teacher-toolkit__sub muted text-sm">{t('schoolSubject.teacherToolkitSub')}</p>

              <div className="school-subj-deep-dive school-subj-deep-dive--in-toolkit">
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="school-subj-deep-dive__title m-0 flex-1 min-w-0">{t('schoolSubject.deepDiveHeading')}</h3>
                  <ListenButton
                    text={`${t('schoolSubject.deepDiveHeading')}. ${t('schoolSubject.deepDiveSub')}. ${teacherPack.conceptualDeepDive}`}
                    ariaLabel={t('listenButton.schoolDeepDive')}
                    size="sm"
                    className="shrink-0"
                  />
                </div>
                <p className="school-subj-deep-dive__sub muted text-sm">{t('schoolSubject.deepDiveSub')}</p>
                <p className="school-subj-deep-dive__body">{teacherPack.conceptualDeepDive}</p>
              </div>

              {teacherPack.vocabularyTerms.length > 0 ? (
                <div className="school-subj-vocab-block">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.vocabularyHeading')}</h3>
                  <dl className="school-subj-vocab-list">
                    {teacherPack.vocabularyTerms.map((row) => (
                      <div key={row.term} className="school-subj-vocab-row">
                        <div className="flex flex-wrap items-start gap-2">
                          <dt className="m-0 flex-1 min-w-0">{row.term}</dt>
                          <ListenButton
                            text={`${row.term}. ${row.definition}`}
                            ariaLabel={t('listenButton.schoolVocabulary')}
                            size="sm"
                            className="shrink-0"
                          />
                        </div>
                        <dd>{row.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {teacherPack.sayThisAloud ? (
                <div className="school-subj-modeling-block">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="school-subj-toolkit-section-title m-0 flex-1 min-w-0">
                      {t('schoolSubject.modelingHeading')}
                    </h3>
                    <ListenButton
                      text={`${t('schoolSubject.modelingHeading')}. ${teacherPack.sayThisAloud}`}
                      ariaLabel={t('listenButton.schoolModelingScript')}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                  <blockquote className="school-subj-modeling-quote">{teacherPack.sayThisAloud}</blockquote>
                </div>
              ) : null}

              {teacherPack.misconceptions.length > 0 ? (
                <div className="school-subj-myth-block">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.misconceptionsHeading')}</h3>
                  <ul className="school-subj-myth-list">
                    {teacherPack.misconceptions.map((m, i) => (
                      <li key={i} className="school-subj-myth-item">
                        <div className="flex flex-wrap items-start gap-2">
                          <p className="school-subj-myth-item__label m-0 flex-1 min-w-0">
                            {t('schoolSubject.misconceptionMyth')}
                          </p>
                          <ListenButton
                            text={`${t('schoolSubject.misconceptionMyth')}: ${m.myth}. ${t('schoolSubject.misconceptionFix')}: ${m.correction}`}
                            ariaLabel={t('listenButton.schoolMisconception')}
                            size="sm"
                            className="shrink-0"
                          />
                        </div>
                        <p className="school-subj-myth-item__myth">{m.myth}</p>
                        <p className="school-subj-myth-item__label">{t('schoolSubject.misconceptionFix')}</p>
                        <p>{m.correction}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="school-subj-diff-grid">
                <div className="school-subj-diff-card">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="school-subj-toolkit-section-title m-0 flex-1 min-w-0">
                      {t('schoolSubject.supportEmergingLabel')}
                    </h3>
                    <ListenButton
                      text={`${t('schoolSubject.supportEmergingLabel')}. ${teacherPack.supportEmergingLearners}`}
                      ariaLabel={t('listenButton.schoolSupportEmerging')}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                  <p>{teacherPack.supportEmergingLearners}</p>
                </div>
                <div className="school-subj-diff-card school-subj-diff-card--extend">
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="school-subj-toolkit-section-title m-0 flex-1 min-w-0">
                      {t('schoolSubject.extendDepthLabel')}
                    </h3>
                    <ListenButton
                      text={`${t('schoolSubject.extendDepthLabel')}. ${teacherPack.extendForDepth}`}
                      ariaLabel={t('listenButton.schoolExtendDepth')}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                  <p>{teacherPack.extendForDepth}</p>
                </div>
              </div>

              {teacherPack.extraPracticeIdeas.length > 0 ? (
                <div className="school-subj-extra-practice">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="school-subj-toolkit-section-title m-0 flex-1 min-w-0">
                      {t('schoolSubject.extraPracticeHeading')}
                    </h3>
                    <ListenButton
                      text={`${t('schoolSubject.extraPracticeHeading')}. ${teacherPack.extraPracticeIdeas.join('. ')}`}
                      ariaLabel={t('listenButton.schoolExtraPractice')}
                      size="sm"
                      className="shrink-0"
                    />
                  </div>
                  <ul className="school-subj-teach-bullets">
                    {teacherPack.extraPracticeIdeas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {effectiveTeacherView ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="school-subj-lesson__section-title m-0 flex-1 min-w-0">{t('schoolSubject.objectivesHeading')}</h2>
                <ListenButton
                  text={loc.objectives.join('. ')}
                  ariaLabel={t('listenButton.schoolObjectives')}
                  size="sm"
                  className="shrink-0"
                />
              </div>
              <ul className="school-subj-objectives">
                {loc.objectives.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </>
          ) : null}

          {loc.teachSections.map((sec, i) => {
            const paras = sec.body
              .split(/\n\n+/)
              .map((para) => para.trim())
              .filter(Boolean)
            const bulletsJoined = sec.bullets?.length ? sec.bullets.join('. ') : ''
            const sectionSpeak = [sec.heading, ...paras, bulletsJoined].filter(Boolean).join('. ')
            return (
            <div key={i} className="school-subj-section">
              <div className="flex flex-wrap items-start gap-2">
                <h2 className="m-0 flex-1 min-w-0">{sec.heading}</h2>
                <ListenButton
                  text={sectionSpeak}
                  ariaLabel={t('listenButton.schoolTeachSection')}
                  size="sm"
                  className="shrink-0"
                />
              </div>
              {sec.body
                .split(/\n\n+/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              {sec.bullets && sec.bullets.length > 0 ? (
                <ul className="school-subj-teach-bullets">
                  {sec.bullets.map((b, k) => (
                    <li key={k}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </div>
            )
          })}
          <Button
            type="button"
            className="mt-2"
            onClick={() => {
              resetQuiz()
              setStep(showPractice ? 'practice' : 'quiz')
            }}
          >
            {showPractice ? t('schoolSubject.goToPractice') : t('schoolSubject.goToQuiz')}
          </Button>
        </div>
        )}

        {step === 'practice' && showPractice ? (
        <div className="w-full min-w-0 px-1 py-2 sm:px-3 sm:py-4">
        <LessonPractice
          lesson={lesson}
          title={loc.title}
          locale={locale}
          practiceGameId={practiceGameId}
          orderedTapLabels={{
            title: t('schoolSubject.practiceOrderedTapTitle'),
            hint: t('schoolSubject.practiceOrderedTapHint'),
            wrong: t('schoolSubject.practiceOrderedTapWrong'),
            done: t('schoolSubject.practiceOrderedTapDone'),
            continueLabel: t('schoolSubject.practiceContinueToQuiz'),
          }}
          continueLabel={t('schoolSubject.practiceContinueToQuiz')}
          wrongHint={t('schoolSubject.practicePickWrongHint')}
          tryAgainLabel={t('schoolSubject.practicePickTryAgain')}
          onContinue={() => {
            recordSchoolSubjectPracticeComplete(subjectId, lesson.id)
            setStep('quiz')
          }}
        />
        </div>
        ) : null}

        {step === 'quiz' && !quizFinished && currentQ && (
        <div className="school-subj-quiz-panel px-4 py-4 md:px-6 md:pb-6">
          <div
            className="school-subj-quiz-progress"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={quizProgressPct}
            aria-label={t('schoolSubject.quizProgressAria', {
              current: qIndex + 1,
              total: questions.length,
            })}
          >
            <div className="school-subj-quiz-progress__fill" style={{ width: `${quizProgressPct}%` }} />
          </div>
          <p className="school-subj-quiz-progress-label text-sm muted">
            {t('schoolSubject.questionProgress', {
              current: qIndex + 1,
              total: questions.length,
            })}
          </p>
          <div className="school-subj-quiz-prompt flex flex-wrap items-start gap-2">
            <span className="min-w-0 flex-1">{currentQ.prompt}</span>
            <ListenButton
              text={quizPromptSpeakText}
              ariaLabel={t('listenButton.schoolQuizQuestion')}
              size="sm"
              className="shrink-0"
            />
          </div>
          <div className="school-subj-quiz-options">
            {currentQ.options.map((opt, idx) => {
              const isSel = selected === idx
              const isCor = idx === currentQ.correctIndex
              let cls = 'school-subj-quiz-opt'
              if (revealed) {
                if (isCor) cls += ' school-subj-quiz-opt--correct'
                else if (isSel) cls += ' school-subj-quiz-opt--wrong'
              }
              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  disabled={revealed}
                  aria-pressed={revealed ? isSel : undefined}
                  onClick={() => pickOption(idx)}
                >
                  {opt}
                </button>
              )
            })}
          </div>

          {revealed && selected !== null ? (
            <div
              className={`school-subj-quiz-feedback ${selected === currentQ.correctIndex ? 'school-subj-quiz-feedback--correct' : 'school-subj-quiz-feedback--wrong'}`}
              role="status"
            >
              <p className="school-subj-quiz-feedback__status">
                {selected === currentQ.correctIndex
                  ? t('schoolSubject.quizStatusCorrect')
                  : t('schoolSubject.quizStatusWrong')}
              </p>
              <div className="school-subj-quiz-feedback__answers">
                <p>
                  <span className="school-subj-quiz-feedback__label">{t('schoolSubject.quizCorrectIs')}:</span>{' '}
                  <strong>{currentQ.options[currentQ.correctIndex]}</strong>
                </p>
                {selected !== currentQ.correctIndex ? (
                  <p>
                    <span className="school-subj-quiz-feedback__label">{t('schoolSubject.quizYourAnswer')}:</span>{' '}
                    {currentQ.options[selected]}
                  </p>
                ) : null}
              </div>
              <h3 className="school-subj-quiz-feedback__why">{t('schoolSubject.quizWhyHeading')}</h3>
              <p className="school-subj-quiz-feedback__explain">
                {quizTeachingNote ||
                  t(
                    effectiveTeacherView ? 'schoolSubject.quizExplainFallback' : 'schoolSubject.quizExplainFallbackStudent',
                    {
                      answer: currentQ.options[currentQ.correctIndex],
                    },
                  )}
              </p>
              {selected !== currentQ.correctIndex ? (
                <p className="school-subj-quiz-feedback__coach">
                  {t(effectiveTeacherView ? 'schoolSubject.quizWrongCoach' : 'schoolSubject.quizWrongCoachStudent')}
                </p>
              ) : null}
              <p className="school-subj-quiz-feedback__hint muted text-sm">
                {t(effectiveTeacherView ? 'schoolSubject.quizReviewLearn' : 'schoolSubject.quizReviewLearnStudent')}
              </p>
              <div className="mt-3 flex justify-end">
                <ListenButton
                  text={quizFeedbackSpeakText}
                  ariaLabel={t('listenButton.schoolQuizFeedback')}
                  size="sm"
                />
              </div>
            </div>
          ) : null}

          <div className="school-subj-quiz-footer">
            <Button type="button" disabled={!revealed} onClick={onQuizNext}>
              {isLastQ ? t('schoolSubject.seeResults') : t('schoolSubject.nextQuestion')}
            </Button>
          </div>
        </div>
        )}

        {step === 'quiz' && quizFinished && (
        <div className="school-subj-quiz-results space-y-3 px-4 py-4 md:px-6 md:pb-6">
          <p className="school-subj-quiz-results__score font-semibold">
            {t('schoolSubject.quizDone', { score: quizCorrect, total: questions.length })}
          </p>
          {quizCorrect >= questions.length ? (
            <p className="school-subj-quiz-results__perfect">{t('schoolSubject.quizPerfect')}</p>
          ) : (
            <p className="school-subj-quiz-results__retry muted">{t('schoolSubject.quizRetry')}</p>
          )}
          <div className="school-subj-quiz-results__actions flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => { resetQuiz(); setStep('quiz') }}>
              {t('schoolSubject.retryQuiz')}
            </Button>
            <Button type="button" onClick={() => setStep('tip')}>
              {t('schoolSubject.goToTip')}
            </Button>
          </div>
        </div>
        )}

        {step === 'tip' && (
        <div className="school-subj-tip-panel px-4 py-4 md:px-6 md:pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="school-subj-lesson__section-title m-0 flex-1 min-w-0">{t('schoolSubject.tipHeading')}</h2>
            <ListenButton
              text={tipSpeakText}
              ariaLabel={t('listenButton.schoolTip')}
              size="sm"
              className="shrink-0"
            />
          </div>
          {effectiveTeacherView ? <p className="school-subj-tip-sublead muted text-sm">{t('schoolSubject.tipSublead')}</p> : null}
          {effectiveTeacherView && (ageBand === 'tots' || ageBand === 'kids') ? (
            <p className="school-subj-tip-imagination muted text-sm">{t('schoolSubject.tipImaginationNote')}</p>
          ) : null}
          {loc.offlineApplication ? (
            <>
              <h3 className="school-subj-tip-kicker">{t('schoolSubject.tipTryHeading')}</h3>
              <div className="school-subj-tip-box school-subj-tip-box--try">{loc.offlineApplication}</div>
              <h3 className="school-subj-tip-kicker">{t('schoolSubject.tipWhyHeading')}</h3>
              <div className="school-subj-tip-box">{loc.realWorldTip}</div>
            </>
          ) : (
            <div className="school-subj-tip-box">{loc.realWorldTip}</div>
          )}
          <div className="mt-4">
            <Link to={trackPath} className="primary-button">
              {t('schoolSubject.backToSubjectTrack')}
            </Link>
          </div>
        </div>
        )}
      </LessonPlayerLayout>
    </section>
  )
}

export default SchoolSubjectLessonPage
