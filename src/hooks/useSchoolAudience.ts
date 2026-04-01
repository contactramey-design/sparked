import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SCHOOL_AUDIENCE_STORAGE_KEY = 'sparki_school_audience_v1'

export type SchoolAudience = 'teacher' | 'student'

function parseAudienceFromSearch(search: string): SchoolAudience | null {
  const raw = new URLSearchParams(search).get('audience')
  if (raw === 'teacher' || raw === 'student') return raw
  return null
}

function readStoredAudience(): SchoolAudience {
  if (typeof window === 'undefined') return 'teacher'
  try {
    const v = window.localStorage.getItem(SCHOOL_AUDIENCE_STORAGE_KEY)
    if (v === 'student' || v === 'teacher') return v
  } catch {
    // ignore
  }
  return 'teacher'
}

/**
 * Who the school subject UI is optimized for. Teachers see standards, toolkit, and alignment detail;
 * students see lesson content, quiz, and tips without educator-only scaffolding.
 * URL `?audience=student` or `?audience=teacher` overrides and persists to localStorage.
 */
export function useSchoolAudience(): {
  schoolAudience: SchoolAudience
  setSchoolAudience: (audience: SchoolAudience) => void
  isTeacherView: boolean
} {
  const location = useLocation()
  const navigate = useNavigate()
  const [stored, setStored] = useState<SchoolAudience>(readStoredAudience)

  useEffect(() => {
    const fromUrl = parseAudienceFromSearch(location.search)
    if (!fromUrl) return
    setStored(fromUrl)
    try {
      window.localStorage.setItem(SCHOOL_AUDIENCE_STORAGE_KEY, fromUrl)
    } catch {
      // ignore
    }
  }, [location.search])

  const schoolAudience = useMemo(() => {
    const fromUrl = parseAudienceFromSearch(location.search)
    if (fromUrl) return fromUrl
    return stored
  }, [location.search, stored])

  const setSchoolAudience = (audience: SchoolAudience) => {
    setStored(audience)
    try {
      window.localStorage.setItem(SCHOOL_AUDIENCE_STORAGE_KEY, audience)
    } catch {
      // ignore
    }
    const params = new URLSearchParams(location.search)
    params.set('audience', audience)
    const qs = params.toString()
    navigate({ pathname: location.pathname, search: qs ? `?${qs}` : '' }, { replace: true })
  }

  return {
    schoolAudience,
    setSchoolAudience,
    isTeacherView: schoolAudience === 'teacher',
  }
}
