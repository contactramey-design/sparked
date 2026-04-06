import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function buildGovernancePacketBlob(t: (key: string, vars?: Record<string, string>) => string): string {
  const sections = [
    `=== ${t('governance.packetDocTitle')} ===`,
    '',
    t('governance.packetGeneratedAt', { date: new Date().toISOString() }),
    '',
    `--- ${t('governance.dataFlowTitle')} ---`,
    t('governance.dataFlowBody'),
    '',
    `--- ${t('governance.aiUseTitle')} ---`,
    t('governance.aiUseWeekly'),
    t('governance.aiUseHomework'),
    t('governance.aiUseNoTraining'),
    '',
    `--- ${t('governance.studentIdTitle')} ---`,
    t('governance.studentIdDo'),
    t('governance.studentIdDont'),
    '',
    `--- ${t('governance.boardSummaryTitle')} ---`,
    t('governance.boardSummaryBody'),
    '',
    t('governance.packetFooter'),
  ]
  return sections.join('\n')
}

type Props = {
  /** When true, show compact intro only (nested in teacher dashboard). */
  compact?: boolean
}

/** County- and board-friendly governance copy: data flows, AI use, student identifiers. */
export default function GovernanceOverviewContent({ compact = false }: Props) {
  const { t } = useTranslation()

  const downloadPacket = () => {
    const text = buildGovernancePacketBlob(t)
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sparki-governance-summary.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const dataFlowSteps = useMemo(
    () =>
      [
        'governance.dataFlowStep1',
        'governance.dataFlowStep2',
        'governance.dataFlowStep3',
        'governance.dataFlowStep4',
      ] as const,
    [],
  )

  return (
    <section className={`stack-lg ${compact ? '' : ''}`}>
      <Card className="print-break border-orange-200/80">
        <CardHeader>
          <CardTitle>{t('governance.pageTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!compact && <p className="text-sm text-slate-700 max-w-prose leading-relaxed">{t('governance.pageIntro')}</p>}
          <p className="text-sm text-slate-700 max-w-prose leading-relaxed">{t('governance.pageIntroShort')}</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={downloadPacket}>
              {t('governance.downloadPacket')}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link to="/for-schools?tab=compliance#school-compliance">{t('governance.fullComplianceLink')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('governance.dataFlowTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-800 max-w-prose">
            {dataFlowSteps.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('governance.aiUseTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-800 max-w-prose">
          <p>{t('governance.aiUseWeekly')}</p>
          <p>{t('governance.aiUseHomework')}</p>
          <p>{t('governance.aiUseNoTraining')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('governance.studentIdTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm max-w-prose">
          <p className="text-emerald-900">{t('governance.studentIdDo')}</p>
          <p className="text-amber-900">{t('governance.studentIdDont')}</p>
        </CardContent>
      </Card>

      <Card className="print-break">
        <CardHeader>
          <CardTitle>{t('governance.boardSummaryTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-700 max-w-prose leading-relaxed">{t('governance.boardSummaryBody')}</p>
        </CardContent>
      </Card>
    </section>
  )
}
