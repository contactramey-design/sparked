import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const STORAGE_KEY = 'sparki_academy_logged_in'
const KID_LOCK_KEY = 'sparki_academy_kid_lock'

interface AuthContextValue {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
  kidLock: boolean
  setKidLock: (locked: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [kidLock, setKidLockState] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      setIsLoggedIn(stored === 'true')
      const lock = window.localStorage.getItem(KID_LOCK_KEY)
      setKidLockState(lock === 'true')
    } catch {
      setIsLoggedIn(false)
      setKidLockState(false)
    }
  }, [])

  const login = useCallback(() => {
    setIsLoggedIn(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
      window.localStorage.removeItem(KID_LOCK_KEY)
    } catch {
      // ignore
    }
  }, [])

  const setKidLock = useCallback((locked: boolean) => {
    setKidLockState(locked)
    try {
      if (locked) {
        window.localStorage.setItem(KID_LOCK_KEY, 'true')
      } else {
        window.localStorage.removeItem(KID_LOCK_KEY)
      }
    } catch {
      // ignore
    }
  }, [])

  const value: AuthContextValue = { isLoggedIn, login, logout, kidLock, setKidLock }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

