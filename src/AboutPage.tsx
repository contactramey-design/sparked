import React from 'react'
import { Link } from 'react-router-dom'
import { appConfig } from './config'

const AboutPage: React.FC = () => (
  <section className="lesson-page">
    <header className="lesson-header">
      <h2>About {appConfig.appName}</h2>
      <Link to="/" className="link-back">
        ← Back to Home
      </Link>
    </header>
    <div className="legal-content card">
      <p>
        {appConfig.appName} is a safe, playful place for kids and families to learn
        about AI, coding, and staying safe online. Our mascot, SpArki, is a
        friendly AI teddy bear who guides children through short lessons and
        quizzes.
      </p>

      <h3>What We Offer</h3>
      <ul>
        <li>
          <strong>Internet Safety</strong> — Lessons on safe app use, kind
          behavior online, and healthy screen habits.
        </li>
        <li>
          <strong>AI &amp; Coding</strong> — Gentle introductions to what AI is and
          how software helps people.
        </li>
        <li>
          <strong>Homework Adventure</strong> — A tool for grown-ups to turn a
          homework page into a story-based quest with SpArki (parent upload and
          consent required).
        </li>
      </ul>

      <h3>Our Mission</h3>
      <p>
        We believe learning about technology should be fun, safe, and
        human-first. SpArki encourages curiosity and effort, not perfection. We
        are committed to protecting children&apos;s privacy and supporting parents
        with clear controls and information.
      </p>

      <p>
        <Link to="/" className="link-muted">
          Return to Home
        </Link>
      </p>
    </div>
  </section>
)

export default AboutPage
