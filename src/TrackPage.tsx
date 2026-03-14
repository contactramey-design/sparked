import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { curriculum } from './curriculum'
import { getUnitStatus, isUnitLockedForTrack, getHasSafetyPass } from './progress'

const TrackPage: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()
  const hasSafetyPass = getHasSafetyPass()

  const track = curriculum.tracks.find((t) => t.id === trackId)
  const units = curriculum.units.filter((u) => u.trackId === trackId)

  if (!track) {
    navigate('/tracks', { replace: true })
    return null
  }

  const sortedUnits = [...units]

  return (
    <section className="lesson-page track-overview-page">
      <header className="track-overview-header">
        <Link to="/tracks" className="link-back">
          ← Back to Tracks
        </Link>
        <h1 className="track-overview-title">{track.title}</h1>
        <p className="track-overview-description">{track.description}</p>
      </header>

      {track.introVideoUrl ? (
        <div className="track-intro-video video-wrapper">
          <video controls style={{ width: '100%', borderRadius: '12px' }}>
            <source src={track.introVideoUrl} type="video/mp4" />
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
        <h2 className="track-units-title">Units in this track</h2>
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
                  <h3 className="track-unit-card-title">{unit.title}</h3>
                  <p className="track-unit-card-summary">{unit.summary}</p>
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
