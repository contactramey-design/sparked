/**
 * Video worker: POST /generate with { adventure: { title, subject, topic, steps }, locale? }
 * Builds TTS script from steps, calls TTS, composites images + audio → MP4, uploads to Vercel Blob.
 * Deploy to Railway, Render, or Fly.io. Set TTS_URL (app /api/tts), BLOB_READ_WRITE_TOKEN, ASSET_BASE_URL.
 */
import express from 'express'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { put } from '@vercel/blob'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegStatic)

const app = express()
app.use(express.json({ limit: '1mb' }))

const SECONDS_PER_STEP = 10
const PORT = process.env.PORT || 3333

async function fetchTTS(text, ttsUrl) {
  const url = ttsUrl || process.env.TTS_URL
  if (!url) throw new Error('TTS_URL not set')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) {
    const msg = `TTS failed: ${res.status}. Check ELEVENLABS_API_KEY on Vercel and that TTS_URL points to your app /api/tts.`
    throw new Error(msg)
  }
  return Buffer.from(await res.arrayBuffer())
}

async function getImageList(subject, assetBaseUrl) {
  const base = assetBaseUrl || process.env.ASSET_BASE_URL
  if (!base) throw new Error('ASSET_BASE_URL not set')
  const manifestUrl = `${base.replace(/\/$/, '')}/adventure-assets/manifest.json`
  const res = await fetch(manifestUrl)
  if (!res.ok) throw new Error(`Could not load asset manifest from ${manifestUrl}. Check ASSET_BASE_URL.`)
  const manifest = await res.json()
  const list = manifest[subject] || manifest.default || ['sparki-default.svg']
  return list.map((file) => `${base.replace(/\/$/, '')}/adventure-assets/${file}`)
}

async function getSquadImageList(assetBaseUrl) {
  const base = assetBaseUrl || process.env.ASSET_BASE_URL
  if (!base) throw new Error('ASSET_BASE_URL not set')
  const squadUrl = `${base.replace(/\/$/, '')}/adventure-assets/squad.json`
  const res = await fetch(squadUrl)
  if (!res.ok) throw new Error(`Could not load squad from ${squadUrl}. Check ASSET_BASE_URL and squad.json.`)
  const parsed = await res.json()
  if (!Array.isArray(parsed) || !parsed.length) {
    throw new Error('Squad not configured or empty')
  }
  const files = parsed
    .map((m) => (m && typeof m.file === 'string' ? m.file.trim() : ''))
    .filter(Boolean)
  if (!files.length) {
    throw new Error('Squad not configured or empty')
  }
  return files.map((file) => `${base.replace(/\/$/, '')}/adventure-assets/${file}`)
}

function buildScript(steps) {
  return steps.map((s) => s.story).filter(Boolean).join(' ')
}

async function compositeVideo(adventure, audioBuffer, imageUrls, outPath) {
  const tmpDir = path.join(path.dirname(outPath), `work_${Date.now()}`)
  await fs.promises.mkdir(tmpDir, { recursive: true })
  const audioPath = path.join(tmpDir, 'audio.mp3')
  await fs.promises.writeFile(audioPath, audioBuffer)

  const durationPerImage = SECONDS_PER_STEP
  const listPath = path.join(tmpDir, 'list.txt')
  const writtenPaths = []
  for (let i = 0; i < imageUrls.length; i++) {
    const ext = path.extname(new URL(imageUrls[i]).pathname) || '.jpg'
    const imgPath = path.join(tmpDir, `img_${i}${ext}`)
    const res = await fetch(imageUrls[i])
    if (!res.ok) continue
    await fs.promises.writeFile(imgPath, Buffer.from(await res.arrayBuffer()))
    writtenPaths.push(imgPath)
  }
  if (writtenPaths.length === 0) throw new Error('No images available. Ensure ASSET_BASE_URL serves /adventure-assets/ and manifest lists existing files.')
  const lines = []
  for (const p of writtenPaths) {
    lines.push(`file '${p.replace(/\\/g, '/')}'`)
    lines.push(`duration ${durationPerImage}`)
  }
  lines.push(`file '${writtenPaths[writtenPaths.length - 1].replace(/\\/g, '/')}'`)
  await fs.promises.writeFile(listPath, lines.join('\n'))

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(listPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .input(audioPath)
      .outputOptions(['-c:v', 'libx264', '-c:a', 'aac', '-shortest', '-pix_fmt', 'yuv420p'])
      .format('mp4')
      .output(outPath)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })

  try {
    await fs.promises.rm(tmpDir, { recursive: true, force: true })
  } catch {}
}

app.post('/generate', async (req, res) => {
  const adventure = req.body?.adventure
  if (!adventure?.steps?.length) {
    return res.status(400).json({ error: 'Missing adventure.steps' })
  }
  const locale = req.body?.locale || 'en'
  const useSquad = !!req.body?.useSquad
  const ttsUrl = process.env.TTS_URL
  const assetBaseUrl = process.env.ASSET_BASE_URL
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (!ttsUrl || !blobToken) {
    return res.status(503).json({ error: 'Worker not configured: TTS_URL and BLOB_READ_WRITE_TOKEN required' })
  }
  if (!assetBaseUrl || !assetBaseUrl.startsWith('http')) {
    return res.status(503).json({ error: 'Worker not configured: ASSET_BASE_URL must be your app URL (e.g. https://your-app.vercel.app)' })
  }

  try {
    const script = buildScript(adventure.steps)
    if (!script.trim()) throw new Error('Empty script')
    const audioBuffer = await fetchTTS(script, ttsUrl)
    let imageUrls
    if (useSquad) {
      const squadImageUrls = await getSquadImageList(assetBaseUrl)
      if (!squadImageUrls.length) throw new Error('Squad not configured or empty')
      // One slide per step, cycling through squad members
      imageUrls = adventure.steps.map((_, i) => squadImageUrls[i % squadImageUrls.length])
    } else {
      imageUrls = await getImageList(adventure.subject || 'default', assetBaseUrl)
      if (!imageUrls.length) throw new Error('No images in manifest')
    }

    // Use OS tmp directory for output to avoid filesystem permission issues on hosts like Railway
    const outPath = path.join(os.tmpdir(), `out_${Date.now()}.mp4`)
    await compositeVideo(adventure, audioBuffer, imageUrls, outPath)

    const buffer = await fs.promises.readFile(outPath)
    await fs.promises.unlink(outPath).catch(() => {})

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) throw new Error('BLOB_READ_WRITE_TOKEN required for upload')
    const blob = await put(`adventure-videos/${Date.now()}-${Math.random().toString(36).slice(2)}.mp4`, buffer, {
      access: 'public',
      contentType: 'video/mp4',
      token,
    })
    return res.json({ videoUrl: blob.url })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Video generation failed' })
  }
})

app.get('/health', (_, res) => res.json({ ok: true }))

app.listen(PORT, () => console.log(`Worker listening on ${PORT}`))
