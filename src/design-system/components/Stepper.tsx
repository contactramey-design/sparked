import { cn } from '@/lib/utils'

export type StepperItem = { id: string; label: string }

type Props = {
  steps: StepperItem[]
  currentId: string
  onStepClick?: (id: string) => void
  ariaLabel: string
  className?: string
}

export function Stepper({ steps, currentId, onStepClick, ariaLabel, className }: Props) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'sticky top-0 z-10 flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-sm backdrop-blur-sm font-school',
        className,
      )}
    >
      {steps.map((s, index) => {
        const active = s.id === currentId
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onStepClick?.(s.id)}
            className={cn(
              'min-h-11 flex-1 min-w-[5.5rem] rounded-xl px-3 py-2 text-sm font-semibold transition-colors sm:flex-none sm:min-w-[7rem]',
              active
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              onStepClick && 'cursor-pointer',
            )}
          >
            <span className="mr-1.5 text-xs font-bold opacity-70">{index + 1}.</span>
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
