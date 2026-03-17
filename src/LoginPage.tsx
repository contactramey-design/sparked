import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'

const LoginPage: React.FC = () => {
  const { configured, isLoggedIn, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, locale } = useTranslation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') ?? '/'
  const fromRedirect = !!searchParams.get('redirect')

  const trimmedEmail = useMemo(() => email.trim(), [email])
  const canSubmit = configured && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(redirect, { replace: true })
    }
  }, [isLoggedIn, navigate, redirect])

  const handleSendLink: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setError(null)
    if (!configured) {
      setError('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.')
      return
    }
    if (!canSubmit) {
      setError('Enter a valid email address.')
      return
    }
    setStatus('sending')
    const res = await signInWithEmail(trimmedEmail)
    if (!res.ok) {
      setStatus('error')
      setError(res.error)
      return
    }
    setStatus('sent')
  }

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('login.title')}</h2>
      </header>
      <div className="lesson-layout">
        <div className="lesson-media card">
          {fromRedirect && (
            <p className="login-redirect-note">
              {t('login.redirectNote')}
            </p>
          )}
          <p>
            {t('login.intro')}
          </p>
          <form onSubmit={handleSendLink} className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Parent email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-3 py-2"
              placeholder="parent@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus('idle')
                setError(null)
              }}
              autoComplete="email"
            />
            {error && <p className="quiz-error text-sm mt-2">{error}</p>}
            {status === 'sent' && (
              <p className="text-sm mt-2" style={{ opacity: 0.9 }}>
                Check your email for a sign-in link. After you click it, you’ll come back here and be signed in.
              </p>
            )}
            <button
              type="submit"
              className="primary-button mt-3"
              disabled={!canSubmit || status === 'sending'}
            >
              {status === 'sending' ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
          <p className="login-coppa-note">
            {t('login.coppaNote')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
