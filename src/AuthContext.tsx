import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabaseClient'

const STORAGE_KEY = 'sparki_academy_logged_in'
const KID_LOCK_KEY = 'sparki_academy_kid_lock'

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  configured: boolean
  signInWithEmail: (email: string) => Promise<{ ok: true } | { ok: false; error: string }>
  devLogin: () => void
  signOut: () => Promise<void>
  kidLock: boolean
  setKidLock: (locked: boolean) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [kidLock, setKidLockState] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const configured = !!supabase

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

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return
        setUser(data.session?.user ?? null)
        setIsLoggedIn(!!data.session?.user)
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
          setIsLoggedIn(false)
        }
      })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setUser(session?.user ?? null)
      setIsLoggedIn(!!session?.user)
      try {
        // Keep compatibility with existing ProtectedRoute behavior
        window.localStorage.setItem(STORAGE_KEY, session?.user ? 'true' : 'false')
      } catch {
        // ignore
      }
    })

    return () => {
      cancelled = true
      sub.subscription?.unsubscribe()
    }
  }, [])

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return { ok: false as const, error: 'Supabase is not configured yet.' }
    const redirectTo = window.location.origin
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    })
    if (error) return { ok: false as const, error: error.message || 'Could not send sign-in email.' }
    return { ok: true as const }
  }, [])

  const signOut = useCallback(async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } finally {
      setUser(null)
      setIsLoggedIn(false)
      try {
        window.localStorage.removeItem(STORAGE_KEY)
        window.localStorage.removeItem(KID_LOCK_KEY)
      } catch {
        // ignore
      }
    }
  }, [])

  const devLogin = useCallback(() => {
    setIsLoggedIn(true)
    try {
      window.localStorage.setItem(STORAGE_KEY, 'true')
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

  const value: AuthContextValue = {
    isLoggedIn,
    user,
    configured,
    signInWithEmail,
    devLogin,
    signOut,
    kidLock,
    setKidLock,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

