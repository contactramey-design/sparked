import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSchoolMode } from './hooks/useSchoolMode'
import SchoolJoinCard from './components/SchoolJoinCard'
import { getSchoolSession } from '@/school/schoolSession'

const SchoolsPage: React.FC = () => {
  const { t } = useTranslation()
  const { schoolMode, setSchoolMode } = useSchoolMode()
  const navigate = useNavigate()
  const { classId } = getSchoolSession()

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h2>{t('schools.title')}</h2>
        <p className="muted">{t('schools.subtitle')}</p>
      </header>

      <div className="stack-lg">
        <Card>
          <CardHeader>
            <CardTitle>{t('schools.modeTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="schools-mode-row">
              <div>
                <div className="schools-mode-pill" aria-hidden>
                  {schoolMode ? t('schools.modeOn') : t('schools.modeOff')}
                </div>
                <div className="muted">{t('schools.modeDesc')}</div>
              </div>
              <Button
                onClick={() => {
                  setSchoolMode(!schoolMode)
                }}
                variant={schoolMode ? 'secondary' : 'default'}
              >
                {schoolMode ? t('schools.turnOff') : t('schools.turnOn')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {schoolMode && <SchoolJoinCard />}

        <div className="schools-grid">
          {classId && (
            <Card>
              <CardHeader>
                <CardTitle>{t('schools.weeklyTrackTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="muted">{t('schools.weeklyTrackDesc')}</p>
                <div className="schools-actions">
                  <Button
                    onClick={() => {
                      navigate('/schools/weekly-track')
                    }}
                  >
                    {t('schools.openWeeklyTrack')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{t('schools.pwaTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.pwaDesc')}</p>
              <div className="schools-actions">
                <Link to="/for-schools#school-compliance" className="secondary-button">
                  {t('schools.openInstallGuide')}
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('schools.dashboardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.dashboardDesc')}</p>
              <div className="schools-actions">
                <Button
                  onClick={() => {
                    navigate('/teacher/dashboard')
                  }}
                >
                  {t('schools.openTeacherDashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('schools.complianceTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.complianceDesc')}</p>
              <div className="schools-actions">
                <Link to="/for-schools" className="secondary-button">
                  {t('schools.openCompliance')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SchoolsPage

