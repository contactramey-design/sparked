import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { books } from './books'
import { useTranslation } from './contexts/LocaleContext'
import { useSchoolShopHidden } from './hooks/useSchoolMode'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const BooksPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const schoolShopHidden = useSchoolShopHidden()

  if (schoolShopHidden) {
    return <Navigate to="/tracks" replace />
  }

  return (
    <AscentPageChrome
      key={locale}
      title={t('booksPage.title')}
      breadcrumb={[
        { label: t('marketingPages.breadcrumbHome'), to: '/' },
        { label: t('booksPage.title') },
      ]}
    >
      <p className="mb-8 text-lg text-slate-600">{t('booksPage.subtitle')}</p>

      <div className="card rounded-2xl border border-teal-100/80">
        <p className="book-blurb text-slate-700">{t('booksPage.deliveryNote')}</p>
      </div>

      <h3 className="shop-section-heading mt-8 font-heading text-xl font-bold text-teal-950">{t('booksPage.ebooksSectionTitle')}</h3>
      <div className="books-grid mt-4">
        {books.map((book) => (
          <article key={book.id} className="card book-card rounded-2xl border border-teal-100/80">
            <div className="book-cover-wrap" aria-hidden>
              <img
                src={book.coverSrc}
                alt=""
                className="book-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <h3 className="book-title">{t(book.titleKey)}</h3>
            <p className="book-blurb">{t(book.blurbKey)}</p>
            <p className="book-meta">
              <strong>{book.price}</strong> · {t(book.storeLabelKey)}
            </p>
            <div className="book-actions">
              {book.kind === 'subscription_bundle' ? (
                <>
                  <Link to="/?view=parent" className="primary-button">
                    {t('booksPage.unlockSubscription')}
                  </Link>
                  <p className="book-subscription-hint muted text-sm mt-2">{t('booksPage.subscriptionHint')}</p>
                </>
              ) : (
                <Link to={`/ebook?ebookId=${encodeURIComponent(book.id)}`} className="primary-button">
                  {t('booksPage.readEbook')}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </AscentPageChrome>
  )
}

export default BooksPage

