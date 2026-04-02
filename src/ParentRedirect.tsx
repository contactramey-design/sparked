import { Navigate } from 'react-router-dom'

const SCHOOL_MODE_STORAGE_KEY = 'sparki_mode_school_v1'

function parentLandingPath(): string {
  if (typeof window === 'undefined') return '/?view=parent'
  try {
    return window.localStorage.getItem(SCHOOL_MODE_STORAGE_KEY) === 'true' ? '/schools/parent' : '/?view=parent'
  } catch {
    return '/?view=parent'
  }
}

/** /parent — school mode → school parent hub; otherwise consumer parent view on home. */
export default function ParentRedirect() {
  return <Navigate to={parentLandingPath()} replace />
}
