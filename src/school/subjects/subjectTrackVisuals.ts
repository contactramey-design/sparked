/**
 * Hero art for each subject track. Add `*.svg` or `*.webp` under `public/school-subject-heroes/`
 * (see that folder’s README). If the file fails to load, the UI uses a colorful CSS fallback.
 *
 * When generating images, keep a consistent look: warm, Pixar-style 3D, school-safe,
 * Sparki-friendly colors — match your brand prompts.
 */
import type { SchoolSubjectId } from './types'

export type SubjectTrackVisual = {
  /** Served from site root, e.g. `/school-subject-heroes/math.webp` */
  heroImage: string
  /** Modifier class for gradient / pattern fallback when image fails to load */
  fallbackModifier:
    | 'math'
    | 'english'
    | 'science'
    | 'history'
    | 'internet-safety'
    | 'ai-literacy'
}

export const SUBJECT_TRACK_VISUAL: Record<SchoolSubjectId, SubjectTrackVisual> = {
  'internet-safety': {
    heroImage: '/safety-card.png',
    fallbackModifier: 'internet-safety',
  },
  'ai-literacy': {
    heroImage: '/sparkiaicodingcardhomepage.png',
    fallbackModifier: 'ai-literacy',
  },
  math: {
    heroImage: '/school-subject-heroes/math.svg',
    fallbackModifier: 'math',
  },
  english: {
    heroImage: '/school-subject-heroes/english.svg',
    fallbackModifier: 'english',
  },
  science: {
    heroImage: '/school-subject-heroes/science.svg',
    fallbackModifier: 'science',
  },
  history: {
    heroImage: '/school-subject-heroes/history.svg',
    fallbackModifier: 'history',
  },
}
