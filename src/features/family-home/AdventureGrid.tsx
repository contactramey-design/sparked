import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

/** Order: safety + homework first (heroes), AI Tutor tile, then practice + AI coding */
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
    path: '/ai-tutor',
    /** Built-in gradient tile — no separate PNG required */
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
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
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
    <div className="home-tiers mt-10 md:mt-14">
      <h2 className="home-tiers-title mb-6 text-center font-heading text-2xl text-blue-900 md:text-3xl">{t('home.chooseAdventure')}</h2>
      <div className="home-tier-grid mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {TIERS.map((tier) => (
          <AdventureCard key={tier.id} tier={tier} href={tier.path} />
        ))}
      </div>
      <p className="home-tiers-footnote mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-slate-600">
        {t('home.tiersFootnote')}
      </p>
    </div>
  )
}
