import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') ?? '/'
  const fromRedirect = !!searchParams.get('redirect')

  const handleLogin = () => {
    login()
    navigate(redirect, { replace: true })
  }

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <h2>Grown-up Sign In</h2>
      </header>
      <div className="lesson-layout">
        <div className="lesson-media card">
          {fromRedirect && (
            <p className="login-redirect-note">
              Some pages are for signed-in grown-ups only. Sign in to continue.
            </p>
          )}
          <p>
            This simple sign-in remembers that a grown-up has opened SpArki&apos;s
            Academy on this device. No email or password is required in this demo.
          </p>
          <button type="button" className="primary-button" onClick={handleLogin}>
            Sign in and open home
          </button>
          <p className="login-coppa-note">
            Grown-ups: Sign in once on this device so your family can use SpArki.
            This keeps the experience parent-approved.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage

