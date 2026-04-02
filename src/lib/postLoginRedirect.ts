const STORAGE_KEY = 'sparki_post_login_redirect_v1'

/** Accept only same-origin paths (no open redirects). */
export function readSafeInternalPath(raw: string | null | undefined): string | null {
  if (raw == null || typeof raw !== 'string') return null
  let s = raw.trim()
  try {
    s = decodeURIComponent(s)
  } catch {
    // keep s as trimmed raw
  }
  if (!s.startsWith('/') || s.startsWith('//')) return null
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(s)) return null
  if (s.startsWith('/login')) return null
  if (s.length > 256) return null
  return s
}

export function setPostLoginRedirect(path: string): void {
  const safe = readSafeInternalPath(path)
  if (!safe || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, safe)
  } catch {
    // ignore
  }
}

export function getPostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return readSafeInternalPath(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export function clearPostLoginRedirect(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

/** Query `redirect` wins over stored path (e.g. from School hub); both are validated. */
export function resolveLoginRedirect(searchParams: URLSearchParams): string {
  const fromQuery = readSafeInternalPath(searchParams.get('redirect'))
  const fromStorage = getPostLoginRedirect()
  return fromQuery ?? fromStorage ?? '/'
}
