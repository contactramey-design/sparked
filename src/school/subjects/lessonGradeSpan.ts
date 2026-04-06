import type { AgeBandId } from '@/ageBand'
import type { SchoolSubjectLesson } from './types'

export function primaryLessonAgeBand(lesson: SchoolSubjectLesson): AgeBandId {
  return lesson.ageBands[0] ?? 'kids'
}

/** Typical US grades line for a lesson (explicit `gradeSpan` or i18n fallback by primary band). */
export function lessonTypicalGradesLine(
  lesson: SchoolSubjectLesson,
  locale: 'en' | 'es',
  t: (key: string) => string,
): string {
  if (lesson.gradeSpan) return lesson.gradeSpan[locale]
  const band = primaryLessonAgeBand(lesson)
  return t(`ageBand.names.${band}.gradesUs`)
}
