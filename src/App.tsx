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
import { AgeBandProvider } from './contexts/AgeBandContext'
import ProtectedRoute from './ProtectedRoute'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import LessonPage from './Lesson'
import TrackListPage from './TrackListPage'
import TrackPage from './TrackPage'
import UnitPage from './UnitPage'
import ComingSoon from './ComingSoon'
import HomeworkAdventurePage from './HomeworkAdventurePage'
import BooksPage from './BooksPage'
import EbookViewerPage from './EbookViewerPage'
import PrivacyPage from './PrivacyPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import CompliancePage from './CompliancePage'
import ForSchoolsPage from './ForSchoolsPage'
import SchoolPrintResourcePage from './SchoolPrintResourcePage'
import SchoolOnePagerPage from './SchoolOnePagerPage'
import TeacherDashboardPage from './TeacherDashboardPage'
import TeacherWeeklyGeneratorPage from './TeacherWeeklyGeneratorPage.tsx'
import SchoolsPage from './SchoolsPage'
import SparkiAvatar from './components/SparkiAvatar'
import MainNav from './components/MainNav'
import InstallOnIpadBanner from './components/InstallOnIpadBanner'
import OfflineBanner from './components/OfflineBanner'
import { useSchoolMode } from './hooks/useSchoolMode'
import SchoolWeeklyTrackPage from './SchoolWeeklyTrackPage.tsx'
import SchoolGeneratedUnitPage from './SchoolGeneratedUnitPage.tsx'
import WeeklyAdventurePage from './WeeklyAdventurePage'
import './App.css'

function SkipToMainLabel() {
  const { t } = useTranslation()
  return <>{t('header.skipToMain')}</>
}

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
      <span className="lang-switcher-icon" aria-hidden>🌐</span>
      <span className="lang-switcher-text">{locale === 'en' ? 'EN' : 'ES'}</span>
    </button>
  )
}

function AppHeader() {
  const location = useLocation()
  const { t } = useTranslation()
  const isSchoolRoute =
    location.pathname.startsWith('/schools') ||
    location.pathname.startsWith('/for-schools') ||
    location.pathname.startsWith('/compliance') ||
    location.pathname.startsWith('/teacher')

  return (
    <header className="app-header">
      <Link to="/" className="logo-placeholder flex items-center gap-2" aria-label={t('header.home')}>
        <SparkiAvatar size="sm" />
      </Link>
      <div className="app-titles">
        <h1>{t('header.appName')}</h1>
        <p className="app-header-tagline">{t('header.tagline')}</p>
      </div>
      <div className="header-nav-cluster">
        <MainNav variant={isSchoolRoute ? 'school' : 'consumer'} />
        <LangSwitcher />
      </div>
    </header>
  )
}

function AppFooter() {
  const location = useLocation()
  const { kidLock, isLoggedIn, signOut } = useAuth()
  const { t } = useTranslation()
  const { schoolMode } = useSchoolMode()
  const isSchoolRoute =
    location.pathname.startsWith('/schools') ||
    location.pathname.startsWith('/for-schools') ||
    location.pathname.startsWith('/compliance') ||
    location.pathname.startsWith('/teacher')
  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
      </small>
      <span className="app-footer-links">
        {!schoolMode && !isSchoolRoute && <Link to="/shop">{t('footer.shop')}</Link>}
        <Link to="/about">{t('footer.about')}</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
        <Link to="/for-schools">{t('footer.forSchools')}</Link>
        <Link to="/contact">{t('footer.contact')}</Link>
        {isLoggedIn && !kidLock && (
          <button type="button" className="footer-link-button" onClick={() => void signOut()}>
            {t('header.signOut')}
          </button>
        )}
      </span>
      {kidLock && (
        <Link to="/parent" className="footer-grownup-link" aria-label={t('footer.grownUp')}>
          {t('footer.grownUp')}
        </Link>
      )}
    </footer>
  )
}

function AppShell() {
  const location = useLocation()

  // Theme rule (strict):
  // - Orange ONLY on actual school routes (`/schools`, `/for-schools`, `/teacher/*`, `/compliance`)
  // - Everything else (home + regular parent customer experience) stays BLUE
  // Note: `schoolMode` toggle is for navigation/UI behavior; it should not recolor Home.
  const useSchoolTheme =
    location.pathname.startsWith('/schools') ||
    location.pathname.startsWith('/for-schools') ||
    location.pathname.startsWith('/teacher') ||
    location.pathname.startsWith('/compliance')

  const theme = useSchoolTheme
    ? {
        primaryColor: '#fb923c',
        secondaryColor: '#fdba74',
        backgroundColor: '#fff7ed',
        textColor: '#7c2d12',
        accentColor: '#ea580c',
      }
    : appConfig.theme

  const themeStyle = {
    '--primary-color': theme.primaryColor,
    '--secondary-color': theme.secondaryColor,
    '--background-color': theme.backgroundColor,
    '--text-color': theme.textColor,
    '--accent-color': theme.accentColor,
  } as React.CSSProperties

  return (
    <div className="app" style={themeStyle} data-school-theme={useSchoolTheme ? 'true' : 'false'}>
      <a href="#app-main" className="skip-link">
        <SkipToMainLabel />
      </a>
      <InstallOnIpadBanner />
      <OfflineBanner />
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
          <Route path="/weekly" element={<WeeklyAdventurePage />} />
          <Route path="/tracks" element={<TrackListPage />} />
          <Route path="/track/:trackId" element={<TrackPage />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/homework" element={<HomeworkAdventurePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/shop" element={<BooksPage />} />
          <Route path="/ebook/:ebookId" element={<EbookViewerPage />} />
          <Route path="/ebook" element={<EbookViewerPage />} />
          <Route path="/parent" element={<Navigate to="/?view=parent" replace />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/for-schools" element={<ForSchoolsPage />} />
          <Route path="/for-schools/resources/:slug" element={<SchoolPrintResourcePage />} />
          <Route path="/for-schools/one-pager" element={<SchoolOnePagerPage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/schools/weekly-track" element={<SchoolWeeklyTrackPage />} />
          <Route path="/schools/unit/:unitId" element={<SchoolGeneratedUnitPage />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/generator" element={<TeacherWeeklyGeneratorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocaleProvider>
        <AgeBandProvider>
          <AppShell />
        </AgeBandProvider>
      </LocaleProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App