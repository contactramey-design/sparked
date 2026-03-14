/**
 * Vite dev middleware: POST /api/tts with body { text } → ElevenLabs TTS → audio/mpeg.
 * Set ELEVENLABS_API_KEY (and optionally ELEVENLABS_VOICE_ID) in .env.
 */
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
      if (!text) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Missing or invalid "text"' }))
        return
      }

      const apiKey = process.env.ELEVENLABS_API_KEY
      if (!apiKey) {
        res.statusCode = 503
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'TTS not configured. Set ELEVENLABS_API_KEY.' }))
        return
      }

      const voiceId = process.env.ELEVENLABS_VOICE_ID || '21m00tcm4tlvdq8ikwam'
      const truncated = text.length > MAX_TEXT_LENGTH ? text.slice(0, MAX_TEXT_LENGTH) : text

      const response = await fetch(`${ELEVENLABS_BASE}/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: truncated,
          model_id: process.env.ELEVENLABS_MODEL_ID || 'eleven_monolingual_v1',
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        res.statusCode = response.status
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'ElevenLabs error', details: errText }))
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
