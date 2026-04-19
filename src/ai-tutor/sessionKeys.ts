/** sessionStorage keys — tab-scoped; no long-lived child profile for tutor data. */
export const TUTOR_STATE_KEY = 'sparki_ai_tutor_state_v1'
/** localStorage — shared across tabs; parent sets school state for AI Tutor + readable on /ai-tutor. */
export const TUTOR_STATE_LOCAL_KEY = 'sparki_ai_tutor_state_code_v1'

export const TUTOR_STATE_CHANGED_EVENT = 'sparki-tutor-state-changed'
export const TUTOR_VOICE_CONSENT_KEY = 'sparki_ai_tutor_voice_consent_v1'
export const TUTOR_MESSAGES_KEY = 'sparki_ai_tutor_messages_v1'
/** localStorage — lifetime free tutor replies used without Adventure Academy (not cleared with chat). */
export const TUTOR_FREE_TURNS_LOCAL_KEY = 'sparki_tutor_free_turns_used_v1'
/** localStorage — successful LiveAvatar session starts without subscription (separate from text free turns). */
export const TUTOR_LIVEAVATAR_FREE_STARTS_KEY = 'sparki_liveavatar_free_starts_used_v1'
