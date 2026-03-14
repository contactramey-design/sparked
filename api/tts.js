/**
 * Vercel serverless: POST /api/tts with body { text } → ElevenLabs TTS → audio/mpeg.
 * Set ELEVENLABS_API_KEY (and optionally ELEVENLABS_VOICE_ID) in Vercel env vars.
 */
const ELEVENLABS_BASE = 'https://api.elevenlabs.io/v1/text-to-speech'
const MAX_TEXT_LENGTH = 2500

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
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

    const apiKey = process.env.ELEVENLABS_API_KEY
    if (!apiKey) {
      res.status(503).json({ error: 'TTS not configured. Set ELEVENLABS_API_KEY in project settings.' })
      return
    }

    const voiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL' // Bella – warm, friendly
    const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text
    const stability = Number(process.env.ELEVENLABS_STABILITY) || 0.45
    const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST) || 0.8

    const response = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: truncated,
        model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2',
        voice_settings: {
          stability,
          similarity_boost: similarityBoost,
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      res.status(response.status).json({ error: 'ElevenLabs error', details: errText })
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
