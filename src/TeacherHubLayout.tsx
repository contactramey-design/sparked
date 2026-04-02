import React, { useEffect } from 'react'
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { clearPostLoginRedirect, setPostLoginRedirect } from './lib/postLoginRedirect'

const SCHOOL_AUDIENCE_STORAGE_KEY = 'sparki_school_audience_v1'

/**
 * Shared shell for teacher tools: overview (classes / progress) and weekly PDF generator.
 * Waits for auth hydration so we don’t bounce to login before Supabase session restores.
 */
const TeacherHubLayout: React.FC = () => {
  const { authHydrated, isLoggedIn } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    try {
      window.localStorage.setItem(SCHOOL_AUDIENCE_STORAGE_KEY, 'teacher')
    } catch {
      // ignore
    }
  }, [])

  // Magic links often land on / with no ?redirect= — persist intended /teacher/* path for LoginPage.
  useEffect(() => {
    if (!authHydrated || isLoggedIn) return
    const target = `${location.pathname}${location.search ?? ''}`
    if (target.startsWith('/teacher')) {
      setPostLoginRedirect(target)
    }
  }, [authHydrated, isLoggedIn, location.pathname, location.search])

  useEffect(() => {
    if (!isLoggedIn) return
    clearPostLoginRedirect()
  }, [isLoggedIn])

  if (!authHydrated) {
    return (
      <div className="teacher-hub teacher-hub--loading page-narrow">
        <p className="muted">{t('teacherHub.checkingSession')}</p>
      </div>
    )
  }

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?redirect=${redirect}`} replace />
  }

  return (
    <div className="teacher-hub page-narrow">
      <header className="teacher-hub__masthead">
        <h1 className="teacher-hub__title">{t('teacherHub.title')}</h1>
        <p className="teacher-hub__subtitle muted">{t('teacherHub.subtitle')}</p>
        <nav className="teacher-hub__tabs" aria-label={t('teacherHub.navAria')}>
          <NavLink
            to="/teacher/dashboard"
            className={({ isActive }) =>
              `teacher-hub__tab${isActive ? ' teacher-hub__tab--active' : ''}`
            }
          >
            {t('teacherHub.tabOverview')}
          </NavLink>
          <NavLink
            to="/teacher/generator"
            className={({ isActive }) =>
              `teacher-hub__tab${isActive ? ' teacher-hub__tab--active' : ''}`
            }
          >
            {t('teacherHub.tabGenerator')}
          </NavLink>
        </nav>
      </header>
      <div className="teacher-hub__body">
        <Outlet />
      </div>
    </div>
  )
}

export default TeacherHubLayout
