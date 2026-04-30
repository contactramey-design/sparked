import { useCallback, useState } from 'react'
import { ALL_AGE_BANDS, type AgeBandId } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'
import { postTutorLeadEmail, readTutorStateCode, writeTutorStateCode } from '@/ai-tutor/tutorService'
import { TutorApp } from '@/ai-tutor/TutorApp'
import {
  readTutorFunnelOnboarding,
  writeTutorFunnelOnboarding,
} from '@/ai-tutor/tutorFunnelStorage'
import { TutorInstallHint } from '@/ai-tutor/TutorInstallHint'

const DEFAULT_STATE_FALLBACK = 'CA'

export default function TutorFunnelPage() {
  const { t, locale } = useTranslation()
  const { setAgeBand } = useAgeBand()
  const [done, setDone] = useState(() => readTutorFunnelOnboarding() !== null)
  const [childDisplayName, setChildDisplayName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [ageBand, setBand] = useState<AgeBandId>('kids')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)
      const name = childDisplayName.trim().slice(0, 80)
      const email = parentEmail.trim()
      if (!name) {
        setError(t('marketingFunnel.onboardingNameRequired'))
        return
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(t('marketingFunnel.onboardingEmailInvalid'))
        return
      }
      setSubmitting(true)
      try {
        writeTutorFunnelOnboarding({ childDisplayName: name, parentEmail: email, ageBand })
        setAgeBand(ageBand)
        if (!readTutorStateCode()) {
          writeTutorStateCode(DEFAULT_STATE_FALLBACK)
        }
        void postTutorLeadEmail(email, locale === 'es' ? 'es' : 'en').catch(() => {})
        setDone(true)
      } finally {
        setSubmitting(false)
      }
    },
    [ageBand, childDisplayName, locale, parentEmail, setAgeBand, t],
  )

  if (!done) {
    return (
      <div
        className="min-h-[100dvh] bg-gradient-to-b from-sky-50 via-white to-amber-50/40 px-4 py-10"
        data-tutor-onboarding
      >
        <div className="mx-auto w-full max-w-md rounded-3xl border border-teal-100/90 bg-white/95 p-6 shadow-lg md:p-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-teal-800">
            {t('marketingFunnel.onboardingKicker')}
          </p>
          <h1 className="mt-2 text-center font-heading text-2xl font-bold text-slate-900">
            {t('marketingFunnel.onboardingTitle')}
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">{t('marketingFunnel.onboardingLead')}</p>
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">{t('marketingFunnel.childNameLabel')}</span>
              <input
                type="text"
                name="childDisplayName"
                autoComplete="nickname"
                value={childDisplayName}
                onChange={(ev) => setChildDisplayName(ev.target.value)}
                className="mt-1.5 w-full min-h-[48px] rounded-xl border border-slate-200 px-3 text-base text-slate-900"
                maxLength={80}
              />
            </label>
            <fieldset>
              <legend className="text-sm font-semibold text-slate-800">{t('marketingFunnel.ageBandLabel')}</legend>
              <div className="mt-2 flex flex-col gap-2">
                {ALL_AGE_BANDS.map((b) => (
                  <label
                    key={b}
                    className={cn(
                      'flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-2',
                      ageBand === b ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-white',
                    )}
                  >
                    <input
                      type="radio"
                      name="ageBand"
                      checked={ageBand === b}
                      onChange={() => setBand(b)}
                      className="h-5 w-5"
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {t(`ageBand.names.${b}.short`)} ({t(`ageBand.names.${b}.ages`)})
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">{t('marketingFunnel.parentEmailLabel')}</span>
              <input
                type="email"
                name="parentEmail"
                autoComplete="email"
                inputMode="email"
                value={parentEmail}
                onChange={(ev) => setParentEmail(ev.target.value)}
                className="mt-1.5 w-full min-h-[48px] rounded-xl border border-slate-200 px-3 text-base text-slate-900"
              />
            </label>
            {error ? (
              <p className="text-sm font-medium text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-teal-600 text-lg font-bold text-white hover:bg-teal-700 disabled:opacity-60"
            >
              {submitting ? t('marketingFunnel.onboardingSubmitting') : t('marketingFunnel.onboardingCta')}
            </button>
          </form>
          <p className="mt-4 text-center text-xs text-slate-500">{t('marketingFunnel.onboardingPrivacy')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50" data-tutor-session>
      <TutorInstallHint />
      <div className="mx-auto max-w-6xl px-3 pb-8 pt-3 sm:px-4 md:pt-4">
        <TutorApp checkoutReturnPath="/tutor" />
      </div>
    </div>
  )
}
