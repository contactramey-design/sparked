import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { AscentPageChrome } from './design-system/ascent/AscentPageChrome'

const ContactPage: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <AscentPageChrome title={t('contact.title')} currentLabel={t('footer.contact')} key={locale}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-lg leading-relaxed text-slate-700">{t('contact.intro')}</p>
        <p className="mt-6 text-slate-700">{t('contact.pilotLead')}</p>
        <p className="mt-6">
          <a href={`mailto:${t('contact.email')}`} className="text-lg font-semibold text-teal-800 underline-offset-2 hover:underline" rel="noopener noreferrer">
            {t('contact.email')}
          </a>
        </p>
        <p className="mt-6 text-slate-600">{t('contact.respondNote')}</p>
        <p className="mt-10">
          <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </AscentPageChrome>
  )
}

export default ContactPage
