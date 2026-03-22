import React from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import AgeBandSelector from './components/AgeBandSelector'

const TrackListPage: React.FC = () => {
  const { t } = useTranslation()
  const tracks = [...curriculum.tracks].sort((a, b) => a.order - b.order)

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div className="welcome-card card">
          <h2>{t('curriculum.chooseAdventure')}</h2>
          <p className="welcome-subtitle">
            {t('curriculum.chooseAdventureSubtitle')}
          </p>
          <div className="track-list-age-band mt-4">
            <p className="muted text-sm mb-2">{t('ageBand.forThisSession')}</p>
            <AgeBandSelector variant="compact" />
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {tracks.map((track) => (
          <div key={track.id} className="card">
            <h3>{t(`curriculum.tracks.${track.id}.title`) || track.title}</h3>
            <p>{t(`curriculum.tracks.${track.id}.description`) || track.description}</p>
            <Link to={`/track/${track.id}`} className="primary-button">
              {t('curriculum.learnWithSparki')}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrackListPage

