import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type HubKey = 'home' | 'tracks' | 'weekly' | 'daily' | 'homework' | 'tutor' | 'practice'

function activeHub(pathname: string, search: string): HubKey | null {
  const parentHome = new URLSearchParams(search).get('view') === 'parent'
  if (pathname === '/' && !parentHome) return 'home'
  if (
    pathname === '/tracks' ||
    pathname.startsWith('/track/') ||
    pathname.startsWith('/unit/') ||
    pathname.startsWith('/lesson/')
  ) {
    return 'tracks'
  }
  if (pathname.startsWith('/weekly')) return 'weekly'
  if (pathname.startsWith('/daily')) return 'daily'
  if (pathname.startsWith('/homework')) return 'homework'
  if (pathname.startsWith('/ai-tutor')) return 'tutor'
  if (pathname.startsWith('/practice')) return 'practice'
  return null
}

const primaryLinks: { to: string; hub: HubKey; labelKey: string }[] = [
  { to: '/tracks', hub: 'tracks', labelKey: 'kidWayfinding.tracks' },
  { to: '/homework', hub: 'homework', labelKey: 'kidWayfinding.homework' },
  { to: '/ai-tutor', hub: 'tutor', labelKey: 'kidWayfinding.tutor' },
]

const moreLinks: { to: string; hub: HubKey; labelKey: string }[] = [
  { to: '/', hub: 'home', labelKey: 'kidWayfinding.home' },
  { to: '/weekly', hub: 'weekly', labelKey: 'kidWayfinding.weekly' },
  { to: '/daily', hub: 'daily', labelKey: 'kidWayfinding.daily' },
  { to: '/practice', hub: 'practice', labelKey: 'kidWayfinding.practice' },
]

const moreHubSet = new Set<HubKey>(moreLinks.map((l) => l.hub))

type Props = {
  className?: string
}

function chipClass(isCurrent: boolean) {
  return cn(
    'inline-flex min-h-12 items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-sm font-bold transition-colors sm:px-4',
    isCurrent
      ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-sm'
      : 'border-teal-100/90 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50',
  )
}

/**
 * Compact kid hubs: three primary shortcuts + “More” for home, weekly, daily, practice.
 */
export function KidWayfindingBar({ className }: Props) {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const pathOnly = pathname || '/'
  const current = activeHub(pathOnly, search)
  const moreActive = current !== null && moreHubSet.has(current)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname, search])

  useEffect(() => {
    if (!moreOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!moreWrapRef.current?.contains(e.target as Node)) setMoreOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  return (
    <div
      className={cn(
        'kid-wayfinding flex flex-wrap items-center gap-2 border-t border-teal-100/70 pt-4 mt-4',
        className,
      )}
      role="navigation"
      aria-label={t('kidWayfinding.aria')}
    >
      {primaryLinks.map(({ to, hub, labelKey }) => {
        const isCurrent = current !== null && hub === current
        return (
          <Link key={to + hub} to={to} className={chipClass(isCurrent)} aria-current={isCurrent ? 'page' : undefined}>
            {t(labelKey)}
          </Link>
        )
      })}

      <div className="relative" ref={moreWrapRef}>
        <button
          type="button"
          className={cn(chipClass(moreActive), 'w-full min-w-[5.5rem] sm:w-auto')}
          aria-expanded={moreOpen}
          aria-haspopup="true"
          aria-controls="kid-wayfinding-more-menu"
          id="kid-wayfinding-more-btn"
          onClick={() => setMoreOpen((o) => !o)}
        >
          {t('kidWayfinding.more')}
        </button>
        {moreOpen ? (
          <div
            id="kid-wayfinding-more-menu"
            role="menu"
            aria-labelledby="kid-wayfinding-more-btn"
            className="absolute left-0 top-[calc(100%+6px)] z-50 flex min-w-[12rem] flex-col gap-1 rounded-xl border border-teal-100 bg-white p-2 shadow-lg sm:left-auto sm:right-0"
          >
            {moreLinks.map(({ to, hub, labelKey }) => {
              const isCurrent = current !== null && hub === current
              return (
                <Link
                  key={to + hub}
                  to={to}
                  role="menuitem"
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-semibold',
                    isCurrent ? 'bg-teal-50 text-teal-950' : 'text-slate-700 hover:bg-slate-50',
                  )}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => setMoreOpen(false)}
                >
                  {t(labelKey)}
                </Link>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
