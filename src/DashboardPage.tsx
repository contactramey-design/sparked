import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Dashboard from './Dashboard'
import { ParentViewContent } from './ParentDashboard'
import { useTranslation } from './contexts/LocaleContext'

type ViewMode = 'child' | 'parent'

const DashboardPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const [viewMode, setViewMode] = useState<ViewMode>(
    viewParam === 'parent' ? 'parent' : 'child',
  )

  useEffect(() => {
    const next = viewParam === 'parent' ? 'parent' : 'child'
    setViewMode(next)
  }, [viewParam])

  const setView = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'parent') {
      setSearchParams({ view: 'parent' }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  return (
    <section className="dashboard-page" key={locale}>
      <div className="dashboard-view-toggle-wrap card">
        <span className="dashboard-view-toggle-label">{t('dashboardPage.switchView')}</span>
        <div className="dashboard-view-toggle" role="tablist" aria-label={t('dashboardPage.dashboardViewAria')}>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'child'}
            aria-controls="dashboard-child-panel"
            id="tab-child"
            className={viewMode === 'child' ? 'active' : ''}
            onClick={() => setView('child')}
          >
            {t('dashboardPage.kidView')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'parent'}
            aria-controls="dashboard-parent-panel"
            id="tab-parent"
            className={viewMode === 'parent' ? 'active' : ''}
            onClick={() => setView('parent')}
          >
            {t('dashboardPage.parentView')}
          </button>
        </div>
      </div>

      {viewMode === 'child' && (
        <div id="dashboard-child-panel" role="tabpanel" aria-labelledby="tab-child">
          <Dashboard />
        </div>
      )}
      {viewMode === 'parent' && (
        <div id="dashboard-parent-panel" role="tabpanel" aria-labelledby="tab-parent">
          <ParentViewContent />
        </div>
      )}
    </section>
  )
}

export default DashboardPage
