import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
                // Create an anonymous school session (auth.uid()) before calling the RPC.
                const uid = await ensureAnonymousSchoolAuth()
                if (!uid) throw new Error(t('schoolJoin.authFailed'))

                const { data, error: rpcError } = await sb.rpc('student_join_class', {
                  p_class_code: classCode.trim(),
                  p_student_code: studentCode.trim(),
                })
                if (rpcError) throw rpcError

                const classId = data as string | null | undefined
                if (!classId) throw new Error(t('schoolJoin.codeNotFound'))

                setSchoolSession(classId, studentCode.trim())
                setJoined(true)
                navigate('/schools/weekly-track')
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

