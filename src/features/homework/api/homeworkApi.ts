import type { HomeworkAnalysis, HomeworkExplanation, HomeworkLanguage, HomeworkMode, HomeworkStory } from '../types/homework'

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; error?: string }
    if (data && typeof data.message === 'string' && data.message.trim()) return data.message
    if (data && typeof data.error === 'string') return data.error
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`
}

export type HomeworkAnalyzeResponse = HomeworkAnalysis & { remaining?: number }

export async function analyzeHomeworkInput(opts: {
  file?: File | null
  worksheetText?: string
  language: HomeworkLanguage
  gradeBand?: string
  subjectHint?: string
  checkoutSessionId?: string | null
  accessToken?: string | null
}): Promise<HomeworkAnalyzeResponse> {
  const text = (opts.worksheetText ?? '').trim()
  if (!opts.file && !text) {
    throw new Error('Choose a photo or paste worksheet text.')
  }

  const formData = new FormData()
  if (opts.file) formData.append('image', opts.file)
  if (text) formData.append('worksheet_text', text)
  formData.append('language', opts.language)
  if (opts.gradeBand) formData.append('gradeBand', opts.gradeBand)
  if (opts.subjectHint) formData.append('subjectHint', opts.subjectHint)
  if (opts.checkoutSessionId) formData.append('checkout_session_id', opts.checkoutSessionId)
  if (opts.accessToken) formData.append('access_token', opts.accessToken)

  const res = await fetch('/api/homework/analyze', {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error(await readError(res))
  return res.json() as Promise<HomeworkAnalyzeResponse>
}

/** @deprecated use analyzeHomeworkInput */
export async function analyzeWorksheet(
  file: File,
  opts: {
    language: 'en' | 'es'
    gradeBand?: string
    subjectHint?: string
    checkoutSessionId?: string | null
    accessToken?: string | null
  },
): Promise<HomeworkAnalyzeResponse> {
  return analyzeHomeworkInput({ file, ...opts })
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

export async function saveHomeworkAdventureSession(opts: {
  accessToken: string
  jobId: string
  checkoutSessionId?: string | null
  childId?: string | null
  analysis: HomeworkAnalysis
  mode: HomeworkMode
}): Promise<void> {
  const clientSessionId = `homework-${opts.jobId}`
  const res = await fetch('/api/homework/save-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token: opts.accessToken,
      client_session_id: clientSessionId,
      checkout_session_id: opts.checkoutSessionId ?? '',
      child_id: opts.childId || undefined,
      subject: opts.analysis.subject,
      topic: opts.analysis.topic,
      learning_objective: opts.analysis.learningObjective,
      language: opts.analysis.language,
      mode: opts.mode,
    }),
  })
  if (!res.ok) {
    const msg = await readError(res)
    throw new Error(msg)
  }
}
