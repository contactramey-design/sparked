/**
 * Hero art for each subject track. Drop WebP/PNG into `public/school-subject-heroes/`
 * (see that folder’s README). If the file is missing, the UI uses a colorful CSS fallback.
 *
 * When generating images, keep a consistent look: warm, Pixar-style 3D, school-safe,
 * Sparki-friendly colors — match your brand prompts.
 */
import type { SchoolSubjectId } from './types'

export type SubjectTrackVisual = {
  /** Served from site root, e.g. `/school-subject-heroes/math.webp` */
  heroImage: string
  /** Modifier class for gradient / pattern fallback when image fails to load */
  fallbackModifier: 'math' | 'english' | 'science' | 'history'
}

export const SUBJECT_TRACK_VISUAL: Record<SchoolSubjectId, SubjectTrackVisual> = {
  math: {
    heroImage: '/school-subject-heroes/math.webp',
    fallbackModifier: 'math',
  },
  english: {
    heroImage: '/school-subject-heroes/english.webp',
    fallbackModifier: 'english',
  },
  science: {
    heroImage: '/school-subject-heroes/science.webp',
    fallbackModifier: 'science',
  },
  history: {
    heroImage: '/school-subject-heroes/history.webp',
    fallbackModifier: 'history',
  },
}
