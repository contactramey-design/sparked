/**
 * Shared types for school subject tracks (mission + core subjects).
 * Add lessons in `curriculum/*.ts` and register in `registry.ts`.
 */
import type { AgeBandId } from '@/ageBand'

export const SCHOOL_SUBJECT_IDS = [
  'internet-safety',
  'ai-literacy',
  'math',
  'english',
  'science',
  'history',
] as const
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

/** Declarative specs resolved per local calendar day (deterministic) — see `resolveSchoolSubjectQuizItem.ts`. */
export type SchoolSubjectQuizDynamic =
  | { kind: 'subtract_equation'; maxMinuend: number }
  | { kind: 'subtract_story_pick'; maxMinuend: number }
  | { kind: 'sum_inverse_fact'; maxSum: number }
  | { kind: 'subtract_drawing_pick'; maxMinuend: number }
  | {
      kind: 'choice_variants'
      variants: Array<{
        prompt: string
        options: [string, string, string]
        correctIndex: 0 | 1 | 2
      }>
    }

export type SchoolSubjectQuizItem = {
  id: string
  prompt: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
  /** Optional; overrides central map in `schoolSubjectQuizFeedback.ts` when set. */
  feedback?: string
  /** When set, prompt/options are regenerated from `kind` using the device’s local date. */
  dynamic?: SchoolSubjectQuizDynamic
}

/** Rich teacher-only pedagogy (see `schoolSubjectTeacherPack.ts`); not shown to students as separate quiz copy. */
export type SchoolSubjectVocabularyTerm = { term: string; definition: string }
export type SchoolSubjectMisconception = { myth: string; correction: string }

export type SchoolSubjectTeacherPackLocale = {
  conceptualDeepDive: string
  vocabularyTerms: SchoolSubjectVocabularyTerm[]
  /** Short script the teacher can read or adapt while modeling. */
  sayThisAloud: string
  misconceptions: SchoolSubjectMisconception[]
  supportEmergingLearners: string
  extendForDepth: string
  extraPracticeIdeas: string[]
}

export type BilingualTeacherPack = { en: SchoolSubjectTeacherPackLocale; es: SchoolSubjectTeacherPackLocale }

export type SchoolSubjectLessonLocale = {
  title: string
  summary: string
  objectives: string[]
  teachSections: SchoolSubjectTeachSection[]
  quiz: SchoolSubjectQuizItem[]
  realWorldTip: string
  /** Optional offline “try this” line; when set, tip step shows Try + Why blocks. */
  offlineApplication?: string
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
  /**
   * Optional US grade span for lesson cards, alignment tables, and docs.
   * When omitted, UI uses `ageBand.names.{band}.gradesUs` from locales (first band in `ageBands`).
   */
  gradeSpan?: { en: string; es: string }
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
  /**
   * When not false, show a short practice step after Learn and before the quick check.
   * Ignored when `includesGameQuiz === false`.
   */
  includesPracticeStep?: boolean
  /** Registry id under `subjects/games` (defaults to built-in ordered-tap when practice is on). */
  practiceGameId?: string
  en: SchoolSubjectLessonLocale
  es: SchoolSubjectLessonLocale
}

export function lessonLocale(lesson: SchoolSubjectLesson, locale: 'en' | 'es'): SchoolSubjectLessonLocale {
  return locale === 'es' ? lesson.es : lesson.en
}

export function isLessonInBand(lesson: SchoolSubjectLesson, band: AgeBandId): boolean {
  return lesson.ageBands.includes(band)
}
