import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
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
import './school-subject.css'

function formatBandsLabel(bands: AgeBandId[], t: (k: string) => string): string {
  return bands.map((b) => t(`ageBand.names.${b}.full`)).join(', ')
}

export const SchoolAlignmentHubPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <section className="lesson-page school-subj-page school-subj-alignment-print">
      <Link to="/schools/subjects" className="link-back">
        {t('schoolSubject.backToSubjectList')}
      </Link>
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

  const lessons = getAllLessonsForSubjectOrdered(subjectId)

  return (
    <section className="lesson-page school-subj-page school-subj-alignment-print">
      <div className="no-print school-subj-alignment-nav">
        <Link to="/schools/alignment" className="link-back">
          {t('schoolSubjects.alignmentBackSubjects')}
        </Link>
        <Link to={`/schools/subjects/${subjectId}`} className="link-back" style={{ marginLeft: '0.75rem' }}>
          {t('schoolSubjects.alignmentBackTrack')}
        </Link>
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
                  <td>{formatBandsLabel(lesson.ageBands, t)}</td>
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
