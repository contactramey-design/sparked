/**
 * Shared types for school subject tracks (math, English, science, history).
 * Add lessons in `curriculum/*.ts` and register in `registry.ts`.
 */
import type { AgeBandId } from '@/ageBand'

export const SCHOOL_SUBJECT_IDS = ['math', 'english', 'science', 'history'] as const
export type SchoolSubjectId = (typeof SCHOOL_SUBJECT_IDS)[number]

export function isSchoolSubjectId(s: string | undefined): s is SchoolSubjectId {
  return SCHOOL_SUBJECT_IDS.includes(s as SchoolSubjectId)
}

export type SchoolSubjectTeachSection = {
  heading: string
  /** Use \\n\\n for multiple paragraphs. */
  body: string
  /** Optional short bullets under the paragraph(s). */
  bullets?: string[]
}

export type SchoolSubjectQuizItem = {
  id: string
  prompt: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
  /** Optional; overrides central map in `schoolSubjectQuizFeedback.ts` when set. */
  feedback?: string
}

export type SchoolSubjectLessonLocale = {
  title: string
  summary: string
  objectives: string[]
  teachSections: SchoolSubjectTeachSection[]
  quiz: SchoolSubjectQuizItem[]
  realWorldTip: string
}

/** California official frameworks for school alignment (CDE). */
export type CaStandardsFramework = 'PTKLF' | 'CCSS_MATH' | 'CCSS_ELA' | 'CA_NGSS' | 'CA_HSS'

export type CaStandardsMeta = {
  framework: CaStandardsFramework
  codes: string[]
  /** Optional grade hint shown in alignment tables, e.g. "TK–K", "1", "4". */
  gradeSpan?: string
  /** Optional CDE search string when a stable deep link is not used. */
  cdeSearchQuery?: string
}

export type SchoolSubjectLesson = {
  id: string
  order: number
  ageBands: AgeBandId[]
  estMinutes: number
  /** California alignment metadata; drives badges and CDE links. */
  caStandards?: CaStandardsMeta
  standardsNote?: string
  cardEmoji?: string
  cardImageUrl?: string
  /**
   * When true (default), lesson includes the interactive quiz step — show “game / practice” badge on track cards.
   * Set false for future read-only lessons.
   */
  includesGameQuiz?: boolean
  en: SchoolSubjectLessonLocale
  es: SchoolSubjectLessonLocale
}

export function lessonLocale(lesson: SchoolSubjectLesson, locale: 'en' | 'es'): SchoolSubjectLessonLocale {
  return locale === 'es' ? lesson.es : lesson.en
}

export function isLessonInBand(lesson: SchoolSubjectLesson, band: AgeBandId): boolean {
  return lesson.ageBands.includes(band)
}
