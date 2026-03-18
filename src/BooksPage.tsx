import React from 'react'
import { books } from './books'
import { useTranslation } from './contexts/LocaleContext'

const BooksPage: React.FC = () => {
  const { locale } = useTranslation()

  return (
    <section className="lesson-page" key={locale}>
      <header className="lesson-header">
        <div>
          <h2>SpArki’s Digital Bookcase</h2>
          <p className="welcome-subtitle">
            Family-friendly ebooks and bundles. Start the Safety Pass trial to download the PDFs.
          </p>
        </div>
      </header>

      <div className="card">
        <p className="book-blurb">
          PDFs are delivered from Sparki through a protected download link. (Kids never get access directly — only
          parents who unlock the Safety Pass.)
        </p>
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
            <h3 className="book-title">{book.title}</h3>
            <p className="book-blurb">{book.blurb}</p>
            <p className="book-meta">
              <strong>{book.price}</strong> · {book.storeLabel}
            </p>
            <div className="book-actions">
              <a href={`/ebook/${encodeURIComponent(book.id)}`} className="primary-button">
                Read ebook
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default BooksPage

