/**
 * POST /api/homework/analyze
 * multipart: image, language (en|es), optional gradeBand, subjectHint, checkout_session_id
 */
import { parseMultipart, requireHomeworkEntitlement } from './lib/multipart.js'
import { openaiChatJson } from './lib/openai.js'
import { analyzeSystemPrompt, analyzeUserContent } from './lib/prompts.js'

export const config = {
  api: { bodyParser: false },
}

function safeError(e) {
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

    try {
      const { fields, files } = await parseMultipart(req)
      const file = files?.image?.[0] ?? files?.image
      if (!file?.filepath) {
        res.status(400).json({ error: 'Missing or invalid "image" file' })
        return
      }
      const fs = await import('fs')
      imageBuffer = await fs.promises.readFile(file.filepath)
      mimeType = file.mimetype || mimeType
      const rawLocale = (fields?.language?.[0] ?? fields?.language ?? fields?.locale ?? '')
        .toString()
        .trim()
      if (rawLocale === 'es' || rawLocale === 'en') language = rawLocale
      gradeBand = (fields?.gradeBand?.[0] ?? fields?.gradeBand ?? '').toString().trim()
      subjectHint = (fields?.subjectHint?.[0] ?? fields?.subjectHint ?? '').toString().trim()
      checkoutSessionId = (fields?.checkout_session_id?.[0] ?? fields?.checkout_session_id ?? '')
        .toString()
        .trim()
    } catch (e) {
      if (e.code === 'LIMIT_FILE_SIZE' || e.message?.includes('maxFileSize')) {
        res.status(413).json({ error: 'Image too large. Please use an image under 4 MB.' })
        return
      }
      res.status(400).json({ error: 'Invalid upload. Please send one image as multipart field "image".' })
      return
    }

    const ent = await requireHomeworkEntitlement(checkoutSessionId)
    if (!ent.ok) {
      res.status(ent.status).json({ error: ent.message })
      return
    }

    const base64 = imageBuffer.toString('base64')
    const dataUrl = `data:${mimeType || 'image/jpeg'};base64,${base64}`

    const userContent = analyzeUserContent(dataUrl, gradeBand, subjectHint, language)
    const parsed = await openaiChatJson({
      messages: [
        { role: 'system', content: analyzeSystemPrompt(language) },
        { role: 'user', content: userContent },
      ],
      max_tokens: 2000,
    })

    const analysis = normalizeAnalysis(parsed, language)
    if (!analysis.subject && !analysis.topic && !analysis.extractedText) {
      throw new Error('Invalid analysis shape from model')
    }

    res.status(200).json(analysis)
  } catch (e) {
    console.error('[homework/analyze]', e.message || e)
    res.status(500).json({ error: safeError(e) })
  }
}
