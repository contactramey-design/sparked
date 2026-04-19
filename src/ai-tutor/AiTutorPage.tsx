import { useEffect, useMemo, useState } from 'react'
import { getHasAcademySubscription, getHomeworkCheckoutSessionId, setAcademyCheckoutSessionId, setHasAcademySubscription } from '@/progress'
import InteractiveTutor from './InteractiveTutor'

export default function AiTutorPage() {
  const [tutorAllowUnauth, setTutorAllowUnauth] = useState(false)
  const [tutorLeadCaptureEnabled, setTutorLeadCaptureEnabled] = useState(false)
  const [tutorVisualEnabled, setTutorVisualEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then(
        (data: {
          tutorAllowUnauth?: boolean
          tutorLeadCaptureEnabled?: boolean
          tutorVisualEnabled?: boolean
        }) => {
          if (!cancelled) {
            setTutorAllowUnauth(Boolean(data.tutorAllowUnauth))
            setTutorLeadCaptureEnabled(Boolean(data.tutorLeadCaptureEnabled))
            setTutorVisualEnabled(Boolean(data.tutorVisualEnabled))
          }
        },
      )
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const checkoutStatus = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const v = params.get('checkout')
    if (v === 'success' || v === 'cancel') return v
    const checkoutSessionId = params.get('checkout_session_id')
    const entitlementType = params.get('entitlement_type')
    if (checkoutSessionId && entitlementType) return 'success'
    return null
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (checkoutStatus !== 'success') return
    try {
      const url = new URL(window.location.href)
      const sessionId = url.searchParams.get('checkout_session_id')
      const entitlementType = url.searchParams.get('entitlement_type')
      const returnTo = url.searchParams.get('returnTo')
      if (sessionId && entitlementType === 'academy') {
        setAcademyCheckoutSessionId(sessionId)
        setHasAcademySubscription(true)
      }

      url.searchParams.delete('checkout')
      url.searchParams.delete('checkout_session_id')
      url.searchParams.delete('entitlement_type')
      url.searchParams.delete('returnTo')
      window.history.replaceState({}, '', url.toString())

      if (returnTo && returnTo.startsWith('/ai-tutor')) {
        window.location.replace(returnTo)
      }
    } catch {
      /* ignore */
    }
  }, [checkoutStatus])

  const checkoutSessionId = getHomeworkCheckoutSessionId()
  const hasAcademy = getHasAcademySubscription()
  const hasActiveSubscription = Boolean(tutorAllowUnauth || checkoutSessionId || hasAcademy)

  return (
    <InteractiveTutor
      checkoutSessionId={checkoutSessionId}
      hasActiveSubscription={hasActiveSubscription}
      tutorLeadCaptureEnabled={tutorLeadCaptureEnabled}
      tutorVisualEnabled={tutorVisualEnabled}
    />
  )
}
