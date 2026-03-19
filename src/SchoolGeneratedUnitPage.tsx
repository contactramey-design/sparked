import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { ensureAnonymousSchoolAuth, getSchoolSession } from '@/school/schoolSession'
import { curriculum, type QuizQuestion, type UnitConfig } from './curriculum'
import GameQuiz from './GameQuiz'
import { updateUnitAfterQuiz, getUnitStatus } from './progress'
import { useTranslation } from './contexts/LocaleContext'
import ListenButton from './components/ListenButton'
import SparkiAvatar from './components/SparkiAvatar'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { readJsonFromCache, unitJsonPath, writeJsonToCache } from './lib/schoolGeneratorCache'

type GeneratedHomeworkStep = {
  id: string
  story: string
  prompt: string
  hint: string
}

type GeneratedHomeworkAdventure = {
  title: string
  subject: string
  topic: string
  steps: GeneratedHomeworkStep[]
}

type GeneratedUnitJson = {
  id?: string
  title: string
  summary: string
  estMinutes?: number
  ageGroup?: string
  isFree?: boolean
  sparklesReward?: number
  contentBlocks: string[]
  quizQuestions: QuizQuestion[]
  homeworkAdventure: GeneratedHomeworkAdventure
  homeworkAdventureVideoUrl?: string
}

type GeneratorUnitRow = {
  generator_id: string
  unit_json: GeneratedUnitJson
}

function parseContentBlocks(blocks: string[]) {
  const storyPrefixes = [/^Story:\s*/i, /^Historia:\s*/i]
  const storyBlock = blocks.find((b) => storyPrefixes.some((re) => re.test(b)))
  let story: string | null = null
  if (storyBlock) {
    const prefix = storyPrefixes.find((re) => re.test(storyBlock))
    story = prefix ? storyBlock.replace(prefix, '').trim() : storyBlock.trim()
  }
  const ruleBlocks = blocks.filter((b) => !storyPrefixes.some((re) => re.test(b)))
  const rules = ruleBlocks.map((block) => {
    // Support both English and Spanish labels.
    const match = block.match(
      /^(Rule|Safety|Kindness|Myth-buster|Idea|Feelings|Pause|Scenario|Examples|Game|Regla|Seguridad|Amabilidad|Idea|Sentimientos|Pausa|Escenario|Ejemplos|Juego):\s*(.*)$/i,
    )
    const label = match ? match[1] : null
    const text = match ? match[2].trim() : block
    return { label, text }
  })
  return { story, rules }
}

function makeUnitConfigFromGenerated(unitId: string, unit: GeneratedUnitJson): UnitConfig {
  return {
    // trackId is not used by the school-generated unit UI, but the type requires it.
    id: unitId,
    trackId: curriculum.tracks[0]?.id ?? 'ai-coding',
    title: unit.title,
    summary: unit.summary,
    estMinutes: unit.estMinutes ?? 20,
    ageGroup: 'age2',
    isFree: true,
    sparklesReward: unit.sparklesReward ?? 10,
    contentBlocks: unit.contentBlocks,
    quizQuestions: unit.quizQuestions,
    activity: {
      id: `generated-act-${unitId}`,
      title: unit.homeworkAdventure?.title ?? 'Home activity',
      description: unit.homeworkAdventure?.topic
        ? `Homework topic: ${unit.homeworkAdventure.topic}`
        : 'A family-friendly homework activity.',
    },
  }
}

const SchoolGeneratedUnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const unitIdSafe = (unitId ?? '').toString()

  const { t } = useTranslation()
  const navigate = useNavigate()

  const { classId } = getSchoolSession()
  const [unitJson, setUnitJson] = useState<GeneratedUnitJson | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [materialFinished, setMaterialFinished] = useState(false)
  const [selected, setSelected] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [quizError, setQuizError] = useState<string | null>(null)
  const [earnedSparkles, setEarnedSparkles] = useState<number | null>(null)
  const [mastered, setMastered] = useState(false)
  const [wasAlreadyMastered, setWasAlreadyMastered] = useState(false)

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const homeworkSteps = unitJson?.homeworkAdventure?.steps ?? []

  useEffect(() => {
    if (!supabase) return
    if (!unitIdSafe) return
    if (!classId) {
      navigate('/schools', { replace: true })
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const isOffline = typeof window !== 'undefined' && !window.navigator.onLine

        if (isOffline) {
          const cached = await readJsonFromCache<GeneratedUnitJson>(unitJsonPath(unitIdSafe))
          if (!cached) throw new Error('No offline data for this unit yet. Ask your teacher to generate again while online.')
          if (cancelled) return
          setUnitJson(cached)
          const quizLen = cached.quizQuestions?.length ?? 0
          setSelected(Array(quizLen).fill(-1))
          const justExisting = !!getUnitStatus(unitIdSafe)?.mastered
          setMastered(justExisting)
          setWasAlreadyMastered(justExisting)
          return
        }

        const uid = await ensureAnonymousSchoolAuth()
        if (!uid) throw new Error('Could not start anonymous school session.')

        const { data: unitRow, error: unitErr } = await supabase
          .from('school_weekly_generator_units')
          .select('generator_id,unit_json')
          .eq('unit_id', unitIdSafe)
          .single()

        if (unitErr) throw unitErr
        const row = unitRow as GeneratorUnitRow | null
        if (!row?.unit_json) throw new Error('Unit not found.')

        // Avoid showing expired generators.
        const { data: genRow, error: genErr } = await supabase
          .from('school_weekly_generators')
          .select('expires_at')
          .eq('id', row.generator_id)
          .single()
        if (genErr) throw genErr

        if (genRow?.expires_at && new Date(genRow.expires_at).getTime() <= Date.now()) {
          throw new Error('This generated unit has expired.')
        }

        if (cancelled) return
        setUnitJson(row.unit_json)

        // Cache for offline mode.
        void writeJsonToCache(unitJsonPath(unitIdSafe), row.unit_json)

        const quizLen = row.unit_json.quizQuestions?.length ?? 0
        setSelected(Array(quizLen).fill(-1))

        const justExisting = !!getUnitStatus(unitIdSafe)?.mastered
        setMastered(justExisting)
        setWasAlreadyMastered(justExisting)
      } catch (e: any) {
        if (cancelled) return

        // Fallback: if Supabase fetch fails, try CacheStorage.
        const cached = await readJsonFromCache<GeneratedUnitJson>(unitJsonPath(unitIdSafe)).catch(() => null)
        if (cached) {
          setUnitJson(cached)
          const quizLen = cached.quizQuestions?.length ?? 0
          setSelected(Array(quizLen).fill(-1))
          const justExisting = !!getUnitStatus(unitIdSafe)?.mastered
          setMastered(justExisting)
          setWasAlreadyMastered(justExisting)
        } else {
          setError(e?.message ?? 'Failed to load unit.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [classId, navigate, unitIdSafe])

  const parsed = useMemo(() => {
    if (!unitJson?.contentBlocks) return { story: null as string | null, rules: [] as Array<{ label: string | null; text: string }> }
    return parseContentBlocks(unitJson.contentBlocks)
  }, [unitJson])

  const unitConfig = useMemo(() => {
    if (!unitJson) return null
    return makeUnitConfigFromGenerated(unitIdSafe, unitJson)
  }, [unitIdSafe, unitJson])

  useEffect(() => {
    // Reset homework stepper when unit changes.
    setCurrentStepIndex(0)
    setShowHint(false)
  }, [unitIdSafe])

  if (loading) {
    return (
      <section className="lesson-page">
        <Card>
          <CardContent>
            <p className="muted">Loading…</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (error) {
    return (
      <section className="lesson-page">
        <header className="lesson-header">
          <Link to="/schools/weekly-track" className="link-back">
            Back
          </Link>
        </header>
        <Card>
          <CardContent>
            <p className="quiz-error" role="alert">
              {error}
            </p>
          </CardContent>
        </Card>
      </section>
    )
  }

  if (!unitJson || !unitConfig) {
    return null
  }

  const handleChange = (qIndex: number, optionIndex: number) => {
    const next = [...selected]
    next[qIndex] = optionIndex
    setSelected(next)
  }

  const triggerQuizSubmit = () => {
    setQuizError(null)

    if (!unitConfig) return
    if (selected.some((i) => i === -1)) {
      setQuizError(t('unit.answerAllFirst'))
      return
    }

    let correct = 0
    unitConfig.quizQuestions.forEach((q, idx) => {
      if (selected[idx] === q.correctIndex) correct += 1
    })

    setScore(correct)

    const result = updateUnitAfterQuiz(unitConfig, correct, unitConfig.quizQuestions.length)
    setEarnedSparkles(result.earnedThisAttempt)
    const updatedStatus = result.progress.units[unitConfig.id]
    const justMastered = !!updatedStatus?.mastered
    setMastered(justMastered)
  }

  const correctCountText =
    score !== null ? `You got ${score} out of ${unitConfig.quizQuestions.length} correct.` : ''

  return (
    <section className="lesson-page unit-page-single">
      <header className="lesson-header">
        <div className="flex flex-wrap items-center gap-3">
          <SparkiAvatar size="md" />
          <div>
            <h2>{unitJson.title}</h2>
            <p className="welcome-subtitle muted">{parsed.story ? 'Lesson + Quiz + Homework' : 'Generated lesson'}</p>
          </div>
        </div>
        <Link to="/schools/weekly-track" className="link-back">
          Back to Weekly Track
        </Link>
      </header>

      <div className="unit-material-section rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-lg md:p-8">
        <div className="mt-0 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-center">{t('curriculum.learnWithSparkiHeading')}</h2>
              <ListenButton text={t('curriculum.learnWithSparkiHeading')} ariaLabel="Listen to heading" size="sm" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <p className="text-center text-lg text-slate-700">{unitJson.summary}</p>
              <ListenButton text={unitJson.summary} ariaLabel="Listen to summary" size="sm" />
            </div>
          </div>

          {parsed.story && (
            <Card className="border-2 border-pink-200 bg-pink-50/60 shadow-md rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg md:text-xl">{t('curriculum.storyTimeWithSparki')}</CardTitle>
                  <ListenButton text={parsed.story} ariaLabel="Listen to story" size="sm" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-slate-800 md:text-lg" style={{ fontSize: 'min(1.1rem, 4vw)' }}>
                  {parsed.story}
                </p>
              </CardContent>
            </Card>
          )}

          {parsed.rules.length > 0 && (
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {parsed.rules.map((rule, idx) => {
                const ruleText = rule.label ? `${rule.label}: ${rule.text}` : rule.text
                return (
                  <Card key={idx} className="border-2 border-blue-100 bg-blue-50/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-left text-lg flex-1">
                          {rule.label ? <span className="font-extrabold">{rule.label}: </span> : null}
                          {rule.text}
                        </CardTitle>
                        <ListenButton text={ruleText} ariaLabel={`Listen to rule ${idx + 1}`} size="sm" className="flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          )}

          {!materialFinished && (
            <div className="unit-material-end w-full flex flex-col items-center justify-center border-t-2 border-dashed border-slate-200 pt-8">
              <Button
                size="lg"
                className="w-full min-h-[3.5rem] max-w-md text-lg shrink-0"
                onClick={() => setMaterialFinished(true)}
              >
                {t('curriculum.finishedShowQuiz')}
              </Button>
            </div>
          )}
        </div>

        {materialFinished && (
          <div className="unit-quiz-section mt-6">
            {unitConfig.quizQuestions.length > 0 && (
              <GameQuiz
                unit={unitConfig}
                selected={selected}
                onAnswer={handleChange}
                onSubmit={(e) => {
                  e.preventDefault()
                  triggerQuizSubmit()
                }}
                score={score}
                error={quizError}
                earnedSparkles={earnedSparkles}
                wasAlreadyMastered={wasAlreadyMastered}
                mastered={mastered}
                nextUnit={null}
                correctCountText={correctCountText}
              />
            )}
          </div>
        )}

        {materialFinished && score !== null && (
          <div className="mt-8 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Homework Adventure</CardTitle>
                <div className="muted">{unitJson.homeworkAdventure.title}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {unitJson.homeworkAdventureVideoUrl && (
                  <div className="video-wrapper">
                    <p className="video-caption muted">Video adventure</p>
                    <video controls preload="metadata" poster={VIDEO_POSTER_DATA_URL} style={{ width: '100%', borderRadius: 'var(--radius-md)' }}>
                      <source src={unitJson.homeworkAdventureVideoUrl} />
                    </video>
                  </div>
                )}

                <div>
                  <div className="muted">
                    {unitJson.homeworkAdventure.subject} · {unitJson.homeworkAdventure.topic}
                  </div>
                  <div className="muted" style={{ fontSize: 12 }}>
                    (Step {currentStepIndex + 1} of {homeworkSteps.length})
                  </div>
                </div>

                {homeworkSteps[currentStepIndex] && (
                  <div className="homework-adventure">
                    <p className="homework-step-story" style={{ fontSize: 16 }}>
                      {homeworkSteps[currentStepIndex].story}
                    </p>
                    <p className="homework-step-prompt" style={{ fontWeight: 700 }}>
                      {homeworkSteps[currentStepIndex].prompt}
                    </p>

                    {showHint ? (
                      <p className="homework-step-hint muted">
                        <strong>Hint:</strong> {homeworkSteps[currentStepIndex].hint}
                      </p>
                    ) : (
                      <Button variant="secondary" onClick={() => setShowHint(true)}>
                        Show hint
                      </Button>
                    )}

                    {homeworkSteps.length > 1 && (
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                        <Button
                          variant="secondary"
                          disabled={currentStepIndex === 0}
                          onClick={() => {
                            setShowHint(false)
                            setCurrentStepIndex((i) => Math.max(0, i - 1))
                          }}
                        >
                          Prev
                        </Button>
                        <Button
                          variant="secondary"
                          disabled={currentStepIndex >= homeworkSteps.length - 1}
                          onClick={() => {
                            setShowHint(false)
                            setCurrentStepIndex((i) => Math.min(homeworkSteps.length - 1, i + 1))
                          }}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}

export default SchoolGeneratedUnitPage

