import { Link, useLocation } from 'react-router-dom'
import SparkiAvatar from '@/components/SparkiAvatar'
import MainNav from '@/components/MainNav'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolShopHidden } from '@/hooks/useSchoolMode'
import { isSchoolShellPath } from '@/lib/schoolShell'
import { cn } from '@/lib/utils'

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

  return (
    <header className={cn('app-header')}>
      <Link to="/" className="logo-placeholder flex min-h-[52px] items-center gap-2" aria-label={t('header.home')}>
        <SparkiAvatar size="sm" />
      </Link>
      <div className="app-titles">
        <h1>{t('header.appName')}</h1>
        <p className={cn('app-header-tagline', 'hidden sm:block')}>{t('header.tagline')}</p>
      </div>
      <div className="header-nav-cluster">
        {!isSchoolRoute ? (
          <Link to="/for-schools" className="header-for-schools-badge" aria-label={t('header.forSchools')}>
            {t('header.forSchools')}
          </Link>
        ) : (
          <Link to="/schools" className="header-for-schools-badge" aria-label={t('header.schoolHubLink')}>
            {t('header.schoolHubLink')}
          </Link>
        )}
        <MainNav variant={mainNavVariant} hideShop={hideShopOnConsumer} />
        <LangSwitcher />
      </div>
    </header>
  )
}
