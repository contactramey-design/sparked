const KEY = 'sparki_teacher_selected_class_snapshot_v1'

export type TeacherClassSnapshot = {
  id: string
  name: string
  class_code: string
}

export function readTeacherClassSnapshot(): TeacherClassSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as unknown
    if (!o || typeof o !== 'object') return null
    const id = (o as { id?: unknown }).id
    const name = (o as { name?: unknown }).name
    const class_code = (o as { class_code?: unknown }).class_code
    if (typeof id !== 'string' || !id) return null
    return {
      id,
      name: typeof name === 'string' ? name : '',
      class_code: typeof class_code === 'string' ? class_code : '',
    }
  } catch {
    return null
  }
}

export function writeTeacherClassSnapshot(row: TeacherClassSnapshot | null): void {
  if (typeof window === 'undefined') return
  try {
    if (!row) {
      window.localStorage.removeItem(KEY)
      return
    }
    window.localStorage.setItem(KEY, JSON.stringify(row))
  } catch {
    /* ignore */
  }
}
