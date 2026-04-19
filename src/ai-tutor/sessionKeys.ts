/** sessionStorage keys — tab-scoped; no long-lived child profile for tutor data. */
export const TUTOR_STATE_KEY = 'sparki_ai_tutor_state_v1'
/** localStorage — shared across tabs; parent sets school state for AI Tutor + readable on /ai-tutor. */
export const TUTOR_STATE_LOCAL_KEY = 'sparki_ai_tutor_state_code_v1'

export const TUTOR_STATE_CHANGED_EVENT = 'sparki-tutor-state-changed'
export const TUTOR_VOICE_CONSENT_KEY = 'sparki_ai_tutor_voice_consent_v1'
export const TUTOR_MESSAGES_KEY = 'sparki_ai_tutor_messages_v1'
/** localStorage — lifetime free tutor replies used without Adventure Academy (not cleared with chat). */
export const TUTOR_FREE_TURNS_LOCAL_KEY = 'sparki_tutor_free_turns_used_v1'
/** localStorage — user already claimed the one-time “email for +3 messages” tutor bonus on this device. */
export const TUTOR_LEAD_BONUS_CLAIMED_KEY = 'sparki_tutor_lead_bonus_claimed_v1'
/** sessionStorage — lead modal dismissed (“Not now”) until the tab session ends. */
export const TUTOR_LEAD_MODAL_DISMISSED_SESSION_KEY = 'sparki_tutor_lead_modal_dismissed_v1'

/** sessionStorage — stable id for this tab’s tutor session (telemetry + session end). */
export const TUTOR_CLIENT_SESSION_KEY = 'sparki_tutor_client_session_v1'

/** sessionStorage — wall-clock ms when first message was sent this session. */
export const TUTOR_SESSION_STARTED_MS_KEY = 'sparki_tutor_session_started_ms_v1'

/** sessionStorage — DALL·E tutor illustrations used this tab session (cap in client). */
export const TUTOR_VISUAL_TURNS_KEY = 'sparki_tutor_visual_turns_v1'
