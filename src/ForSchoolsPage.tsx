import React, { useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from './contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import SparkiAvatar from './components/SparkiAvatar'
import ComplianceContent from './components/ComplianceContent'

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
  const location = useLocation()
  const demoRaw = schoolDemoVideoUrl()
  const demoEmbed = useMemo(() => embedDemoSrc(demoRaw), [demoRaw])

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
              <Link to="/teacher/dashboard">{t('forSchoolsHub.openTeacherDashboard')}</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/teacher/generator">{t('forSchoolsHub.openWeeklyGenerator')}</Link>
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
            <Button asChild>
              <Link to="/contact">{t('forSchoolsHub.openContactForPilot')}</Link>
            </Button>
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
