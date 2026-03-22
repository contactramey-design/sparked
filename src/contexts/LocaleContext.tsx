import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import en from '../locales/en.json'
import es from '../locales/es.json'
import curriculumEn from '../locales/curriculum-en.json'
import curriculumEs from '../locales/curriculum-es.json'
import curriculumBandPluginEn from '../locales/curriculum-band-plugin-en.json'
import curriculumBandPluginEs from '../locales/curriculum-band-plugin-es.json'
import { mergeCurriculumBands } from '../locales/mergeCurriculumBands'
import { mergeLocaleWithFallback } from '../locales/mergeMessages'
import aiCodingGamesEn from '../locales/aiCodingGames-en.json'
import aiCodingGamesEs from '../locales/aiCodingGames-es.json'
import weeklyEn from '../locales/weekly-en.json'
import weeklyEs from '../locales/weekly-es.json'

const STORAGE_KEY = 'spark_academy_locale'

export type Locale = 'en' | 'es'

const enFull = {
  ...en,
  curriculum: mergeCurriculumBands(
    curriculumEn as Record<string, unknown>,
    curriculumBandPluginEn as { units?: Record<string, Record<string, unknown>> },
  ),
  aiCodingGames: aiCodingGamesEn as Record<string, unknown>,
  weekly: weeklyEn as Record<string, unknown>,
} as Record<string, unknown>
const esFull = {
  ...es,
  curriculum: mergeCurriculumBands(
    curriculumEs as Record<string, unknown>,
    curriculumBandPluginEs as { units?: Record<string, Record<string, unknown>> },
  ),
  aiCodingGames: aiCodingGamesEs as Record<string, unknown>,
  weekly: weeklyEs as Record<string, unknown>,
} as Record<string, unknown>
/** Spanish inherits English for any missing key (nested). */
const esFullMerged = mergeLocaleWithFallback(enFull, esFull) as Record<string, unknown>
const messages: Record<Locale, Record<string, unknown>> = { en: enFull, es: esFullMerged }

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
  /** Get raw value (string, array, or object) for keys like curriculum.units.xxx.contentBlocks */
  get: (key: string) => unknown
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
      let raw = getByPath(messages[locale], key)
      if (typeof raw !== 'string' && locale !== 'en') {
        raw = getByPath(messages.en, key)
      }
      const str = typeof raw === 'string' ? raw : key
      return vars ? interpolate(str, vars) : str
    },
    [locale],
  )

  const get = useCallback(
    (key: string): unknown => {
      let v = getByPath(messages[locale], key)
      if (v === undefined && locale !== 'en') {
        v = getByPath(messages.en, key)
      }
      return v
    },
    [locale],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, get }),
    [locale, setLocale, t, get],
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
