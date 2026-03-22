import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { curriculum, getUnitsForBand } from './curriculum'
import { loadProgress, getHasSafetyPass, setHasSafetyPass, setSafetyPassCheckoutSessionId } from './progress'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import { useB2CWeeklyEpisode } from './hooks/useB2CWeeklyEpisode'

/** Parent view content only (used in merged Dashboard page and standalone /parent redirect) */
export const ParentViewContent: React.FC = () => {
  const { t } = useTranslation()
  const { ageBand } = useAgeBand()
  const weeklyEpisode = useB2CWeeklyEpisode()
  const weeklyWk = String(weeklyEpisode.resolved.weekIndex)
  const weeklyTitleShort = t(`weekly.season1.weeks.${weeklyWk}.title`)
  const progress = loadProgress(ageBand)
  const { kidLock, setKidLock } = useAuth()
  const hasSafetyPass = getHasSafetyPass()
  const [unlockLoading, setUnlockLoading] = useState(false)
  const [unlockErrorKey, setUnlockErrorKey] = useState<string | null>(null)

  const checkoutStatus = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const v = params.get('checkout')
    if (v === 'success' || v === 'cancel') return v
    // Robust fallback: some Stripe env configs may omit `checkout=success`
    // but still include `checkout_session_id` + `entitlement_type` params.
    const checkoutSessionId = params.get('checkout_session_id')
    const entitlementType = params.get('entitlement_type')
    if (checkoutSessionId && entitlementType) return 'success'
    return null
  }, [])

  useEffect(() => {
    if (checkoutStatus !== 'success') return
    setUnlockErrorKey(null)

    // Capture checkout session id so the server can validate entitlement for downloads.
    try {
      const url = new URL(window.location.href)
      const sessionId = url.searchParams.get('checkout_session_id')
      const entitlementType = url.searchParams.get('entitlement_type')
      const returnTo = url.searchParams.get('returnTo')
      setSafetyPassCheckoutSessionId(sessionId)
      setHasSafetyPass(entitlementType === 'bundle')

      url.searchParams.delete('checkout')
      url.searchParams.delete('checkout_session_id')
      url.searchParams.delete('entitlement_type')
      url.searchParams.delete('ebook_id')
      url.searchParams.delete('returnTo')
      window.history.replaceState({}, '', url.toString())

      if (returnTo && (returnTo.startsWith('/ebook/') || returnTo.startsWith('/ebook?'))) {
        window.location.replace(returnTo)
      }
    } catch {
      // ignore
    }
  }, [checkoutStatus])

  async function handleUnlock() {
    setUnlockErrorKey(null)
    setUnlockLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error('CHECKOUT_FAILED')
      }
      if (!data || typeof data.url !== 'string') {
        throw new Error('Missing checkout URL')
      }
      window.location.assign(data.url)
    } catch {
      setUnlockErrorKey('parentDashboard.checkoutFailed')
    } finally {
      setUnlockLoading(false)
    }
  }

  return (
    <div className="lesson-layout">
        <div className="lesson-media card weekly-parent-teaser">
          <h3>{t('weekly.parentDashboard.weeklyTeaser')}</h3>
          <p className="text-slate-700 mt-2">
            <strong>{weeklyTitleShort}</strong>
          </p>
          <Link to="/weekly" className="primary-button mt-3 inline-block">
            {t('weekly.parentDashboard.weeklyTeaserLink')}
          </Link>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.parentGuideTitle')}</h3>
          <p>{t('parentDashboard.parentGuideDesc')}</p>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mt-2">
            <li>{t('parentDashboard.guideBullet1')}</li>
            <li>{t('parentDashboard.guideBullet2')}</li>
            <li>{t('parentDashboard.guideBullet3')}</li>
            <li>{t('parentDashboard.guideBullet4')}</li>
          </ul>
          <p className="login-coppa-note mt-3">
            {t('parentDashboard.parentHandbookNote')}
          </p>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.unlockSafetyTitle')}</h3>
          <p>{t('parentDashboard.unlockSafetyDesc')}</p>

          {hasSafetyPass ? (
            <p className="welcome-subtitle">{t('parentDashboard.safetyPassActive')}</p>
          ) : (
            <>
              <button
                type="button"
                className="primary-button"
                onClick={() => void handleUnlock()}
                disabled={unlockLoading}
              >
                {unlockLoading ? t('parentDashboard.openingCheckout') : t('parentDashboard.unlockSafetyButton')}
              </button>
              {checkoutStatus === 'cancel' && (
                <p className="welcome-subtitle">{t('parentDashboard.checkoutCanceled')}</p>
              )}
              {unlockErrorKey && <p className="quiz-error">{t(unlockErrorKey)}</p>}
            </>
          )}
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
              {getUnitsForBand(ageBand).map((unit) => {
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
        <Link to="/tracks" className="link-back">
          {t('parentDashboard.backToDashboard')}
        </Link>
      </header>
      <ParentViewContent />
    </section>
  )
}

export default ParentDashboard
