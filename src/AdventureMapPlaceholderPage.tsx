import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

/** Placeholder for the deferred Sparki Adventure Map (progression + gates). */
export default function AdventureMapPlaceholderPage() {
  const { t } = useTranslation()

  return (
    <AscentPageChrome
      title={t('retention.adventureMapTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('retention.adventureMapTitle') },
      ]}
      contentMaxWidthClassName="max-w-xl"
    >
      <div className="card space-y-4 rounded-2xl border border-teal-100/80 p-6">
        <p className="text-slate-700">{t('retention.adventureMapLead')}</p>
        <Link to="/daily" className="primary-button inline-block w-full py-3 text-center">
          {t('retention.adventureMapCtaDaily')}
        </Link>
      </div>
    </AscentPageChrome>
  )
}
