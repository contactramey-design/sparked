import type { AgeBandId } from '@/ageBand'
import { ENGLISH_LESSONS } from './curriculum/englishLessons'
import { HISTORY_LESSONS } from './curriculum/historyLessons'
import { MATH_LESSONS } from './curriculum/mathLessons'
import { SCIENCE_LESSONS } from './curriculum/scienceLessons'
import type { SchoolSubjectId, SchoolSubjectLesson } from './types'

export const SUBJECT_LESSONS: Record<SchoolSubjectId, SchoolSubjectLesson[]> = {
  math: MATH_LESSONS,
  english: ENGLISH_LESSONS,
  science: SCIENCE_LESSONS,
  history: HISTORY_LESSONS,
}

function bandSortKey(lesson: SchoolSubjectLesson): number {
  if (lesson.ageBands.includes('tots')) return 0
  if (lesson.ageBands.includes('kids')) return 1
  return 2
}

/** All lessons for a subject, ordered Tots → Kids → Crew then lesson order (for alignment tables). */
export function getAllLessonsForSubjectOrdered(subjectId: SchoolSubjectId): SchoolSubjectLesson[] {
  const all = SUBJECT_LESSONS[subjectId] ?? []
  return [...all].sort((a, b) => {
    const ka = bandSortKey(a)
    const kb = bandSortKey(b)
    if (ka !== kb) return ka - kb
    return a.order - b.order
  })
}

export function getLessonsForSubjectAndBand(subjectId: SchoolSubjectId, band: AgeBandId): SchoolSubjectLesson[] {
  const all = SUBJECT_LESSONS[subjectId] ?? []
  return all.filter((l) => l.ageBands.includes(band)).sort((a, b) => a.order - b.order)
}

export function getSubjectLessonById(subjectId: SchoolSubjectId, lessonId: string): SchoolSubjectLesson | undefined {
  return SUBJECT_LESSONS[subjectId]?.find((l) => l.id === lessonId)
}
