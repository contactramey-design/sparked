import React from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { curriculum } from './curriculum'
import { loadProgress, getHasSafetyPass, setHasSafetyPass } from './progress'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'

/** Parent view content only (used in merged Dashboard page and standalone /parent redirect) */
export const ParentViewContent: React.FC = () => {
  const { t } = useTranslation()
  const progress = loadProgress()
  const { kidLock, setKidLock } = useAuth()
  const hasSafetyPass = getHasSafetyPass()

  return (
    <div className="lesson-layout">
        <div className="lesson-media card">
          <h3>{t('parentDashboard.parentGuideTitle')}</h3>
          <p>{t('parentDashboard.parentGuideDesc')}</p>
          <a
            href={appConfig.parentResources.handbookPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            {t('parentDashboard.openParentGuide')}
          </a>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.unlockSafetyTitle')}</h3>
          <p>{t('parentDashboard.unlockSafetyDesc')}</p>
          <label className="parent-toggle">
            <input
              type="checkbox"
              checked={hasSafetyPass}
              onChange={(e) => setHasSafetyPass(e.target.checked)}
            />
            <span>{t('parentDashboard.safetyPassActive')}</span>
          </label>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.lockKidViewTitle')}</h3>
          <p>{t('parentDashboard.lockKidViewDesc')}</p>
          <label className="parent-toggle">
            <input
              type="checkbox"
              checked={kidLock}
              onChange={(e) => setKidLock(e.target.checked)}
            />
            <span>{t('parentDashboard.lockToKidView')}</span>
          </label>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.overallSparklesTitle')}</h3>
          <p>
            {t('parentDashboard.overallSparklesDesc')} <strong>{progress.totalSparkles}</strong>
          </p>
          <p className="welcome-subtitle">
            {t('parentDashboard.sparklesNote')}
          </p>
        </div>

        <div className="lesson-quiz card">
          <h3>{t('parentDashboard.unitsSummaryTitle')}</h3>
          <table className="parent-table">
            <thead>
              <tr>
                <th>{t('parentDashboard.tableTrack')}</th>
                <th>{t('parentDashboard.tableUnit')}</th>
                <th>{t('parentDashboard.tableBestScore')}</th>
                <th>{t('parentDashboard.tableAttempts')}</th>
                <th>{t('parentDashboard.tableStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {curriculum.units.map((unit) => {
                const status = progress.units[unit.id]
                const track = curriculum.tracks.find((tr) => tr.id === unit.trackId)

                const scoreText =
                  status && status.postScore >= 0 ? `${status.postScore}%` : '—'
                const attemptsText = status ? status.attempts : 0
                const statusText = status
                  ? status.mastered
                    ? t('parentDashboard.statusMastered')
                    : t('parentDashboard.statusInProgress')
                  : t('parentDashboard.statusNotStarted')

                return (
                  <tr key={unit.id}>
                    <td>{track ? (t(`curriculum.tracks.${track.id}.title`) || track.title) : ''}</td>
                    <td>{t(`curriculum.units.${unit.id}.title`) || unit.title}</td>
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
  )
}

const ParentDashboard: React.FC = () => {
  const { t, locale } = useTranslation()
  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('parentDashboard.title')}</h2>
        <Link to="/dashboard" className="link-back">
          {t('parentDashboard.backToDashboard')}
        </Link>
      </header>
      <ParentViewContent />
    </section>
  )
}

export default ParentDashboard
