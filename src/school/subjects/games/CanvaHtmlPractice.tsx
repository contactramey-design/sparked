import { useLayoutEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  src: string
  title: string
  onContinue: () => void
  continueLabel: string
}

function absoluteUrl(src: string): string {
  try {
    return new URL(src, window.location.origin).href
  } catch {
    return src
  }
}

/**
 * Embeds exported Canva HTML (Tailwind CDN + inline JS). Same-origin /_sdk/element_sdk.js stub in public.
 * Updates iframe `src` in an effect so toggling ?lang=es does not remount the iframe (avoids layout/scroll glitches).
 */
export function CanvaHtmlPractice({ src, title, onContinue, continueLabel }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useLayoutEffect(() => {
    const el = iframeRef.current
    if (!el) return
    const next = absoluteUrl(src)
    if (el.src !== next) el.src = src
  }, [src])

  return (
    <div className="school-subj-practice-panel school-subj-canva-embed space-y-4">
      <div className="school-subj-canva-frame">
        <iframe
          ref={iframeRef}
          title={title}
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
