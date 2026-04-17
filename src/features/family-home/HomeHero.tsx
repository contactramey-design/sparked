import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

type Props = {
  /** Primary action — roadmap default: safety adventures track */
  primaryCtaHref: string
}

export function HomeHero({ primaryCtaHref }: Props) {
  const { t } = useTranslation()

  return (
    <section
      className={cn(
        'home-hero-ascent relative overflow-hidden rounded-[1.75rem] border border-amber-100/70',
        'bg-gradient-to-br from-[#fdf8f2] via-[#f9f4ec] to-[#e8f5f3]',
        'px-6 py-10 shadow-sm md:px-12 md:py-14',
        'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-md',
      )}
      aria-labelledby="home-hero-ascent-title"
    >
      {/* Decorative blobs — Ascent-style playful backdrop */}
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-teal-300/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-amber-200/35 blur-2xl" aria-hidden />

      <div className="relative z-[1] mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
        <div className="text-center md:text-left">
          <p className="mx-auto inline-flex max-w-full items-center justify-center rounded-full border border-teal-200/70 bg-white/85 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-teal-900 shadow-sm backdrop-blur-sm md:mx-0">
            <span className="text-balance">{t('home.heroAscentRibbon')}</span>
          </p>
          <p className="mt-5 font-heading text-sm font-semibold tracking-wide text-slate-500">{t('home.heroAscentKicker')}</p>
          <h1
            id="home-hero-ascent-title"
            className="home-title mt-2 text-balance font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 md:text-5xl"
          >
            <span className="block md:inline">{t('home.heroAscentTitleLead')}</span>{' '}
            <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              {t('home.heroAscentTitleAccent')}
            </span>
          </h1>
          <p className="home-tagline mt-4 max-w-xl text-balance text-base leading-relaxed text-slate-600 md:mx-0 md:text-lg">
            {t('home.heroAscentTagline')}
          </p>
          <p className="mt-5 max-w-xl text-sm font-medium text-slate-600 md:mx-0">{t('home.heroAgeTeaser')}</p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap md:justify-start">
            <Link
              to={primaryCtaHref}
              className={cn(
                'inline-flex min-h-12 items-center justify-center rounded-2xl px-8 text-base font-bold text-white shadow-md',
                'bg-teal-600 hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
                'motion-safe:transition-colors motion-safe:duration-200',
                'sm:w-auto sm:min-w-[12rem]',
              )}
            >
              {t('home.heroPrimaryCta')}
            </Link>
            <Link
              to="/tracks"
              className={cn(
                'inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-teal-700/35 bg-white px-6 text-sm font-semibold text-teal-900 shadow-sm',
                'hover:border-teal-600 hover:bg-teal-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600',
                'motion-safe:transition-colors motion-safe:duration-200',
                'sm:w-auto',
              )}
            >
              {t('home.heroBrowseAllAdventures')}
            </Link>
          </div>
          <p className="home-hero-secondary-ctas mt-5 text-center text-sm text-slate-600 md:text-left">
            <Link
              to="/?view=parent"
              className="home-hero-secondary-link font-semibold text-teal-800 underline-offset-2 hover:text-teal-950 hover:underline"
            >
              {t('home.secondaryGrownUps')}
            </Link>
          </p>
        </div>

        <div className="relative flex min-h-[220px] items-center justify-center md:min-h-[320px]" aria-hidden>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-56 w-56 rounded-full bg-gradient-to-br from-teal-200/50 to-fuchsia-200/40 blur-sm md:h-72 md:w-72" />
            <div className="absolute h-44 w-44 rounded-full border-2 border-dashed border-teal-400/40 md:h-56 md:w-56" />
            <div className="absolute h-52 w-52 rounded-full border border-pink-300/35 md:h-64 md:w-64" />
          </div>
          <div className="home-hero-sparki relative z-[1] flex items-center justify-center">
            <img
              src="/sparkiacademylogo.webp"
              alt=""
              className="relative z-[1] h-auto max-h-40 w-auto max-w-[min(100%,280px)] object-contain drop-shadow-md motion-reduce:transition-none md:max-h-52"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const next = e.currentTarget.nextElementSibling
                if (next) (next as HTMLElement).style.display = 'block'
              }}
            />
            <span className="home-hero-character-emoji hidden text-7xl" aria-hidden>
              🤖✨
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
