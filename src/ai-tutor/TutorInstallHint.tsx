import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Shows an install banner on supported browsers when the PWA can be added to the home screen.
 */
export function TutorInstallHint() {
  const { t } = useTranslation()
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const dismissedRef = useRef(false)

  useEffect(() => {
    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  if (dismissed || dismissedRef.current || !deferred) return null

  return (
    <div className="sticky top-0 z-50 border-b border-teal-200/80 bg-teal-50/95 px-3 py-2 text-center shadow-sm sm:px-4">
      <p className="text-sm font-medium text-teal-950">{t('marketingFunnel.installHint')}</p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          className="min-h-[44px] rounded-xl bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700"
          onClick={() => {
            void deferred.prompt()
            setDeferred(null)
          }}
        >
          {t('marketingFunnel.installCta')}
        </button>
        <button
          type="button"
          className="min-h-[44px] rounded-xl border border-teal-300 bg-white px-4 text-sm font-semibold text-teal-900"
          onClick={() => {
            dismissedRef.current = true
            setDismissed(true)
          }}
        >
          {t('marketingFunnel.installDismiss')}
        </button>
      </div>
    </div>
  )
}
