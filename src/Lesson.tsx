import React from 'react'
import { useTranslation } from './contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const LessonPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <AscentPageChrome
      title={t('curriculum.lessonRoutePlaceholderTitle')}
      currentLabel={t('curriculum.lessonRoutePlaceholderTitle')}
      contentMaxWidthClassName="max-w-xl"
    >
      <div className="rounded-3xl border border-teal-100 bg-white p-6 text-slate-700 shadow-sm">
        <p>{t('curriculum.lessonRoutePlaceholderBody')}</p>
      </div>
    </AscentPageChrome>
  )
}

export default LessonPage
