import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'

function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/i.test(ua)
  // exclude iOS Chrome/Firefox etc
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua)
  return isIOS && isSafari
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  // iOS Safari
  const nav = window.navigator as Navigator & { standalone?: boolean }
  if (typeof nav.standalone === 'boolean') return nav.standalone
  // Other browsers
  return window.matchMedia?.('(display-mode: standalone)')?.matches ?? false
}

export default function InstallOnIpadBanner() {
  const { t } = useTranslation()
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setDismissed(window.localStorage.getItem('sparki_install_banner_dismissed_v1') === 'true')
    } catch {
      setDismissed(false)
    }
  }, [])

  const shouldShow = useMemo(() => {
    if (dismissed) return false
    if (!isIosSafari()) return false
    if (isStandalone()) return false
    return true
  }, [dismissed])

  if (!shouldShow) return null

  return (
    <div className="install-banner" role="status" aria-live="polite">
      <div className="install-banner-inner">
        <div className="install-banner-text">
          <strong>{t('installBanner.title')}</strong>
          <div className="install-banner-sub">{t('installBanner.steps')}</div>
        </div>
        <div className="install-banner-actions">
          <Button
            variant="secondary"
            onClick={() => {
              setDismissed(true)
              try {
                window.localStorage.setItem('sparki_install_banner_dismissed_v1', 'true')
              } catch {
                // ignore
              }
            }}
          >
            {t('installBanner.gotIt')}
          </Button>
        </div>
      </div>
    </div>
  )
}

