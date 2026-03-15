import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'

const ContactPage: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('contact.title')}</h2>
        <Link to="/" className="link-back">
          {t('common.backToHome')}
        </Link>
      </header>
      <div className="legal-content card">
        <p>{t('contact.intro')}</p>
        <p>
          <a
            href="mailto:hello@sparkiedu.com"
            className="link-muted"
            rel="noopener noreferrer"
          >
            hello@sparkiedu.com
          </a>
        </p>
        <p>{t('contact.respondNote')}</p>
        <p>
          <Link to="/" className="link-muted">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default ContactPage
