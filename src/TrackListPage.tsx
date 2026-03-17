import React from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from './curriculum'
import { getHasSafetyPass } from './progress'
import { useTranslation } from './contexts/LocaleContext'

const TrackListPage: React.FC = () => {
  const { t } = useTranslation()
  const tracks = [...curriculum.tracks].sort((a, b) => a.order - b.order)
  const hasSafetyPass = getHasSafetyPass()

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div className="welcome-card card">
          <h2>{t('curriculum.chooseAdventure')}</h2>
          <p className="welcome-subtitle">
            {t('curriculum.chooseAdventureSubtitle')}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {tracks.map((track) => {
          const isSafetyTrack = track.id === 'social-safety'
          const lockedByPass = !isSafetyTrack && !hasSafetyPass
          return (
            <div key={track.id} className="card">
              <h3>{t(`curriculum.tracks.${track.id}.title`) || track.title}</h3>
              <p>{t(`curriculum.tracks.${track.id}.description`) || track.description}</p>
              {lockedByPass ? (
                <p className="track-unit-locked-message">
                  {t('curriculum.lockedByPayment')}
                </p>
              ) : (
                <Link to={`/track/${track.id}`} className="primary-button">
                  {t('curriculum.learnWithSparki')}
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default TrackListPage

