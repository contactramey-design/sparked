/**
 * Local API server for testing Homework Adventure without Vercel.
 * Run with: node server/local-api.js
 * Serves /api/config, /api/setup-status, /api/tts, /api/process-homework, homework/*, generate-visuals, video, checkout, schools, etc., so Vite proxy matches Vercel.
 */
import http from 'node:http'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
// Load .env from project root first, then cwd (covers npm run from project root)
dotenv.config({ path: path.join(rootDir, '.env') })
dotenv.config() // fallback: .env in process.cwd()
const hasOpenAiKey = Boolean(process.env.OPENAI_API_KEY?.trim())
const videoEnabled = process.env.VIDEO_FEATURE_ENABLED === 'true'
const hasWorkerUrl = Boolean(process.env.VIDEO_WORKER_URL?.trim())
console.log('[local-api] OPENAI_API_KEY:', hasOpenAiKey ? 'set' : 'NOT SET — add OPENAI_API_KEY to .env and restart')
console.log('[local-api] Video:', videoEnabled && hasWorkerUrl ? 'enabled (VIDEO_FEATURE_ENABLED + VIDEO_WORKER_URL)' : 'disabled — set VIDEO_FEATURE_ENABLED=true and VIDEO_WORKER_URL in .env for Create video')

const PORT = Number(process.env.LOCAL_API_PORT) || 3001

/** Wrap Node ServerResponse so handlers can use res.status(code).json(body) */
function wrapRes(res) {
  res.status = function (code) {
    this.statusCode = code
    return this
  }
  res.json = function (body) {
    this.setHeader('Content-Type', 'application/json')
    this.end(JSON.stringify(body))
    return this
  }
  return res
}

/** Read JSON body for POST and set req.body */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8')
        req.body = raw ? JSON.parse(raw) : {}
        resolve()
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = req.url?.split('?')[0] || ''
  const wrapped = wrapRes(res)

  try {
    if (url === '/api/config' && req.method === 'GET') {
      const m = await import('../api/config.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/setup-status' && req.method === 'GET') {
      const m = await import('../api/setup-status.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/video-worker-health' && req.method === 'GET') {
      const m = await import('../api/video-worker-health.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/tts' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/tts.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/process-homework' && req.method === 'POST') {
      const m = await import('../api/process-homework.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/homework/analyze' && req.method === 'POST') {
      const m = await import('../api/homework/analyze.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/homework/explain' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/homework/explain.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/homework/story' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/homework/story.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/homework/images' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/homework/images.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/homework/video' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/homework/video.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/generate-visuals' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/generate-visuals.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/generate-adventure-video' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/generate-adventure-video.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/create-checkout-session' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/create-checkout-session.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/create-ebook-checkout-session' && req.method === 'POST') {
      await readJsonBody(req)
      const m = await import('../api/create-ebook-checkout-session.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/download-ebook' && req.method === 'GET') {
      const m = await import('../api/download-ebook.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/schools/propose-pacing-from-pdf' && req.method === 'POST') {
      const m = await import('../api/schools/propose-pacing-from-pdf.js')
      await m.default(req, wrapped)
      return
    }
    if (url === '/api/schools/generate-weekly-units' && req.method === 'POST') {
      const m = await import('../api/schools/generate-weekly-units.js')
      await m.default(req, wrapped)
      return
    }
  } catch (e) {
    console.error('[local-api]', e)
    wrapped.status(500).json({ error: e.message || 'Server error' })
    return
  }

  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(
    `Local API: http://localhost:${PORT} (config, setup-status, video-worker-health, tts, process-homework, homework/*, generate-visuals, generate-adventure-video, schools-generate-weekly-units, checkout, download-ebook)`,
  )
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Stop the other process (e.g. lsof -ti:${PORT} | xargs kill) and run npm run dev:local again.`)
    process.exit(1)
  }
  throw err
})
