/**
 * Lessons that have a static HTML practice game (split from Canva export).
 * Paths are under public/school-canva-games/ — see scripts/split-canva-games.mjs
 */
import type { Locale } from '@/contexts/LocaleContext'

const CANVA_LESSON_IDS = new Set<string>([
  'math-tots-count-1-5',
  'math-tots-patterns',
  'math-tots-more-less-same',
  'eng-kids-main-idea',
  'eng-kids-sentence-parts',
  'eng-kids-blend-sounds-cvc',
  'sci-kids-states-matter',
  'sci-kids-plants-need',
  'sci-kids-pushes-pulls',
  'hist-kids-community-helpers',
  'hist-kids-map-landmarks',
  'hist-kids-goods-services',
  'math-crew-multiply-thinking',
  'math-crew-fractions-intro',
  'math-crew-area-tiles',
  'eng-crew-text-evidence',
  'eng-crew-context-clues',
  'eng-crew-summary-paragraph',
  'sci-crew-food-web',
  'sci-crew-sun-energy',
  'sci-crew-human-body-systems',
  'hist-crew-timeline-basics',
  'hist-crew-sources',
  'hist-crew-ca-symbols-regions',
])

export function hasCanvaPracticeGame(lessonId: string): boolean {
  return CANVA_LESSON_IDS.has(lessonId)
}

/** Absolute path from site root for <iframe src> (?lang=es loads i18n merge in the game) */
export function canvaPracticeGameSrc(lessonId: string, locale: Locale = 'en'): string | undefined {
  if (!CANVA_LESSON_IDS.has(lessonId)) return undefined
  const base = `/school-canva-games/${lessonId}.html`
  return locale === 'es' ? `${base}?lang=es` : base
}
