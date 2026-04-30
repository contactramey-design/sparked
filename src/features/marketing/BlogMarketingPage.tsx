import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'
import { NewsletterSignup } from '@/features/marketing/NewsletterSignup'

const POSTS = [
  { id: 'post1' as const, slug: 'internet-safety' },
  { id: 'post2' as const, slug: 'adventure-academy' },
  { id: 'post3' as const, slug: 'homework-at-home' },
  { id: 'post4' as const, slug: 'ai-in-schools' },
  { id: 'post5' as const, slug: 'coppa-ai-parent-controls' },
]

export default function BlogMarketingPage() {
  const { t } = useTranslation()
  return (
    <AscentPageChrome title={t('marketingPages.blogPageTitle')} currentLabel={t('marketingPages.blogBreadcrumb')}>
      <p className="mx-auto max-w-2xl text-center text-lg text-slate-600">{t('marketingPages.blogIntro')}</p>
      <div className="mx-auto mt-8 max-w-3xl">
        <NewsletterSignup source="blog" />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map(({ id, slug }) => (
          <article
            key={id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-teal-100 to-fuchsia-100" />
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{t(`marketingPages.${id}Date`)}</p>
              <h2 className="mt-2 font-heading text-xl font-bold text-slate-900">{t(`marketingPages.${id}Title`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{t(`marketingPages.${id}Excerpt`)}</p>
              <Link
                to={`/blog/${slug}`}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-600 px-4 text-sm font-bold text-white hover:bg-teal-700"
              >
                {t('marketingPages.blogReadMore')}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </AscentPageChrome>
  )
}
