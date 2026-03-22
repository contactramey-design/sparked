import type { TrackConfig, UnitConfig } from '../curriculum'
import type { AgeBandId } from '../ageBand'
import { useLocale } from '../contexts/LocaleContext'
import { useAgeBand } from '../contexts/AgeBandContext'

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

/**
 * Merges locale JSON: base `curriculum.units.<id>.*` with optional
 * `curriculum.units.<id>.bands.<tots|kids|crew>.*` for age-appropriate copy
 * (same unit id, same videos/games — different text delivery).
 */
function getTranslatedUnit(
  unit: UnitConfig,
  t: (key: string) => string,
  get: (key: string) => unknown,
  ageBand: AgeBandId,
): UnitConfig {
  const base = `curriculum.units.${unit.id}`
  const bandKey = `${base}.bands.${ageBand}`
  const bandRaw = get(bandKey) as Record<string, unknown> | undefined

  const contentBlocksRaw = get(`${base}.contentBlocks`)
  const baseContentBlocks = Array.isArray(contentBlocksRaw)
    ? (contentBlocksRaw as string[])
    : unit.contentBlocks

  const bandBlocks = bandRaw?.contentBlocks
  const contentBlocks =
    Array.isArray(bandBlocks) && (bandBlocks as unknown[]).length > 0
      ? (bandBlocks as string[])
      : baseContentBlocks

  const activityRaw = get(`${base}.activity`) as { title?: string; description?: string } | undefined
  const bandActivity = bandRaw?.activity as { title?: string; description?: string } | undefined
  const activity = {
    ...unit.activity,
    title: bandActivity?.title ?? activityRaw?.title ?? unit.activity.title,
    description: bandActivity?.description ?? activityRaw?.description ?? unit.activity.description,
  }

  const quizQuestionsRaw = get(`${base}.quizQuestions`) as
    | Array<{ prompt?: string; options?: string[] }>
    | undefined
  const bandQuiz = bandRaw?.quizQuestions as Array<{ prompt?: string; options?: string[] }> | undefined
  const quizQuestions = unit.quizQuestions.map((q, i) => {
    const tq = quizQuestionsRaw?.[i]
    const bq = bandQuiz?.[i]
    return {
      ...q,
      prompt: bq?.prompt ?? tq?.prompt ?? q.prompt,
      options: bq?.options ?? tq?.options ?? q.options,
    }
  })

  const thinkPromptsRaw = get(`${base}.thinkPrompts`) as Array<{ label: string; text: string }> | undefined
  const bandThink = bandRaw?.thinkPrompts as Array<{ label: string; text: string }> | undefined
  const thinkPromptsMerged =
    Array.isArray(bandThink) && bandThink.length > 0
      ? bandThink
      : Array.isArray(thinkPromptsRaw) && thinkPromptsRaw.length > 0
        ? thinkPromptsRaw
        : unit.thinkPrompts
  const thinkPrompts = thinkPromptsMerged

  const title =
    typeof bandRaw?.title === 'string' && bandRaw.title.trim().length > 0
      ? (bandRaw.title as string)
      : t(`${base}.title`) || unit.title
  const summary =
    typeof bandRaw?.summary === 'string' && bandRaw.summary.trim().length > 0
      ? (bandRaw.summary as string)
      : t(`${base}.summary`) || unit.summary

  return {
    ...unit,
    title,
    summary,
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
  const { ageBand } = useAgeBand()
  if (!unit) return null
  return getTranslatedUnit(unit, t, get, ageBand)
}
