import { cn } from '@/lib/utils'

type Props = {
  /** Small uppercase label above the title */
  kicker: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
  /** For `aria-labelledby` on the wrapping section */
  id?: string
}

/** Ascent-style section header — marketing home only. */
export function SectionHeading({ kicker, title, description, className, align = 'left', id }: Props) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={cn('max-w-2xl', alignCls, className)}>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-800">{kicker}</p>
      <h2 id={id} className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
        {title}
      </h2>
      {description ? <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">{description}</p> : null}
    </div>
  )
}
