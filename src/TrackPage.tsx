import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { curriculum } from './curriculum'
import { getUnitStatus, isUnitLockedForTrack } from './progress'

const TrackPage: React.FC = () => {
  const { trackId } = useParams<{ trackId: string }>()
  const navigate = useNavigate()

  const track = curriculum.tracks.find((t) => t.id === trackId)
  const units = curriculum.units.filter((u) => u.trackId === trackId)

  if (!track) {
    navigate('/tracks', { replace: true })
    return null
  }

  const sortedUnits = [...units]

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <h2>{track.title}</h2>
        <Link to="/tracks" className="link-back">
          ← Back to Tracks
        </Link>
      </header>

      <div className="lesson-layout">
        <div className="lesson-media">
          <p>{track.description}</p>

          {track.id === 'social-safety' && (
            <div className="video-wrapper">
              <video
                controls
                style={{ width: '100%', borderRadius: 'var(--radius-md)' }}
              >
                <source src="/safetyAppIntro.mp4" type="video/mp4" />
                Sorry, your browser doesn’t support the video tag.
              </video>
            </div>
          )}

          {track.id !== 'social-safety' && (
            <div className="animation-placeholder">
              <p>
                Imagine SpArki in this track&apos;s world – for AI &amp; Coding, SpArki
                might be sorting glowing blocks; for Safety, SpArki might be holding
                a friendly shield with a heart.
              </p>
            </div>
          )}
        </div>

        <div className="lesson-quiz card">
          <h3>Units in This Track</h3>
          <ul className="lesson-list">
            {sortedUnits.map((unit) => {
              const locked = isUnitLockedForTrack(unit.id)
              const status = getUnitStatus(unit.id)
              const mastered = !!status?.mastered

              return (
                <li key={unit.id}>
                  {locked ? (
                    <div className="locked-unit">
                      <span className="lesson-title">{unit.title}</span>
                      <span className="lesson-sparks">Locked · finish previous</span>
                    </div>
                  ) : (
                    <Link to={`/unit/${unit.id}`}>
                      <span className="lesson-title">{unit.title}</span>
                      <span className="lesson-sparks">
                        {mastered ? 'Mastered · ⭐' : `${unit.sparklesReward} sparkles`}
                      </span>
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export default TrackPage
