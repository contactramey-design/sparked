import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const PrivacyPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const dateStr = new Date().toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US')

  return (
    <AscentPageChrome
      key={locale}
      title={t('privacy.title')}
      currentLabel={t('footer.privacy')}
    >
      <div className="legal-content card rounded-3xl border border-teal-100/80 bg-white p-6 shadow-sm md:p-10">
        <p className="legal-updated text-slate-600">{t('privacy.lastUpdated', { date: dateStr })}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.coppaTitle')}</h3>
        <p className="text-slate-700">{t('privacy.coppaBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.noCollectTitle')}</h3>
        <p className="text-slate-700">{t('privacy.noCollectBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.parentOnlyTitle')}</h3>
        <p className="text-slate-700">{t('privacy.parentOnlyBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.dataMinTitle')}</h3>
        <p className="text-slate-700">{t('privacy.dataMinBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.progressTitle')}</h3>
        <p className="text-slate-700">{t('privacy.progressBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.schoolPilotsTitle')}</h3>
        <p className="text-slate-700">{t('privacy.schoolPilotsBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.ageBandTitle')}</h3>
        <p className="text-slate-700">{t('privacy.ageBandBody')}</p>

        <h3 className="font-heading text-lg font-bold text-teal-900">{t('privacy.rightsTitle')}</h3>
        <p className="text-slate-700">{t('privacy.rightsBody')}</p>

        <p className="mt-8">
          <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </AscentPageChrome>
  )
}

export default PrivacyPage
