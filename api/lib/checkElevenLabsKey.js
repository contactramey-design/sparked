/**
 * Lightweight check: ElevenLabs accepts GET /v1/voices with xi-api-key.
 * @param {string} apiKey - trimmed key
 * @returns {Promise<{ ok: boolean, status?: number, detail?: string }>}
 */
export async function checkElevenLabsApiKey(apiKey) {
  if (!apiKey) return { ok: false, detail: 'missing' }
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices?page_size=1', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        Accept: 'application/json',
      },
    })
    if (res.ok) return { ok: true, status: res.status }
    const text = await res.text().catch(() => '')
    return { ok: false, status: res.status, detail: text.slice(0, 300) }
  } catch (e) {
    return { ok: false, detail: e?.message || String(e) }
  }
}
