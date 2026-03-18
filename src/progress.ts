import { curriculum, type UnitConfig } from './curriculum'

const STORAGE_KEY = 'sparki_age2_progress'
const SAFETY_PASS_KEY = 'sparki_safety_pass_v1'
const SAFETY_PASS_CHECKOUT_SESSION_KEY = 'sparki_safety_pass_checkout_session_v1'

export interface UnitProgress {
  unitId: string
  postScore: number
  attempts: number
  mastered: boolean
  earnedSparkles: number
  lastUpdated: string
}

export interface ChildProgress {
  units: Record<string, UnitProgress>
  totalSparkles: number
  level: number
  currentStreakDays: number
  longestStreakDays: number
  lastPlayDate: string | null
  totalUnitsMastered: number
}

export interface PlayerStats {
  totalSparkles: number
  level: number
  nextLevelAt: number
  nextLevelSparklesRemaining: number
  currentStreakDays: number
  longestStreakDays: number
  totalUnitsMastered: number
  totalUnits: number
}

function getDefaultProgress(): ChildProgress {
  return {
    units: {},
    totalSparkles: 0,
    level: 1,
    currentStreakDays: 0,
    longestStreakDays: 0,
    lastPlayDate: null,
    totalUnitsMastered: 0,
  }
}

export function loadProgress(): ChildProgress {
  if (typeof window === 'undefined') return getDefaultProgress()

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultProgress()
    const parsed = JSON.parse(raw) as ChildProgress
    if (!parsed.units || typeof parsed.totalSparkles !== 'number') {
      return getDefaultProgress()
    }
    return parsed
  } catch {
    return getDefaultProgress()
  }
}

export function saveProgress(progress: ChildProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // ignore storage issues
  }
}

export function getUnitStatus(unitId: string): UnitProgress | null {
  const progress = loadProgress()
  return progress.units[unitId] ?? null
}

export function getTotalSparkles(): number {
  const progress = loadProgress()
  return progress.totalSparkles
}

export function getHasSafetyPass(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(SAFETY_PASS_KEY) === 'true'
  } catch {
    return false
  }
}

export function setHasSafetyPass(value: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (value) {
      window.localStorage.setItem(SAFETY_PASS_KEY, 'true')
    } else {
      window.localStorage.removeItem(SAFETY_PASS_KEY)
    }
  } catch {
    // ignore storage issues
  }
}

export function getSafetyPassCheckoutSessionId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(SAFETY_PASS_CHECKOUT_SESSION_KEY)
    return raw && raw.trim() ? raw : null
  } catch {
    return null
  }
}

export function setSafetyPassCheckoutSessionId(sessionId: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (sessionId) {
      window.localStorage.setItem(SAFETY_PASS_CHECKOUT_SESSION_KEY, sessionId)
    } else {
      window.localStorage.removeItem(SAFETY_PASS_CHECKOUT_SESSION_KEY)
    }
  } catch {
    // ignore storage issues
  }
}

function updateGamification(progress: ChildProgress): void {
  const masteredCount = Object.values(progress.units).filter((u) => u.mastered).length
  progress.totalUnitsMastered = masteredCount

  const level = Math.max(1, Math.floor(progress.totalSparkles / 10) + 1)
  progress.level = level

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const last = progress.lastPlayDate

  if (!last) {
    progress.currentStreakDays = 1
    progress.longestStreakDays = Math.max(progress.longestStreakDays, 1)
    progress.lastPlayDate = today
    return
  }

  if (last === today) {
    return
  }

  const lastDate = new Date(last)
  const diffMs = now.getTime() - lastDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    progress.currentStreakDays += 1
  } else {
    progress.currentStreakDays = 1
  }

  if (progress.currentStreakDays > progress.longestStreakDays) {
    progress.longestStreakDays = progress.currentStreakDays
  }

  progress.lastPlayDate = today
}

export function getPlayerStats(): PlayerStats {
  const progress = loadProgress()
  const totalSparkles = progress.totalSparkles
  const level = Math.max(1, Math.floor(totalSparkles / 10) + 1)
  const nextLevelAt = level * 10
  const nextLevelSparklesRemaining = Math.max(0, nextLevelAt - totalSparkles)

  const totalUnits = curriculum.units.length

  return {
    totalSparkles,
    level,
    nextLevelAt,
    nextLevelSparklesRemaining,
    currentStreakDays: progress.currentStreakDays,
    longestStreakDays: progress.longestStreakDays,
    totalUnitsMastered: progress.totalUnitsMastered,
    totalUnits,
  }
}

interface UpdateResult {
  progress: ChildProgress
  earnedThisAttempt: number
}

export function updateUnitAfterQuiz(
  unit: UnitConfig,
  correctCount: number,
  totalQuestions: number,
): UpdateResult {
  const now = new Date().toISOString()
  const progress = loadProgress()
  const existing = progress.units[unit.id]

  const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0
  const percent = Math.round(ratio * 100)
  const mastered = percent >= 80

  const rawSparkles = Math.max(0, Math.round(unit.sparklesReward * ratio))

  let earnedThisAttempt = 0

  if (!existing) {
    earnedThisAttempt = rawSparkles
    progress.units[unit.id] = {
      unitId: unit.id,
      postScore: percent,
      attempts: 1,
      mastered,
      earnedSparkles: rawSparkles,
      lastUpdated: now,
    }
  } else {
    const bestScore = Math.max(existing.postScore, percent)
    const bestSparkles = Math.max(existing.earnedSparkles, rawSparkles)
    earnedThisAttempt = Math.max(0, bestSparkles - existing.earnedSparkles)

    progress.units[unit.id] = {
      unitId: unit.id,
      postScore: bestScore,
      attempts: existing.attempts + 1,
      mastered: existing.mastered || mastered,
      earnedSparkles: bestSparkles,
      lastUpdated: now,
    }
  }

  if (earnedThisAttempt > 0) {
    progress.totalSparkles += earnedThisAttempt
  }

  updateGamification(progress)
  saveProgress(progress)

  return { progress, earnedThisAttempt }
}

export function isUnitLockedForTrack(unitId: string): boolean {
  const unit = curriculum.units.find((u) => u.id === unitId)
  if (!unit) return false

  const unitsInTrack = curriculum.units.filter((u) => u.trackId === unit.trackId)
  const index = unitsInTrack.findIndex((u) => u.id === unitId)
  if (index <= 0) return false

  const previousUnit = unitsInTrack[index - 1]
  const prevStatus = getUnitStatus(previousUnit.id)
  return !prevStatus?.mastered
}
