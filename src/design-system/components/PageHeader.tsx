import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type BreadcrumbItem = { label: string; to?: string }

type Props = {
  breadcrumb?: BreadcrumbItem[]
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ breadcrumb, title, description, actions, className }: Props) {
  return (
    <header className={cn('mb-6 md:mb-8', className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-3 text-sm text-slate-600 font-school">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {breadcrumb.map((item, i) => (
              <li key={`${item.label}-${i}`} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden className="text-slate-400">/</span> : null}
                {item.to ? (
                  <Link to={item.to} className="text-orange-700 hover:text-orange-900 underline-offset-2 hover:underline font-medium">
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-800">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-school">{title}</h1>
          {description ? <p className="mt-2 text-base text-slate-600 max-w-prose font-school">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2 shrink-0">{actions}</div> : null}
      </div>
    </header>
  )
}
