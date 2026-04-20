import React from 'react'
import { Link } from 'react-router-dom'
import { curriculum, getUnitsInTrackForBand, type TrackId } from './curriculum'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import { AgeBandVisualPicker } from './features/family-home/AgeBandVisualPicker'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const TrackListPage: React.FC = () => {
  const { t } = useTranslation()
  const { ageBand } = useAgeBand()
  const tracks = [...curriculum.tracks]
    .sort((a, b) => a.order - b.order)
    .filter((track) => getUnitsInTrackForBand(track.id as TrackId, ageBand).length > 0)

  return (
    <AscentPageChrome
      title={t('curriculum.chooseAdventure')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('curriculum.chooseAdventure') },
      ]}
    >
      <section className="dashboard">
        <div className="dashboard-top">
          <div className="welcome-card card rounded-2xl border border-teal-100/80">
            <p className="welcome-subtitle text-slate-600">{t('curriculum.chooseAdventureSubtitle')}</p>
            <div className="track-list-age-band mt-4">
              <p className="muted mb-3 text-sm font-semibold text-teal-900">{t('ageBand.forThisSession')}</p>
              <AgeBandVisualPicker />
            </div>
          </div>
        </div>

        <div className="track-list-practice-callout card mt-4 max-w-3xl rounded-2xl border border-teal-100/80">
          <h3 className="m-0 font-heading text-lg font-bold text-teal-950">{t('trackList.practiceCalloutTitle')}</h3>
          <p className="welcome-subtitle mt-2 mb-0 text-slate-600">{t('trackList.practiceCalloutBody')}</p>
          <Link to="/practice" className="primary-button mt-4 inline-block">
            {t('trackList.practiceCalloutLink')}
          </Link>
        </div>

        <div className="card mt-4 max-w-3xl rounded-2xl border border-violet-100/90 bg-violet-50/40">
          <h3 className="m-0 font-heading text-lg font-bold text-violet-950">{t('trackList.tutorFocusCalloutTitle')}</h3>
          <p className="welcome-subtitle mt-2 mb-0 text-slate-700">{t('trackList.tutorFocusCalloutBody')}</p>
          <ul className="mt-4 grid list-none gap-2 p-0 sm:grid-cols-2">
            <li>
              <Link
                to={`/ai-tutor?focus=ai-literacy&band=${ageBand}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-center text-base font-semibold text-violet-900 hover:bg-violet-50"
              >
                {t('trackList.tutorFocusAiLiteracy')}
              </Link>
            </li>
            <li>
              <Link
                to={`/ai-tutor?focus=internet-safety&band=${ageBand}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-center text-base font-semibold text-violet-900 hover:bg-violet-50"
              >
                {t('trackList.tutorFocusSafety')}
              </Link>
            </li>
            <li>
              <Link
                to={`/ai-tutor?focus=ai-media-trust&band=${ageBand}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-center text-base font-semibold text-violet-900 hover:bg-violet-50"
              >
                {t('trackList.tutorFocusMedia')}
              </Link>
            </li>
            <li>
              <Link
                to={`/ai-tutor?focus=coding-challenge&band=${ageBand}`}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 border-violet-200 bg-white px-4 py-3 text-center text-base font-semibold text-violet-900 hover:bg-violet-50"
              >
                {t('trackList.tutorFocusCoding')}
              </Link>
            </li>
          </ul>
          <Link
            to="/coding-lab"
            className="mt-3 inline-flex min-h-[48px] items-center text-base font-semibold text-violet-900 underline-offset-2 hover:underline"
          >
            {t('trackList.codingLabLink')}
          </Link>
        </div>

        <div className="dashboard-grid">
          {tracks.map((track) => (
            <div key={track.id} className="card rounded-2xl border border-teal-100/80">
              <h3 className="font-heading text-lg text-slate-900">{t(`curriculum.tracks.${track.id}.title`) || track.title}</h3>
              <p className="text-slate-600">{t(`curriculum.tracks.${track.id}.description`) || track.description}</p>
              <Link to={`/track/${track.id}`} className="primary-button">
                {t('curriculum.learnWithSparki')}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </AscentPageChrome>
  )
}

export default TrackListPage

