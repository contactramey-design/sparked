import React, { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { Button } from '@/components/ui/button'
import {
  getSchoolMathLessonById,
  isLessonInBand,
  lessonLocale,
} from './schoolMathCurriculum'
import { recordSchoolMathQuizResult } from './schoolMathProgress'
import './school-math.css'

type StepId = 'learn' | 'quiz' | 'tip'

const SchoolMathLessonPage: React.FC = () => {
  const { lessonId: rawId } = useParams<{ lessonId: string }>()
  const lessonId = rawId ? decodeURIComponent(rawId) : ''
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { ageBand } = useAgeBand()

  const lesson = useMemo(() => getSchoolMathLessonById(lessonId), [lessonId])
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

  if (!lesson || !loc) {
    return (
      <section className="school-math-lesson">
        <Link to="/schools/math" className="link-back">
          {t('schoolMath.backToMath')}
        </Link>
        <p className="muted">{t('schoolMath.lessonNotFound')}</p>
      </section>
    )
  }

  if (!isLessonInBand(lesson, ageBand)) {
    return (
      <section className="school-math-lesson">
        <Link to="/schools/math" className="link-back">
          {t('schoolMath.backToMath')}
        </Link>
        <div className="card p-4 space-y-3">
          <p>{t('schoolMath.wrongBand')}</p>
          <Button type="button" variant="secondary" onClick={() => navigate('/schools/math')}>
            {t('schoolMath.chooseBand')}
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
      recordSchoolMathQuizResult(lesson.id, quizCorrect, total)
      setQuizFinished(true)
    } else {
      setQIndex((i) => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  return (
    <section className="school-math-lesson">
      <Link to="/schools/math" className="link-back">
        {t('schoolMath.backToMath')}
      </Link>

      <header style={{ marginTop: '0.75rem' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-color)' }}>
          {loc.title}
        </h1>
        <p className="muted text-sm" style={{ marginTop: '0.25rem' }}>
          {t('schoolMath.durationLine', { minutes: lesson.estMinutes })}
          {lesson.standardsNote ? ` · ${lesson.standardsNote}` : ''}
        </p>
      </header>

      <div className="school-math-stepper" role="tablist" aria-label={t('schoolMath.stepsAria')}>
        {(['learn', 'quiz', 'tip'] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={step === s}
            className={`school-math-step ${step === s ? 'school-math-step--active' : ''}`}
            onClick={() => setStep(s)}
          >
            {s === 'learn' && t('schoolMath.stepLearn')}
            {s === 'quiz' && t('schoolMath.stepQuiz')}
            {s === 'tip' && t('schoolMath.stepTip')}
          </button>
        ))}
      </div>

      {step === 'learn' && (
        <div>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
            {t('schoolMath.objectivesHeading')}
          </h2>
          <ul className="school-math-objectives">
            {loc.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
          {loc.teachSections.map((sec, i) => (
            <div key={i} className="school-math-section">
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
            {t('schoolMath.goToQuiz')}
          </Button>
        </div>
      )}

      {step === 'quiz' && !quizFinished && currentQ && (
        <div>
          <p className="text-sm muted mb-2">
            {t('schoolMath.questionProgress', {
              current: qIndex + 1,
              total: questions.length,
            })}
          </p>
          <div className="school-math-quiz-prompt">{currentQ.prompt}</div>
          <div className="school-math-quiz-options">
            {currentQ.options.map((opt, idx) => {
              const isSel = selected === idx
              const isCor = idx === currentQ.correctIndex
              let cls = 'school-math-quiz-opt'
              if (revealed) {
                if (isCor) cls += ' school-math-quiz-opt--correct'
                else if (isSel) cls += ' school-math-quiz-opt--wrong'
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
          <div className="school-math-quiz-footer">
            <Button type="button" disabled={!revealed} onClick={onQuizNext}>
              {isLastQ ? t('schoolMath.seeResults') : t('schoolMath.nextQuestion')}
            </Button>
          </div>
        </div>
      )}

      {step === 'quiz' && quizFinished && (
        <div className="space-y-3">
          <p className="font-semibold" style={{ color: 'var(--text-color)' }}>
            {t('schoolMath.quizDone', { score: quizCorrect, total: questions.length })}
          </p>
          {quizCorrect >= questions.length ? (
            <p>{t('schoolMath.quizPerfect')}</p>
          ) : (
            <p className="muted">{t('schoolMath.quizRetry')}</p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => { resetQuiz(); setStep('quiz') }}>
              {t('schoolMath.retryQuiz')}
            </Button>
            <Button type="button" onClick={() => setStep('tip')}>
              {t('schoolMath.goToTip')}
            </Button>
          </div>
        </div>
      )}

      {step === 'tip' && (
        <div>
          <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-color)' }}>
            {t('schoolMath.tipHeading')}
          </h2>
          <div className="school-math-tip-box">{loc.realWorldTip}</div>
          <div className="mt-4">
            <Link to="/schools/math" className="primary-button">
              {t('schoolMath.backToMath')}
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default SchoolMathLessonPage
