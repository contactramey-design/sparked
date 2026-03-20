import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { useB2CWeeklyEpisode } from './hooks/useB2CWeeklyEpisode'
import ListenButton from './components/ListenButton'
import { useTranslatedUnit } from './hooks/useTranslatedCurriculum'

const WeeklyAdventurePage: React.FC = () => {
  const { t } = useTranslation()
  const { resolved, entry, safetyUnit, aiUnit, totalWeeks } = useB2CWeeklyEpisode()
  const translatedSafety = useTranslatedUnit(safetyUnit)
  const translatedAi = useTranslatedUnit(aiUnit)

  const wk = String(resolved.weekIndex)

  const title = t(`weekly.season1.weeks.${wk}.title`)
  const tagline = t(`weekly.season1.weeks.${wk}.tagline`)
  const story = t(`weekly.season1.weeks.${wk}.story`)
  const parentBlurb = t(`weekly.season1.weeks.${wk}.parentBlurb`)

  const storyForListen = `${title}. ${tagline}. ${story}`

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
        <p className="welcome-subtitle muted">{t('weekly.weeklyPage.seasonLabel')}</p>
        <h1>{t('weekly.weeklyPage.title')}</h1>
        <p className="welcome-subtitle">{t('weekly.weeklyPage.subtitle')}</p>
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
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-600 font-medium mt-1">{tagline}</p>
          </div>
          <ListenButton text={storyForListen} ariaLabel={t('weekly.weeklyPage.storyHeading')} size="md" />
        </div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mt-4">
          {t('weekly.weeklyPage.storyHeading')}
        </h3>
        <p className="text-slate-700 mt-2 leading-relaxed">{story}</p>
      </div>

      <div className="weekly-dual-grid">
        <article className="lesson-media card weekly-unit-card">
          <h3 className="text-lg font-bold text-slate-800">{t('weekly.weeklyPage.safetyHeading')}</h3>
          <p className="font-semibold text-primary mt-2">{translatedSafety?.title ?? safetyUnit.title}</p>
          <p className="text-slate-600 text-sm mt-1">{translatedSafety?.summary ?? safetyUnit.summary}</p>
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
          <p className="text-slate-600 text-sm mt-1">{translatedAi?.summary ?? aiUnit.summary}</p>
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
        <h3 className="text-lg font-bold text-slate-800">{t('weekly.weeklyPage.parentHeading')}</h3>
        <p className="text-slate-700 mt-2 leading-relaxed">{parentBlurb}</p>
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
