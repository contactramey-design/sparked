import * as React from 'react'
import { cn } from '@/lib/utils'

type Props = {
  stepper: React.ReactNode
  children: React.ReactNode
  /** Practice step often needs more horizontal room */
  immersive?: boolean
  className?: string
}

/** Shared chrome for school lesson steps: stepper + bordered content surface. */
export function LessonPlayerLayout({ stepper, children, immersive, className }: Props) {
  return (
    <div
      className={cn(
        'lesson-player-layout mx-auto w-full min-w-0 max-w-full px-3 pb-10 font-school sm:px-4',
        immersive ? 'max-w-6xl' : 'max-w-4xl',
        className,
      )}
    >
      {stepper}
      <div
        className={cn(
          'mt-4 min-h-0 w-full min-w-0 rounded-2xl border border-slate-200/90 bg-white shadow-sm',
          /* overflow-hidden breaks drag/touch inside practice embeds; clip only where embeds do their own scrolling */
          immersive ? 'overflow-visible shadow-md' : 'overflow-x-auto overflow-y-visible',
        )}
      >
        {children}
      </div>
    </div>
  )
}
