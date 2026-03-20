/**
 * B2C Season 1 weekly adventure: anchor + caps.
 *
 * - Anchor: first instant of "week 1" (UTC Monday 00:00). Weeks advance every 7 days from this point.
 * - Before anchor: UI shows week 1 as a preview (see resolveB2CWeekIndex).
 * - Change `SEASON_1_ANCHOR_ISO` when you officially launch Season 1; extend `MAX_PUBLISHED_WEEK` in
 *   season1.manifest.json + matching keys in weekly-en.json / weekly-es.json together.
 */
export const B2C_SEASON_ID = 'season1' as const

/** UTC instant when week 1 begins (Monday). */
export const SEASON_1_ANCHOR_ISO = '2025-03-03T00:00:00.000Z'

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

export interface ResolvedB2CWeek {
  /** 1-based week index within the season, clamped to published range */
  weekIndex: number
  /** True when local time is before the anchor (treat as week 1 preview). */
  isBeforeSeasonStart: boolean
  /** True when computed week would exceed max published (shows latest published week). */
  isCappedAtMax: boolean
}

/**
 * @param maxPublishedWeek - highest week number that exists in manifest + locale files (authoritative cap).
 */
export function resolveB2CWeekIndex(nowMs: number, maxPublishedWeek: number): ResolvedB2CWeek {
  const anchor = Date.parse(SEASON_1_ANCHOR_ISO)
  if (Number.isNaN(anchor)) {
    return { weekIndex: 1, isBeforeSeasonStart: false, isCappedAtMax: false }
  }
  if (nowMs < anchor) {
    return { weekIndex: 1, isBeforeSeasonStart: true, isCappedAtMax: false }
  }
  const rawWeek = Math.floor((nowMs - anchor) / MS_PER_WEEK) + 1
  const capped = Math.min(Math.max(rawWeek, 1), maxPublishedWeek)
  return {
    weekIndex: capped,
    isBeforeSeasonStart: false,
    isCappedAtMax: rawWeek > maxPublishedWeek,
  }
}
