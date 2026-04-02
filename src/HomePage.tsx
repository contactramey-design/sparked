import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import AgeBandSelector from './components/AgeBandSelector'
import { awardDailyLoginBonus, getPlayerStats } from './progress'
import { ParentViewContent } from './ParentDashboard'
import { clearPostLoginRedirect, getPostLoginRedirect } from './lib/postLoginRedirect'

const TIERS = [
  {
    id: 'safety',
    title: 'Internet Safety',
    description: 'Learn safe watching, kind comments, and healthy screen time with SpArki.',
    path: '/track/social-safety',
    imageSrc: '/safety-card.png',
    imageAlt: 'SpArki in the Internet Safety world',
  },
  {
    id: 'ai-coding',
    title: 'AI & Coding',
    description: 'Discover what AI is, how code works, and how software helps people.',
    path: '/track/ai-coding',
    imageSrc: '/sparkiaicodingcardhomepage.png',
    imageAlt: 'SpArki in the AI and Coding world',
  },
  {
    id: 'homework',
    title: 'Homework Adventure',
    description: 'Turn homework into a story-based quest. Grown-up uploads; SpArki guides.',
    path: '/homework',
    imageSrc: '/homework-card.png',
    imageAlt: 'SpArki as Homework Adventure tutor',
  },
] as const

function TierCard({
  tier,
  href,
}: {
  tier: (typeof TIERS)[number]
  href: string
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const { t } = useTranslation()
  const title = t(`home.tiers.${tier.id}.title`)
  const description = t(`home.tiers.${tier.id}.description`)
  const imageAlt = t(`home.tiers.${tier.id}.imageAlt`)

  return (
    <Link to={href} className="home-tier-card glitch-card" title={title}>
      <div className="glitch-card-outer" aria-hidden />
      <div className="glitch-card-inner">
        <div className="glitch-card-img-wrap">
          {imgFailed ? (
            <span className="home-tier-placeholder">{title}</span>
          ) : (
            <img
              src={tier.imageSrc}
              alt={imageAlt}
              className="home-tier-image"
              onError={() => setImgFailed(true)}
            />
          )}
          <div className="glitch-card-corners">
            <span className="glitch-corner tl" />
            <span className="glitch-corner tr" />
            <span className="glitch-corner bl" />
            <span className="glitch-corner br" />
          </div>
          <div className="glitch-card-info">
            <span className="glitch-card-status" aria-hidden>
              {t('home.adventure')}
            </span>
            <h3 className="glitch-card-title">{title}</h3>
            <p className="glitch-card-desc">{description}</p>
            <span className="glitch-card-cta">{t('home.startAdventure')}</span>
          </div>
        </div>
      </div>
      <div className="glitch-scanlines" aria-hidden />
    </Link>
  )
}

const HomePage: React.FC = () => {
  const { authHydrated, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const { ageBand, ageBandDisplayName } = useAgeBand()
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

  // Academy is public: no login required just to explore tracks + units.
  const ctaHref = '/tracks'

  // Checkout success returns to /?view=parent&checkout=success.

  if (isParentView && !isLoggedIn && !checkoutStatus) {
    return (
      <section className="home-page home-hub">
        <div className="home-footer-actions">
          <Link to="/login?redirect=%2F%3Fview%3Dparent" className="secondary-button">
            {t('login.title')}
          </Link>
          <Link to="/" className="link-muted">
            {t('common.backToHome')}
          </Link>
        </div>
        <div className="hub-parent-wrap" key={locale}>
          <ParentViewContent />
        </div>
      </section>
    )
  }

  if (isParentView) {
    return (
      <section className="home-page home-hub">
        <div className="home-footer-actions">
          <Link to="/" className="secondary-button">
            {t('common.backToHome')}
          </Link>
          {appConfig.parentResources.handbookPdfUrl ? (
            <a
              href={appConfig.parentResources.handbookPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="link-muted"
            >
              {t('home.parentGuide')}
            </a>
          ) : null}
        </div>
        <div className="hub-parent-wrap" key={locale}>
          <ParentViewContent />
        </div>
      </section>
    )
  }

  return (
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
      <div className="home-hero">
        <div className="home-hero-sparki" aria-hidden>
          <img
            src="/sparkiacademylogo.webp"
            alt=""
            className="home-hero-character"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const next = e.currentTarget.nextElementSibling
              if (next) (next as HTMLElement).style.display = 'block'
            }}
          />
          <span className="home-hero-character-emoji" aria-hidden>
            🤖✨
          </span>
        </div>
        <div className="home-hero-content">
          <h1 className="home-title">{t('header.appName')}</h1>
          <p className="home-tagline">{t('header.tagline')}</p>
          <div className="home-hero-age-wrap">
            <h2 className="home-hero-age-label">{t('ageBand.homeSectionTitle')}</h2>
            <p className="home-hero-age-sub muted text-sm">{t('ageBand.homeSectionSubtitle')}</p>
            <p className="home-hero-age-current sr-only">
              {t('ageBand.currentLabel', { name: ageBandDisplayName })}
            </p>
            <AgeBandSelector variant="compact" idPrefix="home-hero-age" />
          </div>
          <Link to={ctaHref} className="home-hero-cta primary-button">
            {t('home.joinAdventure')}
          </Link>
        </div>
      </div>

      <div className="home-tiers">
        <h2 className="home-tiers-title">{t('home.chooseAdventure')}</h2>
        <div className="home-tier-grid">
          {TIERS.map((tier) => {
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                href={tier.path}
              />
            )
          })}
        </div>
      </div>

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
  )
}

export default HomePage
