import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadSchoolSubjectProgress } from '@/school/subjects/schoolSubjectProgress'
import { getSchoolSession } from '@/school/schoolSession'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'

/**
 * Grown-up view for Sparki **School** flows: class join, weekly track, subject tracks.
 * Consumer “family” tools (Safety Pass, B2C weekly, full unit grades) stay on `/?view=parent`.
 */
const SchoolParentPage: React.FC = () => {
  const { t } = useTranslation()
  const { ageBand } = useAgeBand()
  const { kidLock, setKidLock } = useAuth()
  const [session, setSession] = useState(() => getSchoolSession())
  const [subjectTracksLocalActivity, setSubjectTracksLocalActivity] = useState(false)

  useEffect(() => {
    setSession(getSchoolSession())
  }, [])

  useEffect(() => {
    const sync = () => setSession(getSchoolSession())
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  useEffect(() => {
    try {
      const n = Object.keys(loadSchoolSubjectProgress().lessons).length
      setSubjectTracksLocalActivity(n > 0)
    } catch {
      setSubjectTracksLocalActivity(false)
    }
  }, [])

  const conversationKeys = useMemo(() => {
    if (ageBand === 'tots') {
      return ['convPromptTots1', 'convPromptTots2', 'convPromptTots3', 'convPromptTots4'] as const
    }
    if (ageBand === 'kids') {
      return ['convPromptKids1', 'convPromptKids2', 'convPromptKids3', 'convPromptKids4'] as const
    }
    return ['convPromptCrew1', 'convPromptCrew2', 'convPromptCrew3', 'convPromptCrew4'] as const
  }, [ageBand])

  const { classId, studentCode } = session

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <h2>{t('schoolParent.pageTitle')}</h2>
        <p className="muted max-w-prose">{t('schoolParent.pageSubtitle')}</p>
        <Link to="/schools" className="link-back mt-2 inline-block">
          {t('schoolParent.backToSchoolHub')}
        </Link>
      </header>

      <div className="stack-lg lesson-layout">
        <div className="lesson-media card border-2 border-orange-200 bg-orange-50/40">
          <h3>{t('schoolParent.hubCardTitle')}</h3>
          <p className="text-slate-700 mt-2">{t('schoolParent.hubCardBody')}</p>
          <Link to="/schools" className="primary-button mt-3 inline-block">
            {t('schoolParent.hubCardCta')}
          </Link>
        </div>

        <div className="lesson-media card">
          <h3>{t('schoolParent.classStatusTitle')}</h3>
          {classId && studentCode ? (
            <p className="text-slate-700 mt-2">
              {t('schoolParent.classStatusJoined', { code: studentCode })}
            </p>
          ) : (
            <p className="text-slate-700 mt-2">{t('schoolParent.classStatusNotJoined')}</p>
          )}
        </div>

        {classId ? (
          <div className="lesson-media card">
            <h3>{t('schoolParent.weeklyTitle')}</h3>
            <p className="text-slate-700 mt-2">{t('schoolParent.weeklyBody')}</p>
            <Link to="/schools/weekly-track" className="primary-button mt-3 inline-block">
              {t('schoolParent.weeklyCta')}
            </Link>
          </div>
        ) : null}

        <div className="lesson-media card">
          <h3>{t('schoolParent.subjectsTitle')}</h3>
          <p className="text-slate-700 mt-2">{t('schoolParent.subjectsBody')}</p>
          <Link to="/schools/subjects" className="primary-button mt-3 inline-block">
            {t('schoolParent.subjectsCta')}
          </Link>
        </div>

        <div className="lesson-media card">
          <h3>{t('schoolParent.teacherResourcesTitle')}</h3>
          <p className="text-slate-700 mt-2">{t('schoolParent.teacherResourcesBody')}</p>
          <Link to="/for-schools/resources/parent-letter" className="secondary-button mt-3 inline-block">
            {t('schoolParent.teacherResourcesCta')}
          </Link>
        </div>

        <div className="lesson-media card">
          <h3>{t('parentDashboard.conversationTitle')}</h3>
          <p className="text-slate-700">{t('parentDashboard.conversationIntro')}</p>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mt-2">
            {conversationKeys.map((key) => (
              <li key={key}>{t(`parentDashboard.${key}`)}</li>
            ))}
          </ul>
        </div>

        {subjectTracksLocalActivity ? (
          <div className="lesson-media card">
            <p className="text-sm text-slate-700">{t('parentDashboard.schoolSubjectLocalNote')}</p>
          </div>
        ) : null}

        <div className="lesson-media card">
          <h3>{t('parentDashboard.lockKidViewTitle')}</h3>
          <p>{t('parentDashboard.lockKidViewDesc')}</p>
          <label className="parent-toggle mt-2">
            <input type="checkbox" checked={kidLock} onChange={(e) => setKidLock(e.target.checked)} />
            <span>{t('parentDashboard.lockToKidView')}</span>
          </label>
        </div>

        <div className="lesson-media card bg-slate-50 border border-slate-200">
          <h3>{t('schoolParent.fullFamilyTitle')}</h3>
          <p className="text-slate-700 mt-2">{t('schoolParent.fullFamilyBody')}</p>
          <Link to="/?view=parent" className="secondary-button mt-3 inline-block">
            {t('schoolParent.fullFamilyCta')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SchoolParentPage
