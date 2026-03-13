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
import Dashboard from './Dashboard'
import LessonPage from './Lesson'
import TrackListPage from './TrackListPage'
import TrackPage from './TrackPage'
import UnitPage from './UnitPage'
import ComingSoon from './ComingSoon'
import ParentDashboard from './ParentDashboard'
import HomeworkAdventurePage from './HomeworkAdventurePage'
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
          <nav className="main-nav">
            <Link to="/login">Sign in</Link>
          </nav>
        )}
        {isLogin && (
          <nav className="main-nav">
            <Link to="/">Home</Link>
          </nav>
        )}
        {isHome && isLoggedIn && (
          <nav className="main-nav">
            <Link to="/dashboard">Dashboard</Link>
            {!kidLock && <Link to="/parent">Parent</Link>}
            <button type="button" onClick={logout} className="nav-button">
              Sign out
            </button>
          </nav>
        )}
      </header>
    )
  }

  return (
    <header className="app-header">
      <Link to="/dashboard" className="logo-placeholder">
        SpArki
      </Link>
      <div className="app-titles">
        <h1>{appConfig.appName}</h1>
        <p>{appConfig.tagline}</p>
      </div>
      <nav className="main-nav">
        <Link to="/dashboard">Dashboard</Link>
        {!kidLock && <Link to="/parent">Parent</Link>}
        <button type="button" onClick={logout} className="nav-button">
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
      {kidLock && (
        <Link to="/parent" className="footer-grownup-link">
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
          <AppHeader />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
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
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/coming-soon" element={<ComingSoon />} />
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