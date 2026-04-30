export type TutorExperienceMode = 'sparki' | 'tutor'

const KEY = 'sparki_tutor_experience_mode_v1'

export function readTutorExperienceMode(): TutorExperienceMode {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'sparki' || v === 'tutor') return v
  } catch {
    /* ignore */
  }
  return 'tutor'
}

export function writeTutorExperienceMode(mode: TutorExperienceMode) {
  try {
    localStorage.setItem(KEY, mode)
  } catch {
    /* ignore */
  }
}
