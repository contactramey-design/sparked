import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { Button } from '@/components/ui/button'
import { readTeacherClassSnapshot } from '@/lib/teacherSelectedClassStorage'

export default function TeacherHubClassBar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [snap, setSnap] = useState(() => readTeacherClassSnapshot())

  useEffect(() => {
    const sync = () => setSnap(readTeacherClassSnapshot())
    window.addEventListener('sparki-teacher-class-snapshot', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('sparki-teacher-class-snapshot', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  if (!snap) return null

  const onGenerator = location.pathname.startsWith('/teacher/generator')

  return (
    <div className="teacher-hub-class-bar" role="region" aria-label={t('teacherHub.classBarAria')}>
      <div className="teacher-hub-class-bar__meta">
        <span className="font-semibold text-slate-900">{snap.name}</span>
        <span className="text-sm text-slate-600"> · {t('teacherDashboard.tableCode')}: </span>
        <span className="teacher-hub-class-bar__code text-slate-900">{snap.class_code}</span>
      </div>
      <div className="teacher-hub-class-bar__actions">
        <Button asChild variant={onGenerator ? 'default' : 'secondary'} size="sm">
          <Link to="/teacher/dashboard?tab=students">{t('teacherHub.classBarRoster')}</Link>
        </Button>
        <Button asChild variant={onGenerator ? 'secondary' : 'default'} size="sm">
          <Link to="/teacher/generator">{t('teacherHub.tabGenerator')}</Link>
        </Button>
      </div>
    </div>
  )
}
