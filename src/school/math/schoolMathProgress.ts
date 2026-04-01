const STORAGE_KEY = 'sparki_school_math_progress_v1'

export type SchoolMathLessonProgress = {
  quizBestScore: number
  quizAttempts: number
  completedAt?: string
}

export type SchoolMathProgressState = {
  lessons: Record<string, SchoolMathLessonProgress>
}

function defaultState(): SchoolMathProgressState {
  return { lessons: {} }
}

export function loadSchoolMathProgress(): SchoolMathProgressState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || !('lessons' in parsed)) return defaultState()
    const lessons = (parsed as SchoolMathProgressState).lessons
    if (!lessons || typeof lessons !== 'object') return defaultState()
    return { lessons }
  } catch {
    return defaultState()
  }
}

export function saveSchoolMathProgress(state: SchoolMathProgressState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

/** Merge quiz result; keeps best score. */
export function recordSchoolMathQuizResult(lessonId: string, score: number, total: number): void {
  const state = loadSchoolMathProgress()
  const prev = state.lessons[lessonId]
  const ratio = total > 0 ? score / total : 0
  const next: SchoolMathLessonProgress = {
    quizBestScore: prev ? Math.max(prev.quizBestScore, ratio) : ratio,
    quizAttempts: (prev?.quizAttempts ?? 0) + 1,
    completedAt:
      ratio >= 1 ? new Date().toISOString() : prev?.completedAt,
  }
  state.lessons[lessonId] = next
  saveSchoolMathProgress(state)
}

export function isSchoolMathLessonMastered(lessonId: string): boolean {
  const p = loadSchoolMathProgress().lessons[lessonId]
  return !!p && p.quizBestScore >= 1
}
