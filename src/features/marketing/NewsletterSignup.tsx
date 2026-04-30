import React, { useMemo, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'

type Props = {
  className?: string
  source: 'blog' | 'home'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterSignup({ className, source }: Props) {
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cta = useMemo(() => (source === 'home' ? t('marketingPages.newsletterHomeCta') : t('marketingPages.newsletterCta')), [source, t])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setOk(false)
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError(t('marketingPages.newsletterEmailInvalid'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter-optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          locale: locale === 'es' ? 'es' : 'en',
          source,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string }
      if (!res.ok) {
        throw new Error((typeof data.message === 'string' && data.message) || (typeof data.error === 'string' && data.error) || 'Unable to subscribe.')
      }
      setOk(true)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : t('marketingPages.newsletterFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={className}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-slate-900">{t('marketingPages.newsletterTitle')}</h2>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">{t('marketingPages.newsletterBody')}</p>
        <form className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch" onSubmit={onSubmit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">
            {t('marketingPages.newsletterEmailLabel')}
          </label>
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder={t('marketingPages.newsletterEmailPlaceholder')}
            className="min-h-[52px] w-full flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-base text-slate-900"
            disabled={loading}
          />
          <button
            type="submit"
            className="min-h-[52px] shrink-0 rounded-2xl bg-teal-600 px-6 text-base font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? t('marketingPages.newsletterSubmitting') : cta}
          </button>
        </form>
        {ok ? <p className="mt-3 text-sm font-semibold text-teal-800">{t('marketingPages.newsletterSuccess')}</p> : null}
        {error ? (
          <p className="mt-3 text-sm font-semibold text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <p className="mt-3 text-xs leading-relaxed text-slate-500">{t('marketingPages.newsletterPrivacy')}</p>
      </div>
    </section>
  )
}

