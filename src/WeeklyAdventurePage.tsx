import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { useB2CWeeklyEpisode } from './hooks/useB2CWeeklyEpisode'
import ListenButton from './components/ListenButton'
import { useTranslatedUnit } from './hooks/useTranslatedCurriculum'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'

const WeeklyAdventurePage: React.FC = () => {
  const { t } = useTranslation()
  const { resolved, entry, safetyUnit, aiUnit, totalWeeks } = useB2CWeeklyEpisode()
  const translatedSafety = useTranslatedUnit(safetyUnit)
  const translatedAi = useTranslatedUnit(aiUnit)

  const wk = String(resolved.weekIndex)
  const illustrationWeekFile = String(resolved.weekIndex).padStart(2, '0')

  // Put week illustrations in `public/weekly/season1/`:
  // - `week-01.png`, `week-02.png`, ... (png/jpg/webp all work as long as you use .png here)
  // If a file isn't uploaded yet, we fall back to a generic placeholder.
  const illustrationSrc = `/weekly/season1/week-${illustrationWeekFile}.png`
  const videoSrc = `/weekly/season1/week-${illustrationWeekFile}.mp4`
  const fallbackVideoSrc = '/Unit1b_intro_.mp4'
  const weeklyBridgeThumbSrc = '/weekly/season1/sparkis-two-world-bridge.png'
  const fallbackIllustrationSrc = '/globalposter.png'
  const [illustrationFailed, setIllustrationFailed] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    setIllustrationFailed(false)
    setVideoFailed(false)
  }, [resolved.weekIndex])

  const effectiveIllustrationSrc = illustrationFailed ? fallbackIllustrationSrc : illustrationSrc
  const illustrationAlt = t(`weekly.season1.weeks.${wk}.illustrationAlt`)

  const title = t(`weekly.season1.weeks.${wk}.title`)
  const story = t(`weekly.season1.weeks.${wk}.story`)
  const parentBlurb = t(`weekly.season1.weeks.${wk}.parentBlurb`)

  const storyForListen = `${title}. ${story}`

  if (!entry || !safetyUnit || !aiUnit) {
    return (
      <section className="lesson-page weekly-adventure-page">
        <p className="muted">{t('weekly.weeklyPage.browseTracks')}</p>
        <Link to="/tracks" className="primary-button">
          {t('weekly.weeklyPage.browseTracks')}
        </Link>
      </section>
    )
  }

  return (
    <section className="lesson-page weekly-adventure-page">
      <header className="lesson-header">
        <Link to="/" className="link-back">
          {t('weekly.weeklyPage.backHome')}
        </Link>
        <p className="weekly-week-badge">
          {t('weekly.weeklyPage.weekLabel', { week: resolved.weekIndex, total: totalWeeks })}
        </p>
        {resolved.isBeforeSeasonStart && (
          <p className="weekly-banner-note">{t('weekly.weeklyPage.previewBeforeLaunch')}</p>
        )}
        {resolved.isCappedAtMax && (
          <p className="weekly-banner-note">{t('weekly.weeklyPage.cappedNote')}</p>
        )}
      </header>

      <div className="weekly-hero card">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>

        <div className="weekly-video-wrap">
          <video
            controls
            preload="metadata"
            poster={weeklyBridgeThumbSrc || VIDEO_POSTER_DATA_URL}
            onError={() => setVideoFailed(true)}
            className="weekly-story-video"
          >
            <source src={videoFailed ? fallbackVideoSrc : videoSrc} type="video/mp4" />
            Sorry, your browser does not support embedded videos.
          </video>
        </div>

        <div className="weekly-hero-actions">
          <ListenButton text={storyForListen} ariaLabel={t('weekly.weeklyPage.storyHeading')} size="md" />
        </div>

        <div className="weekly-story-illustration" aria-label={t('weekly.weeklyPage.storyHeading')}>
          <img
            src={effectiveIllustrationSrc}
            alt={illustrationAlt}
            onError={() => setIllustrationFailed(true)}
            loading="lazy"
          />
        </div>
      </div>

      <div className="weekly-dual-grid">
        <article className="lesson-media card weekly-unit-card">
          <h3 className="text-lg font-bold text-slate-800">{t('weekly.weeklyPage.safetyHeading')}</h3>
          <p className="font-semibold text-primary mt-2">{translatedSafety?.title ?? safetyUnit.title}</p>
          <div className="weekly-card-actions mt-4 flex flex-wrap gap-2">
            <Link to={`/unit/${safetyUnit.id}`} className="primary-button">
              {t('weekly.weeklyPage.openUnit')}
            </Link>
            <Link to="/track/social-safety" className="secondary-button">
              {t('weekly.weeklyPage.openTrack')}
            </Link>
          </div>
        </article>

        <article className="lesson-media card weekly-unit-card">
          <h3 className="text-lg font-bold text-slate-800">{t('weekly.weeklyPage.aiHeading')}</h3>
          <p className="font-semibold text-primary mt-2">{translatedAi?.title ?? aiUnit.title}</p>
          <div className="weekly-card-actions mt-4 flex flex-wrap gap-2">
            <Link to={`/unit/${aiUnit.id}`} className="primary-button">
              {t('weekly.weeklyPage.openUnit')}
            </Link>
            <Link to="/track/ai-coding" className="secondary-button">
              {t('weekly.weeklyPage.openTrack')}
            </Link>
          </div>
        </article>
      </div>

      <div className="lesson-media card weekly-parent-card">
        <details>
          <summary className="weekly-parent-summary">{t('weekly.weeklyPage.parentHeading')}</summary>
          <p className="text-slate-700 mt-2 leading-relaxed">{parentBlurb}</p>
        </details>
      </div>

      <div className="weekly-footer-nav">
        <Link to="/tracks" className="link-muted">
          {t('weekly.weeklyPage.browseTracks')}
        </Link>
      </div>
    </section>
  )
}

export default WeeklyAdventurePage
