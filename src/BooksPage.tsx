import React from 'react'
import { Link } from 'react-router-dom'
import { books, EBOOK_ID_PENDING_PDF } from './books'
import { useTranslation } from './contexts/LocaleContext'

const BooksPage: React.FC = () => {
  const { t, locale } = useTranslation()

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
            {book.id === EBOOK_ID_PENDING_PDF ? (
              <p className="book-blurb muted" style={{ fontSize: '0.95rem' }}>
                {t('booksPage.tiktokPdfSoon')}
              </p>
            ) : null}
            <div className="book-actions">
              <Link
                to={`/ebook?ebookId=${encodeURIComponent(book.id)}`}
                className={book.id === EBOOK_ID_PENDING_PDF ? 'secondary-button' : 'primary-button'}
              >
                {book.id === EBOOK_ID_PENDING_PDF ? t('booksPage.tiktokReadStatus') : t('booksPage.readEbook')}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BooksPage

