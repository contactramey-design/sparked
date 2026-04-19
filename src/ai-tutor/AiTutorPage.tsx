import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { getHasAcademySubscription, getHomeworkCheckoutSessionId, setAcademyCheckoutSessionId, setHasAcademySubscription } from '@/progress'
import InteractiveTutor from './InteractiveTutor'

export default function AiTutorPage() {
  const { t } = useTranslation()
  const [tutorAllowUnauth, setTutorAllowUnauth] = useState(false)
  const [tutorRequireCheckout, setTutorRequireCheckout] = useState(false)
  const [tutorLeadCaptureEnabled, setTutorLeadCaptureEnabled] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then(
        (data: {
          tutorAllowUnauth?: boolean
          aiTutorRequireCheckout?: boolean
          tutorLeadCaptureEnabled?: boolean
        }) => {
          if (!cancelled) {
            setTutorAllowUnauth(Boolean(data.tutorAllowUnauth))
            setTutorRequireCheckout(Boolean(data.aiTutorRequireCheckout))
            setTutorLeadCaptureEnabled(Boolean(data.tutorLeadCaptureEnabled))
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
  /** Paywall only when AI_TUTOR_REQUIRE_CHECKOUT=true on server (or legacy unauth / session in browser). */
  const canUseApi = Boolean(
    !tutorRequireCheckout || tutorAllowUnauth || checkoutSessionId,
  )

  const startAcademyCheckout = async () => {
    if (checkoutLoading) return
    setCheckoutError(null)
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'academy', returnTo: '/ai-tutor' }),
      })
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !data?.url) {
        throw new Error(typeof data?.error === 'string' ? data.error : 'Unable to open checkout.')
      }
      window.location.assign(data.url)
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Unable to open checkout.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  if (!canUseApi) {
    return (
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl text-slate-900">{t('aiTutor.paywallTitle')}</h2>
        <p className="text-slate-700">{t('aiTutor.paywallBody')}</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="aspect-video w-full bg-gradient-to-br from-teal-50 via-white to-sky-50" />
        </div>
        {!hasAcademy && (
          <p className="text-sm text-slate-600">{t('aiTutor.paywallHint')}</p>
        )}
        {checkoutError ? <p className="text-sm font-semibold text-red-600">{checkoutError}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-teal-600 px-6 text-lg font-bold text-white hover:bg-teal-700 disabled:opacity-60"
            onClick={() => void startAcademyCheckout()}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? t('parentDashboard.openingCheckout') : t('parentDashboard.unlockAcademyButton')}
          </button>
          <Link to="/?view=parent" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('aiTutor.paywallCta')}
          </Link>
        </div>
      </div>
    )
  }

  const hasActiveSubscription = Boolean(tutorAllowUnauth || checkoutSessionId || hasAcademy)

  return (
    <InteractiveTutor
      checkoutSessionId={checkoutSessionId}
      hasActiveSubscription={hasActiveSubscription}
      tutorLeadCaptureEnabled={tutorLeadCaptureEnabled}
    />
  )
}
