import { syncSparkiSubjectTracksToSupabase } from '@/school/syncSchoolProgress'
import type { SchoolSubjectId } from './types'

const STORAGE_KEY = 'sparki_school_subjects_progress_v1'
const LEGACY_MATH_KEY = 'sparki_school_math_progress_v1'

export type SchoolSubjectLessonProgress = {
  quizBestScore: number
  quizAttempts: number
  completedAt?: string
  /** ISO timestamp when the learner finished the inline practice step. */
  practiceCompletedAt?: string
}

export type SchoolSubjectProgressState = {
  lessons: Record<string, SchoolSubjectLessonProgress>
}

function progressKey(subjectId: SchoolSubjectId, lessonId: string): string {
  return `${subjectId}::${lessonId}`
}

function defaultState(): SchoolSubjectProgressState {
  return { lessons: {} }
}

function persistSchoolSubjectProgress(state: SchoolSubjectProgressState): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function migrateLegacyMathIfNeeded(state: SchoolSubjectProgressState): void {
  if (typeof window === 'undefined') return
  try {
    const flag = 'sparki_migrated_school_math_progress_v1'
    if (window.localStorage.getItem(flag)) return
    const raw = window.localStorage.getItem(LEGACY_MATH_KEY)
    if (!raw) {
      window.localStorage.setItem(flag, '1')
      return
    }
    const parsed = JSON.parse(raw) as { lessons?: Record<string, SchoolSubjectLessonProgress> }
    const legacyLessons = parsed?.lessons
    if (!legacyLessons || typeof legacyLessons !== 'object') {
      window.localStorage.setItem(flag, '1')
      return
    }
    let added = false
    for (const [lessonId, prog] of Object.entries(legacyLessons)) {
      const k = progressKey('math', lessonId)
      if (!state.lessons[k]) {
        state.lessons[k] = prog
        added = true
      }
    }
    window.localStorage.setItem(flag, '1')
    if (added) persistSchoolSubjectProgress(state)
  } catch {
    // ignore
  }
}

export function loadSchoolSubjectProgress(): SchoolSubjectProgressState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const empty = defaultState()
      migrateLegacyMathIfNeeded(empty)
      return empty
    }
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || !('lessons' in parsed)) return defaultState()
    const lessons = (parsed as SchoolSubjectProgressState).lessons
    if (!lessons || typeof lessons !== 'object') return defaultState()
    const state = { lessons }
    migrateLegacyMathIfNeeded(state)
    return state
  } catch {
    return defaultState()
  }
}

export function saveSchoolSubjectProgress(state: SchoolSubjectProgressState): void {
  persistSchoolSubjectProgress(state)
}

export function recordSchoolSubjectPracticeComplete(subjectId: SchoolSubjectId, lessonId: string): void {
  const state = loadSchoolSubjectProgress()
  const key = progressKey(subjectId, lessonId)
  const prev = state.lessons[key]
  const base: SchoolSubjectLessonProgress = prev ?? { quizBestScore: 0, quizAttempts: 0 }
  state.lessons[key] = {
    ...base,
    practiceCompletedAt: new Date().toISOString(),
  }
  saveSchoolSubjectProgress(state)
  void syncSparkiSubjectTracksToSupabase()
}

export function recordSchoolSubjectQuizResult(
  subjectId: SchoolSubjectId,
  lessonId: string,
  score: number,
  total: number,
): void {
  const state = loadSchoolSubjectProgress()
  const key = progressKey(subjectId, lessonId)
  const prev = state.lessons[key]
  const ratio = total > 0 ? score / total : 0
  const next: SchoolSubjectLessonProgress = {
    ...(prev ?? { quizBestScore: 0, quizAttempts: 0 }),
    quizBestScore: prev ? Math.max(prev.quizBestScore, ratio) : ratio,
    quizAttempts: (prev?.quizAttempts ?? 0) + 1,
    completedAt: ratio >= 1 ? new Date().toISOString() : prev?.completedAt,
  }
  state.lessons[key] = next
  saveSchoolSubjectProgress(state)
  void syncSparkiSubjectTracksToSupabase()
}

export function isSchoolSubjectLessonMastered(subjectId: SchoolSubjectId, lessonId: string): boolean {
  const p = loadSchoolSubjectProgress().lessons[progressKey(subjectId, lessonId)]
  return !!p && p.quizBestScore >= 1
}
