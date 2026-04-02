import { Button } from '@/components/ui/button'

type Props = {
  src: string
  title: string
  onContinue: () => void
  continueLabel: string
}

/**
 * Embeds exported Canva HTML (Tailwind CDN + inline JS). Same-origin /_sdk/element_sdk.js stub in public.
 */
export function CanvaHtmlPractice({ src, title, onContinue, continueLabel }: Props) {
  return (
    <div className="school-subj-practice-panel school-subj-canva-embed space-y-4">
      <iframe
        title={title}
        src={src}
        className="school-subj-canva-iframe w-full rounded-xl border border-slate-200 bg-white shadow-sm"
        sandbox="allow-scripts allow-same-origin"
      />
      <div className="flex justify-end">
        <Button type="button" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  )
}
