import React from 'react'
import { useTranslation } from './contexts/LocaleContext'

const ComingSoon: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <h2>{t('comingSoon.title')}</h2>
      </header>
      <div className="lesson-layout">
        <div className="lesson-media">
          <p>{t('comingSoon.body')}</p>
        </div>
      </div>
    </section>
  )
}

export default ComingSoon
