import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { ensureAnonymousSchoolAuth, getSchoolSession } from '@/school/schoolSession'
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

  const { classId } = getSchoolSession()
  const [generator, setGenerator] = useState<GeneratorRow | null>(null)
  const [units, setUnits] = useState<UnitCard[]>([])
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
            setUnits(
              (cached.units ?? []).map((u) => ({
                unitId: u.unitId,
                title: u.title,
                summary: u.summary,
                quizCount: u.quizCount,
              })),
            )
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
            <h2>Weekly Track</h2>
            {generator ? <p className="welcome-subtitle">{generator.weekly_track_label}</p> : <p className="welcome-subtitle muted">Your teacher will generate a weekly track.</p>}
          </div>
        </div>
        <Link to="/schools" className="link-back">
          Back to Schools
        </Link>
      </header>

      {loading && (
        <Card>
          <CardContent>
            <p className="muted">Loading…</p>
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
            <p className="muted">No active generated weekly track right now.</p>
          </CardContent>
        </Card>
      )}

      {!loading && generator && (
        <div className="stack-lg">
          <Card>
            <CardHeader>
              <CardTitle>Units</CardTitle>
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
                    </div>
                    <Link to={`/schools/unit/${encodeURIComponent(u.unitId)}`}>
                      <Button>Open unit</Button>
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

