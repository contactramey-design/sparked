import React, { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAuth } from '@/AuthContext'
import { isTeacherUser } from '@/lib/supabaseUserRole'

type NavKey = 'academy'

type Props = {
  variant: 'consumer' | 'school'
  /** Kept for AppShellHeader API compatibility. */
  hideShop?: boolean
}

const consumerNavLinkClass =
  'inline-flex min-h-[48px] items-center rounded-xl px-3 text-sm font-bold text-slate-800 hover:bg-teal-50 hover:text-teal-900 sm:px-4 sm:text-base'

function NavDividerStatic() {
  return <div className="nav-dropdown-divider" role="presentation" />
}

/**
 * Consumer: Home, Tutor, Pricing. School theme: pilot menu.
 */
export default function MainNav({ variant }: Props) {
  const { t } = useTranslation()
  const location = useLocation()
  const { isLoggedIn, kidLock, user } = useAuth()
  const [open, setOpen] = useState<NavKey | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const close = () => setOpen(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close dropdowns when the route changes
    setOpen(null)
  }, [location.pathname, location.search])

  const consumerFlat = (
    <>
      <Link
        to="/"
        className={consumerNavLinkClass}
        aria-current={location.pathname === '/' ? 'page' : undefined}
      >
        {t('marketingFunnel.navHome')}
      </Link>
      <Link
        to="/tutor"
        className={consumerNavLinkClass}
        aria-current={location.pathname === '/tutor' ? 'page' : undefined}
      >
        {t('marketingFunnel.navTutor')}
      </Link>
      <Link
        to="/pricing"
        className={consumerNavLinkClass}
        aria-current={location.pathname === '/pricing' ? 'page' : undefined}
      >
        {t('marketingFunnel.navPricing')}
      </Link>
    </>
  )

  const showTeacherLinks = isLoggedIn && user && isTeacherUser(user)
  const showTeacherSignIn = !isLoggedIn

  const schoolAcademy = (
    <>
      <Link to="/" className="nav-dropdown-link" onClick={close}>
        {t('nav.schoolFamilyHome')}
      </Link>
      <Link to="/practice" className="nav-dropdown-link" onClick={close}>
        {t('nav.schoolSubjectsHub')}
      </Link>
      <Link to="/schools/parent" className="nav-dropdown-link" onClick={close}>
        {t('nav.schoolPilotClassJoin')}
      </Link>
      <NavDividerStatic />
      <Link to="/track/social-safety" className="nav-dropdown-link" onClick={close}>
        {t('nav.academySafety')}
      </Link>
      <Link to="/track/ai-coding" className="nav-dropdown-link" onClick={close}>
        {t('nav.academyAiCoding')}
      </Link>
      <NavDividerStatic />
      <Link to="/for-schools" className="nav-dropdown-link" onClick={close}>
        {t('nav.schoolForSchoolsOverview')}
      </Link>
      <Link to="/compliance" className="nav-dropdown-link" onClick={close}>
        {t('nav.schoolCompliance')}
      </Link>
      {showTeacherLinks || showTeacherSignIn ? <NavDividerStatic /> : null}
      {showTeacherLinks ? (
        <Link to="/teacher/dashboard" className="nav-dropdown-link" onClick={close}>
          {t('nav.schoolTeacher')}
        </Link>
      ) : null}
      {showTeacherLinks ? (
        <Link to="/teacher/generator" className="nav-dropdown-link" onClick={close}>
          {t('nav.schoolGenerator')}
        </Link>
      ) : null}
      {showTeacherSignIn ? (
        <Link to="/login?redirect=%2Fteacher%2Fdashboard" className="nav-dropdown-link" onClick={close}>
          {t('nav.teacherSignIn')}
        </Link>
      ) : null}
      {isLoggedIn && !kidLock ? (
        <>
          <NavDividerStatic />
          <Link to="/?view=parent" className="nav-dropdown-link" onClick={close}>
            {t('footer.parentDashboard')}
          </Link>
        </>
      ) : null}
    </>
  )

  const renderDropdown = (key: NavKey, label: string, panel: React.ReactNode) => {
    const isOpen = open === key
    const panelId = `${baseId}-${key}`
    return (
      <div className="nav-dropdown">
        <button
          type="button"
          className={`nav-dropdown-trigger ${isOpen ? 'nav-dropdown-trigger--open' : ''}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="true"
          id={`${panelId}-btn`}
          onClick={() => setOpen(isOpen ? null : key)}
        >
          <span>{label}</span>
          <span className="nav-dropdown-caret" aria-hidden>
            ▾
          </span>
        </button>
        <div id={panelId} role="region" className="nav-dropdown-panel" hidden={!isOpen}>
          {panel}
        </div>
      </div>
    )
  }

  if (variant === 'consumer') {
    return (
      <nav
        className="main-nav main-nav--flat flex flex-wrap items-center gap-1 sm:gap-2"
        aria-label={t('nav.mainAriaLabel')}
        ref={wrapRef}
      >
        {consumerFlat}
      </nav>
    )
  }

  return (
    <nav className="main-nav main-nav--two-tier" aria-label={t('nav.mainAriaLabel')} ref={wrapRef}>
      {renderDropdown('academy', t('nav.schoolMenuSchool'), schoolAcademy)}
    </nav>
  )
}
