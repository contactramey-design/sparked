import { useTranslation } from '@/contexts/LocaleContext'
import { cn } from '@/lib/utils'

const RULE_ICONS = ['📚', '🧠', '🔒', '🛡️', '✨', '💬'] as const

const BULLET_KEYS = [
  'aiTutor.chatRulesBullet1',
  'aiTutor.chatRulesBullet2',
  'aiTutor.chatRulesBullet3',
  'aiTutor.chatRulesBullet4',
  'aiTutor.chatRulesBullet5',
  'aiTutor.chatRulesBullet6',
] as const

export function TutorRulesKidPanel({ className }: { className?: string }) {
  const { t } = useTranslation()

  return (
    <details
      className={cn(
        'group rounded-3xl border-2 border-teal-200/70 bg-gradient-to-br from-emerald-50/95 via-sky-50/40 to-amber-50/50 shadow-md open:shadow-lg',
        className,
      )}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-3 rounded-3xl px-4 py-4 marker:content-none md:px-6 md:py-5 [&::-webkit-details-marker]:hidden',
          'min-h-[56px] motion-safe:transition-colors motion-safe:duration-200 hover:bg-white/30',
        )}
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-inner md:h-16 md:w-16 md:text-4xl" aria-hidden>
          ✨
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-heading text-lg font-extrabold tracking-tight text-teal-950 md:text-xl lg:text-2xl">
            {t('aiTutor.chatRulesTitle')}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-teal-800/90 md:text-base">{t('aiTutor.chatRulesAccordionHint')}</p>
        </div>
        <span
          className="shrink-0 text-teal-700 motion-safe:transition-transform motion-safe:duration-200 group-open:-rotate-180"
          aria-hidden
        >
          <span className="inline-block rounded-full border border-teal-200 bg-white/90 px-2 py-1 text-lg font-bold">▼</span>
        </span>
      </summary>
      <div className="border-t border-teal-100/70 px-4 pb-5 pt-4 md:px-6 md:pb-6 md:pt-5">
        <p className="text-pretty text-base font-medium leading-relaxed text-slate-800 md:text-lg lg:text-xl">
          {t('aiTutor.chatRulesLead')}
        </p>
        <ul className="mt-4 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:gap-4">
          {RULE_ICONS.map((icon, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-2xl border border-white/90 bg-white/95 p-4 shadow-sm md:gap-4 md:p-5 lg:min-h-[5.5rem] lg:items-center"
            >
              <span className="select-none text-4xl leading-none md:text-5xl" aria-hidden>
                {icon}
              </span>
              <p className="m-0 min-w-0 flex-1 text-pretty text-base font-medium leading-snug text-slate-800 md:text-lg">
                {t(BULLET_KEYS[i])}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-3 text-xs leading-relaxed text-slate-600 md:text-sm">
          {t('aiTutor.chatRulesGrownUpNote')}
        </p>
      </div>
    </details>
  )
}
