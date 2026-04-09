import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import AgeBandSelector from '@/components/AgeBandSelector'
import { cn } from '@/lib/utils'

type Props = {
  /** Primary action — roadmap default: safety adventures track */
  primaryCtaHref: string
}

export function HomeHero({ primaryCtaHref }: Props) {
  const { t } = useTranslation()
  const { ageBandDisplayName } = useAgeBand()

  return (
    <div
      className={cn(
        'home-hero rounded-3xl border border-sky-100/80 bg-gradient-to-br from-sky-50 via-white to-indigo-50/60',
        'px-6 py-8 shadow-sm md:px-10 md:py-10',
        'motion-safe:transition-shadow motion-safe:duration-300 motion-safe:hover:shadow-md',
      )}
    >
      <div className="home-hero-sparki flex justify-center" aria-hidden>
        <img
          src="/sparkiacademylogo.webp"
          alt=""
          className="home-hero-character mx-auto max-h-28 w-auto object-contain md:max-h-36 motion-reduce:transition-none"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            const next = e.currentTarget.nextElementSibling
            if (next) (next as HTMLElement).style.display = 'block'
          }}
        />
        <span className="home-hero-character-emoji hidden text-5xl" aria-hidden>
          🤖✨
        </span>
      </div>
      <div className="home-hero-content mx-auto mt-4 max-w-xl text-center">
        <h1 className="home-title text-balance font-heading text-3xl text-blue-900 md:text-4xl">{t('header.appName')}</h1>
        <p className="home-tagline mt-3 text-balance text-base text-slate-700 md:text-lg">{t('header.tagline')}</p>
        <div className="home-hero-age-wrap mx-auto mt-6 max-w-md rounded-2xl bg-white/70 p-4 text-left shadow-inner backdrop-blur-sm">
          <h2 className="home-hero-age-label font-heading text-lg text-blue-900">{t('ageBand.homeSectionTitle')}</h2>
          <p className="home-hero-age-sub muted mt-1 text-sm">{t('ageBand.homeSectionSubtitle')}</p>
          <p className="home-hero-age-current sr-only">{t('ageBand.currentLabel', { name: ageBandDisplayName })}</p>
          <div className="mt-3">
            <AgeBandSelector variant="compact" idPrefix="home-hero-age" />
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <Link
            to={primaryCtaHref}
            className="home-hero-cta primary-button inline-flex min-h-12 w-full max-w-xs items-center justify-center px-8 text-base font-bold sm:w-auto"
          >
            {t('home.heroPrimaryCta')}
          </Link>
          <Link
            to="/tracks"
            className="inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-xl border-2 border-sky-200 bg-white px-6 text-sm font-semibold text-sky-800 shadow-sm hover:bg-sky-50 sm:w-auto"
          >
            {t('home.heroBrowseAllAdventures')}
          </Link>
        </div>
        <p className="home-hero-secondary-ctas mt-5 text-center text-sm text-slate-600">
          <Link
            to="/?view=parent"
            className="home-hero-secondary-link font-semibold text-sky-700 underline-offset-2 hover:text-sky-900 hover:underline"
          >
            {t('home.secondaryGrownUps')}
          </Link>
        </p>
      </div>
    </div>
  )
}
