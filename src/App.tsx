import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { appConfig } from './config'
import { AuthProvider, useAuth } from './AuthContext'
import { LocaleProvider, useTranslation } from './contexts/LocaleContext'
import ProtectedRoute from './ProtectedRoute'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import LessonPage from './Lesson'
import TrackListPage from './TrackListPage'
import TrackPage from './TrackPage'
import UnitPage from './UnitPage'
import ComingSoon from './ComingSoon'
import HomeworkAdventurePage from './HomeworkAdventurePage'
import PrivacyPage from './PrivacyPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import './App.css'

function SkipToMainLabel() {
  const { t } = useTranslation()
  return <>{t('header.skipToMain')}</>
}

function LangSwitcher() {
  const { locale, setLocale } = useTranslation()
  return (
    <button
      type="button"
      onClick={() => setLocale((prev) => (prev === 'en' ? 'es' : 'en'))}
      className="lang-switcher"
      aria-label={locale === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'}
      title={locale === 'en' ? 'Español' : 'English'}
    >
      <span className="lang-switcher-icon" aria-hidden>🌐</span>
      <span className="lang-switcher-text">{locale === 'en' ? 'EN' : 'ES'}</span>
    </button>
  )
}

function AppHeader() {
  const location = useLocation()
  const { isLoggedIn, logout, kidLock } = useAuth()
  const { t } = useTranslation()
  const isHome = location.pathname === '/'
  const isLogin = location.pathname === '/login'

  if (isHome || isLogin) {
    return (
      <header className="app-header">
        <div className="logo-placeholder" aria-hidden>🤖 SpArki</div>
        <div className="app-titles">
          <h1>{t('header.appName')}</h1>
          <p>{t('header.tagline')}</p>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          {isHome && !isLoggedIn && (
            <>
              <Link to="/login">{t('header.signIn')}</Link>
              <LangSwitcher />
            </>
          )}
          {isLogin && (
            <>
              <Link to="/">{t('header.home')}</Link>
              <LangSwitcher />
            </>
          )}
          {isHome && isLoggedIn && (
            <>
              <Link to="/">{t('header.home')}</Link>
              <Link to="/tracks">{t('header.courses')}</Link>
              {!kidLock && <Link to="/?view=parent">{t('header.parent')}</Link>}
              <LangSwitcher />
              <button
                type="button"
                onClick={logout}
                className="nav-button"
                aria-label={t('header.signOut')}
              >
                {t('header.signOut')}
              </button>
            </>
          )}
        </nav>
      </header>
    )
  }

  return (
    <header className="app-header">
      <Link to="/" className="logo-placeholder" aria-label="SpArki home">
        🤖 SpArki
      </Link>
      <div className="app-titles">
        <h1>{t('header.appName')}</h1>
        <p>{t('header.tagline')}</p>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">{t('header.home')}</Link>
        <Link to="/tracks">{t('header.courses')}</Link>
        {!kidLock && <Link to="/?view=parent">{t('header.parent')}</Link>}
        <LangSwitcher />
        <button
          type="button"
          onClick={logout}
          className="nav-button"
          aria-label={t('header.signOut')}
        >
          {t('header.signOut')}
        </button>
      </nav>
    </header>
  )
}

function AppFooter() {
  const { kidLock } = useAuth()
  const { t } = useTranslation()
  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
      </small>
      <span className="app-footer-links">
        <Link to="/about">{t('footer.about')}</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
        <Link to="/contact">{t('footer.contact')}</Link>
      </span>
      {kidLock && (
        <Link to="/parent" className="footer-grownup-link" aria-label={t('footer.grownUp')}>
          {t('footer.grownUp')}
        </Link>
      )}
    </footer>
  )
}

const App: React.FC = () => {
  const themeStyle = {
    '--primary-color': appConfig.theme.primaryColor,
    '--secondary-color': appConfig.theme.secondaryColor,
    '--background-color': appConfig.theme.backgroundColor,
    '--text-color': appConfig.theme.textColor,
    '--accent-color': appConfig.theme.accentColor,
  } as React.CSSProperties

  return (
    <BrowserRouter>
      <AuthProvider>
        <LocaleProvider>
        <div className="app" style={themeStyle}>
          <a href="#app-main" className="skip-link">
            <SkipToMainLabel />
          </a>
          <AppHeader />
          <main id="app-main" className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Navigate to="/" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracks"
                element={
                  <ProtectedRoute>
                    <TrackListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track/:trackId"
                element={
                  <ProtectedRoute>
                    <TrackPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/unit/:unitId"
                element={
                  <ProtectedRoute>
                    <UnitPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lesson/:id"
                element={
                  <ProtectedRoute>
                    <LessonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homework"
                element={
                  <ProtectedRoute>
                    <HomeworkAdventurePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent"
                element={
                  <ProtectedRoute>
                    <Navigate to="/?view=parent" replace />
                  </ProtectedRoute>
                }
              />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <AppFooter />
        </div>
        </LocaleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App