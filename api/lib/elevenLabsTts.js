/**
 * ElevenLabs TTS: which models honor `language_code` for pronunciation (en / es).
 * @param {string} modelId
 */
export function elevenLabsModelSupportsLanguageCode(modelId) {
  const m = String(modelId || '').toLowerCase()
  if (!m) return false
  if (m.includes('multilingual')) return true
  if (m.includes('eleven_v3')) return true
  if (m.includes('turbo_v2_5') || m.includes('flash_v2_5')) return true
  return false
}

/**
 * Mutates payload with language_code when the model supports it (clearer Spanish accent).
 * @param {Record<string, unknown>} payload
 * @param {string} modelId
 * @param {boolean} isSpanish
 */
export function applyElevenLabsLanguageCode(payload, modelId, isSpanish) {
  if (!elevenLabsModelSupportsLanguageCode(modelId)) return
  payload.language_code = isSpanish ? 'es' : 'en'
}
