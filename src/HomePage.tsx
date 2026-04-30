import React, { useEffect, useMemo } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { appConfig } from './config'
import { useAuth } from './AuthContext'
import { useTranslation } from './contexts/LocaleContext'
import { ParentViewContent } from './ParentDashboard'
import { clearPostLoginRedirect, getPostLoginRedirect } from './lib/postLoginRedirect'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import { TutorFunnelDemoVideo } from '@/features/marketing/TutorFunnelDemoVideo'
import { cn } from '@/lib/utils'

const HomePage: React.FC = () => {
  const { authHydrated, isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const { t, locale } = useTranslation()
  const [searchParams] = useSearchParams()
  const viewParam = searchParams.get('view')

  const isParentView = viewParam === 'parent'

  useEffect(() => {
    if (!authHydrated || !isLoggedIn || isParentView) return
    const pending = getPostLoginRedirect()
    if (!pending?.startsWith('/teacher')) return
    clearPostLoginRedirect()
    navigate(pending, { replace: true })
  }, [authHydrated, isLoggedIn, isParentView, navigate])

  const checkoutStatus = useMemo(() => {
    const v = searchParams.get('checkout')
    if (v === 'success' || v === 'cancel') return v
    return null
  }, [searchParams])

  const loginPath = '/login'

  if (isParentView && !isLoggedIn && !checkoutStatus) {
    return (
      <AscentPageChrome
        key={locale}
        title={t('dashboardPage.parentPanelHeading')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('dashboardPage.parentPanelHeading') },
        ]}
        contentMaxWidthClassName="max-w-5xl"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link to="/login?redirect=%2F%3Fview%3Dparent" className="primary-button">
            {t('login.title')}
          </Link>
          <Link to="/" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('common.backToHome')}
          </Link>
        </div>
        <p className="mb-6 max-w-prose text-sm text-slate-600">{t('dashboardPage.parentPanelLead')}</p>
        <ParentViewContent />
      </AscentPageChrome>
    )
  }

  if (isParentView) {
    return (
      <AscentPageChrome
        key={locale}
        title={t('dashboardPage.parentPanelHeading')}
        breadcrumb={[
          { label: t('marketingPages.breadcrumbHome'), to: '/' },
          { label: t('dashboardPage.parentPanelHeading') },
        ]}
        contentMaxWidthClassName="max-w-5xl"
      >
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Link to="/" className="secondary-button">
            {t('common.backToHome')}
          </Link>
          {appConfig.parentResources.handbookPdfUrl ? (
            <a
              href={appConfig.parentResources.handbookPdfUrl}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-teal-800 underline-offset-2 hover:underline"
            >
              {t('home.parentGuide')}
            </a>
          ) : null}
        </div>
        <p className="mb-6 max-w-prose text-sm text-slate-600">{t('dashboardPage.parentPanelLead')}</p>
        <ParentViewContent />
      </AscentPageChrome>
    )
  }

  return (
    <AscentPageChrome key={locale} contentMaxWidthClassName="max-w-3xl">
      <section className="home-funnel px-4 py-12 md:py-16">
        <h1 className="text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
          {t('marketingFunnel.homeHeroTitle')}
        </h1>
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-slate-600 md:text-xl">
          {t('marketingFunnel.homeHeroLead')}
        </p>

        <div className="mt-10 w-full">
          <TutorFunnelDemoVideo />
        </div>

        <ul className="mt-10 max-w-prose space-y-4 text-base leading-relaxed text-slate-800 md:text-lg">
          <li className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-hidden />
            <span>{t('marketingFunnel.homeBullet1')}</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-hidden />
            <span>{t('marketingFunnel.homeBullet2')}</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-teal-500" aria-hidden />
            <span>{t('marketingFunnel.homeBullet3')}</span>
          </li>
        </ul>

        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to="/tutor"
            className={cn(
              'inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-teal-600 px-8 text-lg font-bold text-white shadow-md hover:bg-teal-700',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
            )}
          >
            {t('marketingFunnel.homeCta')}
          </Link>
        </div>

        <p className="mt-10 text-center text-sm text-slate-600 sm:text-left">
          <Link to="/pricing" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('marketingFunnel.navPricing')}
          </Link>
          <span className="mx-2 text-slate-400" aria-hidden>
            ·
          </span>
          <Link to="/?view=parent" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('home.secondaryGrownUps')}
          </Link>
          <span className="mx-2 text-slate-400" aria-hidden>
            ·
          </span>
          <Link to={loginPath} className="font-semibold text-teal-800 underline-offset-2 hover:underline">
            {t('home.grownUpSignIn')}
          </Link>
        </p>
      </section>
    </AscentPageChrome>
  )
}

export default HomePage
