/**
 * OpenAI chat helpers for homework pipeline (JSON responses).
 */

export function parseModelJson(raw) {
  if (!raw || typeof raw !== 'string') throw new Error('Empty model response')
  let jsonStr = raw.trim()
  const codeMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (codeMatch) jsonStr = codeMatch[1].trim()
  return JSON.parse(jsonStr)
}

async function openaiChatCompletion({ apiKey, model, messages, max_tokens }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(
      res.status === 429 ? 'Rate limit. Please try again in a moment.' : `OpenAI error: ${errText}`,
    )
  }

  const data = await res.json()
  const raw = data.choices?.[0]?.message?.content?.trim()
  if (!raw) throw new Error('No content from model')
  return raw
}

export async function openaiChatJson({ model = 'gpt-4o', messages, max_tokens = 2500, _repair = false }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  let raw
  try {
    raw = await openaiChatCompletion({ apiKey, model, messages, max_tokens })
    return parseModelJson(raw)
  } catch (e) {
    const isParse =
      e instanceof SyntaxError ||
      (e && typeof e.message === 'string' && (e.message.includes('JSON') || e.message.includes('Unexpected token')))
    if (!_repair && isParse) {
      const repairMsg = {
        role: 'user',
        content:
          'Your last reply was not valid JSON. Respond with one JSON object only (no markdown fences, no extra text).',
      }
      return openaiChatJson({
        model,
        messages: [...messages, repairMsg],
        max_tokens: Math.min(max_tokens, 2000),
        _repair: true,
      })
    }
    throw e
  }
}
