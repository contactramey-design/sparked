import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

/**
 * Lightweight retention hub: deep-links to tutor, safety, homework, practice.
 * Full “daily quest” rotation can replace static links later (Phase 2).
 */
export default function DailySparkQuestPage() {
  const { t } = useTranslation()

  return (
    <AscentPageChrome
      title={t('retention.dailyQuestTitle')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('retention.dailyQuestTitle') },
      ]}
      contentMaxWidthClassName="max-w-xl"
    >
      <div className="card space-y-4 rounded-2xl border border-teal-100/80 p-6">
        <p className="text-slate-700">{t('retention.dailyQuestLead')}</p>
        <ul className="m-0 list-none space-y-3 p-0">
          <li>
            <Link to="/ai-tutor" className="primary-button inline-block w-full py-3 text-center">
              {t('retention.dailyQuestTutorCta')}
            </Link>
          </li>
          <li>
            <Link to="/track/social-safety" className="secondary-button inline-block w-full border-2 border-teal-200 py-3 text-center">
              {t('retention.dailyQuestSafetyCta')}
            </Link>
          </li>
          <li>
            <Link to="/homework" className="secondary-button inline-block w-full border-2 border-teal-200 py-3 text-center">
              {t('retention.dailyQuestHomeworkCta')}
            </Link>
          </li>
          <li>
            <Link to="/practice" className="secondary-button inline-block w-full border-2 border-teal-200 py-3 text-center">
              {t('retention.dailyQuestPracticeCta')}
            </Link>
          </li>
        </ul>
      </div>
    </AscentPageChrome>
  )
}
