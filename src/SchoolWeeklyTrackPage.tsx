import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { ensureAnonymousSchoolAuth, getSchoolSession } from '@/school/schoolSession'
import { getUnitStatus } from './progress'
import { useTranslation } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { readJsonFromCache, unitJsonPath, weeklyActiveGeneratorPath, writeJsonToCache } from './lib/schoolGeneratorCache'

type GeneratorRow = {
  id: string
  weekly_track_label: string
  expires_at: string
}

type GeneratorUnitRow = {
  unit_id: string
  unit_json: any
}

type UnitCard = {
  unitId: string
  title: string
  summary?: string
  quizCount?: number
  unitJson?: any
}

const SchoolWeeklyTrackPage: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { classId } = getSchoolSession()
  const [generator, setGenerator] = useState<GeneratorRow | null>(null)
  const [units, setUnits] = useState<UnitCard[]>([])
  const [unitMasteredMap, setUnitMasteredMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSchoolSession = useMemo(() => !!classId, [classId])

  useEffect(() => {
    if (!supabase) return
    if (!classId) return

    let cancelled = false
    setLoading(true)
    setError(null)

    void (async () => {
      try {
        const isOffline = typeof window !== 'undefined' && !window.navigator.onLine

        if (isOffline) {
          const cached = await readJsonFromCache<{
            generatorId: string
            weeklyTrackLabel: string
            units: Array<{ unitId: string; title: string; summary?: string; quizCount?: number }>
          }>(weeklyActiveGeneratorPath(classId))

          if (!cancelled && cached?.generatorId) {
            setGenerator({
              id: cached.generatorId,
              weekly_track_label: cached.weeklyTrackLabel,
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            })
            const offlineUnits = (cached.units ?? []).map((u) => ({
              unitId: u.unitId,
              title: u.title,
              summary: u.summary,
              quizCount: u.quizCount,
            }))
            setUnits(offlineUnits)

            // Offline mastery: fall back to local progress.
            const map: Record<string, boolean> = {}
            for (const u of offlineUnits) map[u.unitId] = !!getUnitStatus(u.unitId)?.mastered
            setUnitMasteredMap(map)
          }
          return
        }

        const uid = await ensureAnonymousSchoolAuth()
        if (!uid) throw new Error('Could not start anonymous school session.')

        const nowIso = new Date().toISOString()
        const { data: genData, error: genErr } = await supabase
          .from('school_weekly_generators')
          .select('id,weekly_track_label,expires_at')
          .eq('class_id', classId)
          .gt('expires_at', nowIso)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (genErr) throw genErr
        const genRow = genData as GeneratorRow | null
        if (!genRow) {
          if (!cancelled) {
            setGenerator(null)
            setUnits([])
          }
          return
        }

        const { data: unitData, error: unitErr } = await supabase
          .from('school_weekly_generator_units')
          .select('unit_id,unit_json')
          .eq('generator_id', genRow.id)
          .order('created_at', { ascending: true })

        if (unitErr) throw unitErr
        const unitRows = (unitData ?? []) as GeneratorUnitRow[]

        const cards: UnitCard[] = unitRows.map((r) => ({
          unitId: r.unit_id,
          title: r.unit_json?.title ?? 'Generated unit',
          summary: r.unit_json?.summary ?? '',
          quizCount: Array.isArray(r.unit_json?.quizQuestions) ? r.unit_json.quizQuestions.length : undefined,
          unitJson: r.unit_json,
        }))

        // Read mastery from Supabase (so tracking works across devices / after refresh).
        const { data: progressRow, error: progressErr } = await supabase
          .from('school_student_progress')
          .select('progress')
          .eq('class_id', classId)
          .eq('student_uid', uid)
          .single()

        if (!progressErr && progressRow?.progress && typeof progressRow.progress === 'object') {
          const unitsObj = (progressRow.progress as any).units
          const map: Record<string, boolean> = {}
          if (unitsObj && typeof unitsObj === 'object') {
            for (const [k, v] of Object.entries(unitsObj as Record<string, any>)) {
              map[k] = !!(v as any)?.mastered
            }
          }
          setUnitMasteredMap(map)
        }

        // Cache unit JSON for offline use.
        void (async () => {
          const activeCache = {
            generatorId: genRow.id,
            weeklyTrackLabel: genRow.weekly_track_label,
            units: cards.map((c) => ({
              unitId: c.unitId,
              title: c.title,
              summary: c.summary,
              quizCount: c.quizCount,
            })),
          }
          await writeJsonToCache(weeklyActiveGeneratorPath(classId), activeCache)
          for (const c of cards) {
            if (c.unitJson) await writeJsonToCache(unitJsonPath(c.unitId), c.unitJson)
          }
        })()

        if (!cancelled) {
          setGenerator(genRow)
          setUnits(cards)
        }
      } catch (e: any) {
        if (cancelled) return
        // If we couldn't fetch online, attempt cached content.
        if (classId) {
          const cached = await readJsonFromCache<{
            generatorId: string
            weeklyTrackLabel: string
            units: Array<{ unitId: string; title: string; summary?: string; quizCount?: number }>
          }>(weeklyActiveGeneratorPath(classId)).catch(() => null)
          if (cached?.generatorId) {
            setGenerator({
              id: cached.generatorId,
              weekly_track_label: cached.weeklyTrackLabel,
              expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            })
            setUnits(
              (cached.units ?? []).map((u) => ({
                unitId: u.unitId,
                title: u.title,
                summary: u.summary,
                quizCount: u.quizCount,
              })),
            )
            return
          }
        }

        setError(e?.message ?? 'Failed to load weekly track.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [classId])

  useEffect(() => {
    if (!hasSchoolSession) {
      navigate('/schools', { replace: true })
    }
  }, [hasSchoolSession, navigate])

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <h2>{t('schools.weeklyTrackTitle')}</h2>
            {generator ? <p className="welcome-subtitle">{generator.weekly_track_label}</p> : <p className="welcome-subtitle muted">{t('schools.weeklyTrackWaiting')}</p>}
          </div>
        </div>
        <Link to="/schools" className="link-back">
          {t('schools.weeklyTrackBackToSchools')}
        </Link>
      </header>

      {loading && (
        <Card>
          <CardContent>
            <p className="muted">{t('schools.weeklyTrackLoading')}</p>
          </CardContent>
        </Card>
      )}

      {!!error && (
        <Card>
          <CardContent>
            <p className="quiz-error" role="alert">
              {error}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !generator && !error && (
        <Card>
          <CardContent>
            <p className="muted">{t('schools.weeklyTrackNoActive')}</p>
          </CardContent>
        </Card>
      )}

      {!loading && generator && (
        <div className="stack-lg">
          <Card>
            <CardHeader>
              <CardTitle>{t('schools.weeklyTrackUnitsTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gap: 12 }}>
                {units.map((u, idx) => (
                  <div
                    key={u.unitId}
                    style={{
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 12,
                      padding: 14,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Unit {idx + 1} · {typeof u.quizCount === 'number' ? `${u.quizCount} questions` : 'Quiz'}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{u.title}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {u.summary ?? ''}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 12,
                          fontWeight: 700,
                        color: unitMasteredMap[u.unitId] ? '#0ea5e9' : '#64748b',
                        }}
                      >
                        {unitMasteredMap[u.unitId] ? t('schools.weeklyTrackMastered') : t('schools.weeklyTrackNotStarted')}
                      </div>
                    </div>
                    <Link to={`/schools/unit/${encodeURIComponent(u.unitId)}`}>
                      <Button>{t('schools.weeklyTrackOpenUnit')}</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}

export default SchoolWeeklyTrackPage

