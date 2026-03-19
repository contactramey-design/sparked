import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useAuth } from './AuthContext'
import { useTranslation, useLocale } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type SchoolClassRow = {
  id: string
  name: string
  class_code: string
  teacher_id: string
  created_at: string
}

function isTeacherUser(user: NonNullable<ReturnType<typeof useAuth>['user']>): boolean {
  const roleAny =
    (user.app_metadata as any)?.role ??
    (user.user_metadata as any)?.role ??
    ((user.app_metadata as any)?.roles?.[0] ?? null)
  if (roleAny === 'teacher') return true
  // If you're piloting without custom claims yet, allow any non-anonymous signed-in user.
  const isAnon = (user as any)?.is_anonymous === true
  return !isAnon
}

type GeneratorUnitSummary = {
  unitId: string
  title: string
}

type GeneratorResult = {
  generatorId: string
  weeklyTrackLabel: string
  units: GeneratorUnitSummary[]
}

const TeacherWeeklyGeneratorPage: React.FC = () => {
  const { user, isLoggedIn } = useAuth()
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
    } catch (e: any) {
      setError(e?.message ?? t('teacherGenerator.errorLoadClasses'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!canUseSupabase) return
    if (!isLoggedIn) navigate('/login?redirect=%2Fteacher%2Fgenerator', { replace: true })
  }, [canUseSupabase, isLoggedIn, navigate])

  useEffect(() => {
    if (!teacherOk) return
    void refreshClasses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherOk])

  const classOptions = useMemo(() => classes, [classes])

  const submit = async () => {
    if (!supabase || !user) return
    setError(null)
    setLoading(true)
    setResult(null)
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
      formData.append('generate_video', generateVideoPerUnit.toString())

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
    } catch (e: any) {
      setError(e?.message ?? t('teacherGenerator.errorGenerate'))
    } finally {
      setLoading(false)
    }
  }

  if (!canUseSupabase) {
    return (
      <div className="page page-narrow">
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
      <div className="page page-narrow">
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
    <div className="page page-narrow">
      <header className="page-header">
        <h2>{t('teacherGenerator.title')}</h2>
        <p className="muted">{t('teacherGenerator.subtitle')}</p>
      </header>

      <div className="stack-lg">
        <Card>
          <CardHeader>
            <CardTitle>{t('teacherGenerator.generateTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="stack-lg">
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

              <label className="muted">
                {t('teacherGenerator.pdfLabel')}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    setError(null)
                    setFile(e.target.files?.[0] ?? null)
                    setResult(null)
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

              {!!error && (
                <p className="quiz-error" role="alert">
                  {error}
                </p>
              )}

              <Button
                disabled={loading || !selectedClassId || !file}
                onClick={() => {
                  void submit()
                }}
              >
                {loading ? t('teacherGenerator.buttonBusy') : t('teacherGenerator.buttonIdle')}
              </Button>
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
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default TeacherWeeklyGeneratorPage

