import { ALL_AGE_BANDS, type AgeBandId } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

/** Large touch-friendly grade-band control for school curriculum (binds to global age band). */
export function GradeBandTabs({ className }: Props) {
  const { ageBand, setAgeBand } = useAgeBand()
  const { t } = useTranslation()

  return (
    <div
      role="group"
      aria-label={t('ageBand.selectorAria')}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {(ALL_AGE_BANDS as AgeBandId[]).map((id) => {
        const selected = ageBand === id
        return (
          <button
            key={id}
            type="button"
            aria-pressed={selected}
            onClick={() => setAgeBand(id)}
            className={cn(
              'min-h-12 min-w-[6.5rem] rounded-xl border-2 px-3 py-2 text-left font-school transition-all',
              selected
                ? 'border-orange-500 bg-orange-500 text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:border-orange-200 hover:bg-orange-50/50',
            )}
          >
            <span className="block text-sm font-bold leading-tight">{t(`ageBand.names.${id}.short`)}</span>
            <span className={cn('mt-0.5 block text-[11px] font-medium leading-snug', selected ? 'text-white/90' : 'text-slate-600')}>
              {t(`ageBand.names.${id}.gradesUs`)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
