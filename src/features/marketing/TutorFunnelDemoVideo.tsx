import { useTranslation } from '@/contexts/LocaleContext'

const DEFAULT_HOME_DEMO_VIDEO_EN = '/0418.mov'
const DEFAULT_HOME_DEMO_VIDEO_ES = '/0418-es.mp4'

export function TutorFunnelDemoVideo() {
  const { t, locale } = useTranslation()
  const url = (
    locale === 'es'
      ? import.meta.env.VITE_TUTOR_FUNNEL_DEMO_VIDEO_URL_ES ||
        import.meta.env.VITE_SCHOOL_DEMO_VIDEO_URL_ES ||
        DEFAULT_HOME_DEMO_VIDEO_ES
      : import.meta.env.VITE_TUTOR_FUNNEL_DEMO_VIDEO_URL ||
        import.meta.env.VITE_SCHOOL_DEMO_VIDEO_URL ||
        DEFAULT_HOME_DEMO_VIDEO_EN
  ).trim()

  if (!url) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
        {t('marketingFunnel.homeDemoFallback')}
      </p>
    )
  }

  const isDirectVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)

  if (isDirectVideo) {
    return (
      <video
        key={url}
        src={url}
        controls
        playsInline
        className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-black shadow-md"
      />
    )
  }

  return (
    <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-md">
      <iframe
        src={url}
        title={t('marketingFunnel.homeHeroTitle')}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
