import { supabase } from '@/lib/supabaseClient'
import type { AgeBandId } from '@/ageBand'
import { DEFAULT_AGE_BAND, isAgeBandId } from '@/ageBand'

/** Parse `student_join_class` RPC result (jsonb or legacy uuid string). */
export function parseStudentJoinRpcResult(data: unknown): { classId: string; ageBand: AgeBandId } | null {
  if (data == null) return null
  if (typeof data === 'string' && data.trim()) {
    return { classId: data.trim(), ageBand: DEFAULT_AGE_BAND }
  }
  if (typeof data === 'object' && data !== null && 'class_id' in data) {
    const o = data as Record<string, unknown>
    const id = String(o.class_id ?? '').trim()
    if (!id) return null
    const rawBand = o.age_band
    const bandStr = typeof rawBand === 'string' ? rawBand : String(rawBand ?? '')
    const ageBand: AgeBandId = isAgeBandId(bandStr) ? bandStr : DEFAULT_AGE_BAND
    return { classId: id, ageBand }
  }
  return null
}

const CLASS_ID_KEY = 'sparki_school_class_id_v1'
const STUDENT_CODE_KEY = 'sparki_school_student_code_v1'
const CLASS_AGE_BAND_KEY = 'sparki_school_class_age_band_v1'

export type SchoolSession = {
  classId: string | null
  studentCode: string | null
  /** Set when joining a class; matches `school_classes.age_band` for UI sync. */
  classAgeBand: AgeBandId | null
}

export function getSchoolSession(): SchoolSession {
  if (typeof window === 'undefined') return { classId: null, studentCode: null, classAgeBand: null }
  try {
    const classId = window.localStorage.getItem(CLASS_ID_KEY)
    const studentCode = window.localStorage.getItem(STUDENT_CODE_KEY)
    const bandRaw = window.localStorage.getItem(CLASS_AGE_BAND_KEY)
    const classAgeBand = isAgeBandId(bandRaw) ? bandRaw : null
    return {
      classId: classId && classId.trim() ? classId : null,
      studentCode: studentCode && studentCode.trim() ? studentCode : null,
      classAgeBand,
    }
  } catch {
    return { classId: null, studentCode: null, classAgeBand: null }
  }
}

export function setSchoolSession(classId: string, studentCode: string, opts?: { classAgeBand?: AgeBandId | null }) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CLASS_ID_KEY, classId)
    window.localStorage.setItem(STUDENT_CODE_KEY, studentCode)
    if (opts?.classAgeBand && isAgeBandId(opts.classAgeBand)) {
      window.localStorage.setItem(CLASS_AGE_BAND_KEY, opts.classAgeBand)
    } else if (opts?.classAgeBand === null) {
      window.localStorage.removeItem(CLASS_AGE_BAND_KEY)
    }
  } catch {
    // ignore
  }
}

/** Update only stored class age band (e.g. after `student_my_class_age_band` RPC). */
export function setSchoolClassAgeBand(band: AgeBandId | null) {
  if (typeof window === 'undefined') return
  try {
    if (band && isAgeBandId(band)) window.localStorage.setItem(CLASS_AGE_BAND_KEY, band)
    else window.localStorage.removeItem(CLASS_AGE_BAND_KEY)
  } catch {
    // ignore
  }
}

export function clearSchoolSession() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CLASS_ID_KEY)
    window.localStorage.removeItem(STUDENT_CODE_KEY)
    window.localStorage.removeItem(CLASS_AGE_BAND_KEY)
  } catch {
    // ignore
  }
}

export async function ensureAnonymousSchoolAuth(): Promise<string | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  if (data.session?.user) return data.session.user.id
  // Anonymous sign-in for school iPads (no email).
  const { data: anon, error } = await supabase.auth.signInAnonymously()
  if (error) return null
  return anon.user?.id ?? null
}
