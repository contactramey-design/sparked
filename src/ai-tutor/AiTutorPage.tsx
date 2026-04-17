import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { getHasAcademySubscription, getHomeworkCheckoutSessionId } from '@/progress'
import InteractiveTutor from './InteractiveTutor'

export default function AiTutorPage() {
  const { t } = useTranslation()
  const [tutorAllowUnauth, setTutorAllowUnauth] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { tutorAllowUnauth?: boolean }) => {
        if (!cancelled) setTutorAllowUnauth(Boolean(data.tutorAllowUnauth))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const checkoutSessionId = getHomeworkCheckoutSessionId()
  const hasAcademy = getHasAcademySubscription()
  const canUseApi = Boolean(tutorAllowUnauth || checkoutSessionId)

  if (!canUseApi) {
    return (
      <div className="mx-auto max-w-xl space-y-6 rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl text-slate-900">{t('aiTutor.paywallTitle')}</h2>
        <p className="text-slate-700">{t('aiTutor.paywallBody')}</p>
        {!hasAcademy && (
          <p className="text-sm text-slate-600">{t('aiTutor.paywallHint')}</p>
        )}
        <Link
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-teal-600 px-6 text-lg font-bold text-white hover:bg-teal-700"
          to="/?view=parent"
        >
          {t('aiTutor.paywallCta')}
        </Link>
      </div>
    )
  }

  return <InteractiveTutor checkoutSessionId={checkoutSessionId} />
}
