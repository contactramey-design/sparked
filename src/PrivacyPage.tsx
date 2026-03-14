import React from 'react'
import { Link } from 'react-router-dom'

const PrivacyPage: React.FC = () => (
  <section className="lesson-page">
    <header className="lesson-header">
      <h2>Privacy Policy</h2>
      <Link to="/" className="link-back">
        ← Back to Home
      </Link>
    </header>
    <div className="legal-content card">
      <p className="legal-updated">
        Last updated: {new Date().toLocaleDateString('en-US')}
      </p>

      <h3>Our Commitment to Children&apos;s Privacy (COPPA)</h3>
      <p>
        SpArki&apos;s Adventures Academy is designed for families and is committed to
        complying with the Children&apos;s Online Privacy Protection Act (COPPA). We do
        not knowingly collect personal information from children under 13 without
        verifiable parental consent.
      </p>

      <h3>Information We Do Not Collect from Children</h3>
      <p>
        In the child-facing experience, we do not collect names, email addresses,
        photos, voice recordings, or any personally identifiable information (PII)
        from children. Children access content through a parent-managed session
        (e.g., a temporary link or this device after a parent has signed in). There
        is no child account or child login.
      </p>

      <h3>Parent-Only Features</h3>
      <p>
        Grown-ups sign in to access the Parent view, unlock the Safety Pass, and
        (when available) upload homework. Parent consent is required before any
        upload or processing of content that could contain a child&apos;s information.
        We recommend verifiable consent methods (e.g., as described in our parent
        materials) where applicable.
      </p>

      <h3>Data Minimization and Deletion</h3>
      <p>
        When homework or similar content is processed, we use it only to generate
        a learning adventure. We do not store uploaded images or documents after
        processing. Only anonymized results (e.g., &quot;math addition problem&quot;) may
        be kept in a session. We do not use child data for behavioral advertising
        or profiling.
      </p>

      <h3>Progress and Session Data</h3>
      <p>
        Progress (e.g., quiz scores, sparkles) may be stored locally on the device
        for the child&apos;s experience. We do not use cookies or tracking for
        child-directed sessions in a way that would support behavioral targeting.
      </p>

      <h3>Your Rights and Contact</h3>
      <p>
        Parents can review, request deletion of, or revoke access to any data
        associated with their use of the service. For questions about this policy
        or to exercise your rights, please use our Contact page.
      </p>

      <p>
        <Link to="/" className="link-muted">
          Return to Home
        </Link>
      </p>
    </div>
  </section>
)

export default PrivacyPage
