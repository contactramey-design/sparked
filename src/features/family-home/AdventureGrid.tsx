import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

/** Full catalog order — home page shows first 3 only; rest via “See all”. */
const TIERS = [
  {
    id: 'safety',
    path: '/track/social-safety',
    imageSrc: '/safety-card.png',
  },
  {
    id: 'homework',
    path: '/homework',
    imageSrc: '/homework-card.png',
  },
  {
    id: 'aiTutor',
    path: '/tutor',
    tile: 'premiumAiTutor' as const,
  },
  {
    id: 'practice',
    path: '/practice',
    imageSrc: '/globalposter.png',
  },
  {
    id: 'ai-coding',
    path: '/track/ai-coding',
    imageSrc: '/sparkiaicodingcardhomepage.png',
  },
] as const

const FEATURED_COUNT = 3
const featuredTiers = TIERS.slice(0, FEATURED_COUNT)

function AdventureCard({
  tier,
  href,
}: {
  tier: (typeof TIERS)[number]
  href: string
}) {
  const [imgFailed, setImgFailed] = useState(false)
  const { t } = useTranslation()
  const title = t(`home.tiers.${tier.id}.title`)
  const description = t(`home.tiers.${tier.id}.description`)
  const imageAlt = t(`home.tiers.${tier.id}.imageAlt`)

  return (
    <Link
      to={href}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm outline-none',
        'motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg',
        'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
      )}
      title={title}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-sky-100 to-indigo-50">
        {'tile' in tier && tier.tile === 'premiumAiTutor' ? (
          <div
            className="flex h-full w-full flex-col justify-end bg-gradient-to-br from-indigo-700 via-sky-600 to-slate-900 p-4 text-white motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
            role="img"
            aria-label={imageAlt}
          >
            <span className="mb-2 inline-flex w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              {t('home.aiTutorCardBadge')}
            </span>
            <span className="font-heading text-lg font-bold leading-tight drop-shadow md:text-xl">{t('home.aiTutorCardHeadline')}</span>
            <span className="mt-1 text-xs text-white/85">{t('home.aiTutorCardSub')}</span>
          </div>
        ) : imgFailed ? (
          <span className="flex h-full items-center justify-center px-4 text-center font-heading text-slate-700">{title}</span>
        ) : (
          <img
            src={'imageSrc' in tier ? tier.imageSrc : ''}
            alt={imageAlt}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
            onError={() => setImgFailed(true)}
          />
        )}
        {!('tile' in tier && tier.tile === 'premiumAiTutor') && (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" aria-hidden />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left text-white">
              <span className="text-xs font-bold uppercase tracking-wide opacity-90">{t('home.adventure')}</span>
              <h3 className="font-heading text-xl leading-snug drop-shadow-sm md:text-2xl">{title}</h3>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">{description}</p>
        <span
          className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-center text-sm font-bold text-white shadow-sm ${
            'tile' in tier && tier.tile === 'premiumAiTutor'
              ? 'bg-indigo-600 group-hover:bg-indigo-700'
              : 'bg-sky-500 group-hover:bg-sky-600'
          }`}
        >
          {'tile' in tier && tier.tile === 'premiumAiTutor' ? t('home.startAiTutor') : t('home.startAdventure')}
        </span>
      </div>
    </Link>
  )
}

export function AdventureGrid() {
  const { t } = useTranslation()

  return (
    <div className="home-tiers mt-8 md:mt-10">
      <h2 className="home-tiers-title mb-2 text-center font-heading text-2xl text-slate-900 md:text-3xl">{t('home.chooseAdventure')}</h2>
      <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-600">{t('home.featuredAdventuresLead')}</p>
      <div className="home-tier-grid mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredTiers.map((tier) => (
          <AdventureCard key={tier.id} tier={tier} href={tier.path} />
        ))}
      </div>
      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
        <Link
          to="/tracks"
          className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-teal-600 bg-white px-6 text-sm font-bold text-teal-900 shadow-sm hover:bg-teal-50"
        >
          {t('home.adventureSeeAllCta')}
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <Link to="/practice" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('home.adventureLinkPractice')}
          </Link>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <Link to="/track/ai-coding" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('home.adventureLinkCoding')}
          </Link>
        </div>
      </div>
      <p className="home-tiers-footnote mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-slate-500">{t('home.tiersFootnoteShort')}</p>
    </div>
  )
}
