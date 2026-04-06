import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import {
  clearPostLoginRedirect,
  getPostLoginRedirect,
  readSafeInternalPath,
  resolveLoginRedirect,
} from './lib/postLoginRedirect'
import { supabase } from './lib/supabaseClient'

const LoginPage: React.FC = () => {
  const { isLoggedIn, devLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, locale } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  const searchParams = new URLSearchParams(location.search)
  const redirect = resolveLoginRedirect(searchParams)
  const fromRedirect =
    !!readSafeInternalPath(searchParams.get('redirect')) ||
    !!getPostLoginRedirect()?.startsWith('/teacher')

  React.useEffect(() => {
    if (!isLoggedIn) return
    clearPostLoginRedirect()
    navigate(redirect, { replace: true })
  }, [isLoggedIn, navigate, redirect])

  const googleAuthEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true'

  const handleGoogle = async () => {
    if (!supabase) return
    setError(null)
    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    })
    if (oauthErr) setError(oauthErr.message || 'Google sign-in failed.')
  }

  const handleStartTrial = async () => {
    setError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.url) {
        throw new Error(
          typeof data?.error === 'string' ? data.error : 'Unable to open checkout. Please try again.',
        )
      }
      window.location.assign(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to open checkout. Please try again.')
    }
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
          {error && <p className="quiz-error text-sm mt-2">{error}</p>}
          {googleAuthEnabled && supabase ? (
            <button type="button" className="primary-button mt-4" onClick={() => void handleGoogle()}>
              {t('login.continueWithGoogle')}
            </button>
          ) : null}
          <button
            type="button"
            className={`${googleAuthEnabled && supabase ? 'secondary-button' : 'primary-button'} mt-4`}
            onClick={() => void handleStartTrial()}
          >
            {t('login.startTrialButton')}
          </button>
          <button
            type="button"
            className="secondary-button mt-3"
            onClick={() => {
              devLogin()
              clearPostLoginRedirect()
              navigate(redirect, { replace: true })
            }}
          >
            {t('login.alreadyAccessButton')}
          </button>
          {googleAuthEnabled && !supabase ? (
            <p className="login-coppa-note text-sm">{t('login.googleNotConfigured')}</p>
          ) : null}
          <p className="login-coppa-note">
            {t('login.coppaNote')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
