import React from 'react'
import { Link } from 'react-router-dom'

const ContactPage: React.FC = () => (
  <section className="lesson-page">
    <header className="lesson-header">
      <h2>Contact Us</h2>
      <Link to="/" className="link-back">
        ← Back to Home
      </Link>
    </header>
    <div className="legal-content card">
      <p>
        For questions about SpArki&apos;s Adventures Academy, privacy, or parent
        controls, please reach out:
      </p>
      <p>
        <a
          href="mailto:hello@sparkiedu.com"
          className="link-muted"
          rel="noopener noreferrer"
        >
          hello@sparkiedu.com
        </a>
      </p>
      <p>
        We aim to respond to family and privacy inquiries in a timely manner.
      </p>
      <p>
        <Link to="/" className="link-muted">
          Return to Home
        </Link>
      </p>
    </div>
  </section>
)

export default ContactPage
