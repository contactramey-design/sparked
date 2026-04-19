/**
 * POST /api/tutor-visual
 * Optional child-safe illustration for tutor reply (gated; rate limited).
 * Body: checkout_session_id?, access_token?, client_session_id, age_band, tutor_reply_snippet (short)
 */
import { verifyHomeworkCheckoutSession } from './lib/verifyBundleEntitlement.js'
import { rateLimit } from './lib/rateLimit.js'
import { estimateMiniCostUsd, getServiceSupabase, insertTutorApiEvent } from './lib/tutorTelemetry.js'

const MODEL = 'gpt-4o-mini'
const IMAGE_MODEL = 'dall-e-3'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (process.env.TUTOR_VISUAL_ENABLED !== 'true') {
    res.status(503).json({ error: 'Tutor visuals are not enabled.', code: 'TUTOR_VISUAL_DISABLED' })
    return
  }

  const rl = rateLimit(req, { key: 'tutor-visual', limit: 12, windowMs: 60 * 60 * 1000 })
  if (!rl.ok) {
    res.status(429).json({ error: 'Too many image requests. Try again later.' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  if (typeof body !== 'object' || body === null) body = {}

  const checkoutSessionId = typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''
  if (process.env.ALLOW_UNAUTH_TUTOR !== 'true') {
    const paid = await verifyHomeworkCheckoutSession(checkoutSessionId)
    if (!paid.ok) {
      res.status(403).json({ error: 'Adventure Academy required for tutor illustrations.' })
      return
    }
  }

  const snippet = typeof body.tutor_reply_snippet === 'string' ? body.tutor_reply_snippet.trim().slice(0, 1200) : ''
  if (!snippet) {
    res.status(400).json({ error: 'tutor_reply_snippet required' })
    return
  }

  const ageBand = typeof body.age_band === 'string' ? body.age_band.trim() : 'kids'
  const clientSessionId = typeof body.client_session_id === 'string' ? body.client_session_id.trim() : ''

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({ error: 'OpenAI not configured.' })
    return
  }

  /** Step 1: one-line image prompt (mini, cheap) */
  let imagePrompt = ''
  let pt = 0
  let ct = 0
  try {
    const pr = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content:
              'Return a single line: an English DALL-E 3 prompt for a child-friendly educational illustration. Pixar-style 3D, warm colors, simple, no text in image, no people faces, no logos, no real brands. Ages: ' +
              ageBand +
              '.',
          },
          { role: 'user', content: snippet },
        ],
        max_tokens: 120,
        temperature: 0.5,
      }),
    })
    if (!pr.ok) {
      res.status(502).json({ error: 'Could not build illustration prompt.' })
      return
    }
    const pdata = await pr.json()
    imagePrompt = pdata.choices?.[0]?.message?.content?.trim() || ''
    if (pdata.usage) {
      pt = pdata.usage.prompt_tokens || 0
      ct = pdata.usage.completion_tokens || 0
    }
  } catch {
    res.status(502).json({ error: 'Prompt step failed.' })
    return
  }

  if (!imagePrompt) {
    res.status(502).json({ error: 'Empty prompt.' })
    return
  }

  /** Step 2: image */
  let imageUrl = ''
  let imgCost = 0.04
  try {
    const ir = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt: imagePrompt.slice(0, 3500),
        size: '1024x1024',
        quality: 'standard',
        n: 1,
      }),
    })
    if (!ir.ok) {
      res.status(502).json({ error: 'Image generation failed.' })
      return
    }
    const idata = await ir.json()
    imageUrl = idata.data?.[0]?.url || ''
    imgCost = 0.04
  } catch {
    res.status(502).json({ error: 'Image request failed.' })
    return
  }

  const miniCost = estimateMiniCostUsd(pt, ct)
  const totalCost = Math.round((miniCost + imgCost) * 1_000_000) / 1_000_000

  const sb = getServiceSupabase()
  if (sb && clientSessionId) {
    await insertTutorApiEvent(sb, {
      event_type: 'tutor_visual',
      model: `${MODEL}+${IMAGE_MODEL}`,
      prompt_tokens: pt,
      completion_tokens: ct,
      estimated_cost_usd: totalCost,
      checkout_session_id: checkoutSessionId || null,
      client_session_id: clientSessionId,
      parent_user_id: null,
      age_band: ageBand,
      metadata: { image_url: imageUrl ? true : false },
    })
  }

  res.status(200).json({ url: imageUrl, estimated_cost_usd: totalCost })
}
