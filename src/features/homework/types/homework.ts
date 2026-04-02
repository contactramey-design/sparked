export type HomeworkLanguage = 'en' | 'es'

export type HomeworkMode = 'explain' | 'story'

export interface HomeworkAnalysis {
  subject: string
  topic: string
  gradeBand?: string
  language: HomeworkLanguage
  extractedText: string
  learningObjective: string
  confidence: number
  needsReview: boolean
}

export interface HomeworkExplanation {
  childExplanation: string
  steps: string[]
  practiceQuestions: string[]
  /** Short no-screen activity tied to the learning objective (from AI). */
  offlineTry?: string
  parentNotes?: string
}

export interface HomeworkStory {
  title: string
  scenes: Array<{
    sceneNumber: number
    summary: string
    narration: string
    teachingPoint: string
  }>
  recap: string
}

/** Scene stills from /api/generate-visuals (URLs from fal; not persisted on server). */
export interface HomeworkStoryVisualItem {
  sceneNumber: number
  url: string
}

export interface HomeworkJob {
  jobId: string
  createdAt: number
  mode: HomeworkMode
  language: HomeworkLanguage
  gradeBand?: string
  analysis: HomeworkAnalysis
  explanation?: HomeworkExplanation
  story?: HomeworkStory
  /** Optional small data URL for worksheet thumb (may be omitted if large) */
  previewDataUrl?: string
  isDemo?: boolean
  /** Selected preset id from HOMEWORK_AVATAR_PRESETS */
  avatarPresetId?: string
  /** Last generated scene images for this job */
  storyVisuals?: HomeworkStoryVisualItem[]
}
