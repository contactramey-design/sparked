import { cn } from '@/lib/utils'
import { caStandardsReferenceUrl, cdeFrameworkUrl, formatCaStandardsBadge } from '@/school/subjects/caStandardsDisplay'
import type { SchoolSubjectLesson } from '@/school/subjects/types'
import { useTranslation } from '@/contexts/LocaleContext'

type Props = {
  lesson: SchoolSubjectLesson
  /** Compact row for lesson cards */
  compact?: boolean
  className?: string
}

/**
 * California alignment: CDE framework metadata when present, else `standardsNote`.
 */
export function StandardsBadge({ lesson, compact, className }: Props) {
  const { t } = useTranslation()
  const ca = lesson.caStandards

  if (ca) {
    const label = formatCaStandardsBadge(ca)
    const shortCodes = ca.codes.slice(0, compact ? 2 : ca.codes.length).join(' · ')
    const display = compact ? (shortCodes || label) : label
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={caStandardsReferenceUrl(ca)}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex max-w-full items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-900 hover:bg-blue-100',
              compact && 'truncate',
            )}
            title={label}
          >
            {display}
            {compact && ca.codes.length > 2 ? '…' : ''}
          </a>
          {!compact ? (
            <a
              href={cdeFrameworkUrl(ca.framework)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-orange-800 underline-offset-2 hover:underline"
            >
              {t('schoolSubjects.viewCde')}
            </a>
          ) : null}
        </div>
        {!compact && ca.codes.length > 0 ? (
          <ul className="m-0 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {ca.codes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  }

  if (lesson.standardsNote?.trim()) {
    return (
      <span
        className={cn(
          'inline-flex max-w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800',
          compact && 'truncate',
          className,
        )}
        title={lesson.standardsNote}
      >
        {compact ? lesson.standardsNote.slice(0, 48) + (lesson.standardsNote.length > 48 ? '…' : '') : lesson.standardsNote}
      </span>
    )
  }

  return (
    <span className={cn('text-xs font-medium text-slate-400', className)} title={t('schoolSubjects.alignmentUnknownFramework')}>
      —
    </span>
  )
}
