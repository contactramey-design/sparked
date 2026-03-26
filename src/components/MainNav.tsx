import React, { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ALL_AGE_BANDS, type AgeBandId } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAuth } from '@/AuthContext'

type NavKey = 'academy' | 'shop'

type Props = {
  variant: 'consumer' | 'school'
}

/**
 * Two top-level nav items (Academy + Shop) with disclosure-style dropdowns.
 * Touch targets ≥ 48px; Escape and outside-click close panels.
 */
export default function MainNav({ variant }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { setAgeBand, ageBand } = useAgeBand()
  const { isLoggedIn, kidLock } = useAuth()
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
      <SectionLabel>{t('nav.sectionLearn')}</SectionLabel>
      <ItemLink to="/tracks">{t('nav.academyAllCourses')}</ItemLink>
      <ItemLink to="/track/social-safety">{t('nav.academySafety')}</ItemLink>
      <ItemLink to="/track/ai-coding">{t('nav.academyAiCoding')}</ItemLink>
      <ItemLink to="/weekly">{t('nav.academyWeekly')}</ItemLink>
      <ItemLink to="/homework">{t('nav.academyHomework')}</ItemLink>
      <SectionLabel>{t('nav.sectionForSchools')}</SectionLabel>
      <ItemLink to="/for-schools">{t('nav.academyForSchoolsOverview')}</ItemLink>
      <ItemLink to="/schools">{t('nav.schoolSchoolHub')}</ItemLink>
      <ItemLink to="/teacher/dashboard">{t('nav.schoolTeacher')}</ItemLink>
      <ItemLink to="/teacher/generator">{t('nav.schoolGenerator')}</ItemLink>
      <ItemLink to="/compliance">{t('nav.schoolCompliance')}</ItemLink>
      <SectionLabel>{t('nav.sectionGrownups')}</SectionLabel>
      {!isLoggedIn && <ItemLink to="/login">{t('nav.academySignIn')}</ItemLink>}
      {isLoggedIn && !kidLock && <ItemLink to="/?view=parent">{t('nav.academyParent')}</ItemLink>}
    </>
  )

  const consumerShop = (
    <>
      <SectionLabel>{t('nav.sectionShop')}</SectionLabel>
      <ItemLink to="/shop">{t('nav.shopEbooks')}</ItemLink>
      <ItemLink to="/shop#merch-coming-soon">{t('nav.shopMerch')}</ItemLink>
      <ItemLink to="/?view=parent">{t('nav.shopSubscription')}</ItemLink>
    </>
  )

  const schoolAcademy = (
    <>
      <ItemLink to="/">{t('nav.schoolFamilyHome')}</ItemLink>
      <ItemLink to="/for-schools">{t('nav.schoolForSchoolsHub')}</ItemLink>
      <ItemLink to="/compliance">{t('nav.schoolCompliance')}</ItemLink>
      <ItemLink to="/schools">{t('nav.schoolSchoolHub')}</ItemLink>
      <ItemLink to="/teacher/dashboard">{t('nav.schoolTeacher')}</ItemLink>
      <ItemLink to="/teacher/generator">{t('nav.schoolGenerator')}</ItemLink>
    </>
  )

  const schoolShop = (
    <>
      <ItemLink to="/shop">{t('nav.schoolShopMaterials')}</ItemLink>
      <ItemLink to="/contact">{t('nav.schoolContact')}</ItemLink>
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
          {renderDropdown('shop', t('nav.shop'), consumerShop)}
        </>
      ) : (
        <>
          {renderDropdown('academy', t('nav.academy'), schoolAcademy)}
          {renderDropdown('shop', t('nav.shop'), schoolShop)}
        </>
      )}
    </nav>
  )
}
