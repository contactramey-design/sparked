import { curriculum, getUnitsForBand, type UnitConfig } from './curriculum'
import type { AgeBandId } from './ageBand'
import { ensureAnonymousSchoolAuth, getSchoolSession } from '@/school/schoolSession'
import { supabase } from '@/lib/supabaseClient'

/** Legacy single-key storage before per–age-band progress. */
const LEGACY_STORAGE_KEY = 'sparki_age2_progress'

function progressStorageKey(ageBand: AgeBandId): string {
  return `sparki_progress_${ageBand}_v1`
}

const SAFETY_PASS_KEY = 'sparki_safety_pass_v1'
const SAFETY_PASS_CHECKOUT_SESSION_KEY = 'sparki_safety_pass_checkout_session_v1'
const ACADEMY_SUB_KEY = 'sparki_academy_subscription_v1'
const ACADEMY_CHECKOUT_SESSION_KEY = 'sparki_academy_checkout_session_v1'
const DAILY_LOGIN_BONUS_LAST_DATE_KEY = 'sparki_daily_login_bonus_last_date_v1'

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

/** One-time: copy legacy progress into the Kids band key so existing users keep sparkles. */
function migrateLegacyProgressIfNeeded(ageBand: AgeBandId): void {
  if (typeof window === 'undefined') return
  if (ageBand !== 'kids') return
  try {
    const kidsKey = progressStorageKey('kids')
    if (window.localStorage.getItem(kidsKey)) return
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacy) return
    window.localStorage.setItem(kidsKey, legacy)
  } catch {
    // ignore
  }
}

export function loadProgress(ageBand: AgeBandId): ChildProgress {
  if (typeof window === 'undefined') return getDefaultProgress()

  migrateLegacyProgressIfNeeded(ageBand)

  try {
    const raw = window.localStorage.getItem(progressStorageKey(ageBand))
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

export function saveProgress(ageBand: AgeBandId, progress: ChildProgress): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(progressStorageKey(ageBand), JSON.stringify(progress))
  } catch {
    // ignore storage issues
  }
}

export function getUnitStatus(unitId: string, ageBand: AgeBandId): UnitProgress | null {
  const progress = loadProgress(ageBand)
  return progress.units[unitId] ?? null
}

export function getTotalSparkles(ageBand: AgeBandId): number {
  const progress = loadProgress(ageBand)
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

export function getHasAcademySubscription(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(ACADEMY_SUB_KEY) === 'true'
  } catch {
    return false
  }
}

export function setHasAcademySubscription(value: boolean): void {
  if (typeof window === 'undefined') return
  try {
    if (value) {
      window.localStorage.setItem(ACADEMY_SUB_KEY, 'true')
    } else {
      window.localStorage.removeItem(ACADEMY_SUB_KEY)
    }
  } catch {
    // ignore
  }
}

export function getAcademyCheckoutSessionId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(ACADEMY_CHECKOUT_SESSION_KEY)
    return raw && raw.trim() ? raw : null
  } catch {
    return null
  }
}

export function setAcademyCheckoutSessionId(sessionId: string | null): void {
  if (typeof window === 'undefined') return
  try {
    if (sessionId) {
      window.localStorage.setItem(ACADEMY_CHECKOUT_SESSION_KEY, sessionId)
    } else {
      window.localStorage.removeItem(ACADEMY_CHECKOUT_SESSION_KEY)
    }
  } catch {
    // ignore
  }
}

/** Homework APIs accept Stripe checkout session from Adventure Academy or legacy Safety Pass bundle. */
export function getHomeworkCheckoutSessionId(): string | null {
  return getAcademyCheckoutSessionId() || getSafetyPassCheckoutSessionId()
}

/** Full subject-track depth (beyond first free lesson per track on `/practice`). */
export function hasFullSubjectPracticeAccess(): boolean {
  return getHasAcademySubscription() || getHasSafetyPass()
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

/** Award a once-per-day sparkle bonus (global calendar day) and update streak for this age band. */
export function awardDailyLoginBonus(
  ageBand: AgeBandId,
  bonusSparkles = 10,
): { awarded: number; streakDays: number } {
  if (typeof window === 'undefined') return { awarded: 0, streakDays: 0 }

  try {
    const today = new Date().toISOString().slice(0, 10)
    const lastAwarded = window.localStorage.getItem(DAILY_LOGIN_BONUS_LAST_DATE_KEY)
    if (lastAwarded === today) {
      const stats = getPlayerStats(ageBand)
      return { awarded: 0, streakDays: stats.currentStreakDays }
    }

    const progress = loadProgress(ageBand)
    progress.totalSparkles += Math.max(0, bonusSparkles)
    updateGamification(progress)
    saveProgress(ageBand, progress)

    window.localStorage.setItem(DAILY_LOGIN_BONUS_LAST_DATE_KEY, today)

    return { awarded: bonusSparkles, streakDays: progress.currentStreakDays }
  } catch {
    return { awarded: 0, streakDays: 0 }
  }
}

export function getPlayerStats(ageBand: AgeBandId): PlayerStats {
  const progress = loadProgress(ageBand)
  const totalSparkles = progress.totalSparkles
  const level = Math.max(1, Math.floor(totalSparkles / 10) + 1)
  const nextLevelAt = level * 10
  const nextLevelSparklesRemaining = Math.max(0, nextLevelAt - totalSparkles)

  const totalUnits = getUnitsForBand(ageBand).length

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
  ageBand: AgeBandId,
): UpdateResult {
  const now = new Date().toISOString()
  const progress = loadProgress(ageBand)
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
  saveProgress(ageBand, progress)

  // School Mode (optional): sync anonymous progress to Supabase for teacher dashboard.
  if (typeof window !== 'undefined') {
    const { classId, studentCode } = getSchoolSession()
    if (classId && studentCode && supabase) {
      void (async () => {
        const uid = await ensureAnonymousSchoolAuth()
        if (!uid) return
        await supabase.from('school_student_progress').upsert(
          {
            class_id: classId,
            student_uid: uid,
            student_code: studentCode,
            progress,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'class_id,student_uid' },
        )
      })()
    }
  }

  return { progress, earnedThisAttempt }
}

export function isUnitLockedForTrack(unitId: string, ageBand: AgeBandId): boolean {
  const unit = curriculum.units.find((u) => u.id === unitId)
  if (!unit) return false

  const unitsInTrack = getUnitsForBand(ageBand).filter((u) => u.trackId === unit.trackId)
  const index = unitsInTrack.findIndex((u) => u.id === unitId)
  if (index <= 0) return false

  const previousUnit = unitsInTrack[index - 1]
  const prevStatus = getUnitStatus(previousUnit.id, ageBand)
  return !prevStatus?.mastered
}
