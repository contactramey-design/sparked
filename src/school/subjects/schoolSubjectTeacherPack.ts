import type { SchoolSubjectTeacherPackLocale } from './types'
import { MATH_TEACHER_PACKS } from './teacherPackData/math'
import { ENGLISH_TEACHER_PACKS } from './teacherPackData/english'
import { SCIENCE_TEACHER_PACKS } from './teacherPackData/science'
import { HISTORY_TEACHER_PACKS } from './teacherPackData/history'

const ALL_TEACHER_PACKS = {
  ...MATH_TEACHER_PACKS,
  ...ENGLISH_TEACHER_PACKS,
  ...SCIENCE_TEACHER_PACKS,
  ...HISTORY_TEACHER_PACKS,
}

export function getSchoolSubjectTeacherPack(
  lessonId: string,
  locale: 'en' | 'es',
): SchoolSubjectTeacherPackLocale | undefined {
  const row = ALL_TEACHER_PACKS[lessonId as keyof typeof ALL_TEACHER_PACKS]
  if (!row) return undefined
  return locale === 'es' ? row.es : row.en
}
