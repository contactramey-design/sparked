/**
 * POST /api/homework-adventure-tts
 * ElevenLabs TTS for Homework Adventure Video scenes (per-character voice).
 * Body: { text, character?: 'sparki'|'byte'|'pixel'|'zap', checkout_session_id?, locale? }
 */
import { authorizeTtsRequest } from './lib/serviceAuth.js'
import { requireHomeworkEntitlement } from './homework/lib/multipart.js'
import { isHomeworkAdventurePaused } from './lib/homeworkAdventurePaused.js'

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech'
const MAX_TEXT_LENGTH = 2500

/** Defaults match common ElevenLabs library IDs; override with ELEVENLABS_HW_VOICE_* env. */
const DEFAULT_VOICE_IDS = {
  sparki: 'EXAVITQu4vr4xnSDxMaL',
  byte: 'TX3LPaxmHKxFdv7VOQHJ',
  pixel: 'jBpfuIE2acCO8z3wKNLl',
  zap: 'onwK4e9ZLuTAKqWW03F9',
}

function voiceIdForCharacter(character) {
  const c = typeof character === 'string' ? character.toLowerCase().trim() : 'sparki'
  const envKey = `ELEVENLABS_HW_VOICE_${c.toUpperCase()}`
  const fromEnv = process.env[envKey]?.trim()
  if (fromEnv) return fromEnv
  return DEFAULT_VOICE_IDS[c] || DEFAULT_VOICE_IDS.sparki
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const gate = authorizeTtsRequest(req)
  if (!gate.ok) {
    res.status(gate.status).json({ error: gate.message })
    return
  }

  if (isHomeworkAdventurePaused()) {
    res.status(503).json({
      code: 'HOMEWORK_ADVENTURE_PAUSED',
      error: 'Homework Adventure video is temporarily paused.',
    })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  if (typeof body !== 'object' || body === null) body = {}

  const checkoutSessionId =
    typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''
  const ent = await requireHomeworkEntitlement(checkoutSessionId)
  if (!ent.ok) {
    res.status(ent.status).json({ error: ent.message })
    return
  }

  const text = typeof body.text === 'string' ? body.text.trim() : ''
  if (!text) {
    res.status(400).json({ error: 'Missing or invalid "text"' })
    return
  }

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'TTS not configured. Set ELEVENLABS_API_KEY in project settings.' })
    return
  }

  const character = body.character
  const voiceId = voiceIdForCharacter(character)
  const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text

  const localeRaw =
    typeof body.locale === 'string'
      ? body.locale.trim().toLowerCase()
      : typeof body.lang === 'string'
        ? body.lang.trim().toLowerCase()
        : ''
  const isSpanish = localeRaw === 'es' || localeRaw.startsWith('es-')

  const modelId = (process.env.ELEVENLABS_HW_MODEL_ID || 'eleven_turbo_v2').trim()
  const outputFormat = (process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128').trim()
  const stability = Number(process.env.ELEVENLABS_STABILITY) || 0.5
  const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST) || 0.75

  const payload = {
    text: truncated,
    model_id: modelId,
    voice_settings: {
      stability,
      similarity_boost: similarityBoost,
    },
  }
  if (modelId.includes('multilingual')) {
    payload.language_code = isSpanish ? 'es' : 'en'
  }

  const elevenUrl = `${ELEVENLABS_BASE}/${voiceId}?output_format=${encodeURIComponent(outputFormat)}`

  try {
    const response = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg, application/octet-stream, */*',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errText = await response.text()
      res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({
        error: 'ElevenLabs error',
        details: errText.slice(0, 500),
      })
      return
    }

    const audio = await response.arrayBuffer()
    res.status(200)
      .setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg')
      .setHeader('Cache-Control', 'no-store')
      .end(Buffer.from(audio))
  } catch (e) {
    res.status(500).json({ error: 'TTS failed', message: e instanceof Error ? e.message : String(e) })
  }
}
