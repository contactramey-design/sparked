import React from 'react'
import { Link } from 'react-router-dom'
import { curriculum } from './curriculum'

const TrackListPage: React.FC = () => {
  const tracks = [...curriculum.tracks].sort((a, b) => a.order - b.order)

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div className="welcome-card card">
          <h2>Choose Your Adventure with SpArki</h2>
          <p className="welcome-subtitle">
            SpArki, the blue robotic teddy-bear teacher, has two paths for Age 5–11
            explorers. Pick one to begin.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {tracks.map((track) => (
          <div key={track.id} className="card">
            <h3>{track.title}</h3>
            <p>{track.description}</p>
            <Link to={`/track/${track.id}`} className="primary-button">
              Learn with SpArki
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrackListPage

