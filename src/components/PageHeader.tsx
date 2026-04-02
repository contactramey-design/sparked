import React from 'react'

type Props = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

/**
 * Shared top-of-page title block for school and teacher surfaces.
 */
export default function PageHeader({ title, subtitle, children, className = '' }: Props) {
  return (
    <header className={`page-header sparki-page-header ${className}`.trim()}>
      <div className="sparki-page-header__text">
        {typeof title === 'string' ? <h2>{title}</h2> : title}
        {subtitle ? <div className="muted sparki-page-header__subtitle">{subtitle}</div> : null}
      </div>
      {children ? <div className="sparki-page-header__actions">{children}</div> : null}
    </header>
  )
}
