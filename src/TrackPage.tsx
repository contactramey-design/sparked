import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { curriculum } from './curriculum'
import { getUnitStatus, isUnitLockedForTrack, getHasSafetyPass } from './progress'
import { useTranslation, useLocale } from './contexts/LocaleContext'
import { useTranslatedTrack } from './hooks/useTranslatedCurriculum'
import ListenButton from './components/ListenButton'
import { VIDEO_POSTER_DATA_URL } from './videoPoster'

const TrackPage: React.FC = () => {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()
  const hasSafetyPass = getHasSafetyPass()

  const track = curriculum.tracks.find((tr) => tr.id === trackId)
  const units = curriculum.units.filter((u) => u.trackId === trackId)
  const translatedTrack = track ? useTranslatedTrack(track) : null

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
      <header className="track-overview-header">
        <Link to="/tracks" className="link-back">
          {t('curriculum.backToTracks')}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="track-overview-title">{translatedTrack.title}</h1>
          <ListenButton text={translatedTrack.title} ariaLabel="Listen to track title" size="sm" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="track-overview-description">{translatedTrack.description}</p>
          <ListenButton text={translatedTrack.description} ariaLabel="Listen to track description" size="sm" />
        </div>
      </header>

      {introVideoSrc ? (
        <div className="track-intro-video video-wrapper">
          <video
            controls
            preload="metadata"
            poster={VIDEO_POSTER_DATA_URL}
            style={{ width: '100%', borderRadius: '12px' }}
            title={track.id === 'social-safety' ? 'Safety intro' : track.id === 'ai-coding' ? 'Coding intro' : undefined}
            aria-label={track.id === 'social-safety' ? 'Safety intro video' : track.id === 'ai-coding' ? 'Coding intro video' : undefined}
          >
            <source src={introVideoSrc} type="video/mp4" />
            Sorry, your browser doesn’t support the video tag.
          </video>
        </div>
      ) : (
        <div className="track-intro-placeholder card">
          <p>
            Imagine SpArki in this track&apos;s world – for AI &amp; Coding, SpArki
            might be sorting glowing blocks; for Safety, SpArki might be holding
            a friendly shield with a heart.
          </p>
        </div>
      )}

      <div className="track-units-list">
        <h2 className="track-units-title">{t('curriculum.unitsInTrack')}</h2>
        <ul className="track-unit-cards">
          {sortedUnits.map((unit, index) => {
            const lockedByProgress = isUnitLockedForTrack(unit.id)
            const status = getUnitStatus(unit.id)
            const mastered = !!status?.mastered
            const earnedSparkles = status?.earnedSparkles ?? 0
            const isPaidSafety =
              track.id === 'social-safety' && !unit.isFree
            const lockedByPayment = isPaidSafety && !hasSafetyPass
            const isLocked = lockedByPayment || lockedByProgress

            return (
              <li key={unit.id} className="track-unit-card-wrapper">
                <div className={`track-unit-card card ${isLocked ? 'track-unit-card-locked' : ''}`}>
                  <div className="track-unit-card-header">
                    <span className="track-unit-number">Unit {index + 1}</span>
                    {isLocked && (
                      <span className="track-unit-badge track-unit-badge-locked" aria-hidden>
                        🔒 Locked
                      </span>
                    )}
                    {!isLocked && mastered && (
                      <span className="track-unit-badge track-unit-badge-mastered" aria-hidden>
                        ⭐ Mastered
                      </span>
                    )}
                    {!isLocked && !mastered && (
                      <span className="track-unit-badge track-unit-badge-sparkles">
                        {unit.sparklesReward} sparkles
                      </span>
                    )}
                  </div>
                  <h3 className="track-unit-card-title">{t(`curriculum.units.${unit.id}.title`) || unit.title}</h3>
                  <p className="track-unit-card-summary">{t(`curriculum.units.${unit.id}.summary`) || unit.summary}</p>
                  {isLocked ? (
                    <div className="track-unit-card-action">
                      {lockedByPayment ? (
                        <span className="track-unit-locked-message">
                          Ask a grown-up to unlock the Safety Pass in Parent view.
                        </span>
                      ) : (
                        <span className="track-unit-locked-message">
                          Finish the previous unit to unlock.
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="track-unit-card-action">
                      <Link to={`/unit/${unit.id}`} className="primary-button">
                        Start unit
                      </Link>
                      {earnedSparkles > 0 && !mastered && (
                        <span className="track-unit-sparkles-earned">
                          {earnedSparkles} sparkles earned so far
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
