/**
 * Age bands for B2C curriculum, homework hints, and (server) school class metadata.
 */
export type AgeBandId = 'tots' | 'kids' | 'crew'

export const ALL_AGE_BANDS: AgeBandId[] = ['tots', 'kids', 'crew']

export const DEFAULT_AGE_BAND: AgeBandId = 'kids'

/** localStorage key for selected band (browser UX). */
export const AGE_BAND_STORAGE_KEY = 'sparki_age_band_v1'

export function isAgeBandId(s: string | null | undefined): s is AgeBandId {
  return s === 'tots' || s === 'kids' || s === 'crew'
}

/**
 * Free-text grade hint for homework analyze API (`gradeBand` field).
 * Keep wording aligned with Sparki age bands (tots / kids / crew).
 */
export function homeworkAgeHintForBand(band: AgeBandId, locale: 'en' | 'es' = 'en'): string {
  if (locale === 'es') {
    switch (band) {
      case 'tots':
        return 'Preescolar / edades 3–5'
      case 'kids':
        return '1.º–2.º grado / edades 6–8'
      case 'crew':
        return '3.º–5.º grado / edades 9–11'
      default:
        return homeworkAgeHintForBand('kids', 'es')
    }
  }
  switch (band) {
    case 'tots':
      return 'Pre-K / ages 3–5'
    case 'kids':
      return 'Grades 1–2 / ages 6–8'
    case 'crew':
      return 'Grades 3–5 / ages 9–11'
    default:
      return homeworkAgeHintForBand('kids', 'en')
  }
}

/** Server-side / prompts: short instruction line for LLM age targeting. */
export function promptAgeInstructionForBand(band: AgeBandId, locale: 'en' | 'es'): string {
  if (locale === 'es') {
    switch (band) {
      case 'tots':
        return 'niños de 3 a 5 años (estilo preescolar, frases muy cortas)'
      case 'kids':
        return 'niños de 6 a 8 años (primaria temprana, texto sencillo)'
      case 'crew':
        return 'niños de 9 a 11 años (un poco más de detalle, aún amigable)'
      default:
        return promptAgeInstructionForBand('kids', 'es')
    }
  }
  switch (band) {
    case 'tots':
      return 'children ages 3–5 (preschool-style, very short sentences)'
    case 'kids':
      return 'children ages 6–8 (early elementary, simple language)'
    case 'crew':
      return 'children ages 9–11 (upper elementary, slightly richer detail, still kid-friendly)'
    default:
      return promptAgeInstructionForBand('kids', 'en')
  }
}
