import { useMemo } from 'react'
import { curriculum } from '../curriculum'
import {
  getB2CSeasonManifest,
  getB2CWeekManifestEntry,
  resolveCurrentB2CWeek,
} from '../weekly/b2cWeeklyManifest'

export function useB2CWeeklyEpisode() {
  const manifest = getB2CSeasonManifest()

  return useMemo(() => {
    const resolved = resolveCurrentB2CWeek(Date.now())
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
  }, [manifest])
}
