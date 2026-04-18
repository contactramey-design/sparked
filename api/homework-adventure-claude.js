/**
 * POST /api/homework-adventure-claude
 * Proxies Anthropic Messages API for the Homework Adventure Video flow.
 * Body: same shape as Anthropic expects, plus optional checkout_session_id (stripped before upstream).
 */
import { requireHomeworkEntitlement } from './homework/lib/multipart.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
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

  const checkoutSessionId =
    typeof body.checkout_session_id === 'string' ? body.checkout_session_id.trim() : ''

  const ent = await requireHomeworkEntitlement(checkoutSessionId)
  if (!ent.ok) {
    res.status(ent.status).json({ error: ent.message })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim()
  if (!apiKey) {
    res.status(503).json({
      error: 'Homework adventure (Claude) is not configured. Set ANTHROPIC_API_KEY in project settings.',
    })
    return
  }

  const { checkout_session_id: _drop, ...anthropicPayload } = body

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(anthropicPayload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const msg =
        (data && typeof data.error === 'object' && data.error?.message) ||
        (typeof data.error === 'string' ? data.error : null) ||
        'Anthropic API error'
      res.status(response.status >= 400 && response.status < 600 ? response.status : 502).json({ error: msg })
      return
    }

    res.status(200).json(data)
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : 'Server error' })
  }
}
