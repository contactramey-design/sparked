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
      <div className="school-subj-canva-frame">
        <iframe
          key={src}
          title={title}
          src={src}
          className="school-subj-canva-iframe"
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" onClick={onContinue}>
          {continueLabel}
        </Button>
      </div>
    </div>
  )
}
