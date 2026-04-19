/**
 * Vercel serverless: POST /api/tts with body { text, locale? } → ElevenLabs TTS → audio/mpeg.
 * Set ELEVENLABS_API_KEY (and optionally ELEVENLABS_VOICE_ID) in Vercel env vars.
 * For Spanish: pass locale "es" (or lang "es"). Optional ELEVENLABS_VOICE_ID_ES overrides voice for Spanish.
 * Uses eleven_multilingual_v2 by default; sends language_code for clearer EN/ES on multilingual models.
 * Pass output_format as query param (ElevenLabs API); default mp3_44100_128.
 *
 * Abuse control: set SPARKI_SERVICE_SECRET (worker sends Bearer) and TTS_ALLOW_ORIGINS (browser Listen).
 * If both unset, endpoint is open (legacy).
 */
import { authorizeTtsRequest } from './lib/serviceAuth.js'
import { applyElevenLabsLanguageCode } from './lib/elevenLabsTts.js'

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech'
const MAX_TEXT_LENGTH = 2500

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

  try {
    let body = req.body
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body)
      } catch {
        body = {}
      }
    }
    if (typeof body !== 'object' || body === null) body = {}
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    if (!text) {
      res.status(400).json({ error: 'Missing or invalid "text"' })
      return
    }

    const localeRaw =
      typeof body.locale === 'string'
        ? body.locale.trim().toLowerCase()
        : typeof body.lang === 'string'
          ? body.lang.trim().toLowerCase()
          : ''
    const isSpanish = localeRaw === 'es' || localeRaw.startsWith('es-')

    // Trim — a trailing newline in Vercel env is a common cause of ElevenLabs 401.
    const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
    if (!apiKey) {
      res.status(503).json({ error: 'TTS not configured. Set ELEVENLABS_API_KEY in project settings.' })
      return
    }

    const defaultVoice = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Bella – warm, friendly
    const voiceEs = (process.env.ELEVENLABS_VOICE_ID_ES || '').trim()
    // Spanish: prefer dedicated ES voice when set; else same voice + language_code (multilingual).
    const voiceId = isSpanish ? voiceEs || defaultVoice : defaultVoice
    const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text
    const stability = Number(process.env.ELEVENLABS_STABILITY) || 0.45
    const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST) || 0.8
    const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
    const outputFormat = (process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128').trim()

    const payload = {
      text: truncated,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
      },
    }
    applyElevenLabsLanguageCode(payload, modelId, isSpanish)

    const elevenUrl = `${ELEVENLABS_BASE}/${voiceId}?output_format=${encodeURIComponent(outputFormat)}`

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
      // ElevenLabs returns 401 for bad keys; forwarding 401 confuses browsers ("Unauthorized" on your domain).
      const upstream = response.status
      if (upstream === 401 || upstream === 403) {
        res.status(503).json({
          error: 'ElevenLabs API key rejected (invalid, expired, or wrong environment).',
          hint: 'In Vercel → Settings → Environment Variables: set ELEVENLABS_API_KEY to your xi-api-key from elevenlabs.io (no quotes, no spaces). Redeploy.',
          details: errText.slice(0, 500),
        })
        return
      }
      // Quota / billing — not a code bug; user needs credits or shorter text.
      let quotaDetail = null
      try {
        const parsed = JSON.parse(errText)
        const st = parsed?.detail?.status
        if (st === 'quota_exceeded' || st === 'insufficient_credits') {
          quotaDetail = parsed?.detail?.message || errText
        }
      } catch {
        /* not JSON */
      }
      if (quotaDetail) {
        res.status(503).json({
          error: 'ElevenLabs quota exceeded',
          code: 'quota_exceeded',
          hint: 'Add credits or upgrade your ElevenLabs plan at elevenlabs.io → Subscription. The app will use device read-aloud (Siri) until quota is available.',
          details: String(quotaDetail).slice(0, 500),
        })
        return
      }
      res.status(upstream >= 400 && upstream < 600 ? upstream : 502).json({
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
    res.status(500).json({ error: 'TTS failed', message: e.message })
  }
}
