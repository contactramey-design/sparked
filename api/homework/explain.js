/**
 * POST /api/homework/explain
 * JSON body: analysis (object), checkout_session_id (optional string)
 */
import { requireHomeworkEntitlement } from './lib/multipart.js'
import { openaiChatJson } from './lib/openai.js'
import { explainSystemPrompt, explainUserPayload } from './lib/prompts.js'

function safeError(e) {
  const message = e.message || 'Something went wrong.'
  if (message.includes('OPENAI_API_KEY')) return 'Service not configured. Please try again later.'
  if (message.includes('429') || message.includes('Rate limit')) return 'Too many requests. Please try again in a moment.'
  if (message.includes('JSON') || message.includes('parse')) return 'Could not build explanation. Try again.'
  if (message.includes('OpenAI') || message.includes('fetch')) return 'Explanation service error. Please try again.'
  return message
}

function normalizeExplanation(raw) {
  const childExplanation = typeof raw.childExplanation === 'string' ? raw.childExplanation : ''
  const steps = Array.isArray(raw.steps) ? raw.steps.map((s) => String(s)).filter(Boolean) : []
  let practiceQuestions = Array.isArray(raw.practiceQuestions)
    ? raw.practiceQuestions.map((s) => String(s)).filter(Boolean)
    : []
  practiceQuestions = practiceQuestions.slice(0, 5)
  const parentNotes = typeof raw.parentNotes === 'string' ? raw.parentNotes : undefined
  return { childExplanation, steps, practiceQuestions, parentNotes }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const analysis = body.analysis
    const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id : ''

    if (!analysis || typeof analysis !== 'object') {
      res.status(400).json({ error: 'Missing analysis object' })
      return
    }

    const ent = await requireHomeworkEntitlement(checkoutSessionId)
    if (!ent.ok) {
      res.status(ent.status).json({ error: ent.message })
      return
    }

    const language = analysis.language === 'es' ? 'es' : 'en'
    const userText = explainUserPayload({
      ...analysis,
      language,
    })

    const parsed = await openaiChatJson({
      messages: [
        { role: 'system', content: explainSystemPrompt(language) },
        { role: 'user', content: userText },
      ],
      max_tokens: 2000,
    })

    const explanation = normalizeExplanation(parsed)
    res.status(200).json(explanation)
  } catch (e) {
    console.error('[homework/explain]', e.message || e)
    res.status(500).json({ error: safeError(e) })
  }
}
