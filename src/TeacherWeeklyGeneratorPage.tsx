import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { writeTeacherClassSnapshot } from '@/lib/teacherSelectedClassStorage'
import { supabase } from './lib/supabaseClient'
import { isTeacherUser } from './lib/supabaseUserRole'
import { useAuth } from './AuthContext'
import { useTranslation, useLocale } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TeacherWeeklyGeneratorSubjectTags from '@/components/TeacherWeeklyGeneratorSubjectTags'
import type { AgeBandId } from './ageBand'

type SchoolClassRow = {
  id: string
  name: string
  class_code: string
  teacher_id: string
  created_at: string
  age_band?: AgeBandId | string
}

type GeneratorUnitSummary = {
  unitId: string
  title: string
}

type GeneratorResult = {
  generatorId: string
  weeklyTrackLabel: string
  classAgeBand?: AgeBandId
  units: GeneratorUnitSummary[]
}

type PacingProposal = {
  detectedThemes: string[]
  weeklyFocusSummary: string
  pacingNotes: string[]
  confidence: string
}

const TeacherWeeklyGeneratorPage: React.FC = () => {
  const { user } = useAuth()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const navigate = useNavigate()

  const canUseSupabase = !!supabase
  const teacherOk = !!user && isTeacherUser(user)

  const [classes, setClasses] = useState<SchoolClassRow[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [generateVideoPerUnit, setGenerateVideoPerUnit] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<GeneratorResult | null>(null)

  const [pacingLoading, setPacingLoading] = useState(false)
  const [pacingProposal, setPacingProposal] = useState<PacingProposal | null>(null)
  const [pacingConfirmed, setPacingConfirmed] = useState(false)

  const refreshClasses = async () => {
    if (!supabase || !user) return
    setError(null)
    setLoading(true)
    try {
      const { data, error: e } = await supabase.from('school_classes').select('*').eq('teacher_id', user.id)
      if (e) throw e
      const rows = (data ?? []) as SchoolClassRow[]
      setClasses(rows)
      if (!selectedClassId && rows[0]?.id) setSelectedClassId(rows[0].id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('teacherGenerator.errorLoadClasses'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!teacherOk) return
    void refreshClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherOk])

  const classOptions = useMemo(() => classes, [classes])
  const selectedClass = useMemo(
    () => classes.find((c) => c.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  )

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

  const selectedClassAgeBand: AgeBandId = useMemo(() => {
    const b = selectedClass?.age_band
    return b === 'tots' || b === 'kids' || b === 'crew' ? b : 'kids'
  }, [selectedClass?.age_band])

  const runPacingReview = async () => {
    if (!supabase || !user) return
    setError(null)
    setPacingLoading(true)
    setPacingProposal(null)
    setPacingConfirmed(false)
    try {
      if (!selectedClassId) throw new Error(t('teacherGenerator.errorSelectClass'))
      if (!file) throw new Error(t('teacherGenerator.errorChoosePdf'))
      if (file.type !== 'application/pdf') throw new Error(t('teacherGenerator.errorPdfType'))

      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      if (!accessToken) throw new Error(t('teacherGenerator.errorMissingSession'))

      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('class_id', selectedClassId)
      formData.append('locale', locale)

      const res = await fetch('/api/schools/propose-pacing-from-pdf', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(typeof data?.error === 'string' ? data.error : t('teacherGenerator.pacingError'))
      setPacingProposal(data as PacingProposal)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('teacherGenerator.pacingError'))
    } finally {
      setPacingLoading(false)
    }
  }

  const submit = async () => {
    if (!supabase || !user) return
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      if (!selectedClassId) throw new Error(t('teacherGenerator.errorSelectClass'))
      if (!file) throw new Error(t('teacherGenerator.errorChoosePdf'))
      if (file.type !== 'application/pdf') throw new Error(t('teacherGenerator.errorPdfType'))
      if (!pacingConfirmed) throw new Error(t('teacherGenerator.pacingGenerateBlocked'))

      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      if (!accessToken) throw new Error(t('teacherGenerator.errorMissingSession'))

      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('class_id', selectedClassId)
      formData.append('locale', locale)
      formData.append('generate_video', generateVideoPerUnit.toString())
      formData.append('teacher_pacing_confirmed', 'true')

      const res = await fetch('/api/schools/generate-weekly-units', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data?.error === 'string' ? data.error : t('teacherGenerator.errorGenerate'))
      }

      const r = data as GeneratorResult
      if (!r?.generatorId || !Array.isArray(r.units)) throw new Error(t('teacherGenerator.errorUnexpectedResponse'))
      setResult(r)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('teacherGenerator.errorGenerate'))
    } finally {
      setLoading(false)
    }
  }

  if (!canUseSupabase) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherGenerator.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">{t('teacherDashboard.supabaseMissing')}</p>
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
            <CardTitle>{t('teacherGenerator.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted">{t('teacherDashboard.notTeacher')}</p>
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
            <CardTitle>{t('teacherGenerator.generateTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stack-lg">
              <p className="muted">{t('teacherGenerator.subtitle')}</p>
              <label className="muted">
                {t('teacherGenerator.classLabel')}
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 6,
                    minHeight: 44,
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                >
                  {classOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.class_code})
                    </option>
                  ))}
                </select>
              </label>

              {selectedClass && (
                <p className="muted" role="status">
                  {t('teacherGenerator.classAgeBandNote', {
                    mode:
                      selectedClass.age_band === 'tots' ||
                      selectedClass.age_band === 'kids' ||
                      selectedClass.age_band === 'crew'
                        ? t(`ageBand.modeBadge.${selectedClass.age_band}`)
                        : t('ageBand.modeBadge.kids'),
                  })}
                </p>
              )}

              <label className="muted">
                {t('teacherGenerator.pdfLabel')}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setError(null)
                    setFile(e.target.files?.[0] ?? null)
                    setResult(null)
                    setPacingProposal(null)
                    setPacingConfirmed(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    marginTop: 6,
                    minHeight: 44,
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid rgba(0,0,0,0.15)',
                  }}
                />
              </label>

              <label className="muted" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="checkbox" checked={generateVideoPerUnit} onChange={(e) => setGenerateVideoPerUnit(e.target.checked)} />
                {t('teacherGenerator.videoToggle')}
              </label>

              <Card className="border border-amber-200/80 bg-amber-50/40">
                <CardHeader className="py-3">
                  <CardTitle className="text-base">{t('teacherGenerator.pacingCardTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-slate-700">{t('teacherGenerator.pacingCardBody')}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={pacingLoading || loading || !selectedClassId || !file}
                    onClick={() => void runPacingReview()}
                  >
                    {pacingLoading ? t('teacherGenerator.pacingBusy') : t('teacherGenerator.pacingButton')}
                  </Button>

                  {pacingProposal ? (
                    <div className="space-y-2 rounded-lg border border-slate-200 bg-white/80 p-3">
                      <div>
                        <div className="font-semibold text-slate-800">{t('teacherGenerator.pacingSummaryLabel')}</div>
                        <p className="text-slate-700 mt-1">{pacingProposal.weeklyFocusSummary}</p>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{t('teacherGenerator.pacingThemesLabel')}</div>
                        <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-700">
                          {pacingProposal.detectedThemes.map((th) => (
                            <li key={th}>{th}</li>
                          ))}
                        </ul>
                      </div>
                      {pacingProposal.pacingNotes.length > 0 ? (
                        <div>
                          <div className="font-semibold text-slate-800">{t('teacherGenerator.pacingNotesLabel')}</div>
                          <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-600">
                            {pacingProposal.pacingNotes.map((n) => (
                              <li key={n}>{n}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <p className="text-xs text-slate-600">
                        {t('teacherGenerator.pacingConfidenceLabel')}:{' '}
                        {pacingProposal.confidence === 'high'
                          ? t('teacherGenerator.pacingConfidenceHigh')
                          : pacingProposal.confidence === 'low'
                            ? t('teacherGenerator.pacingConfidenceLow')
                            : t('teacherGenerator.pacingConfidenceMedium')}
                      </p>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={pacingConfirmed}
                          onChange={(e) => setPacingConfirmed(e.target.checked)}
                        />
                        <span>{t('teacherGenerator.pacingConfirmCheckbox')}</span>
                      </label>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {!!error && (
                <p className="quiz-error" role="alert">
                  {error}
                </p>
              )}

              <Button
                disabled={loading || !selectedClassId || !file || !pacingConfirmed}
                onClick={() => {
                  void submit()
                }}
              >
                {loading ? t('teacherGenerator.buttonBusy') : t('teacherGenerator.buttonIdle')}
              </Button>
              {!pacingConfirmed && selectedClassId && file ? (
                <p className="text-sm text-slate-600">{t('teacherGenerator.pacingGenerateBlocked')}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{t('teacherGenerator.resultTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="stack-lg">
                <div>
                  <div className="muted">{t('teacherGenerator.resultLabel')}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{result.weeklyTrackLabel}</div>
                </div>

                <div>
                  <div className="muted">{t('teacherGenerator.resultUnits')}</div>
                  <div className="stack-md">
                    {result.units.map((u) => (
                      <div
                        key={u.unitId}
                        style={{
                          border: '1px solid rgba(0,0,0,0.12)',
                          borderRadius: 12,
                          padding: 12,
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 10,
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>{u.title}</div>
                          <div className="muted" style={{ fontSize: 12 }}>
                            {u.unitId}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            navigate(`/schools/unit/${u.unitId}`)
                          }}
                        >
                          {t('teacherGenerator.previewStudentPage')}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="muted">
                  {t('teacherGenerator.studentsAccessNote')}
                </div>

                <TeacherWeeklyGeneratorSubjectTags
                  generatorId={result.generatorId}
                  classAgeBand={
                    result.classAgeBand === 'tots' || result.classAgeBand === 'kids' || result.classAgeBand === 'crew'
                      ? result.classAgeBand
                      : selectedClassAgeBand
                  }
                  unitSummaries={result.units}
                />
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

export default TeacherWeeklyGeneratorPage

