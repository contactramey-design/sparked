import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, locale } = useTranslation()

  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') ?? '/'
  const fromRedirect = !!searchParams.get('redirect')

  const handleLogin = () => {
    login()
    navigate(redirect, { replace: true })
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
          <button type="button" className="primary-button" onClick={handleLogin}>
            {t('login.submitButton')}
          </button>
          <p className="login-coppa-note">
            {t('login.coppaNote')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
