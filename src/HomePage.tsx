import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import { AdventureGrid } from './features/family-home/AdventureGrid'
import { HomeAscentBelowHero } from './features/family-home/HomeAscentBelowHero'
import { HomeAgeBandsAscent } from './features/family-home/HomeAgeBandsAscent'
import { HomeHero } from './features/family-home/HomeHero'
import { awardDailyLoginBonus, getPlayerStats } from './progress'
import { ParentViewContent } from './ParentDashboard'
import { clearPostLoginRedirect, getPostLoginRedirect } from './lib/postLoginRedirect'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const HomePage: React.FC = () => {
  const { authHydrated, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { ageBand } = useAgeBand()
  const [searchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const [username, setUsername] = useState('')
  const [sparkles, setSparkles] = useState(0)
  const [displaySparkles, setDisplaySparkles] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [dailyBonusAwarded, setDailyBonusAwarded] = useState(0)

  const [sparklePulse, setSparklePulse] = useState(false)
  const prevSparklesRef = useRef(0)

  const isParentView = viewParam === 'parent'

  // Email magic links usually return to site root with tokens in the hash — no /login?redirect=.
  useEffect(() => {
    if (!authHydrated || !isLoggedIn || isParentView) return
    const pending = getPostLoginRedirect()
    if (!pending?.startsWith('/teacher')) return
    clearPostLoginRedirect()
    navigate(pending, { replace: true })
  }, [authHydrated, isLoggedIn, isParentView, navigate])

  const checkoutStatus = useMemo(() => {
    const v = searchParams.get('checkout')
    if (v === 'success' || v === 'cancel') return v
    return null
  }, [searchParams])

  useEffect(() => {
    if (!isLoggedIn) return
    try {
      const name = window.localStorage.getItem(appConfig.progress.usernameStorageKey) || ''
      setUsername(name)
    } catch {
      // ignore
    }
  }, [isLoggedIn])

  useEffect(() => {
    // Local habit loop: show streak + award one daily bonus once per day.
    const stats = getPlayerStats(ageBand)
    setSparkles(stats.totalSparkles)
    setStreakDays(stats.currentStreakDays)

    const bonus = awardDailyLoginBonus(ageBand, 10)
    if (bonus.awarded > 0) {
      setDailyBonusAwarded(bonus.awarded)
      const updated = getPlayerStats(ageBand)
      setSparkles(updated.totalSparkles)
      setStreakDays(updated.currentStreakDays)
    }
  }, [ageBand])

  useEffect(() => {
    // Animate the sparkles count so it feels alive as your progress grows.
    const start = prevSparklesRef.current
    const end = sparkles
    if (start === end) {
      setDisplaySparkles(end)
      return
    }

    const durationMs = 700
    const t0 = performance.now()
    let raf = 0

    const tick = (now: number) => {
      const p = Math.min((now - t0) / durationMs, 1)
      // Ease-out curve for a smoother landing.
      const eased = 1 - Math.pow(1 - p, 3)
      const value = Math.round(start + (end - start) * eased)
      setDisplaySparkles(value)
      if (p < 1) {
        raf = window.requestAnimationFrame(tick)
      } else {
        prevSparklesRef.current = end
      }
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [sparkles])

  useEffect(() => {
    if (dailyBonusAwarded <= 0) return
    setSparklePulse(true)
    const t = window.setTimeout(() => setSparklePulse(false), 900)
    return () => window.clearTimeout(t)
  }, [dailyBonusAwarded])

  const loginPath = '/login'

  // Primary home CTA: safety-led adventures; browse-all lives on second hero button.
  const heroPrimaryHref = '/track/social-safety'

  // Checkout success returns to /?view=parent&checkout=success.

  if (isParentView && !isLoggedIn && !checkoutStatus) {
    return (
      <AscentPageChrome
        key={locale}
        title={t('dashboardPage.parentPanelHeading')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('dashboardPage.parentPanelHeading') },
        ]}
        contentMaxWidthClassName="max-w-5xl"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link to="/login?redirect=%2F%3Fview%3Dparent" className="primary-button">
            {t('login.title')}
          </Link>
          <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('common.backToHome')}
          </Link>
        </div>
        <p className="mb-6 max-w-prose text-sm text-slate-600">{t('dashboardPage.parentPanelLead')}</p>
        <ParentViewContent />
      </AscentPageChrome>
    )
  }

  if (isParentView) {
    return (
      <AscentPageChrome
        key={locale}
        title={t('dashboardPage.parentPanelHeading')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('dashboardPage.parentPanelHeading') },
        ]}
        contentMaxWidthClassName="max-w-5xl"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link to="/" className="secondary-button">
            {t('common.backToHome')}
          </Link>
          {appConfig.parentResources.handbookPdfUrl ? (
            <a
              href={appConfig.parentResources.handbookPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-teal-800 underline-offset-2 hover:underline"
            >
              {t('home.parentGuide')}
            </a>
          ) : null}
        </div>
        <p className="mb-6 max-w-prose text-sm text-slate-600">{t('dashboardPage.parentPanelLead')}</p>
        <ParentViewContent />
      </AscentPageChrome>
    )
  }

  return (
    <AscentPageChrome
      key={locale}
      kidHomeLayout
      contentMaxWidthClassName="max-w-6xl"
    >
      <section className="home-page">
      {isLoggedIn && (
        <div className="home-floating-badges" aria-label={t('home.hiSparkles', { name: username || 'Explorer', count: displaySparkles })}>
          <button
            type="button"
            className={`home-sparkles-bubble ${sparklePulse ? 'home-sparkles-bubble--pop' : ''}`}
            onClick={() => setSparklePulse(true)}
            aria-label={t('home.hiSparkles', { name: username || 'Explorer', count: displaySparkles })}
          >
            <span className="home-badge-icon" aria-hidden>
              ✦
            </span>
            <span className="home-badge-value" aria-hidden>
              {displaySparkles}
            </span>
            {dailyBonusAwarded > 0 && (
              <span className="home-badge-plus" aria-hidden>
                +{dailyBonusAwarded}
              </span>
            )}
          </button>

          <button
            type="button"
            className="home-streak-bubble"
            onClick={() => setSparklePulse(true)}
            aria-label={t('home.streakLine', { count: streakDays })}
          >
            <span className="home-badge-icon" aria-hidden>
              🔥
            </span>
            <span className="home-badge-value" aria-hidden>
              {streakDays}
            </span>
          </button>
        </div>
      )}
      <div className="home-hero-wrap mx-auto max-w-6xl px-4">
        <HomeHero primaryCtaHref={heroPrimaryHref} />
      </div>

      <HomeAgeBandsAscent />

      <div id="home-adventures" className="home-adventure-wrap mx-auto max-w-6xl scroll-mt-24 px-4">
        <AdventureGrid />
      </div>

      <div className="mx-auto mt-4 max-w-5xl px-4">
        <Link
          to="/daily"
          className="flex flex-col gap-1 rounded-xl border border-amber-200/90 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 shadow-sm transition hover:border-amber-300 hover:shadow sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div>
            <p className="font-heading text-base font-bold text-amber-950">{t('retention.homeCardTitle')}</p>
            <p className="text-sm text-amber-900/85">{t('retention.homeCardBody')}</p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-orange-800">{t('retention.homeCardCta')} →</span>
        </Link>
      </div>

      <HomeAscentBelowHero />

      <div className="home-grownups-footer muted text-center">
        <Link to={loginPath} className="home-grownups-footer-link">
          {t('home.grownUpSignIn')}
        </Link>
        {appConfig.parentResources.handbookPdfUrl ? (
          <>
            <span className="home-grownups-footer-sep" aria-hidden>
              {' · '}
            </span>
            <a
              href={appConfig.parentResources.handbookPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="home-grownups-footer-link"
            >
              {t('home.parentGuide')}
            </a>
          </>
        ) : null}
      </div>
    </section>
    </AscentPageChrome>
  )
}

export default HomePage
