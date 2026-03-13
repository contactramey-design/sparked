import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const searchParams = new URLSearchParams(location.search)
  const redirect = searchParams.get('redirect') ?? '/dashboard'

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
          <p>
            This simple sign-in remembers that a grown-up has opened SpArki&apos;s
            Academy on this device. No email or password is required in this demo.
          </p>
          <button type="button" className="primary-button" onClick={handleLogin}>
            Sign in and open dashboard
          </button>
        </div>
      </div>
    </section>
  )
}

export default LoginPage

