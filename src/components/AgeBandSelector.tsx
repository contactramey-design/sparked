import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import type { AgeBandId } from '@/ageBand'
import { ALL_AGE_BANDS } from '@/ageBand'

type Props = {
  /** compact = pill row; default = larger touch targets */
  variant?: 'default' | 'compact'
  className?: string
  idPrefix?: string
}

const BANDS: AgeBandId[] = ALL_AGE_BANDS

export default function AgeBandSelector({ variant = 'default', className = '', idPrefix = 'age-band' }: Props) {
  const { ageBand, setAgeBand } = useAgeBand()
  const { t } = useTranslation()

  return (
    <div
      className={`age-band-selector ${variant === 'compact' ? 'age-band-selector--compact' : ''} ${className}`.trim()}
      role="group"
      aria-label={t('ageBand.selectorAria')}
    >
      {BANDS.map((id) => {
        const selected = ageBand === id
        const label = t(`ageBand.names.${id}.short`)
        return (
          <button
            key={id}
            type="button"
            id={`${idPrefix}-${id}`}
            className={`age-band-option ${selected ? 'age-band-option--active' : ''}`}
            aria-pressed={selected}
            onClick={() => setAgeBand(id)}
          >
            <span className="age-band-option-title">{label}</span>
            <span className="age-band-option-ages">{t(`ageBand.names.${id}.ages`)}</span>
          </button>
        )
      })}
    </div>
  )
}
