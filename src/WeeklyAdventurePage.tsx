import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { useB2CWeeklyEpisode } from './hooks/useB2CWeeklyEpisode'
import ListenButton from './components/ListenButton'
import { useTranslatedUnit } from './hooks/useTranslatedCurriculum'
import { getPlayerStats } from './progress'
import { resolveB2CWeekIndex } from './weekly/b2cSeasonConfig'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'

const WeeklyAdventurePage: React.FC = () => {
  const { t } = useTranslation()
  const { resolved, entry, safetyUnit, aiUnit } = useB2CWeeklyEpisode()
  const translatedSafety = useTranslatedUnit(safetyUnit)
  const translatedAi = useTranslatedUnit(aiUnit)

  const wk = String(resolved.weekIndex)
  const videoResolvedWeek = resolveB2CWeekIndex(Date.now(), 52)
  const videoWeekIndex = videoResolvedWeek.weekIndex
  const videoWeekFile = String(videoWeekIndex).padStart(2, '0')

  // Video+cover assets are expected under:
  // - `public/weekly/season1/week-01.mp4` ... up to 52 weeks
  const weekVideoSrc = `/weekly/season1/week-${videoWeekFile}.mp4`
  const weeklyBridgeThumbSrc = '/weekly/season1/sparkis-two-world-bridge.png'
  const [sparkles, setSparkles] = useState(0)
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    const stats = getPlayerStats()
    setSparkles(stats.totalSparkles)
    setStreakDays(stats.currentStreakDays || 0)
  }, [videoWeekIndex])

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
        {resolved.isBeforeSeasonStart && <p className="weekly-banner-note">{t('weekly.weeklyPage.previewBeforeLaunch')}</p>}
      </header>

      <div className="weekly-hero card">
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>

        <div className="weekly-hero-content-row">
          <div className="weekly-hero-media">
            <div className="weekly-video-wrap">
              <video
                controls
                preload="none"
                poster={weeklyBridgeThumbSrc || VIDEO_POSTER_DATA_URL}
                className="weekly-story-video"
              >
                <source src={weekVideoSrc} type="video/mp4" />
                Sorry, your browser does not support embedded videos.
              </video>
            </div>

            <div className="weekly-hero-actions">
              <ListenButton
                text={storyForListen}
                ariaLabel={t('weekly.weeklyPage.storyHeading')}
                size="md"
              />
            </div>
          </div>
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

      <div className="lesson-media card weekly-bottom-badges">
        <aside className="side-bubble-badges side-bubble-badges--bottom" aria-label={t('home.hiSparkles', { name: 'Explorer', count: sparkles })}>
          <div
            className="side-bubble-badge side-bubble-badge--sparkles"
            aria-label={t('home.hiSparkles', { name: 'Explorer', count: sparkles })}
          >
            <span className="side-bubble-badge-icon" aria-hidden>
              ✦
            </span>
            <span className="side-bubble-badge-value" aria-hidden>
              {sparkles}
            </span>
          </div>
          <div
            className="side-bubble-badge side-bubble-badge--streak"
            aria-label={t('home.streakLine', { count: streakDays })}
          >
            <span className="side-bubble-badge-icon" aria-hidden>
              🔥
            </span>
            <span className="side-bubble-badge-value" aria-hidden>
              {streakDays}
            </span>
          </div>
        </aside>
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
