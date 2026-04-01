import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { AgeBandId } from '@/ageBand'
import { useTranslation } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { SCHOOL_SUBJECT_IDS, isSchoolSubjectId, type SchoolSubjectId } from '@/school/subjects/types'
import { suggestSparkiLessonsFromGeneratedUnit } from '@/school/subjects/suggestSparkiLessons'

type UnitRow = {
  unit_id: string
  unit_json: Record<string, unknown>
}

type Props = {
  generatorId: string
  classAgeBand: AgeBandId
  unitSummaries: Array<{ unitId: string; title: string }>
}

function readTagsFromJson(j: Record<string, unknown>): SchoolSubjectId[] | null {
  const raw = j.sparkiSubjectTags
  if (!Array.isArray(raw)) return null
  const tags = raw.filter((x): x is SchoolSubjectId => typeof x === 'string' && isSchoolSubjectId(x))
  return tags.length ? tags : null
}

export default function TeacherWeeklyGeneratorSubjectTags({ generatorId, classAgeBand, unitSummaries }: Props) {
  const { t } = useTranslation()
  const [rows, setRows] = useState<UnitRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  /** unitId -> Set of selected subject ids */
  const [selection, setSelection] = useState<Record<string, Set<SchoolSubjectId>>>({})

  const load = useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    setError(null)
    try {
      const { data, error: e } = await supabase
        .from('school_weekly_generator_units')
        .select('unit_id, unit_json')
        .eq('generator_id', generatorId)
      if (e) throw e
      const list = (data ?? []) as UnitRow[]
      setRows(list)

      const nextSel: Record<string, Set<SchoolSubjectId>> = {}
      for (const r of list) {
        const j = r.unit_json
        const title = typeof j.title === 'string' ? j.title : ''
        const summary = typeof j.summary === 'string' ? j.summary : ''
        const ha = j.homeworkAdventure && typeof j.homeworkAdventure === 'object' ? (j.homeworkAdventure as Record<string, unknown>) : {}
        const subject = typeof ha.subject === 'string' ? ha.subject : ''
        const topic = typeof ha.topic === 'string' ? ha.topic : ''

        const savedTags = readTagsFromJson(j)
        if (savedTags) {
          nextSel[r.unit_id] = new Set(savedTags)
        } else {
          const sug = suggestSparkiLessonsFromGeneratedUnit({
            title,
            summary,
            subject,
            topic,
            ageBand: classAgeBand,
          })
          nextSel[r.unit_id] = new Set(sug.map((s) => s.subjectId))
        }
      }
      setSelection(nextSel)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('teacherGenerator.subjectTagsLoadError'))
    } finally {
      setLoading(false)
    }
  }, [classAgeBand, generatorId, t])

  useEffect(() => {
    void load()
  }, [load])

  const toggle = (unitId: string, subject: SchoolSubjectId) => {
    setSelection((prev) => {
      const cur = new Set(prev[unitId] ?? [])
      if (cur.has(subject)) cur.delete(subject)
      else cur.add(subject)
      return { ...prev, [unitId]: cur }
    })
    setSaved(false)
  }

  const saveAll = async () => {
    if (!supabase) return
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      for (const r of rows) {
        const set = selection[r.unit_id] ?? new Set()
        const tags = [...set]
        const nextJson = { ...r.unit_json }
        if (tags.length > 0) nextJson.sparkiSubjectTags = tags
        else delete nextJson.sparkiSubjectTags

        const { error: upErr } = await supabase
          .from('school_weekly_generator_units')
          .update({ unit_json: nextJson })
          .eq('generator_id', generatorId)
          .eq('unit_id', r.unit_id)
        if (upErr) throw upErr
      }
      setSaved(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('teacherGenerator.subjectTagsSaveError'))
    } finally {
      setSaving(false)
    }
  }

  const titleById = useMemo(() => {
    const m = new Map<string, string>()
    for (const u of unitSummaries) m.set(u.unitId, u.title)
    return m
  }, [unitSummaries])

  if (loading) {
    return <p className="muted">{t('teacherGenerator.subjectTagsLoading')}</p>
  }

  return (
    <div className="stack-md" style={{ marginTop: 16 }}>
      <h3 className="text-lg font-bold">{t('teacherGenerator.subjectTagsTitle')}</h3>
      <div className="muted">{t('teacherGenerator.subjectTagsHelp')}</div>
      {error ? (
        <p className="quiz-error" role="alert">
          {error}
        </p>
      ) : null}
      {saved ? <p className="text-green-800 text-sm">{t('teacherGenerator.subjectTagsSaved')}</p> : null}

      <div className="stack-md">
        {rows.map((r) => (
          <div
            key={r.unit_id}
            style={{
              border: '1px solid rgba(0,0,0,0.12)',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{titleById.get(r.unit_id) ?? r.unit_id}</div>
            <div className="flex flex-wrap gap-3">
              {SCHOOL_SUBJECT_IDS.map((sid) => {
                const active = selection[r.unit_id]?.has(sid) ?? false
                return (
                  <label key={sid} className="flex items-center gap-2 cursor-pointer" style={{ minHeight: 44 }}>
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggle(r.unit_id, sid)}
                    />
                    <span>{t(`schoolSubjects.tracks.${sid}.cardTitle`)}</span>
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Button disabled={saving || rows.length === 0} onClick={() => void saveAll()}>
        {saving ? t('teacherGenerator.subjectTagsSaving') : t('teacherGenerator.subjectTagsSave')}
      </Button>
    </div>
  )
}
