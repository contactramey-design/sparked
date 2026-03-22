import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  AGE_BAND_STORAGE_KEY,
  DEFAULT_AGE_BAND,
  type AgeBandId,
  isAgeBandId,
} from '@/ageBand'
import { useTranslation } from '@/contexts/LocaleContext'

type AgeBandContextValue = {
  ageBand: AgeBandId
  setAgeBand: (band: AgeBandId) => void
  /** e.g. "Sparki Kids (6–8)" */
  ageBandDisplayName: string
  /** e.g. "6–8" for disclaimers */
  recommendedAgesShort: string
}

const AgeBandContext = createContext<AgeBandContextValue | null>(null)

function readStoredBand(): AgeBandId {
  if (typeof window === 'undefined') return DEFAULT_AGE_BAND
  try {
    const raw = window.localStorage.getItem(AGE_BAND_STORAGE_KEY)
    if (isAgeBandId(raw)) return raw
  } catch {
    // ignore
  }
  return DEFAULT_AGE_BAND
}

export function AgeBandProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [ageBand, setAgeBandState] = useState<AgeBandId>(readStoredBand)

  const setAgeBand = useCallback((band: AgeBandId) => {
    setAgeBandState(band)
    try {
      window.localStorage.setItem(AGE_BAND_STORAGE_KEY, band)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo<AgeBandContextValue>(() => {
    const ageBandDisplayName = t(`ageBand.names.${ageBand}.full`)
    const recommendedAgesShort = t(`ageBand.names.${ageBand}.ages`)
    return {
      ageBand,
      setAgeBand,
      ageBandDisplayName,
      recommendedAgesShort,
    }
  }, [ageBand, setAgeBand, t])

  return <AgeBandContext.Provider value={value}>{children}</AgeBandContext.Provider>
}

export function useAgeBand(): AgeBandContextValue {
  const ctx = useContext(AgeBandContext)
  if (!ctx) {
    throw new Error('useAgeBand must be used within AgeBandProvider')
  }
  return ctx
}

/** Safe for routes that might render outside provider during tests — defaults to kids. */
export function useOptionalAgeBand(): AgeBandContextValue | null {
  return useContext(AgeBandContext)
}
