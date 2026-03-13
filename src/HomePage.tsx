import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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
    <Link to={href} className="home-tier-card" title={tier.title}>
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
    </Link>
  )
}

const HomePage: React.FC = () => {
  const { isLoggedIn } = useAuth()
  const location = useLocation()

  const loginPath = '/login'
  const redirectParam = (path: string) =>
    `${loginPath}?redirect=${encodeURIComponent(path)}`

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">{appConfig.appName}</h1>
          <p className="home-tagline">{appConfig.tagline}</p>
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
