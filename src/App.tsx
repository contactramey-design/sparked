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
import ProtectedRoute from './ProtectedRoute'
import HomePage from './HomePage'
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
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

function AppHeader() {
  const location = useLocation()
  const { isLoggedIn, logout, kidLock } = useAuth()
  const isHome = location.pathname === '/'
  const isLogin = location.pathname === '/login'

  if (isHome || isLogin) {
    return (
      <header className="app-header">
        <div className="logo-placeholder">SpArki</div>
        <div className="app-titles">
          <h1>{appConfig.appName}</h1>
          <p>{appConfig.tagline}</p>
        </div>
        {isHome && !isLoggedIn && (
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/login">Sign in</Link>
          </nav>
        )}
        {isLogin && (
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
          </nav>
        )}
        {isHome && isLoggedIn && (
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/tracks">Courses</Link>
            <Link to="/dashboard">Dashboard</Link>
            {!kidLock && <Link to="/parent">Parent</Link>}
            <button
              type="button"
              onClick={logout}
              className="nav-button"
              aria-label="Sign out"
            >
              Sign out
            </button>
          </nav>
        )}
      </header>
    )
  }

  return (
    <header className="app-header">
      <Link to="/" className="logo-placeholder" aria-label="SpArki home">
        SpArki
      </Link>
      <div className="app-titles">
        <h1>{appConfig.appName}</h1>
        <p>{appConfig.tagline}</p>
      </div>
      <nav className="main-nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/tracks">Courses</Link>
        <Link to="/dashboard">Dashboard</Link>
        {!kidLock && <Link to="/parent">Parent</Link>}
        <button
          type="button"
          onClick={logout}
          className="nav-button"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </nav>
    </header>
  )
}

function AppFooter() {
  const { kidLock } = useAuth()
  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} SpArki&apos;s Adventures Academy · Learning AI
        the safe way.
      </small>
      <span className="app-footer-links">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/contact">Contact</Link>
      </span>
      {kidLock && (
        <Link to="/parent" className="footer-grownup-link" aria-label="Grown-up sign in">
          Grown-up?
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
        <div className="app" style={themeStyle}>
          <a href="#app-main" className="skip-link">
            Skip to main content
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
                    <DashboardPage />
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
                    <Navigate to="/dashboard?view=parent" replace />
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App