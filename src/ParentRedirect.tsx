import { Navigate, useLocation } from 'react-router-dom'

const SCHOOL_MODE_STORAGE_KEY = 'sparki_mode_school_v1'

function parentLandingPath(): string {
  if (typeof window === 'undefined') return '/?view=parent'
  try {
    return window.localStorage.getItem(SCHOOL_MODE_STORAGE_KEY) === 'true' ? '/schools/parent' : '/?view=parent'
  } catch {
    return '/?view=parent'
  }
}

function withSearch(basePath: string, redirectSearch: string): string {
  if (!redirectSearch) return basePath
  const q = redirectSearch.startsWith('?') ? redirectSearch.slice(1) : redirectSearch
  if (!q) return basePath
  if (basePath.includes('?')) return `${basePath}&${q}`
  return `${basePath}?${q}`
}

/** /parent — school mode → school parent hub; otherwise consumer parent view on home. Preserves query (e.g. checkout). */
export default function ParentRedirect() {
  const { search } = useLocation()
  return <Navigate to={withSearch(parentLandingPath(), search)} replace />
}
