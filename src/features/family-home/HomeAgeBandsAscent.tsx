import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { AgeBandId } from '@/ageBand'
import { useAgeBand } from '@/contexts/AgeBandContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { SectionHeading } from '@/design-system/ascent/SectionHeading'
import { cn } from '@/lib/utils'

function scrollToAdventures() {
  document.getElementById('home-adventures')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

type CardProps = {
  label: string
  ages: string
  selected: boolean
  onSelect: () => void
  className?: string
}

function SmallAgeCard({ label, ages, selected, onSelect, className }: CardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${label} ${ages}`}
      aria-pressed={selected}
      className={cn(
        'flex min-h-[140px] w-full max-w-[190px] flex-col items-center justify-center rounded-[10px] px-5 py-7 text-center shadow-sm',
        'font-heading text-xl font-bold leading-snug text-white motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800',
        selected ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-[#f9f4ec]' : '',
        className,
      )}
    >
      <span className="block">{label}</span>
      <span className="mt-1 block text-sm font-semibold opacity-95">{ages}</span>
    </button>
  )
}

function BigAgeCard({
  title,
  subtitle,
  selected,
  onSelect,
  ariaLabel,
}: {
  title: string
  subtitle: string
  selected: boolean
  onSelect: () => void
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={ariaLabel}
      aria-pressed={selected}
      className={cn(
        'flex min-h-[180px] w-full max-w-[300px] flex-col items-center justify-center rounded-[10px] bg-[#0d9488] px-6 py-10 text-center shadow-md',
        'font-heading text-2xl font-bold leading-tight text-white md:text-3xl',
        'motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.02]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-950',
        selected ? 'ring-2 ring-amber-300 ring-offset-2 ring-offset-[#f9f4ec]' : '',
      )}
    >
      <span className="max-w-[12rem]">{title}</span>
      <span className="mt-2 block text-base font-semibold text-teal-50">{subtitle}</span>
    </button>
  )
}

export function HomeAgeBandsAscent() {
  const { t } = useTranslation()
  const { ageBand, setAgeBand } = useAgeBand()

  const pick = useCallback(
    (id: AgeBandId) => {
      setAgeBand(id)
      scrollToAdventures()
    },
    [setAgeBand],
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-4 md:py-6" aria-labelledby="home-age-ascent-title" data-home-theme="ascent">
      <details className="group rounded-2xl border border-teal-100/70 bg-ascent-warm/80 shadow-sm open:shadow-md">
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:content-none md:px-6 [&::-webkit-details-marker]:hidden"
          id="home-age-ascent-title"
        >
          <span className="font-heading text-base font-bold text-teal-950 md:text-lg">{t('home.ageBandAccordionSummary')}</span>
          <span className="text-teal-700 motion-safe:transition-transform group-open:rotate-180" aria-hidden>
            ▼
          </span>
        </summary>
        <div className="border-t border-teal-100/60 px-4 pb-6 pt-2 md:px-8 md:pb-8">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,37%)_1fr] lg:gap-10">
            <div>
              <SectionHeading
                kicker={t('home.ascentAgeKicker')}
                title={t('home.ascentAgeTitle')}
                description={t('home.ascentAgeBody')}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToAdventures}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-teal-600 px-6 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
                >
                  {t('home.ascentAgeJumpCta')}
                </button>
                <Link
                  to="/tracks"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-teal-800/25 bg-white px-5 text-sm font-semibold text-teal-900 hover:bg-white/90"
                >
                  {t('home.heroBrowseAllAdventures')}
                </Link>
              </div>
            </div>

            <div className="relative flex flex-wrap justify-center gap-3 sm:flex-nowrap sm:justify-between sm:gap-4 md:gap-6 lg:gap-8">
              <div className="mt-0 flex flex-col items-center gap-3 sm:mt-10 sm:items-end md:gap-4">
                <BigAgeCard
                  title={t('home.ascentAgeBigTitle')}
                  subtitle={t('home.ascentAgeBigSub')}
                  selected={false}
                  onSelect={scrollToAdventures}
                  ariaLabel={t('home.ascentAgeJumpCta')}
                />
                <SmallAgeCard
                  label={t('ageBand.names.crew.short')}
                  ages={t('ageBand.names.crew.ages')}
                  selected={ageBand === 'crew'}
                  onSelect={() => pick('crew')}
                  className="bg-fuchsia-600"
                />
              </div>
              <div className="flex flex-col gap-3 md:gap-4">
                <SmallAgeCard
                  label={t('ageBand.names.tots.short')}
                  ages={t('ageBand.names.tots.ages')}
                  selected={ageBand === 'tots'}
                  onSelect={() => pick('tots')}
                  className="bg-sky-600"
                />
                <SmallAgeCard
                  label={t('ageBand.names.kids.short')}
                  ages={t('ageBand.names.kids.ages')}
                  selected={ageBand === 'kids'}
                  onSelect={() => pick('kids')}
                  className="bg-amber-600"
                />
              </div>
            </div>
          </div>
        </div>
      </details>
    </section>
  )
}
