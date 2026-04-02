import { supabase } from '@/lib/supabaseClient'
import { ensureAnonymousSchoolAuth, getSchoolSession } from '@/school/schoolSession'
import { loadSchoolSubjectProgress } from '@/school/subjects/schoolSubjectProgress'

function asProgressRecord(existing: unknown): Record<string, unknown> {
  if (existing && typeof existing === 'object' && !Array.isArray(existing)) {
    return { ...(existing as Record<string, unknown>) }
  }
  return {}
}

/**
 * When a class session is active, mirror local subject-track progress into
 * `school_student_progress.progress.sparkiSubjectTracks` for teacher CSV/roster.
 */
export async function syncSparkiSubjectTracksToSupabase(): Promise<void> {
  const { classId, studentCode } = getSchoolSession()
  if (!classId || !studentCode || !supabase) return
  const uid = await ensureAnonymousSchoolAuth()
  if (!uid) return

  const local = loadSchoolSubjectProgress()
  const { data: row } = await supabase
    .from('school_student_progress')
    .select('progress')
    .eq('class_id', classId)
    .eq('student_uid', uid)
    .maybeSingle()

  const nextProgress = {
    ...asProgressRecord(row?.progress),
    sparkiSubjectTracks: {
      lessons: { ...local.lessons },
      syncedAt: new Date().toISOString(),
    },
  }

  await supabase.from('school_student_progress').upsert(
    {
      class_id: classId,
      student_uid: uid,
      student_code: studentCode,
      progress: nextProgress,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'class_id,student_uid' },
  )
}

/**
 * Optional "Sparki check-in" — NOT official attendance. See docs/SCHOOL-ENGAGEMENT-SIGNALS.md
 */
export async function schoolEngagementPingToSupabase(): Promise<void> {
  const { classId, studentCode } = getSchoolSession()
  if (!classId || !studentCode || !supabase) return
  const uid = await ensureAnonymousSchoolAuth()
  if (!uid) return

  const { data: row } = await supabase
    .from('school_student_progress')
    .select('progress')
    .eq('class_id', classId)
    .eq('student_uid', uid)
    .maybeSingle()

  const base = asProgressRecord(row?.progress)
  const prevEng = (base.sparkiEngagement as Record<string, unknown> | undefined) ?? {}
  base.sparkiEngagement = { ...prevEng, lastPingAt: new Date().toISOString() }

  await supabase.from('school_student_progress').upsert(
    {
      class_id: classId,
      student_uid: uid,
      student_code: studentCode,
      progress: base,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'class_id,student_uid' },
  )
}
