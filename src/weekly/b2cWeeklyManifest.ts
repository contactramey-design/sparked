import { curriculum } from '../curriculum'
import season1Manifest from './season1.manifest.json'
import { B2C_SEASON_ID, resolveB2CWeekIndex, type ResolvedB2CWeek } from './b2cSeasonConfig'

export type B2CWeekManifestEntry = {
  week: number
  safetyUnitId: string
  aiUnitId: string
}

export type B2CSeasonManifest = {
  seasonId: string
  maxPublishedWeek: number
  weeks: B2CWeekManifestEntry[]
}

const manifest = season1Manifest as B2CSeasonManifest

function assertValidManifest(m: B2CSeasonManifest) {
  const ids = new Set(curriculum.units.map((u) => u.id))
  for (const w of m.weeks) {
    if (!ids.has(w.safetyUnitId)) {
      console.warn(`[b2cWeekly] Unknown safetyUnitId for week ${w.week}: ${w.safetyUnitId}`)
    }
    if (!ids.has(w.aiUnitId)) {
      console.warn(`[b2cWeekly] Unknown aiUnitId for week ${w.week}: ${w.aiUnitId}`)
    }
  }
  if (m.maxPublishedWeek !== m.weeks.length) {
    console.warn('[b2cWeekly] maxPublishedWeek should match weeks[] length for Season 1')
  }
}

if (import.meta.env.DEV) {
  assertValidManifest(manifest)
}

export function getB2CSeasonManifest(): B2CSeasonManifest {
  return manifest
}

export function getB2CWeekManifestEntry(weekIndex: number): B2CWeekManifestEntry | null {
  return manifest.weeks.find((w) => w.week === weekIndex) ?? null
}

export function resolveCurrentB2CWeek(nowMs: number = Date.now()): ResolvedB2CWeek {
  return resolveB2CWeekIndex(nowMs, manifest.maxPublishedWeek)
}

export { B2C_SEASON_ID }
