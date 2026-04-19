import React, { useEffect, useMemo, useState, useId } from 'react'
import { loadSchoolSubjectProgress } from '@/school/subjects/schoolSubjectProgress'
import { Link } from 'react-router-dom'
import { curriculum, getUnitsForBand } from './curriculum'
import {
  loadProgress,
  getHasAcademySubscription,
  setHasAcademySubscription,
  setAcademyCheckoutSessionId,
  setEbookCheckoutSessionId,
} from './progress'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { useAgeBand } from './contexts/AgeBandContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import { readTutorStateCode, writeTutorStateCode } from '@/ai-tutor/tutorService'
import { US_STATES_PLUS_DC } from '@/ai-tutor/usStates'
import { supabase } from '@/lib/supabaseClient'

type TutorSessionRow = {
  id: string
  created_at: string
  duration_seconds: number | null
  message_count: number | null
  subject_tag: string | null
  summary_bullets: unknown
  revisit_note: string | null
  sum_estimated_cost_usd: number | string | null
}

type ParentTabId = 'today' | 'billing' | 'insights' | 'ideas'

/** Parent view content only (used in merged Dashboard page and standalone /parent redirect) */
export const ParentViewContent: React.FC = () => {
  const { t } = useTranslation()
  const tabListId = useId()
  const [tab, setTab] = useState<ParentTabId>('today')
  const { ageBand } = useAgeBand()
  const progress = loadProgress(ageBand)
  const { kidLock, setKidLock, isLoggedIn, user } = useAuth()
  const [tutorSessions, setTutorSessions] = useState<TutorSessionRow[]>([])
  const [tutorSessionsLoading, setTutorSessionsLoading] = useState(false)
  const [tutorSessionsError, setTutorSessionsError] = useState<string | null>(null)
  const [entitlementVersion, setEntitlementVersion] = useState(0)
  const hasAcademy = entitlementVersion >= 0 && getHasAcademySubscription()
  const [academyUnlockLoading, setAcademyUnlockLoading] = useState(false)
  const [academyUnlockErrorKey, setAcademyUnlockErrorKey] = useState<string | null>(null)
  const [subjectTracksLocalActivity, setSubjectTracksLocalActivity] = useState(false)
  const [tutorSchoolState, setTutorSchoolState] = useState('')

  useEffect(() => {
    setTutorSchoolState(readTutorStateCode())
  }, [])

  useEffect(() => {
    try {
      const n = Object.keys(loadSchoolSubjectProgress().lessons).length
      setSubjectTracksLocalActivity(n > 0)
    } catch {
      setSubjectTracksLocalActivity(false)
    }
  }, [])

  useEffect(() => {
    if (tab !== 'insights' || !supabase || !isLoggedIn) return
    let cancelled = false
    setTutorSessionsLoading(true)
    setTutorSessionsError(null)
    void (async () => {
      const { data, error } = await supabase
        .from('tutor_sessions')
        .select(
          'id, created_at, duration_seconds, message_count, subject_tag, summary_bullets, revisit_note, sum_estimated_cost_usd',
        )
        .order('created_at', { ascending: false })
        .limit(40)
      if (cancelled) return
      if (error) {
        setTutorSessionsError(error.message)
        setTutorSessions([])
      } else {
        setTutorSessions((data as TutorSessionRow[]) ?? [])
      }
      if (!cancelled) setTutorSessionsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [tab, isLoggedIn, user?.id])

  const conversationKeys = useMemo(() => {
    if (ageBand === 'tots') {
      return ['convPromptTots1', 'convPromptTots2', 'convPromptTots3', 'convPromptTots4'] as const
    }
    if (ageBand === 'kids') {
      return ['convPromptKids1', 'convPromptKids2', 'convPromptKids3', 'convPromptKids4'] as const
    }
    return ['convPromptCrew1', 'convPromptCrew2', 'convPromptCrew3', 'convPromptCrew4'] as const
  }, [ageBand])

  const checkoutStatus = useMemo(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    const v = params.get('checkout')
    if (v === 'success' || v === 'cancel') return v
    // Robust fallback: some Stripe env configs may omit `checkout=success`
    // but still include `checkout_session_id` + `entitlement_type` params.
    const checkoutSessionId = params.get('checkout_session_id')
    const entitlementType = params.get('entitlement_type')
    if (checkoutSessionId && entitlementType) return 'success'
    return null
  }, [])

  useEffect(() => {
    if (checkoutStatus !== 'success') return
    // Capture checkout session id so the server can validate entitlement for downloads.
    try {
      const url = new URL(window.location.href)
      const sessionId = url.searchParams.get('checkout_session_id')
      const entitlementType = url.searchParams.get('entitlement_type')
      const returnTo = url.searchParams.get('returnTo')
      if (sessionId) {
        if (entitlementType === 'academy') {
          setAcademyCheckoutSessionId(sessionId)
          setHasAcademySubscription(true)
        } else if (entitlementType === 'ebook') {
          const ebookId = url.searchParams.get('ebook_id')
          if (ebookId) {
            setEbookCheckoutSessionId(ebookId, sessionId)
          }
        }
      }

      url.searchParams.delete('checkout')
      url.searchParams.delete('checkout_session_id')
      url.searchParams.delete('entitlement_type')
      url.searchParams.delete('ebook_id')
      url.searchParams.delete('returnTo')
      window.history.replaceState({}, '', url.toString())

      if (
        returnTo &&
        (returnTo.startsWith('/ebook/') ||
          returnTo.startsWith('/ebook?') ||
          returnTo.startsWith('/homework') ||
          returnTo.startsWith('/ai-tutor'))
      ) {
        window.location.replace(returnTo)
      } else {
        setEntitlementVersion((v) => v + 1)
      }
    } catch {
      // ignore
    }
  }, [checkoutStatus])

  async function handleAcademyUnlock() {
    setAcademyUnlockErrorKey(null)
    setAcademyUnlockLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'academy', returnTo: '/homework' }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error('CHECKOUT_FAILED')
      }
      if (!data || typeof data.url !== 'string') {
        throw new Error('Missing checkout URL')
      }
      window.location.assign(data.url)
    } catch {
      setAcademyUnlockErrorKey('parentDashboard.checkoutFailed')
    } finally {
      setAcademyUnlockLoading(false)
    }
  }

  const tabDefs: { id: ParentTabId; label: string }[] = [
    { id: 'today', label: t('parentDashboard.tabToday') },
    { id: 'billing', label: t('parentDashboard.tabBilling') },
    { id: 'insights', label: t('parentDashboard.tabInsights') },
    { id: 'ideas', label: t('parentDashboard.tabIdeas') },
  ]

  const unitsRows = getUnitsForBand(ageBand).map((unit) => {
    const status = progress.units[unit.id]
    const track = curriculum.tracks.find((tr) => tr.id === unit.trackId)

    const scoreText = status && status.postScore >= 0 ? `${status.postScore}%` : '—'
    const attemptsText = status ? status.attempts : 0
    const statusText = status
      ? status.mastered
        ? t('parentDashboard.statusMastered')
        : t('parentDashboard.statusInProgress')
      : t('parentDashboard.statusNotStarted')

    return (
      <tr key={unit.id}>
        <td>{track ? t(`curriculum.tracks.${track.id}.title`) || track.title : ''}</td>
        <td>{t(`curriculum.units.${unit.id}.title`) || unit.title}</td>
        <td>{scoreText}</td>
        <td>{attemptsText}</td>
        <td>{statusText}</td>
      </tr>
    )
  })

  const unitsTable = (
    <table className="parent-table">
      <thead>
        <tr>
          <th>{t('parentDashboard.tableTrack')}</th>
          <th>{t('parentDashboard.tableUnit')}</th>
          <th>{t('parentDashboard.tableBestScore')}</th>
          <th>{t('parentDashboard.tableAttempts')}</th>
          <th>{t('parentDashboard.tableStatus')}</th>
        </tr>
      </thead>
      <tbody>{unitsRows}</tbody>
    </table>
  )

  return (
    <div className="space-y-5">
      <div
        id={tabListId}
        role="tablist"
        aria-label={t('parentDashboard.tabListAria')}
        className="flex gap-2 overflow-x-auto border-b border-teal-100/90 pb-2"
      >
        {tabDefs.map(({ id, label }) => {
          const selected = tab === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              id={`${tabListId}-${id}`}
              aria-controls={`${tabListId}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              className={
                selected
                  ? 'shrink-0 rounded-t-lg border border-b-0 border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-950 shadow-sm'
                  : 'shrink-0 rounded-t-lg border border-transparent px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-teal-50/80 hover:text-teal-900'
              }
            >
              {label}
            </button>
          )
        })}
      </div>

      {tab === 'today' && (
        <div
          role="tabpanel"
          id={`${tabListId}-panel-today`}
          aria-labelledby={`${tabListId}-today`}
          className="grid gap-4 md:grid-cols-2"
        >
          {!tutorSchoolState ? (
            <div className="md:col-span-2 rounded-2xl border border-amber-200/90 bg-amber-50/90 p-4 text-sm text-amber-950 shadow-sm">
              {t('parentDashboard.tutorStateUnsetBanner')}
            </div>
          ) : null}

          <div className="card rounded-2xl border border-teal-100/80 p-5">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.academyHubTitle')}</h3>
            <p className="mt-2 text-slate-700">{t('parentDashboard.academyHubBody')}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link to="/homework" className="primary-button inline-block py-3 text-center">
                {t('parentDashboard.academyHubHomework')}
              </Link>
              <Link
                to="/ai-tutor"
                className="secondary-button inline-block border-2 border-teal-200 py-3 text-center font-semibold text-teal-900"
              >
                {t('parentDashboard.academyHubTutor')}
              </Link>
            </div>
          </div>

          <div className="card rounded-2xl border border-teal-100/80 p-5">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.tutorStateTitle')}</h3>
            <p className="mt-1 text-slate-700">{t('parentDashboard.tutorStateDesc')}</p>
            <label className="mt-4 flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-800">{t('aiTutor.stateLabel')}</span>
              <select
                className="min-h-[48px] w-full max-w-md rounded-xl border border-slate-300 bg-white px-3 text-base text-slate-900"
                value={tutorSchoolState}
                onChange={(e) => {
                  const v = e.target.value
                  setTutorSchoolState(v)
                  writeTutorStateCode(v)
                }}
              >
                <option value="">{t('aiTutor.statePlaceholder')}</option>
                {US_STATES_PLUS_DC.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="card rounded-2xl border border-teal-100/80 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.lockKidViewTitle')}</h3>
            <p className="mt-1 text-slate-700">{t('parentDashboard.lockKidViewDesc')}</p>
            <label className="parent-toggle mt-4 inline-flex cursor-pointer items-center gap-2">
              <input type="checkbox" checked={kidLock} onChange={(e) => setKidLock(e.target.checked)} />
              <span>{t('parentDashboard.lockToKidView')}</span>
            </label>
          </div>
        </div>
      )}

      {tab === 'billing' && (
        <div
          role="tabpanel"
          id={`${tabListId}-panel-billing`}
          aria-labelledby={`${tabListId}-billing`}
          className="grid gap-4 md:grid-cols-1"
        >
          <div className="card rounded-2xl border border-teal-100/80 p-5">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.unlockAcademyTitle')}</h3>
            <p className="mt-1 text-slate-700">{t('parentDashboard.unlockAcademyDesc')}</p>
            <p className="mt-2 text-sm text-slate-600">{t('productTiers.summaryLine')}</p>

            {hasAcademy ? (
              <>
                <p className="welcome-subtitle mt-3">{t('parentDashboard.academyActive')}</p>
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-left">
                  <h4 className="font-bold text-emerald-900">{t('parentDashboard.academyIncludesTitle')}</h4>
                  <p className="mt-1 text-sm text-slate-700">{t('parentDashboard.academyIncludesIntro')}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-800">
                    <li>{t('parentDashboard.academyIncludes1')}</li>
                    <li>{t('parentDashboard.academyIncludes2')}</li>
                    <li>{t('parentDashboard.academyIncludes3')}</li>
                    <li>{t('parentDashboard.academyIncludes4')}</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="primary-button mt-4"
                  onClick={() => void handleAcademyUnlock()}
                  disabled={academyUnlockLoading}
                >
                  {academyUnlockLoading ? t('parentDashboard.openingCheckout') : t('parentDashboard.unlockAcademyButton')}
                </button>
                {checkoutStatus === 'cancel' && (
                  <p className="welcome-subtitle mt-2">{t('parentDashboard.checkoutCanceled')}</p>
                )}
                {academyUnlockErrorKey && <p className="quiz-error mt-2">{t(academyUnlockErrorKey)}</p>}
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'insights' && (
        <div
          role="tabpanel"
          id={`${tabListId}-panel-insights`}
          aria-labelledby={`${tabListId}-insights`}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="card rounded-2xl border border-teal-100/80 p-5">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.overallSparklesTitle')}</h3>
            <p className="mt-2 text-slate-700">
              {t('parentDashboard.overallSparklesDesc')} <strong>{progress.totalSparkles}</strong>
            </p>
            <p className="welcome-subtitle mt-2">{t('parentDashboard.sparklesNote')}</p>
          </div>

          {subjectTracksLocalActivity ? (
            <div className="card rounded-2xl border border-teal-100/80 p-5">
              <p className="text-sm text-slate-700">{t('parentDashboard.schoolSubjectLocalNote')}</p>
            </div>
          ) : null}

          <div className="card rounded-2xl border border-teal-100/80 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.tutorSessionsTitle')}</h3>
            <p className="mt-1 text-sm text-slate-700">{t('parentDashboard.tutorSessionsIntro')}</p>
            {!supabase ? (
              <p className="mt-3 text-sm text-slate-600">{t('parentDashboard.tutorSessionsSupabaseOff')}</p>
            ) : !isLoggedIn ? (
              <p className="mt-3 text-sm text-slate-600">{t('parentDashboard.tutorSessionsSignIn')}</p>
            ) : tutorSessionsLoading ? (
              <p className="mt-3 text-sm text-slate-600">{t('parentDashboard.tutorSessionsLoading')}</p>
            ) : tutorSessionsError ? (
              <p className="mt-3 text-sm text-red-800" role="alert">
                {tutorSessionsError}
              </p>
            ) : tutorSessions.length === 0 ? (
              <p className="mt-3 text-sm text-slate-600">{t('parentDashboard.tutorSessionsEmpty')}</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="parent-table text-left text-sm">
                  <thead>
                    <tr>
                      <th>{t('parentDashboard.tableTutorDate')}</th>
                      <th>{t('parentDashboard.tableTutorDuration')}</th>
                      <th>{t('parentDashboard.tableTutorMessages')}</th>
                      <th>{t('parentDashboard.tableTutorSubject')}</th>
                      <th>{t('parentDashboard.tableTutorCost')}</th>
                      <th>{t('parentDashboard.tableTutorSummary')}</th>
                      <th>{t('parentDashboard.tableTutorRevisit')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutorSessions.map((row) => {
                      const d = row.duration_seconds
                      const dur =
                        typeof d === 'number' && d >= 0
                          ? `${Math.floor(d / 60)}m ${d % 60}s`
                          : '—'
                      const bullets = Array.isArray(row.summary_bullets)
                        ? (row.summary_bullets as string[]).filter((b) => typeof b === 'string' && b.trim())
                        : []
                      const costRaw = row.sum_estimated_cost_usd
                      const cost =
                        typeof costRaw === 'number'
                          ? costRaw.toFixed(4)
                          : typeof costRaw === 'string'
                            ? costRaw
                            : '—'
                      return (
                        <tr key={row.id}>
                          <td>{new Date(row.created_at).toLocaleString()}</td>
                          <td>{dur}</td>
                          <td>{row.message_count ?? '—'}</td>
                          <td>{row.subject_tag || '—'}</td>
                          <td>{cost === '—' ? cost : `$${cost}`}</td>
                          <td className="max-w-[14rem]">
                            {bullets.length ? (
                              <ul className="m-0 list-disc space-y-1 pl-4">
                                {bullets.slice(0, 3).map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="max-w-[10rem]">{row.revisit_note?.trim() || '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="card rounded-2xl border border-teal-100/80 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.unitsSummaryTitle')}</h3>
            <details className="mt-3 md:hidden">
              <summary className="cursor-pointer text-sm font-semibold text-teal-900 underline-offset-2 hover:underline">
                {t('parentDashboard.unitsSummaryMobileSummary')}
              </summary>
              <div className="mt-3 overflow-x-auto">{unitsTable}</div>
            </details>
            <div className="mt-3 hidden overflow-x-auto md:block">{unitsTable}</div>
          </div>
        </div>
      )}

      {tab === 'ideas' && (
        <div
          role="tabpanel"
          id={`${tabListId}-panel-ideas`}
          aria-labelledby={`${tabListId}-ideas`}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="card rounded-2xl border border-teal-100/80 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.conversationTitle')}</h3>
            <p className="mt-1 text-slate-700">{t('parentDashboard.conversationIntro')}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {conversationKeys.map((key) => (
                <li key={key}>{t(`parentDashboard.${key}`)}</li>
              ))}
            </ul>
          </div>

          <div className="card rounded-2xl border border-teal-100/80 p-5 md:col-span-2">
            <h3 className="text-lg font-bold text-slate-900">{t('parentDashboard.parentGuideTitle')}</h3>
            <p className="mt-1 text-slate-700">{t('parentDashboard.parentGuideDesc')}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>{t('parentDashboard.guideBullet1')}</li>
              <li>{t('parentDashboard.guideBullet2')}</li>
              <li>{t('parentDashboard.guideBullet3')}</li>
              <li>{t('parentDashboard.guideBullet4')}</li>
            </ul>
            <p className="login-coppa-note mt-4">{t('parentDashboard.parentHandbookNote')}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const ParentDashboard: React.FC = () => {
  const { t, locale } = useTranslation()
  return (
    <AscentPageChrome
      key={locale}
      title={t('parentDashboard.title')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('parentDashboard.title') },
      ]}
      contentMaxWidthClassName="max-w-5xl"
    >
      <div className="mb-5">
        <Link to="/tracks" className="secondary-button">
          {t('parentDashboard.backToDashboard')}
        </Link>
      </div>
      <ParentViewContent />
    </AscentPageChrome>
  )
}

export default ParentDashboard
