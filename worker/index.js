/**
 * Video worker: POST /generate with { adventure: { title, subject, topic, steps }, locale? }
 * Builds TTS script from steps, calls TTS, composites images + audio → MP4, uploads to Vercel Blob.
 * Deploy to Railway, Render, or Fly.io. Set TTS_URL (app /api/tts), BLOB_READ_WRITE_TOKEN, ASSET_BASE_URL.
 */
import express from 'express'
import fs from 'fs'
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
  if (!res.ok) throw new Error(`TTS failed: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function getImageList(subject, assetBaseUrl) {
  const base = assetBaseUrl || process.env.ASSET_BASE_URL || 'http://localhost:5173'
  const manifestUrl = `${base.replace(/\/$/, '')}/adventure-assets/manifest.json`
  const res = await fetch(manifestUrl)
  if (!res.ok) throw new Error('Could not load asset manifest')
  const manifest = await res.json()
  const list = manifest[subject] || manifest.default || ['sparki-default.svg']
  return list.map((file) => `${base.replace(/\/$/, '')}/adventure-assets/${file}`)
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
  if (writtenPaths.length === 0) throw new Error('No images available')
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
  const ttsUrl = process.env.TTS_URL
  const assetBaseUrl = process.env.ASSET_BASE_URL
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (!ttsUrl || !blobToken) {
    return res.status(503).json({ error: 'Worker not configured: TTS_URL and BLOB_READ_WRITE_TOKEN required' })
  }

  let audioPath
  try {
    const script = buildScript(adventure.steps)
    if (!script.trim()) throw new Error('Empty script')
    const audioBuffer = await fetchTTS(script, ttsUrl)
    const imageUrls = await getImageList(adventure.subject || 'default', assetBaseUrl)
    if (!imageUrls.length) throw new Error('No images in manifest')

    const outPath = path.join(process.cwd(), `out_${Date.now()}.mp4`)
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
