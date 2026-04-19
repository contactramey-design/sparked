import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createLocalDevTeacherUser } from './lib/authDevUser'
import { clearPostLoginRedirect } from './lib/postLoginRedirect'
import { supabase } from './lib/supabaseClient'

const STORAGE_KEY = 'sparki_academy_logged_in'
const KID_LOCK_KEY = 'sparki_academy_kid_lock'

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  /** Present when Supabase session exists — send to server APIs that need parent identity (never expose to children UI). */
  accessToken: string | null
  /** True after the initial Supabase session check finishes (or immediately if Supabase is off). */
  authHydrated: boolean
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
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authHydrated, setAuthHydrated] = useState(false)
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
    if (!supabase) {
      setAuthHydrated(true)
      return
    }
    let cancelled = false

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (cancelled) return
        setUser(data.session?.user ?? null)
        setAccessToken(data.session?.access_token ?? null)
        setIsLoggedIn(!!data.session?.user)
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null)
          setAccessToken(null)
          setIsLoggedIn(false)
        }
      })
      .finally(() => {
        if (!cancelled) setAuthHydrated(true)
      })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setUser(session?.user ?? null)
      setAccessToken(session?.access_token ?? null)
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
      setAccessToken(null)
      setIsLoggedIn(false)
      clearPostLoginRedirect()
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
    setUser((u) => u ?? createLocalDevTeacherUser())
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
    accessToken,
    authHydrated,
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

