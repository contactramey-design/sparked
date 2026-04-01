import React from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'

type Props = {
  className?: string
  /** Smaller control for tight toolbars */
  compact?: boolean
}

/**
 * Switch between teacher view (standards, toolkit, alignment detail) and student view (lesson-first).
 */
const SchoolAudienceToggle: React.FC<Props> = ({ className, compact }) => {
  const { t } = useTranslation()
  const { schoolAudience, setSchoolAudience } = useSchoolAudience()

  return (
    <div
      className={`school-audience-toggle${compact ? ' school-audience-toggle--compact' : ''}${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={t('schoolSubject.audienceToggleAria')}
    >
      <span className="school-audience-toggle__label">{t('schoolSubject.audienceLabel')}</span>
      <div className="school-audience-toggle__buttons">
        <button
          type="button"
          className={`school-audience-toggle__btn${schoolAudience === 'student' ? ' school-audience-toggle__btn--active' : ''}`}
          aria-pressed={schoolAudience === 'student'}
          onClick={() => setSchoolAudience('student')}
        >
          {t('schoolSubject.audienceStudent')}
        </button>
        <button
          type="button"
          className={`school-audience-toggle__btn${schoolAudience === 'teacher' ? ' school-audience-toggle__btn--active' : ''}`}
          aria-pressed={schoolAudience === 'teacher'}
          onClick={() => setSchoolAudience('teacher')}
        >
          {t('schoolSubject.audienceTeacher')}
        </button>
      </div>
    </div>
  )
}

export default SchoolAudienceToggle
