import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'

const PrivacyPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const dateStr = new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('privacy.title')}</h2>
        <Link to="/" className="link-back">
          {t('common.backToHome')}
        </Link>
      </header>
      <div className="legal-content card">
        <p className="legal-updated">
          {t('privacy.lastUpdated', { date: dateStr })}
        </p>

        <h3>{t('privacy.coppaTitle')}</h3>
        <p>{t('privacy.coppaBody')}</p>

        <h3>{t('privacy.noCollectTitle')}</h3>
        <p>{t('privacy.noCollectBody')}</p>

        <h3>{t('privacy.parentOnlyTitle')}</h3>
        <p>{t('privacy.parentOnlyBody')}</p>

        <h3>{t('privacy.dataMinTitle')}</h3>
        <p>{t('privacy.dataMinBody')}</p>

        <h3>{t('privacy.progressTitle')}</h3>
        <p>{t('privacy.progressBody')}</p>

        <h3>{t('privacy.schoolPilotsTitle')}</h3>
        <p>{t('privacy.schoolPilotsBody')}</p>

        <h3>{t('privacy.ageBandTitle')}</h3>
        <p>{t('privacy.ageBandBody')}</p>

        <h3>{t('privacy.rightsTitle')}</h3>
        <p>{t('privacy.rightsBody')}</p>

        <p>
          <Link to="/" className="link-muted">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </section>
  )
}

export default PrivacyPage
