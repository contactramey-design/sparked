import { useEffect, useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'

export default function OfflineBanner() {
  const { t } = useTranslation()
  const [online, setOnline] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    return window.navigator.onLine
  })

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <div className="offline-banner-inner">
        <strong>{t('offline.bannerTitle')}</strong>
        <span className="offline-banner-sub">{t('offline.bannerBody')}</span>
      </div>
    </div>
  )
}

