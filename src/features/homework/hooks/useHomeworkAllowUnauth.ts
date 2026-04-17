import { useEffect, useState } from 'react'

/** Matches HomeworkUpload: prod homework without checkout when API allows. */
export function useHomeworkAllowUnauth(): boolean {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { homeworkAllowUnauth?: boolean }) => {
        if (!cancelled) setAllowed(Boolean(data.homeworkAllowUnauth))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return allowed
}
