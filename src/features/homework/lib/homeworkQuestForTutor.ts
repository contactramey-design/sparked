import type { HomeworkJob } from '../types/homework'

export const HOMEWORK_QUEST_FOR_TUTOR_SESSION_KEY = 'sparki_homework_quest_for_tutor_v1'
const QUEST_HANDOFF_DAY_KEY = 'sparki_hw_quest_handoff_day_v1'
const QUEST_HANDOFF_COUNT_KEY = 'sparki_hw_quest_handoff_count_v1'
const MAX_HANDOFFS_PER_DAY = 5

export function buildHomeworkQuestForTutor(job: HomeworkJob): string {
  const lines: string[] = []
  const title = job.story?.title || job.analysis.topic || 'Homework'
  lines.push(`Adventure title: ${title}`)
  lines.push(`Subject: ${job.analysis.subject}. Topic: ${job.analysis.topic}.`)
  if (job.story?.scenes?.length) {
    job.story.scenes.forEach((scene, i) => {
      lines.push(
        `Scene ${i + 1}: ${scene.summary} Teaching point: ${scene.teachingPoint}. Narration hint: ${scene.narration}`,
      )
    })
  } else if (job.explanation) {
    lines.push(`Explanation for the child: ${job.explanation.childExplanation}`)
    ;(job.explanation.steps || []).slice(0, 8).forEach((step, i) => {
      lines.push(`Step ${i + 1}: ${step}`)
    })
  }
  return lines.join('\n').slice(0, 8000)
}

export function saveHomeworkQuestForTutorSession(text: string) {
  try {
    sessionStorage.setItem(HOMEWORK_QUEST_FOR_TUTOR_SESSION_KEY, text)
  } catch {
    /* ignore */
  }
}

export function readHomeworkQuestForTutorSession(): string {
  try {
    return sessionStorage.getItem(HOMEWORK_QUEST_FOR_TUTOR_SESSION_KEY) || ''
  } catch {
    return ''
  }
}

export function clearHomeworkQuestForTutorSession() {
  try {
    sessionStorage.removeItem(HOMEWORK_QUEST_FOR_TUTOR_SESSION_KEY)
  } catch {
    /* ignore */
  }
}

export function canHomeworkQuestHandoffToday(): boolean {
  try {
    const day = new Date().toISOString().slice(0, 10)
    const stored = localStorage.getItem(QUEST_HANDOFF_DAY_KEY)
    if (stored !== day) {
      localStorage.setItem(QUEST_HANDOFF_DAY_KEY, day)
      localStorage.setItem(QUEST_HANDOFF_COUNT_KEY, '0')
      return true
    }
    const n = parseInt(localStorage.getItem(QUEST_HANDOFF_COUNT_KEY) || '0', 10)
    return Number.isFinite(n) && n < MAX_HANDOFFS_PER_DAY
  } catch {
    return true
  }
}

export function bumpHomeworkQuestHandoffCount() {
  try {
    const n = parseInt(localStorage.getItem(QUEST_HANDOFF_COUNT_KEY) || '0', 10)
    localStorage.setItem(QUEST_HANDOFF_COUNT_KEY, String(Math.min(MAX_HANDOFFS_PER_DAY, n + 1)))
  } catch {
    /* ignore */
  }
}
