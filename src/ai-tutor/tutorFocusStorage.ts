/** sessionStorage — tutor curriculum focus slug (resolved server-side; allowlist only). */
export const TUTOR_FOCUS_SLUG_SESSION_KEY = 'sparki_tutor_focus_slug_v1'

export type TutorFocusSlug = 'ai-literacy' | 'internet-safety' | 'ai-media-trust' | 'coding-challenge'

const KNOWN = new Set<string>(['ai-literacy', 'internet-safety', 'ai-media-trust', 'coding-challenge'])

export function normalizeTutorFocusSlug(raw: string | null | undefined): TutorFocusSlug | '' {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
  return KNOWN.has(s) ? (s as TutorFocusSlug) : ''
}

export function saveTutorFocusSlugSession(slug: TutorFocusSlug) {
  try {
    sessionStorage.setItem(TUTOR_FOCUS_SLUG_SESSION_KEY, slug)
  } catch {
    /* ignore */
  }
}

export function readTutorFocusSlugSession(): TutorFocusSlug | '' {
  try {
    return normalizeTutorFocusSlug(sessionStorage.getItem(TUTOR_FOCUS_SLUG_SESSION_KEY))
  } catch {
    return ''
  }
}

export function clearTutorFocusSlugSession() {
  try {
    sessionStorage.removeItem(TUTOR_FOCUS_SLUG_SESSION_KEY)
  } catch {
    /* ignore */
  }
}
