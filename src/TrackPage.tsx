import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { curriculum, getUnitsInTrackForBand, type TrackId } from './curriculum'
import { getUnitStatus, isUnitLockedForTrack } from './progress'
import { useTranslation, useLocale } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import AgeBandSelector from './components/AgeBandSelector'
import { useTranslatedTrack } from './hooks/useTranslatedCurriculum'
import ListenButton from './components/ListenButton'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'

const TrackPage: React.FC = () => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()
  const { ageBand } = useAgeBand()

  const track = curriculum.tracks.find((tr) => tr.id === trackId)
  const units = trackId ? getUnitsInTrackForBand(trackId as TrackId, ageBand) : []
  const translatedTrack = useTranslatedTrack(track)

  if (!track || !translatedTrack) {
    navigate('/tracks', { replace: true })
    return null
  }

  const introVideoSrc =
    locale === 'es' && track.introVideoUrlEs
      ? track.introVideoUrlEs
      : track.introVideoUrl
  const sortedUnits = [...units]

  return (
    <section className="lesson-page track-overview-page">
      <div className="track-age-band-toolbar">
        <AgeBandSelector variant="compact" />
      </div>
      <header className="track-overview-header">
        <Link to="/tracks" className="link-back">
          {t('curriculum.backToTracks')}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="track-overview-title">{translatedTrack.title}</h1>
          <ListenButton
            text={translatedTrack.title}
            ariaLabel={t('aiCodingGames.trackPage.listenTitleAria')}
            size="sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="track-overview-description">{translatedTrack.description}</p>
          <ListenButton
            text={translatedTrack.description}
            ariaLabel={t('aiCodingGames.trackPage.listenDescAria')}
            size="sm"
          />
        </div>
      </header>

      {introVideoSrc ? (
        <div className="track-intro-video video-wrapper">
          <video
            controls
            preload="metadata"
            poster={VIDEO_POSTER_DATA_URL}
            style={{ width: '100%', borderRadius: '12px' }}
            title={
              track.id === 'social-safety'
                ? t('aiCodingGames.trackPage.safetyVideoTitle')
                : track.id === 'ai-coding'
                  ? t('aiCodingGames.trackPage.codingVideoTitle')
                  : undefined
            }
            aria-label={
              track.id === 'social-safety'
                ? t('aiCodingGames.trackPage.safetyVideoAria')
                : track.id === 'ai-coding'
                  ? t('aiCodingGames.trackPage.codingVideoAria')
                  : undefined
            }
          >
            <source src={introVideoSrc} type="video/mp4" />
            {t('aiCodingGames.trackPage.videoUnsupported')}
          </video>
        </div>
      ) : (
        <div className="track-intro-placeholder card">
          <p>{t('aiCodingGames.trackPage.introPlaceholder')}</p>
        </div>
      )}

      <div className="track-units-list">
        <h2 className="track-units-title">{t('curriculum.unitsInTrack')}</h2>
        <ul className="track-unit-cards">
          {sortedUnits.map((unit, index) => {
            const lockedByProgress = isUnitLockedForTrack(unit.id, ageBand)
            const status = getUnitStatus(unit.id, ageBand)
            const mastered = !!status?.mastered
            const earnedSparkles = status?.earnedSparkles ?? 0
            const isLocked = lockedByProgress

            return (
              <li key={unit.id} className="track-unit-card-wrapper">
                <div className={`track-unit-card card ${isLocked ? 'track-unit-card-locked' : ''}`}>
                  <div className="track-unit-card-header">
                    <span className="track-unit-number">
                      {t('curriculum.unitNumber', { num: index + 1 })}
                    </span>
                    {isLocked && (
                      <span className="track-unit-badge track-unit-badge-locked" aria-hidden>
                        🔒 {t('curriculum.lockedBadge')}
                      </span>
                    )}
                    {!isLocked && mastered && (
                      <span className="track-unit-badge track-unit-badge-mastered" aria-hidden>
                        ⭐ {t('curriculum.masteredBadge')}
                      </span>
                    )}
                    {!isLocked && !mastered && (
                      <span className="track-unit-badge track-unit-badge-sparkles">
                        {t('curriculum.unitSparklesReward', {
                          count: unit.sparklesReward,
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="track-unit-card-title">{t(`curriculum.units.${unit.id}.title`) || unit.title}</h3>
                  <p className="track-unit-card-summary">{t(`curriculum.units.${unit.id}.summary`) || unit.summary}</p>
                  {isLocked ? (
                    <div className="track-unit-card-action">
                      <span className="track-unit-locked-message">
                        {t('curriculum.lockedByProgress')}
                      </span>
                    </div>
                  ) : (
                    <div className="track-unit-card-action">
                      <Link to={`/unit/${unit.id}`} className="primary-button">
                        {t('curriculum.startUnit')}
                      </Link>
                      {earnedSparkles > 0 && !mastered && (
                        <span className="track-unit-sparkles-earned">
                          {t('curriculum.sparklesEarnedSoFar', {
                            count: earnedSparkles,
                          })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default TrackPage
