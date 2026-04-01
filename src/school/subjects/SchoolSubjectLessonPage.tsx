import React, { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { Button } from '@/components/ui/button'
import { getSubjectLessonById } from './registry'
import { recordSchoolSubjectQuizResult } from './schoolSubjectProgress'
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

      <header style={{ marginTop: '0.75rem' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
          {loc.title}
        </h1>
        <p className="muted text-sm" style={{ marginTop: '0.25rem' }}>
          {t('schoolSubject.durationLine', { minutes: lesson.estMinutes })}
          {lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
        </p>
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
        <div>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
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
              <p>{sec.body}</p>
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
