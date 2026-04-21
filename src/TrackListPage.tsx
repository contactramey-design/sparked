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

