import { supabase } from '@/lib/supabaseClient'

const CLASS_ID_KEY = 'sparki_school_class_id_v1'
const STUDENT_CODE_KEY = 'sparki_school_student_code_v1'

export function getSchoolSession(): { classId: string | null; studentCode: string | null } {
  if (typeof window === 'undefined') return { classId: null, studentCode: null }
  try {
    const classId = window.localStorage.getItem(CLASS_ID_KEY)
    const studentCode = window.localStorage.getItem(STUDENT_CODE_KEY)
    return {
      classId: classId && classId.trim() ? classId : null,
      studentCode: studentCode && studentCode.trim() ? studentCode : null,
    }
  } catch {
    return { classId: null, studentCode: null }
  }
}

export function setSchoolSession(classId: string, studentCode: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CLASS_ID_KEY, classId)
    window.localStorage.setItem(STUDENT_CODE_KEY, studentCode)
  } catch {
    // ignore
  }
}

export function clearSchoolSession() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CLASS_ID_KEY)
    window.localStorage.removeItem(STUDENT_CODE_KEY)
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

