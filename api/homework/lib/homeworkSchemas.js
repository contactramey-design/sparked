/**
 * Runtime contracts for the homework pipeline (analyze → explain → story).
 * Invalid model JSON → 502; invalid client payloads → 400.
 */
import { z } from 'zod'

const languageEnum = z.enum(['en', 'es'])

const analysisShape = {
  subject: z.string().max(8000),
  topic: z.string().max(8000),
  gradeBand: z.string().max(200).optional(),
  language: languageEnum,
  extractedText: z.string().max(200000),
  learningObjective: z.string().max(8000),
  confidence: z.coerce.number().min(0).max(1),
  needsReview: z.coerce.boolean(),
}

/** Output of /analyze and input shape for /explain and /story (unknown keys stripped by default). */
export const homeworkAnalysisInputSchema = z
  .object(analysisShape)
  .refine(
    (a) =>
      a.subject.trim().length > 0 ||
      a.topic.trim().length > 0 ||
      a.extractedText.trim().length > 0,
    { message: 'Analysis must include subject, topic, or extracted text.' },
  )

/** Strict analysis object returned to the client from /analyze. */
export const homeworkAnalysisOutputSchema = z
  .object(analysisShape)
  .strict()
  .refine(
    (a) =>
      a.subject.trim().length > 0 ||
      a.topic.trim().length > 0 ||
      a.extractedText.trim().length > 0,
    { message: 'Analysis must include subject, topic, or extracted text.' },
  )

/** Model output from /explain (practice questions may be empty on bad model). */
export const homeworkExplanationSchema = z
  .object({
    childExplanation: z.string().max(50000),
    steps: z.array(z.string().max(4000)).min(1).max(25),
    practiceQuestions: z.array(z.string().max(4000)).max(5),
    offlineTry: z.string().max(2000).optional(),
    parentNotes: z.string().max(10000).optional(),
  })
  .strict()
  .refine(
    (ex) =>
      ex.childExplanation.trim().length > 0 ||
      ex.steps.some((s) => typeof s === 'string' && s.trim().length > 0),
    { message: 'Explanation must include text or at least one step.' },
  )

/** Client- or storage-sourced explanation (e.g. story step); allows empty practice. */
export const homeworkExplanationInputSchema = z
  .object({
    childExplanation: z.string().max(50000).default(''),
    steps: z.array(z.string().max(4000)).max(25).default([]),
    practiceQuestions: z.array(z.string().max(4000)).max(5).default([]),
    offlineTry: z.string().max(2000).optional(),
    parentNotes: z.string().max(10000).optional(),
  })
  .refine(
    (ex) =>
      ex.steps.some((s) => s.trim().length > 0) || ex.childExplanation.trim().length > 0,
    { message: 'Explanation must include text or at least one step.' },
  )

const sceneSchema = z
  .object({
    sceneNumber: z.number().int().min(1).max(50),
    summary: z.string().max(12000),
    narration: z.string().max(12000),
    teachingPoint: z.string().max(12000),
  })
  .strict()

export const homeworkStorySchema = z
  .object({
    title: z.string().min(1).max(500),
    recap: z.string().max(12000),
    scenes: z.array(sceneSchema).min(1).max(12),
  })
  .strict()
  .refine(
    (story) =>
      story.scenes.every((sc) => sc.narration.trim().length > 0 || sc.summary.trim().length > 0),
    { message: 'Each scene needs narration or summary.' },
  )

/**
 * @param {z.ZodSchema} schema
 * @param {unknown} data
 * @param {'client'|'model'} source
 * @param {string} routeLabel
 */
export function assertHomeworkContract(schema, data, source, routeLabel) {
  const parsed = schema.safeParse(data)
  if (parsed.success) return parsed.data

  const statusCode = source === 'client' ? 400 : 502
  console.warn(`[homework/contract:${routeLabel}]`, parsed.error.flatten())
  const err = new Error(
    statusCode === 400
      ? 'Request did not match the homework data contract.'
      : 'AI response did not match the homework data contract.',
  )
  err.statusCode = statusCode
  err.code = 'HOMEWORK_CONTRACT'
  throw err
}
