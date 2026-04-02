import { useLayoutEffect, useRef } from 'react'
import type { Locale } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'

type Props = {
  src: string
  locale: Locale
  title: string
  onContinue: () => void
  continueLabel: string
}

declare global {
  interface Window {
    __SPARKI_EMBED_LANG__?: Locale
  }
}

/**
 * Embeds exported Canva HTML (same-origin). Games read `window.parent.__SPARKI_EMBED_LANG__` in
 * sparki-locale-init.js so the iframe URL stays stable (no ?lang=) when families toggle EN/ES.
 * Same lesson + new locale → iframe reload so the game re-runs init with the new language.
 */
export function CanvaHtmlPractice({ src, locale, title, onContinue, continueLabel }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const prevSrcRef = useRef<string | null>(null)
  const prevLocaleRef = useRef<Locale | null>(null)

  useLayoutEffect(() => {
    window.__SPARKI_EMBED_LANG__ = locale
    const el = iframeRef.current
    if (!el) return

    if (prevSrcRef.current !== src) {
      prevSrcRef.current = src
      prevLocaleRef.current = locale
      el.src = src
      return
    }

    if (prevLocaleRef.current !== locale) {
      prevLocaleRef.current = locale
      try {
        const w = el.contentWindow
        if (w && el.src && !el.src.includes('about:blank')) {
          w.location.reload()
        }
      } catch {
        el.src = `${src}${src.includes('?') ? '&' : '?'}_=${Date.now()}`
      }
    }
  }, [locale, src])

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
