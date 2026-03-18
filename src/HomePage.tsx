import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { getPlayerStats } from './progress'
import { ParentViewContent } from './ParentDashboard'

type ViewMode = 'kid' | 'parent'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const [viewMode, setViewMode] = useState<ViewMode>(
    viewParam === 'parent' ? 'parent' : 'kid',
  )
  const [username, setUsername] = useState('')
  const [sparkles, setSparkles] = useState(0)

  useEffect(() => {
    const next = viewParam === 'parent' ? 'parent' : 'kid'
    setViewMode(next)
  }, [viewParam])

  useEffect(() => {
    if (!isLoggedIn) return
    try {
      const name = window.localStorage.getItem(appConfig.progress.usernameStorageKey) || ''
      setUsername(name)
      setSparkles(getPlayerStats().totalSparkles)
    } catch {
      // ignore
    }
  }, [isLoggedIn])

  const setView = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'parent') {
      setSearchParams({ view: 'parent' }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const loginPath = '/login'

  // Academy is public: no login required just to explore tracks + units.
  const ctaHref = '/tracks'

  // Checkout success returns to /?view=parent&checkout=success.
  // Parent view must mount even if the user isn't "logged in" via email/Supabase.
  if (viewMode === 'parent' && !isLoggedIn) {
    return (
      <section className="home-page home-hub">
        <div className="hub-parent-wrap" key={locale}>
          <ParentViewContent />
        </div>
      </section>
    )
  }

  if (isLoggedIn) {
    return (
      <section className="home-page home-hub">
        <div className="hub-toggle-bar" role="tablist" aria-label={`${t('home.view')} ${t('home.kid')} ${t('home.parent')}`}>
          <span className="hub-toggle-label">{t('home.view')}</span>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'kid'}
            className={viewMode === 'kid' ? 'active' : ''}
            onClick={() => setView('kid')}
          >
            {t('home.kid')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'parent'}
            className={viewMode === 'parent' ? 'active' : ''}
            onClick={() => setView('parent')}
          >
            {t('home.parent')}
          </button>
        </div>

        {viewMode === 'kid' && (
          <>
            <p className="hub-kid-line">
              {t('home.hiSparkles', { name: username || 'Explorer', count: sparkles })}
            </p>
            <div className="home-tiers">
              <h2 className="home-tiers-title">{t('home.chooseAdventure')}</h2>
              <div className="home-tier-grid">
                {TIERS.map((tier) => (
                  <TierCard key={tier.id} tier={tier} href={tier.path} />
                ))}
              </div>
            </div>
          </>
        )}

        {viewMode === 'parent' && (
          <div className="hub-parent-wrap" key={locale}>
            <ParentViewContent />
          </div>
        )}

        <div className="home-footer-actions">
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

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-hero-sparki" aria-hidden>
          <img
            src="/sparki-hero.jpg"
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
