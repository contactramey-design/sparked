import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import type { HomeworkLanguage, HomeworkStory } from '../types/homework'
import { requestHomeworkVisuals } from '../lib/visualGenerator'
import { PresetAvatarPicker } from './PresetAvatarPicker'
import { CustomAvatarBuilder } from './CustomAvatarBuilder'
import { getAvatarPreset, type AvatarPreset } from '../constants/avatarPresets'
import type { HomeworkStoryVisualItem } from '../types/homework'
import { getAvatarDescriptionForGeneration } from '../lib/homeworkAvatarSession'

type Props = {
  story: HomeworkStory
  language: HomeworkLanguage
  checkoutSessionId: string | null
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
  const [carouselIndex, setCarouselIndex] = useState(0)
  /** Bumps when custom avatar session changes so prompts re-read storage. */
  const [avatarRev, setAvatarRev] = useState(0)

  const hasStrip = Boolean(storyVisuals && storyVisuals.length > 0)

  const effectiveAvatarDescription = useMemo(() => {
    void avatarRev
    const p = getAvatarPreset(avatarPresetId)
    return getAvatarDescriptionForGeneration(p.imagePromptDescription)
  }, [avatarPresetId, avatarRev])

  const onPresetChange = useCallback(
    (preset: AvatarPreset) => {
      onUpdateJob({ avatarPresetId: preset.id })
    },
    [onUpdateJob],
  )

  const bumpAvatar = useCallback(() => setAvatarRev((x) => x + 1), [])

  const onGenerate = async () => {
    setError(null)
    setLoading(true)
    setCarouselIndex(0)
    try {
      const images = await requestHomeworkVisuals(story, {
        language,
        checkoutSessionId,
        avatarDescription: effectiveAvatarDescription,
      })
      onUpdateJob({ storyVisuals: images })
    } catch (e) {
      setError(e instanceof Error ? e.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(false)
    }
  }

  const nScenes = storyVisuals?.length ?? 0
  const current = nScenes > 0 ? storyVisuals![Math.min(carouselIndex, nScenes - 1)] : null

  const goPrev = () => setCarouselIndex((i) => (i <= 0 ? Math.max(0, nScenes - 1) : i - 1))
  const goNext = () => setCarouselIndex((i) => (nScenes <= 0 ? 0 : (i + 1) % nScenes))

  return (
    <section
      className="card homework-adventure-visuals homework-visuals-panel mt-6"
      aria-labelledby="homework-visuals-heading"
    >
      <h3 id="homework-visuals-heading" className="text-lg font-bold text-blue-900">
        {t('homeworkFeature.visualsHeading')}
      </h3>
      <p className="book-blurb text-sm mb-4 mt-2">{t('homeworkFeature.visualsBlurb')}</p>
      {hasStrip ? (
        <p className="text-sm text-emerald-800 font-medium mb-3">{t('homeworkFeature.visualsAutoNote')}</p>
      ) : (
        <p className="text-sm text-slate-600 mb-3">{t('homeworkFeature.visualsManualHint')}</p>
      )}

      <PresetAvatarPicker valueId={avatarPresetId} onChange={onPresetChange} disabled={loading} />

      <CustomAvatarBuilder disabled={loading} onChange={bumpAvatar} />

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button type="button" className="primary-button" disabled={loading} onClick={() => void onGenerate()}>
          {loading ? t('homeworkFeature.visualsGenerating') : t('homeworkFeature.visualsCta')}
        </button>
      </div>

      {error ? <p className="quiz-error mt-3">{error}</p> : null}

      {current ? (
        <div className="homework-visuals-carousel mt-6">
          <p className="text-sm font-semibold text-blue-800 mb-2">{t('homeworkFeature.visualsStripLabel')}</p>
          <div className="homework-visuals-carousel-frame relative rounded-xl border border-blue-100 bg-slate-50 p-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="homework-visuals-carousel-btn shrink-0"
                onClick={goPrev}
                aria-label={t('homeworkFeature.visualsPrev')}
              >
                ‹
              </button>
              <figure className="flex-1 min-w-0 text-center">
                <img
                  src={current.url}
                  alt=""
                  className="homework-visuals-img mx-auto max-h-[min(52vh,420px)] w-auto max-w-full rounded-lg border border-blue-100 shadow-sm object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="text-xs text-blue-900 mt-2">
                  {t('homeworkFeature.sceneLabel')} {current.sceneNumber} ({carouselIndex + 1}/{nScenes})
                </figcaption>
              </figure>
              <button
                type="button"
                className="homework-visuals-carousel-btn shrink-0"
                onClick={goNext}
                aria-label={t('homeworkFeature.visualsNext')}
              >
                ›
              </button>
            </div>
            <div className="homework-visuals-scroll flex gap-2 overflow-x-auto pb-1 pt-3 justify-center snap-x snap-mandatory">
              {storyVisuals!.map((item, idx) => (
                <button
                  key={`${item.sceneNumber}-${item.url.slice(-20)}`}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`homework-visuals-thumb shrink-0 snap-start rounded-md border-2 overflow-hidden p-0 bg-white ${
                    idx === carouselIndex ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent opacity-80'
                  }`}
                  aria-label={t('homeworkFeature.sceneLabel') + ' ' + item.sceneNumber}
                >
                  <img
                    src={item.url}
                    alt=""
                    className="h-16 w-28 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
