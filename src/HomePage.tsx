import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'

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
    imageSrc: '/ai-coding-card.png',
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

  return (
    <Link to={href} className="home-tier-card glitch-card" title={tier.title}>
      <div className="glitch-card-outer" aria-hidden />
      <div className="glitch-card-inner">
        <div className="glitch-card-img-wrap">
          {imgFailed ? (
            <span className="home-tier-placeholder">{tier.title}</span>
          ) : (
            <img
              src={tier.imageSrc}
              alt={tier.imageAlt}
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
              ADVENTURE
            </span>
            <h3 className="glitch-card-title">{tier.title}</h3>
            <p className="glitch-card-desc">{tier.description}</p>
            <span className="glitch-card-cta">Start adventure →</span>
          </div>
        </div>
      </div>
      <div className="glitch-scanlines" aria-hidden />
    </Link>
  )
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth()

  const loginPath = '/login'
  const redirectParam = (path: string) =>
    `${loginPath}?redirect=${encodeURIComponent(path)}`

  const ctaHref = isLoggedIn ? '/tracks' : `/login?redirect=${encodeURIComponent('/tracks')}`

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
          <h1 className="home-title">{appConfig.appName}</h1>
          <p className="home-tagline">{appConfig.tagline}</p>
          <Link to={ctaHref} className="home-hero-cta primary-button">
            Join the Adventure!
          </Link>
        </div>
      </div>

      <div className="home-tiers">
        <h2 className="home-tiers-title">Choose your adventure</h2>
        <div className="home-tier-grid">
          {TIERS.map((tier) => {
            const href = isLoggedIn ? tier.path : redirectParam(tier.path)
            return (
              <TierCard
                key={tier.id}
                tier={tier}
                href={href}
              />
            )
          })}
        </div>
      </div>

      <div className="home-footer-actions">
        {!isLoggedIn && (
          <Link to={loginPath} className="secondary-button">
            Grown-up? Sign in
          </Link>
        )}
        <a
          href={appConfig.parentResources.handbookPdfUrl}
          target="_blank"
          rel="noreferrer"
          className="link-muted"
        >
          Parent Guide
        </a>
      </div>
    </section>
  )
}

export default HomePage
