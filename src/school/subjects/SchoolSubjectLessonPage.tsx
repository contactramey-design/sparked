import React, { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { Button } from '@/components/ui/button'
import { getSubjectLessonById } from './registry'
import { recordSchoolSubjectQuizResult } from './schoolSubjectProgress'
import { getSchoolSubjectTeacherPack } from './schoolSubjectTeacherPack'
import { getSchoolSubjectQuizFeedback } from './schoolSubjectQuizFeedback'
import {
  caFrameworkLabel,
  cdeFrameworkUrl,
  formatCaStandardsBadge,
  caStandardsReferenceUrl,
} from './caStandardsDisplay'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import { isLessonInBand, isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import './school-subject.css'

type StepId = 'learn' | 'quiz' | 'tip'

const SchoolSubjectLessonPage: React.FC = () => {
  const { subjectId: rawSubject, lessonId: rawId } = useParams<{ subjectId: string; lessonId: string }>()
  const subjectId = rawSubject as SchoolSubjectId | undefined
  const lessonId = rawId ? decodeURIComponent(rawId) : ''
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { ageBand } = useAgeBand()
  const { isTeacherView } = useSchoolAudience()

  const validSubject = subjectId && isSchoolSubjectId(subjectId)

  const lesson = useMemo(() => {
    if (!validSubject) return undefined
    return getSubjectLessonById(subjectId, lessonId)
  }, [validSubject, subjectId, lessonId])
  const loc = lesson ? lessonLocale(lesson, locale) : null

  const [step, setStep] = useState<StepId>('learn')
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

  const trackPath = validSubject ? `/schools/subjects/${subjectId}` : '/schools/subjects'

  if (!validSubject || !lesson || !loc) {
    return (
      <section className="school-subj-lesson">
        <Link to={validSubject ? trackPath : '/schools/subjects'} className="link-back">
          {t('schoolSubject.backToSubjectTrack')}
        </Link>
        <p className="muted">{t('schoolSubject.lessonNotFound')}</p>
      </section>
    )
  }

  if (!isLessonInBand(lesson, ageBand)) {
    return (
      <section className="school-subj-lesson">
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

  const questions = loc.quiz
  const currentQ = questions[qIndex]
  const isLastQ = qIndex >= questions.length - 1
  const teacherPack = useMemo(() => getSchoolSubjectTeacherPack(lesson.id, locale), [lesson.id, locale])

  const quizTeachingNote = useMemo(() => {
    if (!currentQ) return ''
    if (!isTeacherView) {
      return currentQ.feedback?.trim() || ''
    }
    return (
      currentQ.feedback?.trim() ||
      getSchoolSubjectQuizFeedback(currentQ.id, locale)?.trim() ||
      ''
    )
  }, [currentQ?.id, currentQ?.feedback, locale, isTeacherView])

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
    <section className="school-subj-lesson">
      <Link to={trackPath} className="link-back">
        {t('schoolSubject.backToSubjectTrack')}
      </Link>

      <div className="school-subj-lesson-audience-row no-print">
        <SchoolAudienceToggle compact />
      </div>

      <header style={{ marginTop: '0.75rem' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
          {loc.title}
        </h1>
        <p className="muted text-sm" style={{ marginTop: '0.25rem' }}>
          {t('schoolSubject.durationLine', { minutes: lesson.estMinutes })}
          {isTeacherView && lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
        </p>
        {isTeacherView && lesson.caStandards ? (
          <div className="school-subj-lesson-ca">
            <h2 className="school-subj-lesson-ca__title">{t('schoolSubjects.caStandardsHeading')}</h2>
            <p className="school-subj-lesson-ca__framework">
              {caFrameworkLabel(lesson.caStandards.framework, locale)}
              {lesson.caStandards.gradeSpan ? ` · ${lesson.caStandards.gradeSpan}` : ''}
            </p>
            <ul className="school-subj-lesson-ca__codes">
              {lesson.caStandards.codes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="school-subj-lesson-ca__badge muted text-sm">{formatCaStandardsBadge(lesson.caStandards)}</p>
            <div className="school-subj-lesson-ca__links">
              <a href={caStandardsReferenceUrl(lesson.caStandards)} target="_blank" rel="noopener noreferrer">
                {t('schoolSubjects.viewCdeSearch')}
              </a>
              <a href={cdeFrameworkUrl(lesson.caStandards.framework)} target="_blank" rel="noopener noreferrer">
                {t('schoolSubjects.viewCde')}
              </a>
            </div>
          </div>
        ) : null}
      </header>

      <div className="school-subj-stepper" role="tablist" aria-label={t('schoolSubject.stepsAria')}>
        {(['learn', 'quiz', 'tip'] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={step === s}
            className={`school-subj-step ${step === s ? 'school-subj-step--active' : ''}`}
            onClick={() => setStep(s)}
          >
            {s === 'learn' && t('schoolSubject.stepLearn')}
            {s === 'quiz' && t('schoolSubject.stepQuiz')}
            {s === 'tip' && t('schoolSubject.stepTip')}
          </button>
        ))}
      </div>

      {step === 'learn' && (
        <div className="school-subj-learn">
          {isTeacherView ? (
            <div className="school-subj-supplemental-callout" role="note">
              <p>{t('schoolSubject.lessonSupplementalNote')}</p>
            </div>
          ) : null}

          <div className="school-subj-summary-box">
            <h2 className="school-subj-summary-box__title">{t('schoolSubject.summaryHeading')}</h2>
            <p className="school-subj-summary-box__body">{loc.summary}</p>
          </div>

          {isTeacherView && teacherPack ? (
            <div className="school-subj-teacher-toolkit">
              <h2 className="school-subj-teacher-toolkit__title">{t('schoolSubject.teacherToolkitTitle')}</h2>
              <p className="school-subj-teacher-toolkit__sub muted text-sm">{t('schoolSubject.teacherToolkitSub')}</p>

              <div className="school-subj-deep-dive school-subj-deep-dive--in-toolkit">
                <h3 className="school-subj-deep-dive__title">{t('schoolSubject.deepDiveHeading')}</h3>
                <p className="school-subj-deep-dive__sub muted text-sm">{t('schoolSubject.deepDiveSub')}</p>
                <p className="school-subj-deep-dive__body">{teacherPack.conceptualDeepDive}</p>
              </div>

              {teacherPack.vocabularyTerms.length > 0 ? (
                <div className="school-subj-vocab-block">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.vocabularyHeading')}</h3>
                  <dl className="school-subj-vocab-list">
                    {teacherPack.vocabularyTerms.map((row) => (
                      <div key={row.term} className="school-subj-vocab-row">
                        <dt>{row.term}</dt>
                        <dd>{row.definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {teacherPack.sayThisAloud ? (
                <div className="school-subj-modeling-block">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.modelingHeading')}</h3>
                  <blockquote className="school-subj-modeling-quote">{teacherPack.sayThisAloud}</blockquote>
                </div>
              ) : null}

              {teacherPack.misconceptions.length > 0 ? (
                <div className="school-subj-myth-block">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.misconceptionsHeading')}</h3>
                  <ul className="school-subj-myth-list">
                    {teacherPack.misconceptions.map((m, i) => (
                      <li key={i} className="school-subj-myth-item">
                        <p className="school-subj-myth-item__label">{t('schoolSubject.misconceptionMyth')}</p>
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
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.supportEmergingLabel')}</h3>
                  <p>{teacherPack.supportEmergingLearners}</p>
                </div>
                <div className="school-subj-diff-card school-subj-diff-card--extend">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.extendDepthLabel')}</h3>
                  <p>{teacherPack.extendForDepth}</p>
                </div>
              </div>

              {teacherPack.extraPracticeIdeas.length > 0 ? (
                <div className="school-subj-extra-practice">
                  <h3 className="school-subj-toolkit-section-title">{t('schoolSubject.extraPracticeHeading')}</h3>
                  <ul className="school-subj-teach-bullets">
                    {teacherPack.extraPracticeIdeas.map((idea, i) => (
                      <li key={i}>{idea}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <h2 className="text-base font-semibold mb-2 mt-4" style={{ color: 'var(--text-color)' }}>
            {t('schoolSubject.objectivesHeading')}
          </h2>
          <ul className="school-subj-objectives">
            {loc.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>

          {loc.teachSections.map((sec, i) => (
            <div key={i} className="school-subj-section">
              <h2>{sec.heading}</h2>
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
          ))}
          <Button
            type="button"
            className="mt-2"
            onClick={() => {
              resetQuiz()
              setStep('quiz')
            }}
          >
            {t('schoolSubject.goToQuiz')}
          </Button>
        </div>
      )}

      {step === 'quiz' && !quizFinished && currentQ && (
        <div>
          <p className="text-sm muted mb-2">
            {t('schoolSubject.questionProgress', {
              current: qIndex + 1,
              total: questions.length,
            })}
          </p>
          <div className="school-subj-quiz-prompt">{currentQ.prompt}</div>
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
                    isTeacherView ? 'schoolSubject.quizExplainFallback' : 'schoolSubject.quizExplainFallbackStudent',
                    {
                      answer: currentQ.options[currentQ.correctIndex],
                    },
                  )}
              </p>
              {selected !== currentQ.correctIndex ? (
                <p className="school-subj-quiz-feedback__coach">
                  {t(isTeacherView ? 'schoolSubject.quizWrongCoach' : 'schoolSubject.quizWrongCoachStudent')}
                </p>
              ) : null}
              <p className="school-subj-quiz-feedback__hint muted text-sm">
                {t(isTeacherView ? 'schoolSubject.quizReviewLearn' : 'schoolSubject.quizReviewLearnStudent')}
              </p>
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
        <div className="space-y-3">
          <p className="font-semibold" style={{ color: 'var(--text-color)' }}>
            {t('schoolSubject.quizDone', { score: quizCorrect, total: questions.length })}
          </p>
          {quizCorrect >= questions.length ? (
            <p>{t('schoolSubject.quizPerfect')}</p>
          ) : (
            <p className="muted">{t('schoolSubject.quizRetry')}</p>
          )}
          <div className="flex flex-wrap gap-2">
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
        <div>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
            {t('schoolSubject.tipHeading')}
          </h2>
          <div className="school-subj-tip-box">{loc.realWorldTip}</div>
          <div className="mt-4">
            <Link to={trackPath} className="primary-button">
              {t('schoolSubject.backToSubjectTrack')}
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default SchoolSubjectLessonPage
