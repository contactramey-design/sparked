import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

const TIERS = [
  {
    id: 'safety',
    path: '/track/social-safety',
    imageSrc: '/safety-card.png',
  },
  {
    id: 'ai-coding',
    path: '/track/ai-coding',
    imageSrc: '/sparkiaicodingcardhomepage.png',
  },
  {
    id: 'homework',
    path: '/homework',
    imageSrc: '/homework-card.png',
  },
  {
    id: 'practice',
    path: '/practice',
    imageSrc: '/globalposter.png',
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
        {imgFailed ? (
          <span className="flex h-full items-center justify-center px-4 text-center font-heading text-slate-700">{title}</span>
        ) : (
          <img
            src={tier.imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-[1.02]"
            onError={() => setImgFailed(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left text-white">
          <span className="text-xs font-bold uppercase tracking-wide opacity-90">{t('home.adventure')}</span>
          <h3 className="font-heading text-xl leading-snug drop-shadow-sm md:text-2xl">{title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>
        <span className="mt-auto inline-flex min-h-11 items-center justify-center rounded-xl bg-sky-500 px-4 py-2 text-center text-sm font-bold text-white shadow-sm group-hover:bg-sky-600">
          {t('home.startAdventure')}
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
      <div className="home-tier-grid mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((tier) => (
          <AdventureCard key={tier.id} tier={tier} href={tier.path} />
        ))}
      </div>
    </div>
  )
}
