import { useEffect, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import type { HomeworkLanguage, HomeworkStory } from '../types/homework'
import { requestHomeworkVisuals } from '../lib/visualGenerator'
import { PresetAvatarPicker } from './PresetAvatarPicker'
import { getAvatarPreset, type AvatarPreset } from '../constants/avatarPresets'
import type { HomeworkStoryVisualItem } from '../types/homework'

type Props = {
  story: HomeworkStory
  language: HomeworkLanguage
  checkoutSessionId: string | null
  /** Persisted job fields */
  avatarPresetId?: string
  storyVisuals?: HomeworkStoryVisualItem[]
  onUpdateJob: (partial: {
    avatarPresetId?: string
    storyVisuals?: HomeworkStoryVisualItem[]
  }) => void
}

export function AdventureVisuals({
  story,
  language,
  checkoutSessionId,
  avatarPresetId,
  storyVisuals,
  onUpdateJob,
}: Props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasStrip = Boolean(storyVisuals && storyVisuals.length > 0)
  const [detailsOpen, setDetailsOpen] = useState(hasStrip)

  useEffect(() => {
    if (hasStrip) setDetailsOpen(true)
  }, [hasStrip])

  const onPresetChange = (next: AvatarPreset) => {
    onUpdateJob({ avatarPresetId: next.id })
  }

  const onGenerate = async () => {
    setError(null)
    setLoading(true)
    try {
      const p = getAvatarPreset(avatarPresetId)
      const images = await requestHomeworkVisuals(story, {
        language,
        checkoutSessionId,
        avatarDescription: p.imagePromptDescription,
      })
      onUpdateJob({ storyVisuals: images })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <details
      className="card homework-adventure-visuals homework-visuals-extra mt-6"
      open={detailsOpen}
      onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-lg font-bold text-blue-900 list-none flex items-center gap-2">
        <span aria-hidden className="homework-visuals-chevron select-none">
          ▸
        </span>
        <span id="homework-visuals-heading">{t('homeworkFeature.visualsExtraSummary')}</span>
      </summary>
      <p className="book-blurb text-sm mb-4 mt-3">{t('homeworkFeature.visualsBlurb')}</p>

      <PresetAvatarPicker valueId={avatarPresetId} onChange={onPresetChange} disabled={loading} />

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          className="primary-button"
          disabled={loading}
          onClick={onGenerate}
        >
          {loading ? t('homeworkFeature.visualsGenerating') : t('homeworkFeature.visualsCta')}
        </button>
      </div>

      {error ? <p className="quiz-error mt-3">{error}</p> : null}

      {storyVisuals && storyVisuals.length > 0 ? (
        <div className="homework-visuals-strip mt-6">
          <p className="text-sm font-semibold text-blue-800 mb-2">{t('homeworkFeature.visualsStripLabel')}</p>
          <div className="homework-visuals-scroll flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
            {storyVisuals.map((item) => (
              <figure
                key={`${item.sceneNumber}-${item.url.slice(-24)}`}
                className="homework-visuals-card shrink-0 snap-start"
              >
                <img
                  src={item.url}
                  alt=""
                  className="homework-visuals-img rounded-lg border border-blue-100 shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="text-xs text-blue-900 mt-1 text-center">
                  {t('homeworkFeature.sceneLabel')} {item.sceneNumber}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </details>
  )
}
