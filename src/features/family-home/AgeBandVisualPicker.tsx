import { useCallback } from 'react'
import type { AgeBandId } from '@/ageBand'
import { ALL_AGE_BANDS } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type CardProps = {
  label: string
  ages: string
  selected: boolean
  onSelect: () => void
  className?: string
}

function SmallAgeCard({ label, ages, selected, onSelect, className }: CardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label} ${ages}`}
      aria-pressed={selected}
      className={cn(
        'flex min-h-[52px] min-w-[min(100%,10rem)] flex-1 flex-col items-center justify-center rounded-[10px] px-4 py-5 text-center shadow-sm sm:min-h-[140px] sm:max-w-[190px] sm:px-5 sm:py-7',
        'font-heading text-lg font-bold leading-snug text-white motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02] sm:text-xl',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800',
        selected ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-[#f9f4ec]' : '',
        className,
      )}
    >
      <span className="block">{label}</span>
      <span className="mt-1 block text-xs font-semibold opacity-95 sm:text-sm">{ages}</span>
    </button>
  )
}

type Props = {
  /** Called after the age band is updated (e.g. scroll to content). */
  afterPick?: () => void
  className?: string
}

/** Large touch cards for Tots / Kids / Crew — use on curriculum pages instead of the compact text-only selector. */
export function AgeBandVisualPicker({ afterPick, className }: Props) {
  const { t } = useTranslation()
  const { ageBand, setAgeBand } = useAgeBand()

  const pick = useCallback(
    (id: AgeBandId) => {
      setAgeBand(id)
      afterPick?.()
    },
    [setAgeBand, afterPick],
  )

  const bandClass: Record<AgeBandId, string> = {
    tots: 'bg-sky-600',
    kids: 'bg-amber-600',
    crew: 'bg-fuchsia-600',
  }

  return (
    <div
      className={cn('flex flex-wrap justify-center gap-3 sm:gap-4', className)}
      role="group"
      aria-label={t('ageBand.selectorAria')}
    >
      {(ALL_AGE_BANDS as AgeBandId[]).map((id) => (
        <SmallAgeCard
          key={id}
          label={t(`ageBand.names.${id}.short`)}
          ages={t(`ageBand.names.${id}.ages`)}
          selected={ageBand === id}
          onSelect={() => pick(id)}
          className={bandClass[id]}
        />
      ))}
    </div>
  )
}
