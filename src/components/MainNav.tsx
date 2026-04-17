import React, { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ALL_AGE_BANDS, type AgeBandId } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAuth } from '@/AuthContext'
import { isTeacherUser } from '@/lib/supabaseUserRole'

type NavKey = 'academy' | 'practice' | 'shop'

type Props = {
  variant: 'consumer' | 'school'
  /** When true on consumer routes, show Academy only (e.g. school mode — shop hidden without duplicating school header links). */
  hideShop?: boolean
}

/**
 * Consumer: Academy + Shop dropdowns. School theme: single menu (no shop) + internet safety links.
 * Touch targets ≥ 48px; Escape and outside-click close panels.
 */
export default function MainNav({ variant, hideShop = false }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { setAgeBand, ageBand } = useAgeBand()
  const { isLoggedIn, kidLock, user } = useAuth()
  const [open, setOpen] = useState<NavKey | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  useEffect(() => {
    setOpen(null)
  }, [location.pathname, location.search])

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

  const pickBand = (band: AgeBandId) => {
    setAgeBand(band)
    navigate('/tracks')
    setOpen(null)
  }

  const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="nav-dropdown-section-label">{children}</p>
  )

  const NavDivider: React.FC = () => <div className="nav-dropdown-divider" role="presentation" />

  const ItemLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <Link to={to} className="nav-dropdown-link" onClick={() => setOpen(null)}>
      {children}
    </Link>
  )

  const consumerAcademy = (
    <>
      <SectionLabel>{t('nav.sectionAgeBand')}</SectionLabel>
      <div className="nav-dropdown-band-row" role="group" aria-label={t('nav.sectionAgeBand')}>
        {ALL_AGE_BANDS.map((band) => (
          <button
            key={band}
            type="button"
            className={`nav-dropdown-band-btn ${ageBand === band ? 'nav-dropdown-band-btn--active' : ''}`}
            onClick={() => pickBand(band)}
          >
            <span className="nav-dropdown-band-name">{t(`ageBand.names.${band}.short`)}</span>
            <span className="nav-dropdown-band-ages">{t(`ageBand.names.${band}.ages`)}</span>
          </button>
        ))}
      </div>
      <NavDivider />
      <ItemLink to="/tracks">{t('nav.academyAllCourses')}</ItemLink>
      <ItemLink to="/track/social-safety">{t('nav.academySafety')}</ItemLink>
      <ItemLink to="/track/ai-coding">{t('nav.academyAiCoding')}</ItemLink>
      <ItemLink to="/weekly">{t('nav.academyWeekly')}</ItemLink>
      <ItemLink to="/homework">{t('nav.academyHomework')}</ItemLink>
      <ItemLink to="/ai-tutor">{t('nav.academyAiTutor')}</ItemLink>
      <NavDivider />
      <SectionLabel>{t('nav.sectionGrownups')}</SectionLabel>
      {!isLoggedIn && <ItemLink to="/login">{t('nav.academySignIn')}</ItemLink>}
      {isLoggedIn && !kidLock && <ItemLink to="/?view=parent">{t('nav.academyParent')}</ItemLink>}
    </>
  )

  const consumerPractice = (
    <>
      <p className="nav-dropdown-blurb muted text-sm leading-snug">{t('nav.practiceBlurb')}</p>
      <p className="nav-dropdown-blurb muted text-xs leading-snug mt-1">{t('nav.practiceStructuredNote')}</p>
      <NavDivider />
      <ItemLink to="/practice">{t('nav.practiceAllSubjects')}</ItemLink>
      <SectionLabel>{t('nav.practiceCoreLabel')}</SectionLabel>
      <ItemLink to="/practice/math">{t('nav.practiceMath')}</ItemLink>
      <ItemLink to="/practice/english">{t('nav.practiceEnglish')}</ItemLink>
      <ItemLink to="/practice/science">{t('nav.practiceScience')}</ItemLink>
      <ItemLink to="/practice/history">{t('nav.practiceHistory')}</ItemLink>
    </>
  )

  const consumerShop = (
    <>
      <ItemLink to="/shop">{t('nav.shopEbooks')}</ItemLink>
      <NavDivider />
      <p className="nav-dropdown-blurb muted text-xs leading-snug">{t('nav.shopParentHint')}</p>
      <ItemLink to="/?view=parent">{t('footer.parentDashboard')}</ItemLink>
    </>
  )

  const showTeacherLinks = isLoggedIn && user && isTeacherUser(user)
  const showTeacherSignIn = !isLoggedIn

  const schoolAcademy = (
    <>
      <ItemLink to="/">{t('nav.schoolFamilyHome')}</ItemLink>
      <ItemLink to="/practice">{t('nav.schoolSubjectsHub')}</ItemLink>
      <ItemLink to="/schools/parent">{t('nav.schoolPilotClassJoin')}</ItemLink>
      <NavDivider />
      <ItemLink to="/track/social-safety">{t('nav.academySafety')}</ItemLink>
      <ItemLink to="/track/ai-coding">{t('nav.academyAiCoding')}</ItemLink>
      <NavDivider />
      <ItemLink to="/for-schools">{t('nav.schoolForSchoolsOverview')}</ItemLink>
      <ItemLink to="/compliance">{t('nav.schoolCompliance')}</ItemLink>
      {showTeacherLinks || showTeacherSignIn ? <NavDivider /> : null}
      {showTeacherLinks ? <ItemLink to="/teacher/dashboard">{t('nav.schoolTeacher')}</ItemLink> : null}
      {showTeacherLinks ? <ItemLink to="/teacher/generator">{t('nav.schoolGenerator')}</ItemLink> : null}
      {showTeacherSignIn ? (
        <ItemLink to="/login?redirect=%2Fteacher%2Fdashboard">{t('nav.teacherSignIn')}</ItemLink>
      ) : null}
      {isLoggedIn && !kidLock ? (
        <>
          <NavDivider />
          <ItemLink to="/?view=parent">{t('footer.parentDashboard')}</ItemLink>
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
        <div
          id={panelId}
          role="region"
          className="nav-dropdown-panel"
          hidden={!isOpen}
        >
          {panel}
        </div>
      </div>
    )
  }

  return (
    <nav className="main-nav main-nav--two-tier" aria-label={t('nav.mainAriaLabel')} ref={wrapRef}>
      {variant === 'consumer' ? (
        <>
          {renderDropdown('academy', t('nav.academy'), consumerAcademy)}
          {renderDropdown('practice', t('nav.practice'), consumerPractice)}
          {!hideShop ? renderDropdown('shop', t('nav.shop'), consumerShop) : null}
        </>
      ) : (
        <>{renderDropdown('academy', t('nav.schoolMenuSchool'), schoolAcademy)}</>
      )}
    </nav>
  )
}
