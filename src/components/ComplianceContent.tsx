import { useState } from 'react'
import { useTranslation } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ListenButton from './ListenButton'

/** Shared COPPA / FERPA / CIPA + PWA + teacher dashboard copy for /for-schools and legacy /compliance. */
export default function ComplianceContent() {
  const { t } = useTranslation()

  const checklistItems = [
    'humanFirst',
    'checkWithAdult',
    'aiCanBeWrong',
    'privacyRules',
    'criticalThinking',
    'acceptableUse',
    'monitoring',
  ] as const

  type ChecklistKey = (typeof checklistItems)[number]

  const [checked, setChecked] = useState<Record<ChecklistKey, boolean>>(
    Object.fromEntries(checklistItems.map((k) => [k, false])) as Record<ChecklistKey, boolean>,
  )

  const doneCount = checklistItems.reduce((sum, k) => sum + (checked[k] ? 1 : 0), 0)

  return (
    <section className="stack-lg">
      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.quickFactsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list">
            <li>{t('compliance.quickFact1')}</li>
            <li>{t('compliance.quickFact2')}</li>
            <li>{t('compliance.quickFact3')}</li>
            <li>{t('compliance.quickFact4')}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.coppaTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('compliance.coppaBody')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.ferpaTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('compliance.ferpaBody')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.cipaTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('compliance.cipaBody')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.dataPrivacyTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list">
            <li>{t('compliance.dataPrivacy1')}</li>
            <li>{t('compliance.dataPrivacy2')}</li>
            <li>{t('compliance.dataPrivacy3')}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="print-break">
        <CardHeader>
          <CardTitle>{t('compliance.schoolUseTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="h3">{t('compliance.pwaTitle')}</h3>
          <p>{t('compliance.pwaBody')}</p>
          <h3 className="h3">{t('compliance.teacherDashboardTitle')}</h3>
          <p>{t('compliance.teacherDashboardBody')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.contactTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t('compliance.contactBody')}</p>
          <p className="muted">{t('compliance.contactNote')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.legalTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="muted">{t('compliance.legalBody')}</p>
        </CardContent>
      </Card>

      <Card className="print-break">
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="muted">{t('compliance.aiToolkit.subtitle')}</p>
          <ListenButton
            text={`${t('compliance.aiToolkit.title')}. ${t('compliance.aiToolkit.subtitle')}`}
            ariaLabel={t('compliance.aiToolkit.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.humanCentered.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{t('compliance.aiToolkit.humanCentered.body')}</p>
          <ListenButton
            text={t('compliance.aiToolkit.humanCentered.listenText')}
            ariaLabel={t('compliance.aiToolkit.humanCentered.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.studentWellBeing.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{t('compliance.aiToolkit.studentWellBeing.body')}</p>
          <ListenButton
            text={t('compliance.aiToolkit.studentWellBeing.listenText')}
            ariaLabel={t('compliance.aiToolkit.studentWellBeing.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.equityBias.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{t('compliance.aiToolkit.equityBias.body')}</p>
          <ListenButton
            text={t('compliance.aiToolkit.equityBias.listenText')}
            ariaLabel={t('compliance.aiToolkit.equityBias.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.transparency.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{t('compliance.aiToolkit.transparency.body')}</p>
          <ListenButton
            text={t('compliance.aiToolkit.transparency.listenText')}
            ariaLabel={t('compliance.aiToolkit.transparency.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('compliance.aiToolkit.governanceProcurement.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>{t('compliance.aiToolkit.governanceProcurement.body')}</p>
          <ListenButton
            text={t('compliance.aiToolkit.governanceProcurement.listenText')}
            ariaLabel={t('compliance.aiToolkit.governanceProcurement.listenAria')}
            size="sm"
          />
        </CardContent>
      </Card>

      <Card className="print-break">
        <CardHeader>
          <CardTitle>{t('compliance.teacherReadiness.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="muted">{t('compliance.teacherReadiness.subtitle')}</p>
            <ListenButton
              text={t('compliance.teacherReadiness.listenText')}
              ariaLabel={t('compliance.teacherReadiness.listenAria')}
              size="sm"
              className="mt-2"
            />
          </div>

          <div className="text-sm muted">
            {t('compliance.teacherReadiness.progress', { done: doneCount, total: checklistItems.length })}
          </div>

          <div className="space-y-2">
            {checklistItems.map((k) => {
              const labelKey = `compliance.teacherReadiness.items.${k}.label`
              const ariaKey = `compliance.teacherReadiness.items.${k}.aria`
              return (
                <label
                  key={k}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
                >
                  <input
                    type="checkbox"
                    checked={checked[k]}
                    onChange={(e) =>
                      setChecked((prev) => ({
                        ...prev,
                        [k]: e.target.checked,
                      }))
                    }
                    aria-label={t(ariaKey)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">{t(labelKey)}</div>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setChecked(
                  Object.fromEntries(checklistItems.map((k) => [k, false])) as Record<ChecklistKey, boolean>,
                )
              }
            >
              {t('compliance.teacherReadiness.reset')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
