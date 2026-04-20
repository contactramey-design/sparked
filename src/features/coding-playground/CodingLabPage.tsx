import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'

/** Blockly demo (Google) + Scratch embed — tutor pairs via /ai-tutor?focus=coding-challenge */
export default function CodingLabPage() {
  const { t } = useTranslation()
  const { ageBand, setAgeBand } = useAgeBand()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const bandParam = searchParams.get('band')?.trim().toLowerCase()
    if (bandParam === 'tots' || bandParam === 'kids' || bandParam === 'crew') {
      setAgeBand(bandParam)
    }
    if (bandParam === 'tots' || bandParam === 'kids' || bandParam === 'crew') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.delete('band')
        window.history.replaceState({}, '', url.toString())
      } catch {
        /* ignore */
      }
    }
  }, [searchParams, setAgeBand])

  return (
    <AscentPageChrome
      title={t('codingLab.title')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('curriculum.chooseAdventure'), to: '/tracks' },
        { label: t('codingLab.title') },
      ]}
    >
      <section className="space-y-6">
        <p className="m-0 max-w-3xl text-lg leading-relaxed text-slate-800">{t('codingLab.intro')}</p>
        <p className="m-0 max-w-3xl text-base text-slate-600">{t('codingLab.supervision')}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            to={`/ai-tutor?focus=coding-challenge&band=${ageBand}`}
            className="primary-button inline-flex min-h-[48px] items-center justify-center px-5 py-3 text-center"
          >
            {t('codingLab.tutorCta')}
          </Link>
          <Link
            to="/track/ai-coding"
            className="secondary-button inline-flex min-h-[48px] items-center justify-center border-2 border-teal-200 px-5 py-3 text-center font-semibold text-teal-900"
          >
            {t('codingLab.backToTrack')}
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="m-0 border-b border-slate-100 px-4 py-3 text-lg font-bold text-slate-900">
              {t('codingLab.blocklyTitle')}
            </h2>
            <iframe
              title={t('codingLab.blocklyIframeTitle')}
              src="https://blockly-demo.appspot.com/static/demos/code/index.html"
              className="h-[min(70vh,560px)] w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h2 className="m-0 border-b border-slate-100 px-4 py-3 text-lg font-bold text-slate-900">
              {t('codingLab.scratchTitle')}
            </h2>
            <iframe
              title={t('codingLab.scratchIframeTitle')}
              src="https://scratch.mit.edu/projects/277884971/embed"
              allowTransparency
              className="h-[min(70vh,560px)] w-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </AscentPageChrome>
  )
}
