import { Link } from 'react-router-dom'
import { useAuth } from '@/AuthContext'
import { useTranslation } from '@/contexts/LocaleContext'
import { useSchoolShopHidden } from '@/hooks/useSchoolMode'

export function AppShellFooter() {
  const { kidLock, isLoggedIn, signOut } = useAuth()
  const { t } = useTranslation()
  const schoolShopHidden = useSchoolShopHidden()

  return (
    <footer className="app-footer">
      <small>
        © {new Date().getFullYear()} {t('header.appName')} · {t('footer.copyright')}
      </small>
      <span className="app-footer-links">
        {!schoolShopHidden && <Link to="/shop">{t('footer.shop')}</Link>}
        <Link to="/about">{t('footer.about')}</Link>
        <Link to="/privacy">{t('footer.privacy')}</Link>
        <Link to="/for-schools">{t('footer.forSchools')}</Link>
        <Link to="/contact">{t('footer.contact')}</Link>
        {schoolShopHidden && <Link to="/schools/parent">{t('footer.schoolParentHub')}</Link>}
        {isLoggedIn && !kidLock && <Link to="/parent">{t('footer.parentDashboard')}</Link>}
        {isLoggedIn && !kidLock && (
          <button type="button" className="footer-link-button" onClick={() => void signOut()}>
            {t('header.signOut')}
          </button>
        )}
      </span>
      {kidLock && (
        <Link to="/parent" className="footer-grownup-link" aria-label={t('footer.grownUp')}>
          {t('footer.grownUp')}
        </Link>
      )}
    </footer>
  )
}
