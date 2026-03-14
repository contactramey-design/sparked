import React from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { curriculum } from './curriculum'
import { loadProgress, getHasSafetyPass, setHasSafetyPass } from './progress'
import { useAuth } from './AuthContext'

const ParentDashboard: React.FC = () => {
  const progress = loadProgress()
  const { kidLock, setKidLock } = useAuth()
  const hasSafetyPass = getHasSafetyPass()

  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <h2>Parent &amp; Grown-Up Progress View</h2>
        <Link to="/dashboard" className="link-back">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="lesson-layout">
        <div className="lesson-media card">
          <h3>Parent Guide</h3>
          <p>Learn how we keep kids safe while they explore AI and technology.</p>
          <a
            href={appConfig.parentResources.handbookPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            Open Parent Guide (PDF)
          </a>
        </div>

        <div className="lesson-media card">
          <h3>Unlock full Safety track</h3>
          <p>
            Your child can explore one safety lesson for free. To unlock the full Social
            Media Safety &amp; Kindness track (Instagram, TikTok, Roblox, and more),
            turn on the Safety Pass below. This setting is stored only on this device and
            does not send any personal data to our servers.
          </p>
          <label className="parent-toggle">
            <input
              type="checkbox"
              checked={hasSafetyPass}
              onChange={(e) => setHasSafetyPass(e.target.checked)}
            />
            <span>Safety Pass active on this device</span>
          </label>
        </div>

        <div className="lesson-media card">
          <h3>Lock to kid view</h3>
          <p>
            When on, the header only shows Dashboard and Sign out so your child cannot open this Parent area.
            Turn off to see the Parent link again. You can always open this page via &quot;Grown-up?&quot; in the footer when locked.
          </p>
          <label className="parent-toggle">
            <input
              type="checkbox"
              checked={kidLock}
              onChange={(e) => setKidLock(e.target.checked)}
            />
            <span>Lock to kid view</span>
          </label>
        </div>

        <div className="lesson-media card">
          <h3>Overall Sparkles</h3>
          <p>
            Total SpArki sparkles earned: <strong>{progress.totalSparkles}</strong>
          </p>
          <p className="welcome-subtitle">
            Sparkles come from unit quizzes. We recommend celebrating effort and growth,
            not just perfect scores.
          </p>
        </div>

        <div className="lesson-quiz card">
          <h3>Units Summary</h3>
          <table className="parent-table">
            <thead>
              <tr>
                <th>Track</th>
                <th>Unit</th>
                <th>Best Score</th>
                <th>Attempts</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {curriculum.units.map((unit) => {
                const status = progress.units[unit.id]
                const track = curriculum.tracks.find((t) => t.id === unit.trackId)

                const scoreText =
                  status && status.postScore >= 0 ? `${status.postScore}%` : '—'
                const attemptsText = status ? status.attempts : 0
                const statusText = status
                  ? status.mastered
                    ? 'Mastered'
                    : 'In progress'
                  : 'Not started'

                return (
                  <tr key={unit.id}>
                    <td>{track?.title ?? ''}</td>
                    <td>{unit.title}</td>
                    <td>{scoreText}</td>
                    <td>{attemptsText}</td>
                    <td>{statusText}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ParentDashboard
