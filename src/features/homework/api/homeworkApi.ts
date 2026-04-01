import type { HomeworkAnalysis, HomeworkExplanation, HomeworkStory } from '../types/homework'

async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (data && typeof data.error === 'string') return data.error
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`
}

export async function analyzeWorksheet(
  file: File,
  opts: {
    language: 'en' | 'es'
    gradeBand?: string
    subjectHint?: string
    checkoutSessionId?: string | null
  },
): Promise<HomeworkAnalysis> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('language', opts.language)
  if (opts.gradeBand) formData.append('gradeBand', opts.gradeBand)
  if (opts.subjectHint) formData.append('subjectHint', opts.subjectHint)
  if (opts.checkoutSessionId) formData.append('checkout_session_id', opts.checkoutSessionId)

  const res = await fetch('/api/homework/analyze', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<HomeworkAnalysis>
}

export async function explainWorksheet(
  analysis: HomeworkAnalysis,
  checkoutSessionId?: string | null,
): Promise<HomeworkExplanation> {
  const res = await fetch('/api/homework/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysis,
      checkout_session_id: checkoutSessionId ?? '',
    }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<HomeworkExplanation>
}

export async function storyFromLesson(
  analysis: HomeworkAnalysis,
  explanation: HomeworkExplanation,
  checkoutSessionId?: string | null,
): Promise<HomeworkStory> {
  const res = await fetch('/api/homework/story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      analysis,
      explanation,
      checkout_session_id: checkoutSessionId ?? '',
    }),
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<HomeworkStory>
}
