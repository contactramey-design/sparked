import { useLocation } from 'react-router-dom'

/** Canonical consumer paths for subject practice (blue shell). */
export const PRACTICE_BASE = '/practice'

export function isFamilyPracticePath(pathname: string): boolean {
  return pathname === PRACTICE_BASE || pathname.startsWith(`${PRACTICE_BASE}/`)
}

export function buildPracticeHubPath(): string {
  return PRACTICE_BASE
}

export function buildPracticeSubjectPath(subjectId: string): string {
  return `${PRACTICE_BASE}/${encodeURIComponent(subjectId)}`
}

export function buildPracticeLessonPath(subjectId: string, lessonId: string): string {
  return `${PRACTICE_BASE}/${encodeURIComponent(subjectId)}/${encodeURIComponent(lessonId)}`
}

/** Legacy school subject URLs → practice equivalents (preserve bookmarks). */
export function practicePathFromLegacySchoolSubjectsPath(pathname: string): string | null {
  if (pathname === '/schools/subjects') return PRACTICE_BASE
  const prefix = '/schools/subjects/'
  if (!pathname.startsWith(prefix)) return null
  const rest = pathname.slice(prefix.length)
  if (!rest) return PRACTICE_BASE
  return `${PRACTICE_BASE}/${rest}`
}

/** Subject pages mount under `/practice/*` (consumer) or legacy redirects only. */
export function usePracticeSubjectRoutes() {
  const { pathname } = useLocation()
  const isFamilyPractice = isFamilyPracticePath(pathname)
  const hubPath = isFamilyPractice ? buildPracticeHubPath() : '/schools/subjects'
  const buildSubjectPath = (subjectId: string) =>
    isFamilyPractice ? buildPracticeSubjectPath(subjectId) : `/schools/subjects/${subjectId}`
  const buildLessonPath = (subjectId: string, lessonId: string) =>
    isFamilyPractice
      ? buildPracticeLessonPath(subjectId, lessonId)
      : `/schools/subjects/${subjectId}/${encodeURIComponent(lessonId)}`
  return { isFamilyPractice, hubPath, buildSubjectPath, buildLessonPath }
}
