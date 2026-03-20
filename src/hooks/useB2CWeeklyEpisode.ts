import { useEffect, useMemo, useState } from 'react'
import { curriculum } from '../curriculum'
import {
  getB2CSeasonManifest,
  getB2CWeekManifestEntry,
  resolveCurrentB2CWeek,
} from '../weekly/b2cWeeklyManifest'
import type { ResolvedB2CWeek } from '../weekly/b2cSeasonConfig'

export function useB2CWeeklyEpisode() {
  const manifest = getB2CSeasonManifest()
  /** Epoch 0 is before season anchor → same “preview week 1” as resolveB2CWeekIndex(0, max). */
  const [resolved, setResolved] = useState<ResolvedB2CWeek>(() => resolveCurrentB2CWeek(0))

  useEffect(() => {
    const tick = () => setResolved(resolveCurrentB2CWeek(Date.now()))
    tick()
    const id = window.setInterval(tick, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [manifest.maxPublishedWeek])

  return useMemo(() => {
    const entry = getB2CWeekManifestEntry(resolved.weekIndex)
    const safetyUnit = entry
      ? curriculum.units.find((u) => u.id === entry.safetyUnitId) ?? null
      : null
    const aiUnit = entry ? curriculum.units.find((u) => u.id === entry.aiUnitId) ?? null : null

    return {
      manifest,
      resolved,
      entry,
      safetyUnit,
      aiUnit,
      totalWeeks: manifest.maxPublishedWeek,
    }
  }, [manifest, resolved])
}
