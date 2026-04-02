import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSchoolMode } from './hooks/useSchoolMode'
import SchoolJoinCard from './components/SchoolJoinCard'
import { getSchoolSession } from '@/school/schoolSession'
import { setPostLoginRedirect } from '@/lib/postLoginRedirect'
import { supabase } from '@/lib/supabaseClient'
import { schoolEngagementPingToSupabase } from '@/school/syncSchoolProgress'

const SchoolsPage: React.FC = () => {
  const { t } = useTranslation()
  const { schoolMode, setSchoolMode } = useSchoolMode()
  const navigate = useNavigate()
  const { classId } = getSchoolSession()
  const [checkInBusy, setCheckInBusy] = useState(false)
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null)

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h2>{t('schools.title')}</h2>
        <p className="muted">{t('schools.subtitle')}</p>
        <p className="muted text-sm mt-2 max-w-prose">{t('schools.weeklyVsSubjectsNote')}</p>
        <p className="muted text-sm mt-3 font-medium max-w-prose">{t('schools.fitIntro')}</p>
        <ul className="muted text-sm mt-2 max-w-prose list-disc pl-5 space-y-1">
          <li>{t('schools.fitBullet1')}</li>
          <li>{t('schools.fitBullet2')}</li>
          <li>{t('schools.fitBullet3')}</li>
          <li>{t('schools.fitBullet4')}</li>
        </ul>
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

        {schoolMode && classId ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('schools.engagementCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.engagementCardBody')}</p>
              {!supabase ? (
                <p className="text-sm text-amber-800 mt-2">{t('schools.engagementNeedSupabase')}</p>
              ) : (
                <>
                  <Button
                    type="button"
                    className="mt-3"
                    disabled={checkInBusy}
                    onClick={() => {
                      setCheckInMsg(null)
                      setCheckInBusy(true)
                      void (async () => {
                        try {
                          await schoolEngagementPingToSupabase()
                          setCheckInMsg(t('schools.engagementDone'))
                        } catch {
                          setCheckInMsg(t('schoolJoin.errorGeneric'))
                        } finally {
                          setCheckInBusy(false)
                        }
                      })()
                    }}
                  >
                    {checkInBusy ? '…' : t('schools.engagementButton')}
                  </Button>
                  {checkInMsg ? <p className="text-sm text-emerald-800 mt-2">{checkInMsg}</p> : null}
                </>
              )}
            </CardContent>
          </Card>
        ) : null}

        <div className="schools-grid">
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle>{t('schools.schoolParentCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.schoolParentCardDesc')}</p>
              <div className="schools-actions">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigate('/schools/parent')
                  }}
                >
                  {t('schools.openSchoolParentHub')}
                </Button>
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
                    setPostLoginRedirect('/teacher/dashboard')
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
              <CardTitle>{t('schools.subjectHubTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="muted">{t('schools.subjectHubDesc')}</p>
              <div className="schools-actions">
                <Button
                  onClick={() => {
                    navigate('/schools/subjects')
                  }}
                >
                  {t('schools.openSubjectHub')}
                </Button>
              </div>
            </CardContent>
          </Card>

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

