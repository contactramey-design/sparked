import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

export type AscentBreadcrumbItem = { label: string; to?: string }

type Props = {
  title: string
  /** Used when `breadcrumb` is omitted: Home / currentLabel */
  currentLabel?: string
  /** Full trail; last item without `to` is the current page. Overrides `currentLabel` when set. */
  breadcrumb?: AscentBreadcrumbItem[]
  children: React.ReactNode
  className?: string
  /** Extra classes on the inner content column (after hero). */
  contentClassName?: string
  /** Max width for the content column (default `max-w-6xl`). */
  contentMaxWidthClassName?: string
}

/**
 * Inner-page hero + container aligned to Ascent marketing pages (PageTitle + warm band).
 * App shell stays Sparki; consumer routes use this for a consistent professional layout.
 */
export function AscentPageChrome({
  title,
  currentLabel,
  breadcrumb,
  children,
  className,
  contentClassName,
  contentMaxWidthClassName = 'max-w-6xl',
}: Props) {
  const { t } = useTranslation()

  const items: AscentBreadcrumbItem[] =
    breadcrumb && breadcrumb.length > 0
      ? breadcrumb
      : [
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: currentLabel ?? title },
        ]

  return (
    <div className={cn('min-h-[40vh] bg-gradient-to-b from-ascent-cream via-white to-slate-50/40 pb-16 pt-0', className)}>
      <div className="border-b border-teal-100/80 bg-ascent-warm">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <h1 className="text-balance font-heading text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">{title}</h1>
          <nav className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600" aria-label="Breadcrumb">
            {items.map((item, i) => (
              <span key={`${item.label}-${i}`} className="flex flex-wrap items-center gap-2">
                {i > 0 ? (
                  <span className="text-slate-400" aria-hidden>
                    /
                  </span>
                ) : null}
                {item.to ? (
                  <Link to={item.to} className="text-teal-800 underline-offset-2 hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-900">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>
      <div className={cn('mx-auto px-4 py-10 md:py-12', contentMaxWidthClassName, contentClassName)}>{children}</div>
    </div>
  )
}
