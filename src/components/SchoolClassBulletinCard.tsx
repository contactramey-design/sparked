import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useTranslation } from '@/contexts/LocaleContext'

type Bulletin = { text: string; at: string | null }

type Props = {
  classId: string | null | undefined
  /** When set, shows a link to the full school parent page (bulletin + more) */
  moreHref?: string
  moreLabel?: string
}

/**
 * Read-only class bulletin (teacher → families) via `public_bulletin_for_class`.
 * See docs/SCHOOL-CLASS-BULLETIN.md and Teacher dashboard “Class note for families”.
 */
export function SchoolClassBulletinCard({ classId, moreHref, moreLabel }: Props) {
  const { t } = useTranslation()
  const [bulletin, setBulletin] = useState<Bulletin>({ text: '', at: null })

  useEffect(() => {
    if (!classId || !supabase) {
      setBulletin({ text: '', at: null })
      return
    }
    let cancelled = false
    void (async () => {
      const { data, error } = await supabase.rpc('public_bulletin_for_class', { p_class_id: classId })
      if (cancelled || error) return
      const o = data as { bulletin_text?: string; bulletin_updated_at?: string | null }
      setBulletin({
        text: typeof o?.bulletin_text === 'string' ? o.bulletin_text : '',
        at: o?.bulletin_updated_at ?? null,
      })
    })()
    return () => {
      cancelled = true
    }
  }, [classId])

  if (!classId) return null

  return (
    <div className="lesson-media card border border-amber-200 bg-amber-50/30">
      <h3>{t('schoolParent.bulletinTitle')}</h3>
      {bulletin.text.trim() ? (
        <>
          <p className="text-slate-800 mt-2 whitespace-pre-wrap">{bulletin.text}</p>
          {bulletin.at ? (
            <p className="text-xs text-slate-500 mt-2">
              {t('schoolParent.bulletinUpdated', {
                when: new Date(bulletin.at).toLocaleString(),
              })}
            </p>
          ) : null}
        </>
      ) : (
        <p className="text-slate-600 mt-2">{t('schoolParent.bulletinEmpty')}</p>
      )}
      {moreHref && moreLabel ? (
        <Link to={moreHref} className="secondary-button mt-3 inline-block text-sm">
          {moreLabel}
        </Link>
      ) : null}
    </div>
  )
}
