import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type HubKey = 'home' | 'tracks' | 'weekly' | 'daily' | 'homework' | 'tutor'

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
  return null
}

const links: { to: string; hub: HubKey; labelKey: string }[] = [
  { to: '/', hub: 'home', labelKey: 'kidWayfinding.home' },
  { to: '/tracks', hub: 'tracks', labelKey: 'kidWayfinding.tracks' },
  { to: '/weekly', hub: 'weekly', labelKey: 'kidWayfinding.weekly' },
  { to: '/daily', hub: 'daily', labelKey: 'kidWayfinding.daily' },
  { to: '/homework', hub: 'homework', labelKey: 'kidWayfinding.homework' },
  { to: '/ai-tutor', hub: 'tutor', labelKey: 'kidWayfinding.tutor' },
]

type Props = {
  className?: string
}

/**
 * Big tap targets + consistent Ascent styling so kids can jump between main hubs without the dropdown menu.
 */
export function KidWayfindingBar({ className }: Props) {
  const { t } = useTranslation()
  const { pathname, search } = useLocation()
  const pathOnly = pathname || '/'
  const current = activeHub(pathOnly, search)

  return (
    <div
      className={cn(
        'kid-wayfinding flex flex-wrap gap-2 border-t border-teal-100/70 pt-4 mt-4',
        className,
      )}
      role="navigation"
      aria-label={t('kidWayfinding.aria')}
    >
      {links.map(({ to, hub, labelKey }) => {
        const isCurrent = current !== null && hub === current
        return (
          <Link
            key={to + hub}
            to={to}
            className={cn(
              'inline-flex min-h-12 items-center justify-center rounded-xl border-2 px-3 py-2 text-center text-sm font-bold transition-colors sm:px-4',
              isCurrent
                ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-sm'
                : 'border-teal-100/90 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50',
            )}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {t(labelKey)}
          </Link>
        )
      })}
    </div>
  )
}
