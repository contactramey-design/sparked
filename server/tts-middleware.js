/**
 * Vite dev middleware: POST /api/tts with body { text, locale } → ElevenLabs TTS → audio/mpeg.
 * Set ELEVENLABS_API_KEY in .env and (optionally) separate voices:
 * - ELEVENLABS_VOICE_ID_EN
 * - ELEVENLABS_VOICE_ID_ES
 */
import dotenv from 'dotenv'
dotenv.config()

const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech'
const MAX_TEXT_LENGTH = 2500

async function readBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks).toString('utf8')
}

export function ttsMiddleware() {
  return async (req, res, next) => {
    if (req.url !== '/api/tts' && !req.url?.startsWith('/api/tts?')) return next()
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }

    try {
      const raw = await readBody(req)
      const data = JSON.parse(raw || '{}')
      const text = typeof data.text === 'string' ? data.text.trim() : ''
      const locale = data.locale === 'es' ? 'es' : 'en'
      if (!text) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Missing or invalid "text"' }))
        return
      }

      const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
      if (!apiKey) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'TTS not configured. Set ELEVENLABS_API_KEY.' }))
        return
      }

      const defaultVoice = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
      const voiceId =
        locale === 'es'
          ? process.env.ELEVENLABS_VOICE_ID_ES || defaultVoice
          : process.env.ELEVENLABS_VOICE_ID_EN || defaultVoice
      const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text
      const stability = Number(process.env.ELEVENLABS_STABILITY) || 0.45
      const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST) || 0.8
      const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
      const outputFormat = (process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128').trim()
      const isSpanish = locale === 'es'

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
        const upstream = response.status
        if (upstream === 401 || upstream === 403) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'ElevenLabs API key rejected (invalid, expired, or wrong environment).',
              hint: 'Set ELEVENLABS_API_KEY in .env to your xi-api-key from elevenlabs.io (trimmed, no quotes).',
              details: errText.slice(0, 500),
            }),
          )
          return
        }
        res.statusCode = upstream
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'ElevenLabs error', details: errText.slice(0, 500) }))
        return
      }

      const audio = await response.arrayBuffer()
      res.statusCode = 200
      res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg')
      res.setHeader('Cache-Control', 'no-store')
      res.end(Buffer.from(audio))
    } catch (e) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'TTS failed', message: e.message }))
    }
  }
}
