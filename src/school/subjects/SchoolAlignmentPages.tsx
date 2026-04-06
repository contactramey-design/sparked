import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolAudience } from '@/hooks/useSchoolAudience'
import SchoolAudienceToggle from './SchoolAudienceToggle'
import type { AgeBandId } from '@/ageBand'
import { SCHOOL_SUBJECT_IDS, isSchoolSubjectId, lessonLocale, type SchoolSubjectId } from './types'
import { getAllLessonsForSubjectOrdered } from './registry'
import {
  caFrameworkLabel,
  cdeFrameworkUrl,
  formatCaStandardsBadge,
  caStandardsReferenceUrl,
} from './caStandardsDisplay'
import { parseStandardsNote } from './subjectStandards'
import { lessonTypicalGradesLine } from './lessonGradeSpan'
import './school-subject.css'

function formatBandsLabel(bands: AgeBandId[], t: (k: string) => string): string {
  return bands.map((b) => t(`ageBand.names.${b}.full`)).join(', ')
}

export const SchoolAlignmentHubPage: React.FC = () => {
  const { t } = useTranslation()
  const { schoolAudience } = useSchoolAudience()

  if (schoolAudience === 'student') {
    return (
      <section className="lesson-page school-subj-page">
        <Link to="/schools/subjects" className="link-back">
          {t('schoolSubject.backToSubjectList')}
        </Link>
        <div className="school-subj-alignment-student-gate card p-4 space-y-3 no-print">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            {t('schoolSubjects.alignmentStudentTitle')}
          </h1>
          <p className="muted">{t('schoolSubjects.alignmentStudentBody')}</p>
          <SchoolAudienceToggle />
          <p>
            <Link to="/schools/subjects" className="primary-button">
              {t('schoolSubject.backToSubjectList')}
            </Link>
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="lesson-page school-subj-page school-subj-alignment-print">
      <div className="school-subj-alignment-teacher-bar no-print">
        <Link to="/schools/subjects" className="link-back">
          {t('schoolSubject.backToSubjectList')}
        </Link>
        <SchoolAudienceToggle compact className="school-subj-alignment-audience" />
      </div>
      <header className="school-subj-alignment-header">
        <h1>{t('schoolSubjects.alignmentHubTitle')}</h1>
        <p className="muted">{t('schoolSubjects.alignmentHubIntro')}</p>
        <p className="school-subj-alignment-print-hint no-print">{t('schoolSubjects.alignmentPrintHint')}</p>
      </header>
      <ul className="school-subj-alignment-hub-list">
        {SCHOOL_SUBJECT_IDS.map((id) => (
          <li key={id}>
            <Link to={`/schools/alignment/${id}`} className="school-subj-alignment-hub-link">
              {t(`schoolSubjects.tracks.${id}.title`)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const SchoolAlignmentSubjectPage: React.FC = () => {
  const { subjectId: raw } = useParams<{ subjectId: string }>()
  const subjectId = raw as SchoolSubjectId | undefined
  const { t, locale } = useTranslation()
  const { schoolAudience } = useSchoolAudience()

  if (!subjectId || !isSchoolSubjectId(subjectId)) {
    return (
      <section className="lesson-page school-subj-page">
        <Link to="/schools/alignment" className="link-back">
          {t('schoolSubjects.alignmentBackSubjects')}
        </Link>
        <p className="muted">{t('schoolSubject.unknownSubject')}</p>
      </section>
    )
  }

  if (schoolAudience === 'student') {
    return (
      <section className="lesson-page school-subj-page">
        <div className="no-print school-subj-alignment-nav">
          <Link to="/schools/subjects" className="link-back">
            {t('schoolSubject.backToSubjectList')}
          </Link>
        </div>
        <div className="school-subj-alignment-student-gate card p-4 space-y-3 no-print">
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
            {t('schoolSubjects.alignmentStudentTitle')}
          </h1>
          <p className="muted">{t('schoolSubjects.alignmentStudentBody')}</p>
          <SchoolAudienceToggle />
          <p>
            <Link to={`/schools/subjects/${subjectId}`} className="primary-button">
              {t('schoolSubjects.alignmentBackTrack')}
            </Link>
          </p>
        </div>
      </section>
    )
  }

  const lessons = getAllLessonsForSubjectOrdered(subjectId)

  return (
    <section className="lesson-page school-subj-page school-subj-alignment-print">
      <div className="no-print school-subj-alignment-nav school-subj-alignment-nav--with-toggle">
        <Link to="/schools/alignment" className="link-back">
          {t('schoolSubjects.alignmentBackSubjects')}
        </Link>
        <Link to={`/schools/subjects/${subjectId}`} className="link-back school-subj-alignment-nav__after">
          {t('schoolSubjects.alignmentBackTrack')}
        </Link>
        <SchoolAudienceToggle compact className="school-subj-alignment-audience" />
      </div>
      <header className="school-subj-alignment-header">
        <h1>{t(`schoolSubjects.tracks.${subjectId}.title`)}</h1>
        <p className="muted">{t('schoolSubjects.alignmentHubIntro')}</p>
        <p className="school-subj-alignment-print-hint no-print">{t('schoolSubjects.alignmentPrintHint')}</p>
      </header>

      <div className="school-subj-alignment-table-wrap">
        <table className="school-subj-alignment-table">
          <thead>
            <tr>
              <th>{t('schoolSubjects.alignmentColLesson')}</th>
              <th>{t('schoolSubjects.alignmentColBand')}</th>
              <th>{t('schoolSubjects.alignmentColFramework')}</th>
              <th>{t('schoolSubjects.alignmentColCodes')}</th>
              <th>{t('schoolSubjects.alignmentColObjective')}</th>
              <th>{t('schoolSubjects.alignmentColTime')}</th>
              <th className="no-print">{t('schoolSubjects.alignmentColLink')}</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => {
              const loc = lessonLocale(lesson, locale)
              const ca = lesson.caStandards
              const { scopeLine, codeBadge } = parseStandardsNote(lesson.standardsNote)
              const frameworkLabel = ca
                ? caFrameworkLabel(ca.framework, locale)
                : t('schoolSubjects.alignmentUnknownFramework')
              const codesText = ca?.codes.length
                ? ca.codes.join(' · ')
                : [codeBadge, scopeLine].filter(Boolean).join(' — ') || '—'
              const toLesson = `/schools/subjects/${subjectId}/${encodeURIComponent(lesson.id)}`
              return (
                <tr key={lesson.id}>
                  <td>{loc.title}</td>
                  <td>
                    {formatBandsLabel(lesson.ageBands, t)}
                    <div className="school-subj-alignment-grades muted text-sm">
                      {lessonTypicalGradesLine(lesson, locale, t)}
                    </div>
                  </td>
                  <td>
                    {ca ? (
                      <span title={formatCaStandardsBadge(ca)}>{frameworkLabel}</span>
                    ) : (
                      frameworkLabel
                    )}
                  </td>
                  <td>{codesText}</td>
                  <td>{loc.objectives[0] ?? loc.summary}</td>
                  <td>{lesson.estMinutes}</td>
                  <td className="no-print">
                    <div className="school-subj-alignment-actions">
                      <Link to={toLesson}>{t('schoolSubjects.startLesson')}</Link>
                      {ca ? (
                        <>
                          <a href={caStandardsReferenceUrl(ca)} target="_blank" rel="noopener noreferrer">
                            {t('schoolSubjects.viewCdeSearch')}
                          </a>
                          <a href={cdeFrameworkUrl(ca.framework)} target="_blank" rel="noopener noreferrer">
                            {t('schoolSubjects.viewCde')}
                          </a>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
