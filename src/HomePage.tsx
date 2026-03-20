import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { awardDailyLoginBonus, getPlayerStats } from './progress'
import { ParentViewContent } from './ParentDashboard'
import { useSchoolMode } from './hooks/useSchoolMode'

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
  const { isLoggedIn } = useAuth()
  const { t, locale } = useTranslation()
  const { schoolMode } = useSchoolMode()
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
    const stats = getPlayerStats()
    setSparkles(stats.totalSparkles)
    setStreakDays(stats.currentStreakDays)

    const bonus = awardDailyLoginBonus(10)
    if (bonus.awarded > 0) {
      setDailyBonusAwarded(bonus.awarded)
      const updated = getPlayerStats()
      setSparkles(updated.totalSparkles)
      setStreakDays(updated.currentStreakDays)
    }
  }, [])

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
  const shopBadge = (
    <div className="home-shop-badge-row" aria-hidden={false}>
      <Link to="/shop" className="home-shop-badge-link">
        <span className="home-shop-badge-text">{t('footer.shop')}</span>
      </Link>
    </div>
  )

  if (isParentView && !isLoggedIn && !checkoutStatus) {
    return (
      <section className="home-page home-hub">
        {shopBadge}
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
        {shopBadge}
        <div className="home-footer-actions">
          <Link to="/" className="secondary-button">
            {t('common.backToHome')}
          </Link>
          <a
            href={appConfig.parentResources.handbookPdfUrl}
            target="_blank"
            rel="noreferrer"
            className="link-muted"
          >
            {t('home.parentGuide')}
          </a>
        </div>
        <div className="hub-parent-wrap" key={locale}>
          <ParentViewContent />
        </div>
      </section>
    )
  }

  return (
    <section className="home-page">
      {!schoolMode && shopBadge}
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
          <Link to={ctaHref} className="home-hero-cta primary-button">
            {t('home.joinAdventure')}
          </Link>
        </div>
      </div>

      <div className="home-weekly-teaser card">
        <div className="home-weekly-adventure">
          <img
            src="/weekly/season1/sparkis-two-world-bridge.png"
            alt=""
            className="home-weekly-thumb"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />

          <div className="home-weekly-adventure-left">
            <div className="home-weekly-kicker text-sm font-semibold text-slate-500 uppercase tracking-wide">
              {t('weekly.weeklyPage.learningAdventureLabel')}
            </div>
            <div className="home-weekly-adventure-text text-xl font-bold text-slate-800">
              {t('weekly.weeklyPage.title')}
            </div>
          </div>

          <Link to="/weekly" className="home-weekly-adventure-button">
            <span className="home-weekly-adventure-button-glow" aria-hidden />
            <span className="home-weekly-adventure-button-inner">
              <span className="home-weekly-adventure-icon" aria-hidden>
                🚀
              </span>
              <span>{t('weekly.weeklyPage.navLink')}</span>
            </span>
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

      <div className="home-footer-actions">
        <Link to={loginPath} className="secondary-button">
          {t('home.grownUpSignIn')}
        </Link>
        <Link to="/tracks" className="secondary-button">
          {t('header.courses')}
        </Link>
        <a
          href={appConfig.parentResources.handbookPdfUrl}
          target="_blank"
          rel="noreferrer"
          className="link-muted"
        >
          {t('home.parentGuide')}
        </a>
      </div>
    </section>
  )
}

export default HomePage
