import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { books } from './books'
import { useTranslation } from './contexts/LocaleContext'

const BooksPage: React.FC = () => {
  const { t, locale } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (hash !== '#merch-coming-soon' && hash !== '#merch-kits') return
    requestAnimationFrame(() => {
      document.getElementById('merch-coming-soon')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.hash])

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <div>
          <h2>{t('booksPage.title')}</h2>
          <p className="welcome-subtitle">{t('booksPage.subtitle')}</p>
        </div>
      </header>

      <div className="card">
        <p className="book-blurb">{t('booksPage.deliveryNote')}</p>
      </div>

      <h3 className="shop-section-heading mt-6">{t('booksPage.ebooksSectionTitle')}</h3>
      <div className="books-grid mt-4">
        {books.map((book) => (
          <article key={book.id} className="card book-card">
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

      <div id="merch-coming-soon" className="merch-kits-anchor mt-8">
        <div className="card">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            {t('nav.comingSoonBadge')}
          </p>
          <h3 className="shop-section-heading mt-2">{t('merch.lockedTitle')}</h3>
          <p className="book-blurb mt-2">{t('merch.lockedBody')}</p>
        </div>
      </div>
    </section>
  )
}

export default BooksPage

