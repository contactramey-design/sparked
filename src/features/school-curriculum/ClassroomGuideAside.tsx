import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'
import ListenButton from '@/components/ListenButton'

type Props = {
  className?: string
  /** Stable id for `aria-labelledby` from the parent region. */
  headingId?: string
}

/**
 * Teacher-facing “how to use in class” steps (i18n). Collapsible on narrow viewports;
 * always expanded in a static card from the `lg` breakpoint up.
 */
export function ClassroomGuideAside({ className, headingId = 'school-subj-how-to-heading' }: Props) {
  const { t } = useTranslation()

  const howToSpeakText = [
    t('schoolSubjects.howToTitle'),
    t('schoolSubjects.howToStep1'),
    t('schoolSubjects.howToStep2'),
    t('schoolSubjects.howToStep3'),
  ].join('. ')

  const steps = (
    <ol className="school-subj-howto-list">
      <li>{t('schoolSubjects.howToStep1')}</li>
      <li>{t('schoolSubjects.howToStep2')}</li>
      <li>{t('schoolSubjects.howToStep3')}</li>
    </ol>
  )

  return (
    <div className={cn('school-subj-classroom-guide', className)}>
      <details className="school-subj-aside-block lg:hidden motion-safe:transition-[box-shadow]">
        <summary className="school-subj-aside-block__title cursor-pointer list-none font-school [&::-webkit-details-marker]:hidden">
          {t('schoolSubjects.howToTitle')}
        </summary>
        <div className="flex justify-end px-1 pb-2">
          <ListenButton text={howToSpeakText} ariaLabel={t('listenButton.schoolHowTo')} size="sm" />
        </div>
        {steps}
      </details>

      <div className="school-subj-aside-block hidden lg:block" aria-labelledby={headingId}>
        <div className="flex flex-wrap items-start gap-2">
          <h3 id={headingId} className="school-subj-aside-block__title m-0 flex-1 min-w-0">
            {t('schoolSubjects.howToTitle')}
          </h3>
          <ListenButton text={howToSpeakText} ariaLabel={t('listenButton.schoolHowTo')} size="sm" className="shrink-0" />
        </div>
        {steps}
      </div>
    </div>
  )
}
