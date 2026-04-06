import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { supabase } from './lib/supabaseClient'
import { randomSchoolClassCode } from './lib/schoolClassCode'
import { isTeacherUser } from './lib/supabaseUserRole'
import { curriculum } from './curriculum'
import type { AgeBandId } from './ageBand'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { writeTeacherClassSnapshot } from '@/lib/teacherSelectedClassStorage'
import GovernanceOverviewContent from '@/components/GovernanceOverviewContent'

const TEACHER_ONBOARDING_KEY = 'sparki_teacher_onboarding_dismissed_v1'

function subjectTrackStats(progress: unknown): { count: number; mastered: number } {
  const p = progress as Record<string, unknown>
  const st = p.sparkiSubjectTracks as { lessons?: Record<string, { quizBestScore?: number }> } | undefined
  const lessons = st?.lessons
  if (!lessons || typeof lessons !== 'object') return { count: 0, mastered: 0 }
  const vals = Object.values(lessons)
  return {
    count: vals.length,
    mastered: vals.filter((e) => (e?.quizBestScore ?? 0) >= 1).length,
  }
}

function engagementLastPing(progress: unknown): string {
  const p = progress as Record<string, unknown>
  const e = p.sparkiEngagement as { lastPingAt?: string } | undefined
  return e?.lastPingAt ? String(e.lastPingAt) : ''
}

type SchoolClassRow = {
  id: string
  name: string
  class_code: string
  teacher_id: string
  created_at: string
  age_band?: AgeBandId | string
  bulletin_text?: string | null
  bulletin_updated_at?: string | null
}

type StudentProgressRow = {
  id: string
  class_id: string
  student_code: string
  progress: unknown
  updated_at: string
}

function downloadPlainTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function toCsv(rows: Array<Record<string, string | number>>): string {
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k))
      return set
    }, new Set<string>()),
  )
  const escape = (v: string | number) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h] ?? '')).join(','))].join('\n')
}

function safeProgressObject(progress: unknown): { units?: Record<string, { mastered?: boolean }> } {
  if (!progress || typeof progress !== 'object') return {}
  return progress as { units?: Record<string, { mastered?: boolean }> }
}

function percent(n: number, d: number): number {
  if (d <= 0) return 0
  return Math.round((n / d) * 100)
}

function computeTrackCompletion(trackId: string, progress: unknown): number {
  const unitIds = curriculum.units.filter((u) => u.trackId === trackId).map((u) => u.id)
  const p = safeProgressObject(progress)
  const masteredCount = unitIds.filter((id) => p.units?.[id]?.mastered).length
  return percent(masteredCount, unitIds.length)
}

function buildParentProgressSummary(opts: {
  className: string
  classCode: string
  bulletin: string
  studentsCount: number
  safetyAvg: number
  aiAvg: number
  homeworkAvg: number
  overallAvg: number
  exportedAt: string
}): string {
  const lines = [
    `Class: ${opts.className}`,
    `Join code: ${opts.classCode}`,
    `Exported: ${opts.exportedAt}`,
    '',
    'What we are practicing in SpArki (anonymous class averages):',
    `- Internet safety track: ${opts.safetyAvg}%`,
    `- AI & coding track: ${opts.aiAvg}%`,
    `- Homework adventures (when active): ${opts.homeworkAvg}%`,
    `- Overall blend: ${opts.overallAvg}%`,
    '',
    `Students with synced progress: ${opts.studentsCount}`,
    '',
    'Teacher / class note for families:',
    opts.bulletin.trim() || '(No class note saved yet.)',
    '',
    'Tip: SpArki uses anonymous labels on devices—not a full official roster.',
    'Ask your teacher if you need help joining from home with the class code.',
  ]
  return lines.join('\n')
}

