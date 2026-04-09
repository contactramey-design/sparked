import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SparkiAvatar from '@/components/SparkiAvatar'
import MainNav from '@/components/MainNav'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolShopHidden } from '@/hooks/useSchoolMode'
import { isSchoolShellPath } from '@/lib/schoolShell'
import { cn } from '@/lib/utils'

const MOBILE_NAV_MQ = '(max-width: 767px)'

function LangSwitcher() {
  const { locale, setLocale, t } = useTranslation()
  return (
    <button
      type="button"
      onClick={() => setLocale((prev) => (prev === 'en' ? 'es' : 'en'))}
      className="lang-switcher"
      aria-label={locale === 'en' ? t('header.langSwitchAriaEn') : t('header.langSwitchAriaEs')}
      title={locale === 'en' ? t('header.langSwitchTitleEn') : t('header.langSwitchTitleEs')}
    >
      <span className="lang-switcher-icon" aria-hidden>
        🌐
      </span>
      <span className="lang-switcher-text">{locale === 'en' ? 'EN' : 'ES'}</span>
    </button>
  )
}

export function AppShellHeader() {
  const location = useLocation()
  const { t } = useTranslation()
  const isSchoolRoute = isSchoolShellPath(location.pathname)
  const schoolShopHidden = useSchoolShopHidden()
  const mainNavVariant = isSchoolRoute ? 'school' : 'consumer'
  const hideShopOnConsumer = schoolShopHidden && !isSchoolRoute

  const [narrowViewport, setNarrowViewport] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_NAV_MQ).matches : false,
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_NAV_MQ)
    const onChange = () => {
      setNarrowViewport(mq.matches)
      if (!mq.matches) setMobileMenuOpen(false)
    }
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!narrowViewport || !mobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [narrowViewport, mobileMenuOpen])

  const navProps: { variant: 'consumer' | 'school'; hideShop: boolean } = {
    variant: mainNavVariant,
    hideShop: hideShopOnConsumer,
  }

  return (
    <>
      <header className={cn('app-header')}>
        <Link to="/" className="logo-placeholder flex min-h-[52px] items-center gap-2" aria-label={t('header.home')}>
          <SparkiAvatar size="sm" />
        </Link>
        <div className="app-titles">
          <h1>{t('header.appName')}</h1>
          <p className={cn('app-header-tagline', 'hidden sm:block')}>{t('header.tagline')}</p>
        </div>
        <div className="header-nav-cluster">
          {isSchoolRoute ? (
            <Link to="/" className="header-for-schools-badge" aria-label={t('header.academyHomeAria')}>
              {t('header.academyHome')}
            </Link>
          ) : null}

          {!narrowViewport ? (
            <div className="header-nav-desktop">
              <MainNav {...navProps} />
              <LangSwitcher />
            </div>
          ) : (
            <div className="header-nav-mobile-only">
              <button
                type="button"
                className="header-mobile-menu-trigger"
                aria-expanded={mobileMenuOpen}
                aria-controls="header-mobile-menu"
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                <span className="sr-only">
                  {mobileMenuOpen ? t('header.mobileMenuClose') : t('header.mobileMenuOpen')}
                </span>
                <span className="header-mobile-menu-icon" aria-hidden>
                  {mobileMenuOpen ? '✕' : '☰'}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      {narrowViewport && mobileMenuOpen ? (
        <>
          <button
            type="button"
            className="header-mobile-backdrop"
            aria-label={t('header.mobileMenuClose')}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="header-mobile-menu"
            className="header-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label={t('header.mobileMenuTitle')}
          >
            <div className="header-mobile-panel-inner">
              <MainNav {...navProps} />
              <div className="header-mobile-lang-row">
                <LangSwitcher />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
