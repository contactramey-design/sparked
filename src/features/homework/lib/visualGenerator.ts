import type { HomeworkLanguage, HomeworkStory, HomeworkStoryVisualItem } from '../types/homework'

export async function requestHomeworkVisuals(
  story: HomeworkStory,
  opts: {
    language: HomeworkLanguage
    checkoutSessionId: string | null
    avatarDescription: string
  },
): Promise<HomeworkStoryVisualItem[]> {
  const res = await fetch('/api/generate-visuals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      story,
      language: opts.language,
      checkout_session_id: opts.checkoutSessionId ?? '',
      avatar_description: opts.avatarDescription,
    }),
  })
  if (!res.ok) {
    let msg = `Request failed (${res.status})`
    try {
      const data = await res.json()
      if (data && typeof data.error === 'string') msg = data.error
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  const data = (await res.json()) as { images?: HomeworkStoryVisualItem[] }
  if (!Array.isArray(data.images)) {
    throw new Error('Invalid response from scene art service')
  }
  return data.images
}
