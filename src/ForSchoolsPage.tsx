import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { useAuth } from './AuthContext'
import { supabase } from './lib/supabaseClient'
import { isTeacherUser } from './lib/supabaseUserRole'
import { randomSchoolClassCode } from './lib/schoolClassCode'
import { setPostLoginRedirect } from './lib/postLoginRedirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SparkiAvatar from './components/SparkiAvatar'
import ComplianceContent from './components/ComplianceContent'

/** Last live class code this browser created (real row in Supabase). */
const LIVE_PILOT_CLASS_CODE_KEY = 'sparki_for_schools_live_class_code'

function schoolDemoVideoUrl(): string {
  return (import.meta.env.VITE_SCHOOL_DEMO_VIDEO_URL as string | undefined)?.trim() ?? ''
}

function embedDemoSrc(raw: string): { type: 'iframe'; src: string } | { type: 'video'; src: string } | null {
  const u = raw.trim()
  if (!u) return null
  if (/\.(mp4|webm)(\?|$)/i.test(u)) return { type: 'video', src: u }
  try {
    const url = new URL(u)
    if (url.hostname.includes('youtube.com') && url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
    }
    if (url.hostname === 'youtu.be') {
      const id = url.pathname.replace(/^\//, '').split('/')[0]
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
    }
    if (url.hostname.includes('youtube.com') && url.pathname.startsWith('/embed/')) {
      return { type: 'iframe', src: u }
    }
  } catch {
    /* ignore */
  }
  return { type: 'iframe', src: u }
}

const ForSchoolsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user, isLoggedIn } = useAuth()
  const location = useLocation()
  const demoRaw = schoolDemoVideoUrl() || '/Unit1b_intro_.mp4'
  const demoEmbed = useMemo(() => embedDemoSrc(demoRaw), [demoRaw])

  const canUseSupabase = !!supabase
  const teacherOk = !!user && isTeacherUser(user)

  const [pilotCode, setPilotCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(LIVE_PILOT_CLASS_CODE_KEY)
    } catch {
      return null
    }
  })
  const [pilotCopied, setPilotCopied] = useState(false)
  const [pilotLoading, setPilotLoading] = useState(false)
  const [pilotError, setPilotError] = useState<string | null>(null)

  const loginRedirectPath = `/login?redirect=${encodeURIComponent('/for-schools')}`

  const startFreePilot = useCallback(async () => {
    setPilotError(null)
    setPilotCopied(false)
    if (!supabase) {
      setPilotError(t('forSchoolsHub.pilotSupabaseMissing'))
      return
    }
    if (!isLoggedIn || !user) {
      setPilotError(t('forSchoolsHub.pilotSignInRequired'))
      return
    }
    if (!isTeacherUser(user)) {
      setPilotError(t('forSchoolsHub.pilotNeedFullAccount'))
      return
    }

    setPilotLoading(true)
    try {
      let lastError: Error | null = null
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const class_code = randomSchoolClassCode()
        const { data, error: insertError } = await supabase
          .from('school_classes')
          .insert({
            teacher_id: user.id,
            name: t('forSchoolsHub.pilotClassDefaultName'),
            class_code,
            age_band: 'kids',
          })
          .select('class_code')
          .single()

        if (!insertError && data?.class_code) {
          const code = String(data.class_code)
          try {
            window.localStorage.setItem(LIVE_PILOT_CLASS_CODE_KEY, code)
          } catch {
            /* ignore */
          }
          setPilotCode(code)
          setPilotLoading(false)
          return
        }

        const msg = insertError?.message ?? ''
        const code = (insertError as { code?: string })?.code
        if (code === '23505' || /duplicate|unique/i.test(msg)) {
          lastError = insertError instanceof Error ? insertError : new Error(msg)
          continue
        }
        throw insertError ?? new Error(t('forSchoolsHub.pilotCreateError'))
      }
      throw lastError ?? new Error(t('forSchoolsHub.pilotCreateError'))
    } catch (e: unknown) {
      setPilotError(e instanceof Error ? e.message : t('forSchoolsHub.pilotCreateError'))
    } finally {
      setPilotLoading(false)
    }
  }, [isLoggedIn, supabase, t, user])

  const copyPilotCode = useCallback(async () => {
    if (!pilotCode || typeof navigator === 'undefined' || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(pilotCode)
      setPilotCopied(true)
      window.setTimeout(() => setPilotCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }, [pilotCode])

  useEffect(() => {
    if (location.hash === '#school-compliance') {
      requestAnimationFrame(() => {
        document.getElementById('school-compliance')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.hash, location.pathname])

  return (
    <div className="page page-narrow print-page">
      <header className="page-header for-schools-hero">
        <div className="for-schools-hero-row no-print">
          <img
            src="/sparkiacademylogo.webp"
            alt=""
            className="for-schools-logo"
            width={120}
            height={120}
          />
          <SparkiAvatar size="lg" />
        </div>
        <h2>{t('forSchoolsHub.pageTitle')}</h2>
        <p className="muted">{t('forSchoolsHub.heroSubtitle')}</p>
      </header>

      <div className="stack-lg no-print">
        <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md">
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.pilotStartTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!canUseSupabase ? (
              <p className="muted">{t('forSchoolsHub.pilotSupabaseMissing')}</p>
            ) : !isLoggedIn ? (
              <>
                <p className="muted">{t('forSchoolsHub.pilotStartBodySignedOut')}</p>
                <Button size="lg" asChild>
                  <Link to={loginRedirectPath}>{t('forSchoolsHub.pilotSignInButton')}</Link>
                </Button>
              </>
            ) : !teacherOk ? (
              <p className="muted">{t('forSchoolsHub.pilotNeedFullAccount')}</p>
            ) : (
              <p className="muted">{t('forSchoolsHub.pilotStartBody')}</p>
            )}

            {canUseSupabase && isLoggedIn && teacherOk ? (
              <div className="flex flex-wrap gap-3">
                <Button type="button" size="lg" disabled={pilotLoading} onClick={() => void startFreePilot()}>
                  {pilotLoading ? t('forSchoolsHub.pilotCreating') : t('forSchoolsHub.pilotStartButton')}
                </Button>
                {pilotCode ? (
                  <Button type="button" variant="secondary" disabled={pilotLoading} onClick={() => void copyPilotCode()}>
                    {pilotCopied ? t('forSchoolsHub.pilotCopied') : t('forSchoolsHub.pilotCopy')}
                  </Button>
                ) : null}
              </div>
            ) : null}

            {!!pilotError && <p className="text-sm text-red-700">{pilotError}</p>}

            {pilotCode ? (
              <div className="rounded-xl border border-amber-200 bg-white p-4">
                <p className="text-sm font-semibold text-amber-900">{t('forSchoolsHub.pilotCodeLabel')}</p>
                <p className="mt-1 font-mono text-2xl font-black tracking-widest text-slate-900">{pilotCode}</p>
                <p className="muted mt-2 text-sm">{t('forSchoolsHub.pilotCodeHint')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/schools">{t('forSchoolsHub.openSchoolHub')}</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      to="/teacher/dashboard"
                      onClick={() => setPostLoginRedirect('/teacher/dashboard')}
                    >
                      {t('forSchoolsHub.openTeacherDashboard')}
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.resourcesPdfTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <p className="muted flex-1 min-w-[200px]">{t('forSchoolsHub.resourcesPdfBody')}</p>
            <Button variant="secondary" asChild>
              <Link to="/for-schools/resources/teacher-guide">{t('forSchoolsHub.openTeacherGuide')}</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/for-schools/resources/parent-letter">{t('forSchoolsHub.openParentLetter')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.pricingTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted mb-4">{t('forSchoolsHub.pricingIntro')}</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 font-semibold">{t('forSchoolsHub.pricingColTier')}</th>
                    <th className="p-3 font-semibold">{t('forSchoolsHub.pricingColPrice')}</th>
                    <th className="p-3 font-semibold">{t('forSchoolsHub.pricingColIncludes')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-medium">{t('forSchoolsHub.pricingPilot')}</td>
                    <td className="p-3">{t('forSchoolsHub.pricingPilotPrice')}</td>
                    <td className="p-3 muted">{t('forSchoolsHub.pricingPilotNotes')}</td>
                  </tr>
                  <tr className="border-t border-slate-200 bg-slate-50/80">
                    <td className="p-3 font-medium">{t('forSchoolsHub.pricingStandard')}</td>
                    <td className="p-3">{t('forSchoolsHub.pricingStandardPrice')}</td>
                    <td className="p-3 muted">{t('forSchoolsHub.pricingStandardNotes')}</td>
                  </tr>
                  <tr className="border-t border-slate-200">
                    <td className="p-3 font-medium">{t('forSchoolsHub.pricingDistrict')}</td>
                    <td className="p-3">{t('forSchoolsHub.pricingDistrictPrice')}</td>
                    <td className="p-3 muted">{t('forSchoolsHub.pricingDistrictNotes')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="muted mt-3 text-xs">{t('forSchoolsHub.pricingFootnote')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.coursesTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list">
              <li>
                <strong>{t('forSchoolsHub.course1Name')}</strong> — {t('forSchoolsHub.course1Desc')}
              </li>
              <li>
                <strong>{t('forSchoolsHub.course2Name')}</strong> — {t('forSchoolsHub.course2Desc')}
              </li>
              <li>
                <strong>{t('forSchoolsHub.course3Name')}</strong> — {t('forSchoolsHub.course3Desc')}
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.spanishTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('forSchoolsHub.spanishBody')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.pwaHighlightTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{t('forSchoolsHub.pwaHighlightBody')}</p>
            <p className="muted mt-2">{t('compliance.pwaBody')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.demoTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {demoEmbed ? (
              <div className="for-schools-video-wrap">
                {demoEmbed.type === 'iframe' ? (
                  <iframe
                    title={t('forSchoolsHub.demoCaption')}
                    src={demoEmbed.src}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video controls playsInline className="w-full rounded-xl" poster="/globalposter.png">
                    <source src={demoEmbed.src} />
                  </video>
                )}
                <p className="muted text-sm mt-2">{t('forSchoolsHub.demoCaption')}</p>
              </div>
            ) : (
              <p className="muted">{t('forSchoolsHub.demoPlaceholder')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.teacherMvpTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <p className="muted flex-1 min-w-[200px]">{t('forSchoolsHub.teacherMvpBody')}</p>
            <Button asChild>
              <Link
                to="/teacher/dashboard"
                onClick={() => setPostLoginRedirect('/teacher/dashboard')}
              >
                {t('forSchoolsHub.openTeacherDashboard')}
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link
                to="/teacher/generator"
                onClick={() => setPostLoginRedirect('/teacher/generator')}
              >
                {t('forSchoolsHub.openWeeklyGenerator')}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.onePagerTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <p className="muted flex-1">{t('forSchoolsHub.onePagerBody')}</p>
            <Button variant="secondary" asChild>
              <Link to="/for-schools/one-pager">{t('forSchoolsHub.openOnePager')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.schoolOpsTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="muted mb-3">{t('forSchoolsHub.schoolOpsBody')}</p>
            <Button variant="outline" asChild>
              <Link to="/schools">{t('forSchoolsHub.openSchoolHub')}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('forSchoolsHub.pilotCtaTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="muted">{t('forSchoolsHub.pilotCtaBody')}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/contact">{t('forSchoolsHub.openContactForPilot')}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  to="/teacher/dashboard"
                  onClick={() => setPostLoginRedirect('/teacher/dashboard')}
                >
                  {t('forSchoolsHub.openTeacherDashboard')}
                </Link>
              </Button>
            </div>
            <p className="muted text-sm">{t('forSchoolsHub.pilotDocNote')}</p>
          </CardContent>
        </Card>
      </div>

      <div id="school-compliance" className="stack-lg scroll-mt-24">
        <h2 className="text-xl font-bold mt-8 no-print">{t('compliance.title')}</h2>
        <p className="muted no-print">{t('compliance.kidIntro')}</p>
        <ComplianceContent />
      </div>
    </div>
  )
}

export default ForSchoolsPage
