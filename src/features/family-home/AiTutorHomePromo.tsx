import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'

/**
 * Full-width promo card on the home page (matches Daily Spark strip pattern).
 */
export function AiTutorHomePromo() {
  const { t } = useTranslation()
  return (
    <Link
      to="/ai-tutor"
      className="block rounded-2xl border border-indigo-200/90 bg-gradient-to-br from-indigo-600 via-sky-600 to-slate-800 px-5 py-5 shadow-md transition hover:shadow-lg hover:brightness-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            {t('home.aiTutorPromoBadge')}
          </p>
          <h2 className="mt-3 font-heading text-xl font-bold text-white md:text-2xl">{t('home.aiTutorPromoTitle')}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-50 md:text-base">{t('home.aiTutorPromoBody')}</p>
        </div>
        <span className="mt-1 shrink-0 self-start rounded-xl bg-white px-4 py-3 text-center text-sm font-bold text-indigo-800 sm:self-center">
          {t('home.aiTutorPromoCta')} →
        </span>
      </div>
    </Link>
  )
}
