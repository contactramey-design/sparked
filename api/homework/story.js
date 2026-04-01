/**
 * POST /api/homework/story
 * JSON body: analysis, explanation, checkout_session_id (optional)
 */
import { requireHomeworkEntitlement } from './lib/multipart.js'
import { openaiChatJson } from './lib/openai.js'
import {
  loadSquadNames,
  storySystemPrompt,
  storyUserPayload,
} from './lib/prompts.js'

function safeError(e) {
  const message = e.message || 'Something went wrong.'
  if (message.includes('OPENAI_API_KEY')) return 'Service not configured. Please try again later.'
  if (message.includes('429') || message.includes('Rate limit')) return 'Too many requests. Please try again in a moment.'
  if (message.includes('JSON') || message.includes('parse')) return 'Could not build story. Try again.'
  if (message.includes('OpenAI') || message.includes('fetch')) return 'Story service error. Please try again.'
  return message
}

function normalizeStory(raw) {
  const title = typeof raw.title === 'string' ? raw.title : 'SpArki story'
  const recap = typeof raw.recap === 'string' ? raw.recap : ''
  const scenes = Array.isArray(raw.scenes)
    ? raw.scenes
        .map((s, i) => ({
          sceneNumber: typeof s?.sceneNumber === 'number' ? s.sceneNumber : i + 1,
          summary: typeof s?.summary === 'string' ? s.summary : '',
          narration: typeof s?.narration === 'string' ? s.narration : '',
          teachingPoint: typeof s?.teachingPoint === 'string' ? s.teachingPoint : '',
        }))
        .filter((s) => s.narration || s.summary)
    : []
  return { title, scenes, recap }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const analysis = body.analysis
    const explanation = body.explanation
    const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id : ''

    if (!analysis || typeof analysis !== 'object') {
      res.status(400).json({ error: 'Missing analysis object' })
      return
    }
    if (!explanation || typeof explanation !== 'object') {
      res.status(400).json({ error: 'Missing explanation object' })
      return
    }

    const ent = await requireHomeworkEntitlement(checkoutSessionId)
    if (!ent.ok) {
      res.status(ent.status).json({ error: ent.message })
      return
    }

    const language = analysis.language === 'es' ? 'es' : 'en'
    const squadNames = await loadSquadNames()
    const userText = storyUserPayload(analysis, explanation)

    const parsed = await openaiChatJson({
      messages: [
        { role: 'system', content: storySystemPrompt(language, squadNames) },
        { role: 'user', content: userText },
      ],
      max_tokens: 2500,
    })

    const story = normalizeStory(parsed)
    if (story.scenes.length === 0) {
      throw new Error('Story had no valid scenes')
    }

    res.status(200).json(story)
  } catch (e) {
    console.error('[homework/story]', e.message || e)
    res.status(500).json({ error: safeError(e) })
  }
}
