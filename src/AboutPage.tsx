import React from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { useTranslation } from './contexts/LocaleContext'

const AboutPage: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('about.title', { appName: appConfig.appName })}</h2>
        <Link to="/" className="link-back">
          {t('common.backToHome')}
        </Link>
      </header>
      <div className="legal-content card">
        <p>
          {t('about.intro', { appName: appConfig.appName })}
        </p>

        <h3>{t('about.whatWeOffer')}</h3>
        <ul>
          <li>{t('about.safetyBullet')}</li>
          <li>{t('about.codingBullet')}</li>
          <li>{t('about.homeworkBullet')}</li>
        </ul>

        <h3>{t('about.missionTitle')}</h3>
        <p>{t('about.missionBody')}</p>

        <p>
          <Link to="/" className="link-muted">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default AboutPage
