import React from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'
import { useTranslation } from './contexts/LocaleContext'
import { AscentPageChrome } from './design-system/ascent/AscentPageChrome'

const AboutPage: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <AscentPageChrome
      title={t('about.title', { appName: appConfig.appName })}
      currentLabel={t('footer.about')}
      key={locale}
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-lg leading-relaxed text-slate-700">{t('about.intro', { appName: appConfig.appName })}</p>

        <h3 className="mt-10 font-heading text-xl font-bold text-teal-900">{t('about.whatWeOffer')}</h3>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
          <li>{t('about.safetyBullet')}</li>
          <li>{t('about.codingBullet')}</li>
          <li>{t('about.homeworkBullet')}</li>
        </ul>

        <h3 className="mt-10 font-heading text-xl font-bold text-teal-900">{t('about.missionTitle')}</h3>
        <p className="mt-3 leading-relaxed text-slate-700">{t('about.missionBody')}</p>

        <p className="mt-10">
          <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('common.returnToHome')}
          </Link>
        </p>
      </div>
    </AscentPageChrome>
  )
}

export default AboutPage
