import type { HomeworkLanguage } from '../types/homework'

type Props = {
  value: HomeworkLanguage
  onChange: (v: HomeworkLanguage) => void
  labelEn: string
  labelEs: string
}

export function LanguageToggle({ value, onChange, labelEn, labelEs }: Props) {
  return (
    <div className="homework-lang-toggle flex gap-2 flex-wrap" role="group">
      <button
        type="button"
        className={`secondary-button ${value === 'en' ? 'homework-lang-toggle--active' : ''}`}
        onClick={() => onChange('en')}
      >
        {labelEn}
      </button>
      <button
        type="button"
        className={`secondary-button ${value === 'es' ? 'homework-lang-toggle--active' : ''}`}
        onClick={() => onChange('es')}
      >
        {labelEs}
      </button>
    </div>
  )
}
