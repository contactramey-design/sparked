export interface ChatRequest {
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
}

export interface ChatResponse {
  reply: string
}

// Simple helper to talk to the /api/chat endpoint.
export async function sendChat(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Chat request failed')
  }

  return (await res.json()) as ChatResponse
}