function buildCountyPilotSummary(opts: {
  className: string
  classCode: string
  studentsCount: number
  safetyAvg: number
  aiAvg: number
  homeworkAvg: number
  overallAvg: number
  subjectLessonsTouched: number
  subjectLessonsMastered: number
  exportedAt: string
}): string {
  const lines = [
    'SpArki pilot — class summary (for principals / county / board packets)',
    '',
    `Class: ${opts.className}`,
    `Join code: ${opts.classCode}`,
    `Export timestamp (UTC): ${opts.exportedAt}`,
    '',
    'Aggregate completion (anonymous student rows, class average):',
    `- Internet safety track: ${opts.safetyAvg}%`,
    `- AI & coding track: ${opts.aiAvg}%`,
    `- Generated homework units (when active): ${opts.homeworkAvg}%`,
    `- Blended overall: ${opts.overallAvg}%`,
    '',
    `Synced anonymous rows: ${opts.studentsCount}`,
    `Subject-track practice (totals across roster): ${opts.subjectLessonsMastered} mastered / ${opts.subjectLessonsTouched} lesson touches`,
    '',
    'Data notes:',
    '- No ads or behavioral ads in the student experience.',
    '- COPPA / FERPA-oriented design: class codes + anonymous labels; see For Schools → Compliance.',
    '- For raw columns, use Teacher dashboard → Export CSV.',
  ]
  return lines.join('\n')
}

