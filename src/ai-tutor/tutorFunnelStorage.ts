import type { AgeBandId } from '@/ageBand'
import { isAgeBandId } from '@/ageBand'

export const TUTOR_FUNNEL_ONBOARDING_KEY = 'sparki_tutor_funnel_onboarding_v1'

export type TutorFunnelOnboarding = {
  childDisplayName: string
  parentEmail: string
  ageBand: AgeBandId
}

export function readTutorFunnelOnboarding(): TutorFunnelOnboarding | null {
  try {
    const raw = sessionStorage.getItem(TUTOR_FUNNEL_ONBOARDING_KEY)
    if (!raw) return null
    const o = JSON.parse(raw) as Partial<TutorFunnelOnboarding>
    if (
      typeof o.childDisplayName !== 'string' ||
      typeof o.parentEmail !== 'string' ||
      !isAgeBandId(o.ageBand)
    ) {
      return null
    }
    return {
      childDisplayName: o.childDisplayName.trim().slice(0, 80),
      parentEmail: o.parentEmail.trim().slice(0, 320),
      ageBand: o.ageBand,
    }
  } catch {
    return null
  }
}

export function writeTutorFunnelOnboarding(data: TutorFunnelOnboarding) {
  sessionStorage.setItem(TUTOR_FUNNEL_ONBOARDING_KEY, JSON.stringify(data))
}
