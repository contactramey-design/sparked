import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const TILES = [
  { src: '/safety-card.png', to: '/track/social-safety', labelKey: 'marketingPages.portfolio1' as const },
  { src: '/homework-card.png', to: '/homework', labelKey: 'marketingPages.portfolio2' as const },
  { src: '/globalposter.png', to: '/practice', labelKey: 'marketingPages.portfolio3' as const },
  { src: '/sparkiaicodingcardhomepage.png', to: '/track/ai-coding', labelKey: 'marketingPages.portfolio4' as const },
  { src: '/sparkiacademylogo.webp', to: '/', labelKey: 'marketingPages.portfolio5' as const },
  { src: '/bundlecover.webp', to: '/books', labelKey: 'marketingPages.portfolio6' as const },
]

export default function PortfolioMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome title={t('marketingPages.portfolioPageTitle')} currentLabel={t('marketingPages.portfolioBreadcrumb')}>
      <p className="mx-auto max-w-2xl text-center text-lg text-slate-600">{t('marketingPages.portfolioIntro')}</p>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {TILES.map((tile) => (
          <Link
            key={tile.labelKey}
            to={tile.to}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm"
          >
            <img
              src={tile.src}
              alt=""
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-4 text-center font-heading text-sm font-bold text-white md:text-base">
              {t(tile.labelKey)}
            </span>
          </Link>
        ))}
      </div>
    </AscentPageChrome>
  )
}