const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get('tab')
  const tab: 'classes' | 'students' | 'home' | 'governance' =
    tabParam === 'students' || tabParam === 'home' || tabParam === 'governance' ? tabParam : 'classes'

  const setTab = (v: 'classes' | 'students' | 'home' | 'governance') => {
    if (v === 'classes') setSearchParams({}, { replace: true })
    else setSearchParams({ tab: v }, { replace: true })
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [classes, setClasses] = useState<SchoolClassRow[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [newClassName, setNewClassName] = useState('')
  const [newClassAgeBand, setNewClassAgeBand] = useState<AgeBandId>('kids')

  const [students, setStudents] = useState<StudentProgressRow[]>([])
  const [homeworkGeneratedUnitIds, setHomeworkGeneratedUnitIds] = useState<string[]>([])
  const [onboardingDismissed, setOnboardingDismissed] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.localStorage.getItem(TEACHER_ONBOARDING_KEY) === '1'
    } catch {
      return false
    }
  })
  const [bulletinDraft, setBulletinDraft] = useState('')

  const canUseSupabase = !!supabase

  const teacherOk = !!user && isTeacherUser(user)

  const courseTrackIds = useMemo(
    () => ({
      internetSafety: 'social-safety',
      aiCoding: 'ai-coding',
      homework: 'homework-adventures',
    }),
    [],
  )

  const refreshClasses = async () => {
    if (!supabase || !user) return
    setError(null)
    setLoading(true)
    try {
      const { data, error: e } = await supabase
        .from('school_classes')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false })
      if (e) throw e
      const rows = (data ?? []) as SchoolClassRow[]
      setClasses(rows)
      if (!selectedClassId && rows[0]?.id) setSelectedClassId(rows[0].id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('teacherDashboard.errorLoadClasses'))
    } finally {
      setLoading(false)
    }
  }

  const refreshStudents = async (classId: string) => {
    if (!supabase || !user || !classId) return
    setError(null)
    setLoading(true)
    try {
      const { data, error: e } = await supabase
        .from('school_student_progress')
        .select('*')
        .eq('class_id', classId)
        .order('updated_at', { ascending: false })
      if (e) throw e
      setStudents((data ?? []) as StudentProgressRow[])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('teacherDashboard.errorLoadStudents'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!teacherOk) return
    void refreshClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherOk])

  useEffect(() => {
    if (!teacherOk) return
    if (!selectedClassId) return
    void refreshStudents(selectedClassId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherOk, selectedClassId])

  // Load the latest generated weekly units for this class so we can compute
  // Homework Adventures progress from generated-unit quiz mastery.
  useEffect(() => {
    if (!teacherOk) return
    if (!selectedClassId) return
    if (!supabase) return

    let cancelled = false
    void (async () => {
      try {
        const nowIso = new Date().toISOString()
        const { data: genRow, error: genErr } = await supabase
          .from('school_weekly_generators')
          .select('id')
          .eq('class_id', selectedClassId)
          .gt('expires_at', nowIso)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (genErr) throw genErr
        if (!genRow?.id || cancelled) {
          setHomeworkGeneratedUnitIds([])
          return
        }

        const { data: unitRows, error: unitErr } = await supabase
          .from('school_weekly_generator_units')
          .select('unit_id')
          .eq('generator_id', genRow.id)
          .order('created_at', { ascending: true })

        if (unitErr) throw unitErr
        if (cancelled) return
        setHomeworkGeneratedUnitIds((unitRows ?? []).map((r) => r.unit_id).filter(Boolean))
      } catch {
        if (!cancelled) setHomeworkGeneratedUnitIds([])
      }
    })()

    return () => {
      cancelled = true
    }
  }, [teacherOk, selectedClassId])

  const selectedClass = classes.find((c) => c.id === selectedClassId) ?? null

  useEffect(() => {
    if (!selectedClass) {
      writeTeacherClassSnapshot(null)
    } else {
      writeTeacherClassSnapshot({
        id: selectedClass.id,
        name: selectedClass.name,
        class_code: selectedClass.class_code,
      })
    }
    window.dispatchEvent(new Event('sparki-teacher-class-snapshot'))
  }, [selectedClass])

  useEffect(() => {
    setBulletinDraft(selectedClass?.bulletin_text?.trim() ? String(selectedClass.bulletin_text) : '')
  }, [selectedClassId, selectedClass?.bulletin_text])

  const aggregated = useMemo(() => {
    const totalStudents = students.length
    const safetyAvg =
      totalStudents === 0
        ? 0
        : Math.round(
            students.reduce((sum, s) => sum + computeTrackCompletion(courseTrackIds.internetSafety, s.progress), 0) /
              totalStudents,
          )
    const aiAvg =
      totalStudents === 0
        ? 0
        : Math.round(
            students.reduce((sum, s) => sum + computeTrackCompletion(courseTrackIds.aiCoding, s.progress), 0) /
              totalStudents,
          )

    const homeworkAvg =
      totalStudents === 0 || homeworkGeneratedUnitIds.length === 0
        ? 0
        : Math.round(
            students.reduce((sum, s) => {
              const p = safeProgressObject(s.progress)
              const masteredCount = homeworkGeneratedUnitIds.filter((id) => p.units?.[id]?.mastered).length
              return sum + percent(masteredCount, homeworkGeneratedUnitIds.length)
            }, 0) / totalStudents,
          )

    const overallAvg = Math.round((safetyAvg + aiAvg + homeworkAvg) / 3)
    return { totalStudents, safetyAvg, aiAvg, homeworkAvg, overallAvg }
  }, [courseTrackIds.aiCoding, courseTrackIds.internetSafety, homeworkGeneratedUnitIds, students])

  if (!canUseSupabase) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherDashboard.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('teacherDashboard.supabaseMissing')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!teacherOk) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherDashboard.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('teacherDashboard.notTeacher')}</p>
            <p className="muted">{t('teacherDashboard.notTeacherHint')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="stack-lg">
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherDashboard.snapshotTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stack-lg">
              <div className="muted">{t('teacherDashboard.subtitle')}</div>
              <p className="text-sm text-slate-700 max-w-prose leading-relaxed">{t('teacherDashboard.hubExplainer')}</p>
              {!!error && <div className="muted">{error}</div>}
                  <div className="stack-lg">
                <div>
                  <div className="muted">{t('teacherDashboard.classCompletion')}</div>
                  <Progress value={aggregated.overallAvg} />
                  <div className="muted">
                    {t('teacherDashboard.classCompletionValue', { percent: aggregated.overallAvg })}
                  </div>
                </div>
              </div>

              <div className="schools-actions" style={{ justifyContent: 'flex-start' }}>
                <Button asChild>
                  <Link to="/teacher/generator">{t('teacherDashboard.generateWeeklyTrack')}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {!onboardingDismissed && (
          <Card className="border-2 border-amber-200 bg-amber-50/60">
            <CardHeader>
              <CardTitle>{t('teacherDashboard.onboardingTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-800">
                <li>{t('teacherDashboard.onboardingStep1')}</li>
                <li>{t('teacherDashboard.onboardingStep2')}</li>
                <li>{t('teacherDashboard.onboardingStep3')}</li>
                <li>{t('teacherDashboard.onboardingStep4')}</li>
              </ol>
              <p className="text-xs text-slate-600 max-w-prose">{t('teacherDashboard.onboardingCsvHint')}</p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  try {
                    window.localStorage.setItem(TEACHER_ONBOARDING_KEY, '1')
                  } catch {
                    /* ignore */
                  }
                  setOnboardingDismissed(true)
                }}
              >
                {t('teacherDashboard.onboardingDismiss')}
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs
          defaultValue="classes"
          value={tab}
          onValueChange={(v) => setTab(v as 'classes' | 'students' | 'home' | 'governance')}
        >
            <TabsList>
            <TabsTrigger value="classes">{t('teacherDashboard.tabsClasses')}</TabsTrigger>
            <TabsTrigger value="students">{t('teacherDashboard.tabsRoster')}</TabsTrigger>
            <TabsTrigger value="home">{t('teacherDashboard.tabsHomePackets')}</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>{t('teacherDashboard.classesTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stack-lg">
                  <div className="stack-lg">
                    <label className="muted">
                      {t('teacherDashboard.addClassLabel')}
                      <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
                        <input
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder={t('teacherDashboard.addClassPlaceholder')}
                          style={{
                            minHeight: 44,
                            padding: '10px 12px',
                            borderRadius: 12,
                            border: '1px solid rgba(0,0,0,0.15)',
                            flex: '1 1 260px',
                          }}
                        />
                        <select
                          aria-label={t('teacherDashboard.ageBandLabel')}
                          value={newClassAgeBand}
                          onChange={(e) => setNewClassAgeBand(e.target.value as AgeBandId)}
                          style={{
                            minHeight: 44,
                            padding: '10px 12px',
                            borderRadius: 12,
                            border: '1px solid rgba(0,0,0,0.15)',
                            minWidth: 200,
                          }}
                        >
                          <option value="tots">{t('ageBand.names.tots.full')}</option>
                          <option value="kids">{t('ageBand.names.kids.full')}</option>
                          <option value="crew">{t('ageBand.names.crew.full')}</option>
                        </select>
                        <Button
                          disabled={loading || !newClassName.trim()}
                          onClick={async () => {
                            if (!supabase || !user) return
                            setLoading(true)
                            setError(null)
                            try {
                              const payload = {
                                teacher_id: user.id,
                                name: newClassName.trim(),
                                class_code: randomSchoolClassCode(),
                                age_band: newClassAgeBand,
                              }
                              const { error: e } = await supabase.from('school_classes').insert(payload)
                              if (e) throw e
                              setNewClassName('')
                              await refreshClasses()
                            } catch (e: unknown) {
                              setError(e instanceof Error ? e.message : t('teacherDashboard.errorCreateClass'))
                            } finally {
                              setLoading(false)
                            }
                          }}
                        >
                          {t('teacherDashboard.addClassButton')}
                        </Button>
                      </div>
                    </label>
                  </div>

                  <div className="w-full overflow-x-auto -mx-1 px-1 touch-pan-x">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('teacherDashboard.tableClass')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableAgeBand')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableCode')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableAssigned')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableActions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {classes.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <strong>{c.name}</strong>
                          </TableCell>
                          <TableCell>
                            <span className="muted">
                              {c.age_band === 'tots' || c.age_band === 'kids' || c.age_band === 'crew'
                                ? t(`ageBand.modeBadge.${c.age_band}`)
                                : t('ageBand.modeBadge.kids')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code>{c.class_code}</code>
                          </TableCell>
                          <TableCell>
                            <span className="muted">{t('teacherDashboard.assignedDefault')}</span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={selectedClassId === c.id ? 'secondary' : 'default'}
                              onClick={() => setSelectedClassId(c.id)}
                            >
                              {selectedClassId === c.id
                                ? t('teacherDashboard.selected')
                                : t('teacherDashboard.select')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {classes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <span className="muted">{t('teacherDashboard.noClasses')}</span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </div>

                  {selectedClass ? (
                    <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 space-y-3">
                      <h3 className="font-semibold text-slate-900">{t('teacherDashboard.bulletinTitle')}</h3>
                      <p className="text-sm text-slate-600">{t('teacherDashboard.bulletinHelp')}</p>
                      <textarea
                        value={bulletinDraft}
                        onChange={(e) => setBulletinDraft(e.target.value)}
                        rows={4}
                        className="w-full min-h-[100px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
                        aria-label={t('teacherDashboard.bulletinTitle')}
                      />
                      <Button
                        type="button"
                        disabled={loading || !supabase || !user}
                        onClick={async () => {
                          if (!supabase || !user || !selectedClassId) return
                          setLoading(true)
                          setError(null)
                          try {
                            const { error: be } = await supabase
                              .from('school_classes')
                              .update({
                                bulletin_text: bulletinDraft.trim(),
                                bulletin_updated_at: new Date().toISOString(),
                              })
                              .eq('id', selectedClassId)
                              .eq('teacher_id', user.id)
                            if (be) throw be
                            await refreshClasses()
                          } catch (e: unknown) {
                            setError(e instanceof Error ? e.message : t('teacherDashboard.bulletinSaveError'))
                          } finally {
                            setLoading(false)
                          }
                        }}
                      >
                        {t('teacherDashboard.bulletinSave')}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>{t('teacherDashboard.studentsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stack-lg">
                  <p className="text-sm text-slate-700 max-w-prose leading-relaxed">{t('teacherDashboard.rosterExplainer')}</p>
                  <div className="muted">
                    {selectedClass
                      ? t('teacherDashboard.studentsFor', { name: selectedClass.name, code: selectedClass.class_code })
                      : t('teacherDashboard.selectClassFirst')}
                  </div>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Button
                      variant="secondary"
                      disabled={!selectedClassId || loading}
                      onClick={() => {
                        if (!selectedClassId) return
                        void refreshStudents(selectedClassId)
                      }}
                    >
                      {t('teacherDashboard.refresh')}
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!selectedClassId || students.length === 0}
                      onClick={() => {
                        if (!selectedClass) return
                        const now = new Date().toISOString()
                        const text = buildParentProgressSummary({
                          className: selectedClass.name,
                          classCode: selectedClass.class_code,
                          bulletin: selectedClass.bulletin_text ?? '',
                          studentsCount: students.length,
                          safetyAvg: aggregated.safetyAvg,
                          aiAvg: aggregated.aiAvg,
                          homeworkAvg: aggregated.homeworkAvg,
                          overallAvg: aggregated.overallAvg,
                          exportedAt: now,
                        })
                        downloadPlainTextFile(
                          `sparki-parent-summary-${selectedClass.class_code}.txt`,
                          text,
                        )
                      }}
                    >
                      {t('teacherDashboard.exportParentSummary')}
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={!selectedClassId || students.length === 0}
                      onClick={() => {
                        if (!selectedClass) return
                        const now = new Date().toISOString()
                        const subjectTotals = students.reduce(
                          (acc, s) => {
                            const st = subjectTrackStats(s.progress)
                            acc.touched += st.count
                            acc.mastered += st.mastered
                            return acc
                          },
                          { touched: 0, mastered: 0 },
                        )
                        const text = buildCountyPilotSummary({
                          className: selectedClass.name,
                          classCode: selectedClass.class_code,
                          studentsCount: students.length,
                          safetyAvg: aggregated.safetyAvg,
                          aiAvg: aggregated.aiAvg,
                          homeworkAvg: aggregated.homeworkAvg,
                          overallAvg: aggregated.overallAvg,
                          subjectLessonsTouched: subjectTotals.touched,
                          subjectLessonsMastered: subjectTotals.mastered,
                          exportedAt: now,
                        })
                        downloadPlainTextFile(
                          `sparki-county-pilot-${selectedClass.class_code}.txt`,
                          text,
                        )
                      }}
                    >
                      {t('teacherDashboard.exportCountySummary')}
                    </Button>
                    <Button
                      disabled={!selectedClassId || students.length === 0}
                      onClick={() => {
                        const rows = students.map((s) => {
                          const safety = computeTrackCompletion(courseTrackIds.internetSafety, s.progress)
                          const ai = computeTrackCompletion(courseTrackIds.aiCoding, s.progress)
                          const homeworkPercent =
                            homeworkGeneratedUnitIds.length === 0
                              ? 0
                              : (() => {
                                  const p = safeProgressObject(s.progress)
                                  const masteredCount = homeworkGeneratedUnitIds.filter((id) => p.units?.[id]?.mastered).length
                                  return percent(masteredCount, homeworkGeneratedUnitIds.length)
                                })()

                          const overall = Math.round((safety + ai + homeworkPercent) / 3)
                          const subj = subjectTrackStats(s.progress)
                          const ping = engagementLastPing(s.progress)
                          return {
                            class_code: selectedClass?.class_code ?? '',
                            student_code: s.student_code,
                            internet_safety_percent: safety,
                            ai_coding_percent: ai,
                            homework_percent: homeworkPercent,
                            overall_percent: overall,
                            subject_track_lessons_count: subj.count,
                            subject_track_mastered_count: subj.mastered,
                            engagement_last_ping_at: ping,
                            progress_row_updated_at: s.updated_at,
                          }
                        })
                        const csv = toCsv(rows)
                        downloadTextFile(`sparki-class-${selectedClass?.class_code ?? 'export'}.csv`, csv)
                      }}
                    >
                      {t('teacherDashboard.exportCsv')}
                    </Button>
                  </div>

                  <details className="text-sm text-slate-600 max-w-prose">
                    <summary className="cursor-pointer font-medium text-slate-800">
                      {t('teacherDashboard.csvDocToggle')}
                    </summary>
                    <p className="mt-2 whitespace-pre-line">{t('teacherDashboard.csvDocBody')}</p>
                  </details>

                  <div className="w-full overflow-x-auto -mx-1 px-1 touch-pan-x">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('teacherDashboard.tableStudent')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableSafety')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableAi')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableHomework')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableOverall')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableSubjectTracks')}</TableHead>
                        <TableHead>{t('teacherDashboard.tableEngagement')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((s) => {
                        const safety = computeTrackCompletion(courseTrackIds.internetSafety, s.progress)
                        const ai = computeTrackCompletion(courseTrackIds.aiCoding, s.progress)
                        const homeworkPercent =
                          homeworkGeneratedUnitIds.length === 0
                            ? 0
                            : (() => {
                                const p = safeProgressObject(s.progress)
                                const masteredCount = homeworkGeneratedUnitIds.filter((id) => p.units?.[id]?.mastered).length
                                return percent(masteredCount, homeworkGeneratedUnitIds.length)
                              })()
                        const overall = Math.round((safety + ai + homeworkPercent) / 3)
                        const subj = subjectTrackStats(s.progress)
                        const ping = engagementLastPing(s.progress)
                        return (
                          <TableRow key={s.id}>
                            <TableCell>
                              <code>{s.student_code}</code>
                              <div className="muted" style={{ fontSize: 12 }}>
                                {new Date(s.updated_at).toLocaleString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Progress value={safety} />
                              <div className="muted" style={{ fontSize: 12 }}>
                                {safety}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <Progress value={ai} />
                              <div className="muted" style={{ fontSize: 12 }}>
                                {ai}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <Progress value={homeworkPercent} />
                              <div className="muted" style={{ fontSize: 12 }}>
                                {homeworkPercent}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <Progress value={overall} />
                              <div className="muted" style={{ fontSize: 12 }}>
                                {overall}%
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {subj.count === 0
                                  ? '—'
                                  : t('teacherDashboard.subjectTrackCell', {
                                      mastered: subj.mastered,
                                      total: subj.count,
                                    })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm muted">
                                {ping ? new Date(ping).toLocaleString() : '—'}
                              </span>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <span className="muted">{t('teacherDashboard.noStudents')}</span>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  </div>

                  <div className="muted">{t('teacherDashboard.schemaNote')}</div>
                  <p className="text-sm text-slate-600 max-w-prose">{t('teacherDashboard.trackingScopeNote')}</p>
                  <p className="text-sm text-slate-600 max-w-prose">{t('teacherDashboard.engagementNote')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="home">
            <Card>
              <CardHeader>
                <CardTitle>{t('teacherDashboard.homePacketsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stack-lg">
                  <p className="muted">{t('teacherDashboard.homePacketsDesc')}</p>
                  <div className="muted">{t('teacherDashboard.homePacketsSetup')}</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="governance">
            <GovernanceOverviewContent compact />
          </TabsContent>
        </Tabs>
    </div>
  )
}

export default TeacherDashboardPage

