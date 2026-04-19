import { useMemo } from 'react'

const KEYWORDS: { re: RegExp; icon: string; label: string }[] = [
  { re: /\b(add|plus|sum|fraction|subtract|multiply|divide|math|number)\b/i, icon: '🔢', label: 'Math' },
  { re: /\b(read|story|word|sentence|spell|english|write)\b/i, icon: '📖', label: 'Reading' },
  { re: /\b(science|plant|animal|water|earth|space|experiment)\b/i, icon: '🔬', label: 'Science' },
  { re: /\b(history|past|map|country|president|timeline)\b/i, icon: '🌍', label: 'History' },
  { re: /\b(safe|kind|friend|online|screen|internet)\b/i, icon: '🛡️', label: 'Safety' },
  { re: /\b(ai|robot|computer|code)\b/i, icon: '🤖', label: 'Tech' },
]

type Props = {
  /** Latest user + assistant snippet for heuristic icons */
  userSnippet?: string
  assistantSnippet?: string
  /** e.g. i18n heading above the icons */
  title?: string
}

export function TutorTopicCard({ userSnippet = '', assistantSnippet = '', title = 'Now learning' }: Props) {
  const text = `${userSnippet}\n${assistantSnippet}`
  const picks = useMemo(() => {
    const out: { icon: string; label: string }[] = []
    for (const k of KEYWORDS) {
      if (k.re.test(text)) out.push({ icon: k.icon, label: k.label })
      if (out.length >= 3) break
    }
    if (out.length === 0) out.push({ icon: '✨', label: 'Learning' })
    return out
  }, [text])

  return (
    <div
      className="rounded-2xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-sky-50/80 p-4 shadow-sm"
      aria-label="Topic hints"
    >
      <p className="text-center text-xs font-bold uppercase tracking-wide text-amber-900/90">{title}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        {picks.map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-1">
            <span className="text-4xl leading-none md:text-5xl" aria-hidden>
              {p.icon}
            </span>
            <span className="text-sm font-semibold text-slate-800">{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
