import { Link, Navigate, useParams } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { AscentPageChrome } from '@/design-system/ascent/AscentPageChrome'

const SLUG_TO_POST = {
  'internet-safety': 'post1',
  'adventure-academy': 'post2',
  'homework-at-home': 'post3',
  'ai-in-schools': 'post4',
  'coppa-ai-parent-controls': 'post5',
} as const

type Slug = keyof typeof SLUG_TO_POST
type PostId = (typeof SLUG_TO_POST)[Slug]

function isSlug(s: string | undefined): s is Slug {
  return s !== undefined && s in SLUG_TO_POST
}

export default function BlogPostMarketingPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()

  if (!isSlug(slug)) {
    return <Navigate to="/blog" replace />
  }

  const id: PostId = SLUG_TO_POST[slug]

  return (
    <AscentPageChrome title={t(`marketingPages.${id}Title`)} currentLabel={t('marketingPages.blogBreadcrumb')}>
      <p className="text-sm font-semibold text-teal-800">{t(`marketingPages.${id}Date`)}</p>
      <div className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-700">{t(`marketingPages.${id}Body`)}</div>
      <p className="mt-10">
        <Link to="/blog" className="font-semibold text-teal-800 underline-offset-2 hover:underline">
          {t('marketingPages.blogBackToList')}
        </Link>
      </p>
    </AscentPageChrome>
  )
}
