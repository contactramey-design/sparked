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
import HomeworkFeatureLayout from './features/homework/pages/HomeworkFeatureLayout'
import HomeworkHome from './features/homework/pages/HomeworkHome'
import HomeworkUpload from './features/homework/pages/HomeworkUpload'
import HomeworkResult from './features/homework/pages/HomeworkResult'
import HomeworkHistory from './features/homework/pages/HomeworkHistory'
import BooksPage from './BooksPage'
import EbookViewerPage from './EbookViewerPage'
import PrivacyPage from './PrivacyPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import CompliancePage from './CompliancePage'
import ForSchoolsPage from './ForSchoolsPage'
import SchoolPrintResourcePage from './SchoolPrintResourcePage'
import SchoolOnePagerPage from './SchoolOnePagerPage'
import TeacherHubLayout from './TeacherHubLayout'
import TeacherDashboardPage from './TeacherDashboardPage'
import TeacherWeeklyGeneratorPage from './TeacherWeeklyGeneratorPage.tsx'
import SchoolsPage from './SchoolsPage'
import SchoolParentPage from './SchoolParentPage'
import ParentRedirect from './ParentRedirect'
import SparkiAvatar from './components/SparkiAvatar'
import MainNav from './components/MainNav'
import InstallOnIpadBanner from './components/InstallOnIpadBanner'
import OfflineBanner from './components/OfflineBanner'
import { useSchoolShopHidden } from './hooks/useSchoolMode'
import { isSchoolShellPath } from './lib/schoolShell'
import SchoolWeeklyTrackPage from './SchoolWeeklyTrackPage.tsx'
import SchoolGeneratedUnitPage from './SchoolGeneratedUnitPage.tsx'
import SchoolSubjectsHubPage from './school/subjects/SchoolSubjectsHubPage'
import SchoolSubjectTrackPage from './school/subjects/SchoolSubjectTrackPage'
import SchoolSubjectLessonPage from './school/subjects/SchoolSubjectLessonPage'
import { SchoolAlignmentHubPage, SchoolAlignmentSubjectPage } from './school/subjects/SchoolAlignmentPages'
import SchoolMathLegacyRedirect from './school/subjects/SchoolMathLegacyRedirect'
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
  const isSchoolRoute = isSchoolShellPath(location.pathname)
  const schoolShopHidden = useSchoolShopHidden()
  // School dropdown belongs on shell routes only; school mode on home still uses consumer nav (one header CTA).
  const mainNavVariant = isSchoolRoute ? 'school' : 'consumer'
  const hideShopOnConsumer = schoolShopHidden && !isSchoolRoute

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
        {!isSchoolRoute ? (
          <Link
            to="/for-schools"
            className="header-for-schools-badge"
            aria-label={t('header.forSchools')}
          >
            {t('header.forSchools')}
          </Link>
        ) : (
          <Link
            to="/schools"
            className="header-for-schools-badge"
            aria-label={t('header.schoolHubLink')}
          >
            {t('header.schoolHubLink')}
          </Link>
        )}
        <MainNav variant={mainNavVariant} hideShop={hideShopOnConsumer} />
        <LangSwitcher />
      </div>
    </header>
  )
}

function AppFooter() {
  const { kidLock, isLoggedIn, signOut } = useAuth()
  const { t } = useTranslation()
  const schoolShopHidden = useSchoolShopHidden()
  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
      </small>
      <span className="app-footer-links">
        {!schoolShopHidden && <Link to="/shop">{t('footer.shop')}</Link>}
        <Link to="/about">{t('footer.about')}</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
        <Link to="/for-schools">{t('footer.forSchools')}</Link>
        <Link to="/contact">{t('footer.contact')}</Link>
        {schoolShopHidden && <Link to="/schools/parent">{t('footer.schoolParentHub')}</Link>}
        {isLoggedIn && !kidLock && (
          <Link to="/parent">{t('footer.parentDashboard')}</Link>
        )}
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
  const useSchoolTheme = isSchoolShellPath(location.pathname)

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
          <Route path="/home" element={<Navigate to="/" replace />} />
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
          <Route path="/homework" element={<HomeworkFeatureLayout />}>
            <Route index element={<HomeworkHome />} />
            <Route path="upload" element={<HomeworkUpload />} />
            <Route path="result/:jobId" element={<HomeworkResult />} />
            <Route path="history" element={<HomeworkHistory />} />
          </Route>
          <Route path="/books" element={<BooksPage />} />
          <Route path="/shop" element={<BooksPage />} />
          <Route path="/ebook/:ebookId" element={<EbookViewerPage />} />
          <Route path="/ebook" element={<EbookViewerPage />} />
          <Route path="/parent" element={<ParentRedirect />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/for-schools" element={<ForSchoolsPage />} />
          <Route path="/for-schools/resources/:slug" element={<SchoolPrintResourcePage />} />
          <Route path="/for-schools/one-pager" element={<SchoolOnePagerPage />} />
          <Route path="/schools" element={<SchoolsPage />} />
          <Route path="/schools/parent" element={<SchoolParentPage />} />
          <Route path="/schools/subjects" element={<SchoolSubjectsHubPage />} />
          <Route path="/schools/alignment/:subjectId" element={<SchoolAlignmentSubjectPage />} />
          <Route path="/schools/alignment" element={<SchoolAlignmentHubPage />} />
          <Route path="/schools/subjects/:subjectId/:lessonId" element={<SchoolSubjectLessonPage />} />
          <Route path="/schools/subjects/:subjectId" element={<SchoolSubjectTrackPage />} />
          <Route path="/schools/math" element={<SchoolMathLegacyRedirect />} />
          <Route path="/schools/math/:lessonId" element={<SchoolMathLegacyRedirect />} />
          <Route path="/schools/weekly-track" element={<SchoolWeeklyTrackPage />} />
          <Route path="/schools/unit/:unitId" element={<SchoolGeneratedUnitPage />} />
          <Route path="/teacher" element={<TeacherHubLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboardPage />} />
            <Route path="generator" element={<TeacherWeeklyGeneratorPage />} />
          </Route>
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