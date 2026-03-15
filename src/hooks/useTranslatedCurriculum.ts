import type { TrackConfig, UnitConfig } from '../curriculum'
import { useLocale } from '../contexts/LocaleContext'

function getTranslatedTrack(
  track: TrackConfig,
  t: (key: string) => string,
): TrackConfig {
  return {
    ...track,
    title: t(`curriculum.tracks.${track.id}.title`) || track.title,
    description: t(`curriculum.tracks.${track.id}.description`) || track.description,
  }
}

function getTranslatedUnit(
  unit: UnitConfig,
  t: (key: string) => string,
  get: (key: string) => unknown,
): UnitConfig {
  const base = `curriculum.units.${unit.id}`
  const contentBlocksRaw = get(`${base}.contentBlocks`)
  const contentBlocks = Array.isArray(contentBlocksRaw)
    ? (contentBlocksRaw as string[])
    : unit.contentBlocks

  const activityRaw = get(`${base}.activity`) as { title?: string; description?: string } | undefined
  const activity = {
    ...unit.activity,
    title: activityRaw?.title ?? unit.activity.title,
    description: activityRaw?.description ?? unit.activity.description,
  }

  const quizQuestionsRaw = get(`${base}.quizQuestions`) as Array<{ prompt?: string; options?: string[] }> | undefined
  const quizQuestions = unit.quizQuestions.map((q, i) => {
    const tq = quizQuestionsRaw?.[i]
    return {
      ...q,
      prompt: tq?.prompt ?? q.prompt,
      options: tq?.options ?? q.options,
    }
  })

  const thinkPromptsRaw = get(`${base}.thinkPrompts`) as Array<{ label: string; text: string }> | undefined
  const thinkPrompts = Array.isArray(thinkPromptsRaw) && thinkPromptsRaw.length > 0
    ? thinkPromptsRaw
    : unit.thinkPrompts

  return {
    ...unit,
    title: t(`${base}.title`) || unit.title,
    summary: t(`${base}.summary`) || unit.summary,
    contentBlocks,
    activity,
    quizQuestions,
    ...(thinkPrompts != null && thinkPrompts.length > 0 ? { thinkPrompts } : {}),
  }
}

export function useTranslatedTrack(track: TrackConfig | null | undefined): TrackConfig | null {
  const { t } = useLocale()
  if (!track) return null
  return getTranslatedTrack(track, t)
}

export function useTranslatedUnit(unit: UnitConfig | null | undefined): UnitConfig | null {
  const { t, get } = useLocale()
  if (!unit) return null
  return getTranslatedUnit(unit, t, get)
}
