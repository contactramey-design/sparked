import React from 'react'
import { useTranslation } from './contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const ComingSoon: React.FC = () => {
  const { t, locale } = useTranslation()

  return (
    <AscentPageChrome key={locale} title={t('comingSoon.title')} currentLabel={t('comingSoon.title')} contentMaxWidthClassName="max-w-xl">
      <div className="rounded-3xl border border-teal-100 bg-white p-6 shadow-sm md:p-8">
        <p className="text-slate-700">{t('comingSoon.body')}</p>
      </div>
    </AscentPageChrome>
  )
}

export default ComingSoon
