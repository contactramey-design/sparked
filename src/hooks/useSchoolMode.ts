import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { isSchoolShellPath } from '@/lib/schoolShell'

const SCHOOL_MODE_STORAGE_KEY = 'sparki_mode_school_v1'

function parseModeFromSearch(search: string): 'school' | 'regular' | null {
  const params = new URLSearchParams(search)
  const raw = params.get('mode')
  if (!raw) return null
  if (raw === 'school') return 'school'
  if (raw === 'regular') return 'regular'
  return null
}

export function useSchoolMode(): {
  schoolMode: boolean
  setSchoolMode: (enabled: boolean) => void
} {
  const location = useLocation()
  const navigate = useNavigate()
  const [stored, setStored] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.localStorage.getItem(SCHOOL_MODE_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  // URL param overrides stored value, and persists the choice.
  useEffect(() => {
    const mode = parseModeFromSearch(location.search)
    if (!mode) return
    const next = mode === 'school'
    setStored(next)
    try {
      window.localStorage.setItem(SCHOOL_MODE_STORAGE_KEY, next ? 'true' : 'false')
    } catch {
      // ignore
    }
  }, [location.search])

  const schoolMode = useMemo(() => {
    const mode = parseModeFromSearch(location.search)
    if (mode) return mode === 'school'
    return stored
  }, [location.search, stored])

  const setSchoolMode = (enabled: boolean) => {
    setStored(enabled)
    try {
      window.localStorage.setItem(SCHOOL_MODE_STORAGE_KEY, enabled ? 'true' : 'false')
    } catch {
      // ignore
    }
    const params = new URLSearchParams(location.search)
    params.set('mode', enabled ? 'school' : 'regular')
    navigate({ pathname: location.pathname, search: `?${params.toString()}` }, { replace: true })
  }

  return { schoolMode, setSchoolMode }
}

/** True when the app should hide shop/ebook commerce (school routes or school mode toggle). */
export function useSchoolShopHidden(): boolean {
  const { pathname } = useLocation()
  const { schoolMode } = useSchoolMode()
  return schoolMode || isSchoolShellPath(pathname)
}

