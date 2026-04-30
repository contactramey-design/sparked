import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { practicePathFromLegacySchoolSubjectsPath } from './lib/practiceRoutes'
import { appConfig } from './config'
import { AuthProvider } from './AuthContext'
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
import HomeworkAdventureVideoPage from './features/homework/pages/HomeworkAdventureVideoPage'
import TutorFunnelPage from './ai-tutor/TutorFunnelPage'
import BooksPage from './BooksPage'
import EbookViewerPage from './EbookViewerPage'
import PrivacyPage from './PrivacyPage'
import AboutPage from './AboutPage'
import ContactPage from './ContactPage'
import FaqMarketingPage from './features/marketing/FaqMarketingPage'
import BlogMarketingPage from './features/marketing/BlogMarketingPage'
import BlogPostMarketingPage from './features/marketing/BlogPostMarketingPage'
import ServicesMarketingPage from './features/marketing/ServicesMarketingPage'
import ServiceDetailsMarketingPage from './features/marketing/ServiceDetailsMarketingPage'
import PortfolioMarketingPage from './features/marketing/PortfolioMarketingPage'
import HomeTwoMarketingPage from './features/marketing/HomeTwoMarketingPage'
import CompliancePage from './CompliancePage'
import ForSchoolsPage from './ForSchoolsPage'
import SchoolPrintResourcePage from './SchoolPrintResourcePage'
import SchoolOnePagerPage from './SchoolOnePagerPage'
import TeacherHubLayout from './TeacherHubLayout'
import TeacherDashboardPage from './TeacherDashboardPage'
import TeacherWeeklyGeneratorPage from './TeacherWeeklyGeneratorPage.tsx'
import SchoolParentPage from './SchoolParentPage'
import ParentRedirect from './ParentRedirect'
import { AppShellFooter } from './design-system/components/AppShellFooter'
import { AppShellHeader } from './design-system/components/AppShellHeader'
import InstallOnIpadBanner from './components/InstallOnIpadBanner'
import OfflineBanner from './components/OfflineBanner'
import { isSchoolShellPath } from './lib/schoolShell'
import SchoolWeeklyTrackPage from './SchoolWeeklyTrackPage.tsx'
import SchoolGeneratedUnitPage from './SchoolGeneratedUnitPage.tsx'
import SchoolSubjectsHubPage from './school/subjects/SchoolSubjectsHubPage'
import SchoolSubjectTrackPage from './school/subjects/SchoolSubjectTrackPage'
import SchoolSubjectLessonPage from './school/subjects/SchoolSubjectLessonPage'
import { SchoolAlignmentHubPage, SchoolAlignmentSubjectPage } from './school/subjects/SchoolAlignmentPages'
import SchoolMathLegacyRedirect from './school/subjects/SchoolMathLegacyRedirect'
import DailySparkQuestPage from './DailySparkQuestPage'
import PricingPage from './PricingPage'
import AdventureMapPlaceholderPage from './AdventureMapPlaceholderPage'
import ParentGuidePage from './ParentGuidePage'
import './App.css'

function LegacySchoolSubjectsRedirect() {
  const loc = useLocation()
  const to = practicePathFromLegacySchoolSubjectsPath(loc.pathname) ?? '/practice'
  return <Navigate to={`${to}${loc.search}${loc.hash}`} replace />
}

function SkipToMainLabel() {
  const { t } = useTranslation()
  return <>{t('header.skipToMain')}</>
}

function AiTutorToTutorRedirect() {
  const [searchParams] = useSearchParams()
  const q = searchParams.toString()
  return <Navigate to={q ? `/tutor?${q}` : '/tutor'} replace />
}

function AppShell() {
  const location = useLocation()

  // Theme rule:
  // - Orange on `/for-schools`, `/teacher/*`, `/compliance`, and `/schools/*` (pilot + class flows)
  // - Consumer blue on home, tracks, `/practice`, etc.
  // Note: `schoolMode` hides shop without changing pathname; it does not recolor by itself.
  const useSchoolTheme = isSchoolShellPath(location.pathname)
  const tutorStandalone = location.pathname === '/tutor'

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
      {!tutorStandalone ? (
        <a href="#app-main" className="skip-link">
          <SkipToMainLabel />
        </a>
      ) : null}
      {!tutorStandalone ? <InstallOnIpadBanner /> : null}
      {!tutorStandalone ? <OfflineBanner /> : null}
      {!tutorStandalone ? <AppShellHeader /> : null}
      <main
        id="app-main"
        className={
          tutorStandalone
            ? 'app-main app-main--tutor-standalone min-h-[100dvh] max-w-none p-0'
            : useSchoolTheme
              ? 'app-main font-school'
              : 'app-main app-main--ascent'
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/home-2" element={<HomeTwoMarketingPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/faq" element={<FaqMarketingPage />} />
          <Route path="/blog" element={<BlogMarketingPage />} />
          <Route path="/blog-details" element={<Navigate to="/blog/internet-safety" replace />} />
          <Route path="/blog/:slug" element={<BlogPostMarketingPage />} />
          <Route path="/services" element={<ServicesMarketingPage />} />
          <Route path="/service-details" element={<ServiceDetailsMarketingPage />} />
          <Route path="/portfolio" element={<PortfolioMarketingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
          <Route path="/weekly" element={<Navigate to="/homework" replace />} />
          <Route path="/daily" element={<DailySparkQuestPage />} />
          <Route path="/adventure-map" element={<AdventureMapPlaceholderPage />} />
          <Route path="/tracks" element={<TrackListPage />} />
          <Route path="/track/:trackId" element={<TrackPage />} />
          <Route path="/unit/:unitId" element={<UnitPage />} />
          <Route path="/lesson/:id" element={<LessonPage />} />
          <Route path="/homework" element={<HomeworkFeatureLayout />}>
            <Route index element={<HomeworkHome />} />
            <Route path="upload" element={<HomeworkUpload />} />
            <Route path="result/:jobId" element={<HomeworkResult />} />
            <Route path="history" element={<HomeworkHistory />} />
            <Route path="adventure-video" element={<HomeworkAdventureVideoPage />} />
          </Route>
          <Route path="/tutor" element={<TutorFunnelPage />} />
          <Route path="/ai-tutor" element={<AiTutorToTutorRedirect />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/coding-lab" element={<Navigate to="/tutor?focus=ai-literacy" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/shop" element={<BooksPage />} />
          <Route path="/ebook/:ebookId" element={<EbookViewerPage />} />
          <Route path="/ebook" element={<EbookViewerPage />} />
          <Route path="/parent" element={<ParentRedirect />} />
          <Route path="/parent-guide" element={<ParentGuidePage />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/for-schools" element={<ForSchoolsPage />} />
          <Route path="/for-schools/resources/:slug" element={<SchoolPrintResourcePage />} />
          <Route path="/for-schools/one-pager" element={<SchoolOnePagerPage />} />
          <Route path="/schools" element={<Navigate to="/" replace />} />
          <Route path="/schools/parent" element={<SchoolParentPage />} />
          <Route path="/schools/subjects/*" element={<LegacySchoolSubjectsRedirect />} />
          <Route path="/practice/:subjectId/:lessonId" element={<SchoolSubjectLessonPage />} />
          <Route path="/practice/:subjectId" element={<SchoolSubjectTrackPage />} />
          <Route path="/practice" element={<SchoolSubjectsHubPage />} />
          <Route path="/schools/alignment/:subjectId" element={<SchoolAlignmentSubjectPage />} />
          <Route path="/schools/alignment" element={<SchoolAlignmentHubPage />} />
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
      {!tutorStandalone ? <AppShellFooter /> : null}
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