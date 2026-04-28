/**
 * POST /api/homework/analyze
 * multipart: image (optional if worksheet_text), worksheet_text (optional if image),
 * language (en|es), optional gradeBand, subjectHint, checkout_session_id, access_token
 */
import { parseMultipart, requireHomeworkEntitlement } from './lib/multipart.js'
import { openaiChatJson } from './lib/openai.js'
import {
  analyzeSystemPrompt,
  analyzeTextSystemPrompt,
  analyzeTextUserContent,
  analyzeUserContent,
} from './lib/prompts.js'
import { assertHomeworkContract, homeworkAnalysisOutputSchema } from './lib/homeworkSchemas.js'
import { sanitizeHomeworkAnalysisFields, sanitizeHomeworkText } from './lib/sanitize.js'
import { enforceHomeworkParentRateLimit } from './lib/rateLimitHomeworkParent.js'

export const config = {
  api: { bodyParser: false },
}

function safeError(e) {
  if (e && e.code === 'HOMEWORK_CONTRACT' && e.statusCode === 502) {
    return 'The AI returned something we could not use. Try another photo or again in a moment.'
  }
  const message = e.message || 'Something went wrong.'
  if (message.includes('OPENAI_API_KEY')) return 'Service not configured. Please try again later.'
  if (message.includes('429') || message.includes('Rate limit')) return 'Too many requests. Please try again in a moment.'
  if (message.includes('JSON') || message.includes('parse')) return 'Could not read analysis. Try another photo.'
  if (message.includes('OpenAI') || message.includes('fetch')) return 'Analysis service error. Please try again.'
  return message
}

function normalizeAnalysis(raw, language) {
  const subject = typeof raw.subject === 'string' ? raw.subject : ''
  const topic = typeof raw.topic === 'string' ? raw.topic : ''
  const extractedText = typeof raw.extractedText === 'string' ? raw.extractedText : ''
  const learningObjective = typeof raw.learningObjective === 'string' ? raw.learningObjective : ''
  let confidence = Number(raw.confidence)
  if (Number.isNaN(confidence)) confidence = 0.5
  confidence = Math.min(1, Math.max(0, confidence))
  const needsReview = Boolean(raw.needsReview)
  const gradeBand =
    raw.gradeBand != null && raw.gradeBand !== '' ? String(raw.gradeBand) : undefined
  return {
    subject,
    topic,
    gradeBand,
    language: language === 'es' ? 'es' : 'en',
    extractedText,
    learningObjective,
    confidence,
    needsReview,
  }
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    let imageBuffer
    let mimeType = 'image/jpeg'
    let language = 'en'
    let gradeBand = ''
    let subjectHint = ''
    let checkoutSessionId = ''
    let accessToken = ''
    let worksheetText = ''

    try {
      const { fields, files } = await parseMultipart(req)
      const file = files?.image?.[0] ?? files?.image
      if (file?.filepath) {
        const fs = await import('fs')
        imageBuffer = await fs.promises.readFile(file.filepath)
        mimeType = file.mimetype || mimeType
      }
      const rawLocale = (fields?.language?.[0] ?? fields?.language ?? fields?.locale ?? '')
        .toString()
        .trim()
      if (rawLocale === 'es' || rawLocale === 'en') language = rawLocale
      gradeBand = (fields?.gradeBand?.[0] ?? fields?.gradeBand ?? '').toString().trim()
      subjectHint = (fields?.subjectHint?.[0] ?? fields?.subjectHint ?? '').toString().trim()
      checkoutSessionId = (fields?.checkout_session_id?.[0] ?? fields?.checkout_session_id ?? '')
        .toString()
        .trim()
      accessToken = (fields?.access_token?.[0] ?? fields?.access_token ?? '').toString().trim()
      const rawText = (fields?.worksheet_text?.[0] ?? fields?.worksheet_text ?? '').toString().trim()
      worksheetText = sanitizeHomeworkText(rawText).slice(0, 24_000)
      gradeBand = sanitizeHomeworkText(gradeBand).slice(0, 200)
      subjectHint = sanitizeHomeworkText(subjectHint).slice(0, 500)
    } catch (e) {
      if (e.code === 'LIMIT_FILE_SIZE' || e.message?.includes('maxFileSize')) {
        res.status(413).json({ error: 'Image too large. Please use an image under 4 MB.' })
        return
      }
      res.status(400).json({ error: 'Invalid upload. Send an image as "image" and/or worksheet text as "worksheet_text".' })
      return
    }

    const hasImage = Boolean(imageBuffer)
    const hasText = worksheetText.length > 0
    if (!hasImage && !hasText) {
      res.status(400).json({ error: 'Provide a worksheet photo or paste worksheet text.' })
      return
    }

    const ent = await requireHomeworkEntitlement(checkoutSessionId)
    if (!ent.ok) {
      res.status(ent.status).json({ error: ent.message })
      return
    }

    const rl = await enforceHomeworkParentRateLimit({ accessToken, res })
    if (!rl.ok) return

    let parsed
    if (hasImage) {
      const base64 = imageBuffer.toString('base64')
      const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64}`
      const userContent = analyzeUserContent(dataUrl, gradeBand, subjectHint, language)
      parsed = await openaiChatJson({
        messages: [
          { role: 'system', content: analyzeSystemPrompt(language) },
          { role: 'user', content: userContent },
        ],
        max_tokens: 2000,
      })
    } else {
      const userText = analyzeTextUserContent(worksheetText, gradeBand, subjectHint, language)
      parsed = await openaiChatJson({
        messages: [
          { role: 'system', content: analyzeTextSystemPrompt(language) },
          { role: 'user', content: userText },
        ],
        max_tokens: 2000,
      })
    }

    const analysis = normalizeAnalysis(parsed, language)
    const sanitized = sanitizeHomeworkAnalysisFields(analysis)
    const validated = assertHomeworkContract(
      homeworkAnalysisOutputSchema,
      sanitized,
      'model',
      'analyze',
    )

    const payload = typeof rl.remaining === 'number' ? { ...validated, remaining: rl.remaining } : validated
    res.status(200).json(payload)
  } catch (e) {
    console.error('[homework/analyze]', e.message || e)
    if (e && e.code === 'HOMEWORK_CONTRACT' && e.statusCode) {
      res.status(e.statusCode).json({ error: safeError(e) })
      return
    }
    res.status(500).json({ error: safeError(e) })
  }
}
