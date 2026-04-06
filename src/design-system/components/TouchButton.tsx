import * as React from 'react'
import { cn } from '@/lib/utils'

export type TouchButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

/** Minimum 44px touch target; visible focus ring for keyboard/classroom projection. */
export const TouchButton = React.forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
TouchButton.displayName = 'TouchButton'
