import { useTranslation } from '@/contexts/LocaleContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/** Shared COPPA / FERPA / CIPA + PWA + teacher dashboard copy for /for-schools and legacy /compliance. */
export default function ComplianceContent() {
  const { t } = useTranslation()

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
    </section>
  )
}
