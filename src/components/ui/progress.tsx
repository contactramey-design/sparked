import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, value))
    return (
      <div
        ref={ref}
        className={cn('relative h-3 w-full overflow-hidden rounded-full bg-slate-100', className)}
        {...props}
      >
        <div
          className="h-full bg-primary transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    )
  },
)
Progress.displayName = 'Progress'

