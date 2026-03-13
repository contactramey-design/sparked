import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { curriculum } from './curriculum'
import { getPlayerStats } from './progress'

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('')
  const [stats, setStats] = useState(getPlayerStats())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedName = window.localStorage.getItem(
        appConfig.progress.usernameStorageKey,
      )
      if (storedName) setUsername(storedName)
      setStats(getPlayerStats())
    } catch {
      // ignore
    }
  }, [])

  const handleNameChange = (value: string) => {
    setUsername(value)
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(appConfig.progress.usernameStorageKey, value)
    } catch {
      // ignore
    }
  }

  const maxSparks = curriculum.units.reduce(
    (sum, unit) => sum + unit.sparklesReward,
    0,
  )

  const progressPercent =
    maxSparks > 0 ? Math.min(100, (stats.totalSparkles / maxSparks) * 100) : 0

  return (
    <section className="dashboard">
      <div className="dashboard-top">
        <div className="welcome-card card">
          <h2>{appConfig.welcomeMessage}</h2>
          <label className="username-label">
            Your explorer name:
            <input
              type="text"
              placeholder="Type your name"
              value={username}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </label>
          <p className="welcome-subtitle">
            Hi {username || 'Explorer'}! SpArki, your AI teddy-bear teacher, is
            ready to learn with you.
          </p>
          <div className="video-placeholder hero-image-wrapper">
            <img
              src="/sparki-hero.jpg"
              alt="SpArki, a blue robotic teddy-bear teacher, welcoming you."
              className="hero-image"
            />
          </div>
        </div>

        <div className="progress-card card">
          <h3>SpArki Sparkles</h3>
          <p className="points-count">
            Level {stats.level} · {stats.totalSparkles} sparkles
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="progress-help">
            Earn sparkles by completing unit quizzes with your best effort. SpArki
            cheers for trying, not perfection!
          </p>
          <p className="progress-help">
            {stats.nextLevelSparklesRemaining > 0
              ? `Earn ${stats.nextLevelSparklesRemaining} more sparkles to reach Level ${
                  stats.level + 1
                }.`
              : 'You are at the top level for now—amazing work!'}
          </p>
          <p className="progress-help">
            Streak: {stats.currentStreakDays || 0} day
            {stats.currentStreakDays === 1 ? '' : 's'} in a row
            {stats.longestStreakDays > 1
              ? ` · Longest streak: ${stats.longestStreakDays} days`
              : ''}
          </p>
          <p className="progress-help">
            Units mastered: {stats.totalUnitsMastered} / {stats.totalUnits}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-span-full">
          <h3>Your courses</h3>
          <p>
            Pick a track to join SpArki on an AI, coding, or safety adventure.
            Start with K–2; more age groups are coming soon.
          </p>
          <div className="dashboard-track-cards">
            {[...curriculum.tracks]
              .sort((a, b) => a.order - b.order)
              .map((track) => (
                <div key={track.id} className="card track-card">
                  <h4>{track.title}</h4>
                  <p>{track.description}</p>
                  <Link to={`/track/${track.id}`} className="primary-button">
                    Learn with SpArki
                  </Link>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3>Homework Adventure (Preview)</h3>
          <p>
            Grown-ups can upload a homework page and let SpArki turn it into a
            gentle story-based quest.
          </p>
          <Link to="/homework" className="secondary-button">
            Open Homework Adventure
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
