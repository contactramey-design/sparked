import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import en from '../locales/en.json'
import es from '../locales/es.json'

const STORAGE_KEY = 'spark_academy_locale'

export type Locale = 'en' | 'es'

const messages: Record<Locale, Record<string, unknown>> = { en, es }

function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj
  for (const k of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[k]
  }
  return current
}

function interpolate(str: string, vars: Record<string, string | number>): string {
  let out = str
  for (const [key, value] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
  }
  return out
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (next: Locale | ((prev: Locale) => Locale)) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'es' || stored === 'en') return stored
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('es')) return 'es'
  return 'en'
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((next: Locale | ((prev: Locale) => Locale)) => {
    setLocaleState((prev) => {
      const value = typeof next === 'function' ? next(prev) : next
      try {
        window.localStorage.setItem(STORAGE_KEY, value)
      } catch {
        // ignore
      }
      return value
    })
  }, [])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const raw = getByPath(messages[locale], key)
      const str = typeof raw === 'string' ? raw : key
      return vars ? interpolate(str, vars) : str
    },
    [locale],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}

export function useTranslation() {
  return useLocale()
}
