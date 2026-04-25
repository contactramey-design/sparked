import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { curriculum, getUnitsForBand } from './curriculum'
import { getPlayerStats } from './progress'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { ageBand } = useAgeBand()
  const [username, setUsername] = useState('')
  const [stats, setStats] = useState(() => getPlayerStats(ageBand))

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const storedName = window.localStorage.getItem(
        appConfig.progress.usernameStorageKey,
      )
      if (storedName) setUsername(storedName)
      setStats(getPlayerStats(ageBand))
    } catch {
      // ignore
    }
  }, [ageBand])

  const handleNameChange = (value: string) => {
    setUsername(value)
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(appConfig.progress.usernameStorageKey, value)
    } catch {
      // ignore
    }
  }

  const maxSparks = getUnitsForBand(ageBand).reduce(
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
            {t('dashboard.explorerName')}
            <input
              type="text"
              placeholder={t('dashboard.explorerPlaceholder')}
              value={username}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </label>
          <p className="welcome-subtitle">
            {t('dashboard.welcomeLine', { name: username || 'Explorer' })}
          </p>
          <div className="video-placeholder hero-image-wrapper">
            <img
              src="/sparkiacademylogo.webp"
              alt="Sparki, a blue robotic teddy-bear teacher, welcoming you."
              className="hero-image"
            />
          </div>
        </div>

        <div className="progress-card card">
          <h3>{t('dashboard.sparkiSparkles')}</h3>
          <p className="points-count">
            {t('dashboard.levelSparkles', { level: stats.level, sparkles: stats.totalSparkles })}
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="progress-help">
            {t('dashboard.progressHelp1')}
          </p>
          <p className="progress-help">
            {stats.nextLevelSparklesRemaining > 0
              ? t('dashboard.progressHelp2Earn', { count: stats.nextLevelSparklesRemaining, level: stats.level + 1 })
              : t('dashboard.progressHelp2Top')}
          </p>
          <p className="progress-help">
            {t('dashboard.streakDays', { count: stats.currentStreakDays || 0 })}
            {stats.longestStreakDays > 1
              ? ` · ${t('dashboard.longestStreak', { days: stats.longestStreakDays })}`
              : ''}
          </p>
          <p className="progress-help">
            {t('dashboard.unitsMastered', { mastered: stats.totalUnitsMastered, total: stats.totalUnits })}
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card card-span-full">
          <h3>{t('dashboard.yourCourses')}</h3>
          <p>
            {t('dashboard.yourCoursesDesc')}
          </p>
          <div className="dashboard-track-cards">
            {[...curriculum.tracks]
              .sort((a, b) => a.order - b.order)
              .map((track) => (
                <div key={track.id} className="card track-card">
                  <h4>{t(`curriculum.tracks.${track.id}.title`) || track.title}</h4>
                  <p>{t(`curriculum.tracks.${track.id}.description`) || track.description}</p>
                  <Link to={`/track/${track.id}`} className="primary-button">
                    {t('curriculum.learnWithSparki')}
                  </Link>
                </div>
              ))}
          </div>
        </div>

        <div className="card">
          <h3>{t('dashboard.homeworkPreviewTitle')}</h3>
          <p>
            {t('dashboard.homeworkPreviewDesc')}
          </p>
          <Link to="/homework" className="secondary-button">
            {t('dashboard.openHomeworkAdventure')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
