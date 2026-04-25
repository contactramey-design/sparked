/**
 * POST /api/generate-visuals
 * JSON body: story (title + scenes), checkout_session_id, optional language, optional avatar_description
 * COPPA: Do not persist image URLs or prompts server-side; return URLs for client display only.
 */
import { requireHomeworkEntitlement } from './homework/lib/multipart.js'
import { loadSquadNames } from './homework/lib/prompts.js'
import { buildSceneImagePrompt } from './homework/lib/visualPrompts.js'
import { generateFluxSceneImage } from './homework/lib/visualProvider.js'

const MAX_SCENES = 6

function safeError(e) {
  const message = e?.message || 'Something went wrong.'
  if (message.includes('FAL_KEY')) return 'Scene art is not configured yet. Ask a grown-up to add FAL_KEY for this feature.'
  const m = String(message)
  const lower = m.toLowerCase()
  if (
    lower.includes('insufficient') ||
    lower.includes('balance') ||
    lower.includes('payment required') ||
    lower.includes('402')
  ) {
    return 'fal.ai credits are too low for scene art right now. Add credits (or switch to a cheaper model) and try again.'
  }
  if (m.includes('429') || lower.includes('rate limit') || lower.includes('quota')) {
    return 'Too many image requests. Please try again in a moment.'
  }
  if (message.includes('Image provider')) return 'Could not create scene art. Try again.'
  return message
}

function normalizeStory(body) {
  const story = body.story
  if (!story || typeof story !== 'object') return null
  const title = typeof story.title === 'string' ? story.title : 'Sparki story'
  const scenes = Array.isArray(story.scenes) ? story.scenes : []
  const normalized = scenes
    .map((s, i) => ({
      sceneNumber: typeof s?.sceneNumber === 'number' ? s.sceneNumber : i + 1,
      summary: typeof s?.summary === 'string' ? s.summary : '',
      narration: typeof s?.narration === 'string' ? s.narration : '',
      teachingPoint: typeof s?.teachingPoint === 'string' ? s.teachingPoint : '',
    }))
    .filter((s) => s.narration || s.summary)
    .slice(0, MAX_SCENES)
  if (normalized.length === 0) return null
  return { title, scenes: normalized }
}

/**
 * Run async tasks with max concurrency.
 * @template T
 * @param {T[]} items
 * @param {number} concurrency
 * @param {(item: T, index: number) => Promise<void>} fn
 */
async function poolMap(items, concurrency, fn) {
  const results = new Array(items.length)
  let idx = 0
  async function worker() {
    while (idx < items.length) {
      const i = idx++
      results[i] = await fn(items[i], i)
    }
  }
  const n = Math.min(concurrency, items.length || 1)
  await Promise.all(Array.from({ length: n }, () => worker()))
  return results
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id : ''
    const language = body.language === 'es' ? 'es' : 'en'
    const avatarDescription =
      typeof body.avatar_description === 'string' ? body.avatar_description.slice(0, 500) : ''

    const story = normalizeStory(body)
    if (!story) {
      res.status(400).json({ error: 'Missing or invalid story object with scenes' })
      return
    }

    const ent = await requireHomeworkEntitlement(checkoutSessionId)
    if (!ent.ok) {
      res.status(ent.status).json({ error: ent.message })
      return
    }

    const squadNames = await loadSquadNames()

    const prompts = story.scenes.map((scene) =>
      buildSceneImagePrompt({
        storyTitle: story.title,
        sceneNumber: scene.sceneNumber,
        narration: scene.narration,
        summary: scene.summary,
        teachingPoint: scene.teachingPoint,
        squadNames,
        language,
        avatarDescription: avatarDescription || undefined,
      }),
    )

    const urls = await poolMap(
      prompts,
      2,
      async (prompt) => generateFluxSceneImage(prompt),
    )

    const images = story.scenes.map((scene, i) => ({
      sceneNumber: scene.sceneNumber,
      url: urls[i],
    }))

    res.status(200).json({ images })
  } catch (e) {
    console.error('[generate-visuals]', e.message || e)
    res.status(500).json({ error: safeError(e) })
  }
}
