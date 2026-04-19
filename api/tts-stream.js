/**
 * POST /api/tts-stream — ElevenLabs streaming TTS (chunked MPEG), same auth as /api/tts.
 * Pipes upstream bytes through for lower time-to-first-byte than buffering full MP3.
 */
import { Readable } from 'node:stream'
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

  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'TTS not configured. Set ELEVENLABS_API_KEY in project settings.' })
    return
  }

  const defaultVoice = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'
  const voiceEs = (process.env.ELEVENLABS_VOICE_ID_ES || '').trim()
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

  const elevenUrl = `${ELEVENLABS_BASE}/${voiceId}/stream?output_format=${encodeURIComponent(outputFormat)}`

  try {
    const upstream = await fetch(elevenUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg, application/octet-stream, */*',
      },
      body: JSON.stringify(payload),
    })

    if (!upstream.ok) {
      const errText = await upstream.text()
      const upstreamStatus = upstream.status
      if (upstreamStatus === 401 || upstreamStatus === 403) {
        res.status(503).json({
          error: 'ElevenLabs API key rejected (invalid, expired, or wrong environment).',
          details: errText.slice(0, 500),
        })
        return
      }
      res.status(upstreamStatus >= 400 && upstreamStatus < 600 ? upstreamStatus : 502).json({
        error: 'ElevenLabs error',
        details: errText.slice(0, 500),
      })
      return
    }

    if (!upstream.body) {
      res.status(502).json({ error: 'Empty stream from ElevenLabs' })
      return
    }

    res.statusCode = 200
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-store')

    const nodeStream = Readable.fromWeb(upstream.body)
    nodeStream.on('error', () => {
      if (!res.writableEnded) res.end()
    })
    nodeStream.pipe(res)
  } catch (e) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'TTS stream failed', message: e.message })
    }
  }
}
