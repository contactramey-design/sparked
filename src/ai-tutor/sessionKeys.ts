/** sessionStorage keys — tab-scoped; no long-lived child profile for tutor data. */
export const TUTOR_STATE_KEY = 'sparki_ai_tutor_state_v1'
/** localStorage — shared across tabs; parent sets school state for AI Tutor + readable on /ai-tutor. */
export const TUTOR_STATE_LOCAL_KEY = 'sparki_ai_tutor_state_code_v1'

export const TUTOR_STATE_CHANGED_EVENT = 'sparki-tutor-state-changed'
export const TUTOR_VOICE_CONSENT_KEY = 'sparki_ai_tutor_voice_consent_v1'
export const TUTOR_MESSAGES_KEY = 'sparki_ai_tutor_messages_v1'
