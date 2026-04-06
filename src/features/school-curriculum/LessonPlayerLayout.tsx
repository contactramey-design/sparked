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
        'lesson-player-layout mx-auto w-full px-4 pb-10 font-school',
        immersive ? 'max-w-5xl' : 'max-w-4xl',
        className,
      )}
    >
      {stepper}
      <div
        className={cn(
          'mt-4 rounded-2xl border border-slate-200/90 bg-white shadow-sm',
          immersive && 'overflow-hidden shadow-md',
        )}
      >
        {children}
      </div>
    </div>
  )
}
