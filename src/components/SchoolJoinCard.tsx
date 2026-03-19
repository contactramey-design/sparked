import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LocaleContext'
import { ensureAnonymousSchoolAuth, getSchoolSession, setSchoolSession } from '@/school/schoolSession'

function makeStudentCode(): string {
  const n = Math.floor(10 + Math.random() * 90)
  return `Explorer-${n}`
}

export default function SchoolJoinCard() {
  const { t } = useTranslation()
  const existing = useMemo(() => getSchoolSession(), [])
  const [classCode, setClassCode] = useState('')
  const [studentCode, setStudentCode] = useState(existing.studentCode ?? makeStudentCode())
  const [joined, setJoined] = useState(!!existing.classId && !!existing.studentCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setJoined(!!existing.classId && !!existing.studentCode)
  }, [existing.classId, existing.studentCode])

  if (!supabase) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('schoolJoin.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="muted">{t('schoolJoin.supabaseMissing')}</p>
        </CardContent>
      </Card>
    )
  }

  if (joined) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('schoolJoin.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('schoolJoin.joinedLine', { student: existing.studentCode ?? '' })}</p>
          <p className="muted">{t('schoolJoin.joinedHint')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('schoolJoin.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="stack-lg">
          <div className="muted">{t('schoolJoin.subtitle')}</div>
          {!!error && <div className="muted">{error}</div>}
          <label className="muted">
            {t('schoolJoin.classCode')}
            <input
              value={classCode}
              onChange={(e) => setClassCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              style={{
                display: 'block',
                width: '100%',
                marginTop: 6,
                minHeight: 44,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.15)',
              }}
            />
          </label>
          <label className="muted">
            {t('schoolJoin.studentCode')}
            <input
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="Explorer-42"
              style={{
                display: 'block',
                width: '100%',
                marginTop: 6,
                minHeight: 44,
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.15)',
              }}
            />
          </label>
          <Button
            disabled={loading || !classCode.trim() || !studentCode.trim()}
            onClick={async () => {
              setLoading(true)
              setError(null)
              try {
                const sb = supabase
                if (!sb) throw new Error(t('schoolJoin.supabaseMissing'))
                const uid = await ensureAnonymousSchoolAuth()
                if (!uid) throw new Error(t('schoolJoin.authFailed'))

                const { data: classes, error: e1 } = await sb
                  .from('school_classes')
                  .select('id')
                  .eq('class_code', classCode.trim())
                  .limit(1)
                if (e1) throw e1
                const classId = (classes?.[0] as any)?.id as string | undefined
                if (!classId) throw new Error(t('schoolJoin.codeNotFound'))

                setSchoolSession(classId, studentCode.trim())
                setJoined(true)
              } catch (e: any) {
                setError(e?.message ?? t('schoolJoin.errorGeneric'))
              } finally {
                setLoading(false)
              }
            }}
          >
            {t('schoolJoin.joinButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

