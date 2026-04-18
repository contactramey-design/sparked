import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'
import { KidWayfindingBar } from './KidWayfindingBar'

export type AscentBreadcrumbItem = { label: string; to?: string }

type Props = {
  /** Omit when `kidHomeLayout` — main heading lives in the page hero. */
  title?: string
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
  /**
   * Kid landing (home): same Ascent shell as inner pages but no duplicate giant H1 —
   * breadcrumb strip + optional subtitle + wayfinding; hero below keeps the main title.
   */
  kidHomeLayout?: boolean
  /** Shown under breadcrumb when `kidHomeLayout` */
  kidHomeSubtitle?: string
  /** Big shortcut chips to main kid hubs (Home, Adventures, This week, …) */
  showKidWayfinding?: boolean
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
  kidHomeLayout = false,
  kidHomeSubtitle,
  showKidWayfinding = false,
}: Props) {
  const { t } = useTranslation()

  const items: AscentBreadcrumbItem[] =
    breadcrumb && breadcrumb.length > 0
      ? breadcrumb
      : kidHomeLayout
        ? [{ label: t('marketingPages.breadcrumbHome') }]
        : [
            { label: t('marketingPages.breadcrumbHome'), to: '/' },
            { label: currentLabel ?? title ?? t('marketingPages.breadcrumbHome') },
          ]

  const breadcrumbNav = (
    <nav
      className={cn('flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600', !kidHomeLayout && 'mt-0')}
      aria-label={t('header.breadcrumbAria')}
    >
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
  )

  if (kidHomeLayout) {
    return (
      <div className={cn('min-h-[40vh] bg-gradient-to-b from-ascent-cream via-white to-slate-50/40 pb-16 pt-0', className)}>
        <div className="border-b border-teal-100/80 bg-ascent-warm">
          <div className="mx-auto max-w-6xl px-4 py-5 md:py-6">
            {breadcrumbNav}
            {kidHomeSubtitle ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{kidHomeSubtitle}</p> : null}
            <KidWayfindingBar className="mt-4 border-t-0 pt-0" />
          </div>
        </div>
        <div className={cn('mx-auto px-4 py-6 md:py-10', contentMaxWidthClassName, contentClassName)}>{children}</div>
      </div>
    )
  }

  const pageTitle = title ?? currentLabel ?? ''

  return (
    <div className={cn('min-h-[40vh] bg-gradient-to-b from-ascent-cream via-white to-slate-50/40 pb-16 pt-0', className)}>
      <div className="border-b border-teal-100/80 bg-ascent-warm">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          {breadcrumbNav}
          {pageTitle ? (
            <h1 className="mt-4 text-balance font-heading text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {pageTitle}
            </h1>
          ) : null}
          {showKidWayfinding ? <KidWayfindingBar /> : null}
        </div>
      </div>
      <div className={cn('mx-auto px-4 py-10 md:py-12', contentMaxWidthClassName, contentClassName)}>{children}</div>
    </div>
  )
}
