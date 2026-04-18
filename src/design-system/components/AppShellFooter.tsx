import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolShopHidden } from '@/hooks/useSchoolMode'
import { getFooterVariant } from '@/lib/marketingFooterPaths'
import { isTeacherUser } from '@/lib/supabaseUserRole'

export function AppShellFooter() {
  const location = useLocation()
  const { kidLock, isLoggedIn, signOut, user } = useAuth()
  const { t } = useTranslation()
  const schoolShopHidden = useSchoolShopHidden()

  const teacherIsLoggedIn = Boolean(isLoggedIn && user && isTeacherUser(user))
  const teacherHref = teacherIsLoggedIn ? '/teacher/dashboard' : '/login?redirect=%2Fteacher%2Fdashboard'
  const teacherLabel = teacherIsLoggedIn ? t('footer.teacherDashboard') : t('footer.teacherSignIn')

  const variant = getFooterVariant(location.pathname, {
    isLoggedIn: Boolean(isLoggedIn),
    kidLock,
  })

  if (variant === 'short') {
    return (
      <footer className="app-footer app-footer--short">
        <small>
          © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
        </small>
        <div className="app-footer-stack">
          <span className="app-footer-links app-footer-links--primary">
            <Link to="/privacy">{t('footer.privacy')}</Link>
            <Link to="/contact-us">{t('footer.contact')}</Link>
            <Link to="/about-us" aria-label={t('footer.sparkiWebsiteAria')}>
              {t('footer.sparkiWebsite')}
            </Link>
            {!schoolShopHidden && <Link to="/shop">{t('footer.shop')}</Link>}
            {isLoggedIn && !kidLock && <Link to="/?view=parent">{t('footer.parentDashboard')}</Link>}
            {isLoggedIn && !kidLock && (
              <button type="button" className="footer-link-button" onClick={() => void signOut()}>
                {t('header.signOut')}
              </button>
            )}
            {teacherIsLoggedIn && (
              <Link to={teacherHref} className="app-footer-link-muted">
                {teacherLabel}
              </Link>
            )}
          </span>
        </div>
        {kidLock && (
          <Link to="/?view=parent" className="footer-grownup-link" aria-label={t('footer.grownUp')}>
            {t('footer.grownUp')}
          </Link>
        )}
      </footer>
    )
  }

  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
      </small>
      <div className="app-footer-stack">
        <span className="app-footer-links app-footer-links--primary">
          {!schoolShopHidden && <Link to="/shop">{t('footer.shop')}</Link>}
          <Link to="/about">{t('footer.about')}</Link>
          <Link to="/services">{t('footer.services')}</Link>
          <Link to="/portfolio">{t('footer.portfolio')}</Link>
          <Link to="/blog">{t('footer.blog')}</Link>
          <Link to="/faq">{t('footer.faq')}</Link>
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <Link to="/contact">{t('footer.contact')}</Link>
          {isLoggedIn && !kidLock && <Link to="/?view=parent">{t('footer.parentDashboard')}</Link>}
          {isLoggedIn && !kidLock && (
            <button type="button" className="footer-link-button" onClick={() => void signOut()}>
              {t('header.signOut')}
            </button>
          )}
        </span>
        <nav className="app-footer-school-cluster" aria-label={t('footer.schoolsPilotsAria')}>
          <span className="app-footer-school-label">{t('footer.schoolsPilotsLabel')}</span>
          <span className="app-footer-school-links">
            <Link to="/for-schools" className="app-footer-link-muted">
              {t('footer.forEducators')}
            </Link>
            <Link to="/compliance" className="app-footer-link-muted">
              {t('footer.compliance')}
            </Link>
            <Link to={teacherHref} className="app-footer-link-muted">
              {teacherLabel}
            </Link>
            {schoolShopHidden ? (
              <Link to="/schools/parent" className="app-footer-link-muted">
                {t('footer.classJoinPilot')}
              </Link>
            ) : null}
          </span>
        </nav>
      </div>
      {kidLock && (
        <Link to="/?view=parent" className="footer-grownup-link" aria-label={t('footer.grownUp')}>
          {t('footer.grownUp')}
        </Link>
      )}
    </footer>
  )
}
