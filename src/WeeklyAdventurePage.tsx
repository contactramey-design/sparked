import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { useB2CWeeklyEpisode } from './hooks/useB2CWeeklyEpisode'
import ListenButton from './components/ListenButton'
import { useTranslatedUnit } from './hooks/useTranslatedCurriculum'
import { getPlayerStats } from './progress'
import { useAgeBand } from './contexts/AgeBandContext'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const WeeklyAdventurePage: React.FC = () => {
  const { t } = useTranslation()
  const { ageBand, recommendedAgesShort } = useAgeBand()
  const { resolved, entry, safetyUnit, aiUnit } = useB2CWeeklyEpisode()
  const translatedSafety = useTranslatedUnit(safetyUnit)
  const translatedAi = useTranslatedUnit(aiUnit)

  const wk = String(resolved.weekIndex)
  const videoWeekFile = String(resolved.weekIndex).padStart(2, '0')

  // Video+cover assets are expected under:
  // - `public/weekly/season1/week-01.mp4` ... up to 52 weeks
  const weekVideoSrc = `/weekly/season1/week-${videoWeekFile}.mp4`
  const weeklyBridgeThumbSrc = '/weekly/season1/sparkis-two-world-bridge.png'
  const stats = getPlayerStats(ageBand)
  const sparkles = stats.totalSparkles
  const streakDays = stats.currentStreakDays || 0

  const title = t(`weekly.season1.weeks.${wk}.title`)
  const story = t(`weekly.season1.weeks.${wk}.story`)
  const parentBlurb = t(`weekly.season1.weeks.${wk}.parentBlurb`)

  const storyForListen = `${title}. ${story}`

  if (!entry || !safetyUnit || !aiUnit) {
    return (
      <AscentPageChrome
        title={t('weekly.weeklyPage.title')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('weekly.weeklyPage.title') },
        ]}
        contentMaxWidthClassName="max-w-lg"
      >
        <p className="text-slate-600">{t('weekly.weeklyPage.browseTracks')}</p>
        <Link to="/tracks" className="primary-button mt-4 inline-block">
          {t('weekly.weeklyPage.browseTracks')}
        </Link>
      </AscentPageChrome>
    )
  }

  return (
    <AscentPageChrome
      title={title}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('weekly.weeklyPage.title') },
        { label: title },
      ]}
    >
    <section className="weekly-adventure-page">
      {resolved.isBeforeSeasonStart && (
        <p className="weekly-banner-note mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {t('weekly.weeklyPage.previewBeforeLaunch')}
        </p>
      )}

      <div className="weekly-hero card rounded-2xl border border-teal-100/80">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{t('weekly.weeklyPage.storyHeading')}</p>
        <p className="mt-2 text-sm text-slate-600">{t('curriculum.ageDisclaimer', { ages: recommendedAgesShort })}</p>

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
        <Link to="/tracks" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
          {t('weekly.weeklyPage.browseTracks')}
        </Link>
      </div>
    </section>
    </AscentPageChrome>
  )
}

export default WeeklyAdventurePage
