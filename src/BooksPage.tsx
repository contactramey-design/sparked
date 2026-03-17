import React from 'react'
const BooksPage: React.FC = () => {
  return (
    <section className="lesson-page">
      <header className="lesson-header">
        <div>
          <h2>SpArki’s Digital Bookcase</h2>
          <p className="welcome-subtitle">
            Our ebooks and bundles are coming soon. For now, enjoy the Safety Pass and Academy adventures.
          </p>
        </div>
      </header>
      <div className="card">
        <p className="book-blurb">
          We’re still finalizing our digital bookcase. Once your ebooks are live on Amazon, TikTok Shop,
          or other platforms, this page will turn into a clickable shelf for families.
        </p>
      </div>
    </section>
  )
}

export default BooksPage

