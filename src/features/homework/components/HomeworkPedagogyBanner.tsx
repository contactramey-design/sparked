import { useTranslation } from '@/contexts/LocaleContext'

/** Ed-tech positioning: AI guides curiosity; it does not replace the child’s thinking. */
export function HomeworkPedagogyBanner() {
  const { t } = useTranslation()
  return (
    <div
      className="rounded-xl border border-sky-200 bg-sky-50/90 px-4 py-3 text-sky-950 text-sm leading-relaxed"
      role="note"
    >
      <p className="font-semibold text-sky-900">{t('homeworkFeature.pedagogyBannerTitle')}</p>
      <p className="mt-1">{t('homeworkFeature.pedagogyBannerBody')}</p>
    </div>
  )
}
