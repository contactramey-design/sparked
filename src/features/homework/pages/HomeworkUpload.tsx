import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import type { AgeBandId } from '@/ageBand'
import { homeworkAgeHintForBand, isAgeBandId } from '@/ageBand'
import { getSchoolSession } from '@/school/schoolSession'
import { getHomeworkCheckoutSessionId } from '@/progress'
import { analyzeWorksheet, explainWorksheet, storyFromLesson } from '../api/homeworkApi'
import { useHomeworkUpload } from '../hooks/useHomeworkUpload'
import { saveHomeworkJob } from '../hooks/useHomeworkJob'
import type { HomeworkJob, HomeworkLanguage, HomeworkMode } from '../types/homework'
import { UploadCard } from '../components/UploadCard'
import { HomeworkPreview } from '../components/HomeworkPreview'
import { LanguageToggle } from '../components/LanguageToggle'
import { ModeSelector } from '../components/ModeSelector'
import { GenerateButton } from '../components/GenerateButton'

function fileToDataUrl(file: File, maxBytes = 350_000): Promise<string | undefined> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const s = typeof reader.result === 'string' ? reader.result : ''
      if (s.length > maxBytes) resolve(undefined)
      else resolve(s)
    }
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })
}

export default function HomeworkUpload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { ageBand } = useAgeBand()
  const { file, previewUrl, error, setError, onFileChange, reset } = useHomeworkUpload()

  const [genLanguage, setGenLanguage] = useState<HomeworkLanguage>('en')
  const [mode, setMode] = useState<HomeworkMode>('explain')
  /** Sparki band sent to the API as a localized grade hint; empty = omit hint. */
  const [gradeBandId, setGradeBandId] = useState<'' | AgeBandId>('')
  const gradeBandSynced = useRef(false)
  const [subjectHint, setSubjectHint] = useState('')
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('')
  const [homeworkAllowUnauth, setHomeworkAllowUnauth] = useState(false)

  useEffect(() => {
    if (gradeBandSynced.current) return
    gradeBandSynced.current = true
    const session = getSchoolSession()
    const band = isAgeBandId(session.classAgeBand) ? session.classAgeBand : ageBand
    setGradeBandId(band)
  }, [ageBand])

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { homeworkAllowUnauth?: boolean }) => {
        if (!cancelled) setHomeworkAllowUnauth(Boolean(data.homeworkAllowUnauth))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const checkoutSessionId = getHomeworkCheckoutSessionId()
  const needsCheckout =
    import.meta.env.PROD && !checkoutSessionId && !homeworkAllowUnauth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!file) {
      setError(t('homeworkFeature.errorNeedFile'))
      return
    }
    if (!allowed) {
      setError(t('homeworkFeature.errorNeedPermission'))
      return
    }
    if (needsCheckout) {
      setError(t('homeworkPage.errorMissingCheckoutSession'))
      return
    }

    const jobId = crypto.randomUUID()
    setLoading(true)
    try {
      setPhase(t('homeworkFeature.phaseAnalyze'))
      const gradeBand =
        gradeBandId && isAgeBandId(gradeBandId)
          ? homeworkAgeHintForBand(gradeBandId, genLanguage === 'es' ? 'es' : 'en')
          : undefined
      const analysis = await analyzeWorksheet(file, {
        language: genLanguage,
        gradeBand,
        subjectHint: subjectHint.trim() || undefined,
        checkoutSessionId,
      })

      setPhase(t('homeworkFeature.phaseExplain'))
      const explanation = await explainWorksheet(analysis, checkoutSessionId)

      let story = undefined
      if (mode === 'story') {
        setPhase(t('homeworkFeature.phaseStory'))
        story = await storyFromLesson(analysis, explanation, checkoutSessionId)
      }

      const previewDataUrl = await fileToDataUrl(file)
      const job: HomeworkJob = {
        jobId,
        createdAt: Date.now(),
        mode,
        language: genLanguage,
        gradeBand,
        analysis,
        explanation,
        story,
        previewDataUrl,
      }
      saveHomeworkJob(job)
      reset()
      navigate(`/homework/result/${jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('homeworkPage.errorGeneric'))
    } finally {
      setLoading(false)
      setPhase('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <UploadCard
        label={t('homeworkFeature.uploadLabel')}
        onChange={(ev) => onFileChange(ev.target.files?.[0] ?? null, t('homeworkPage.errorFileType'))}
        ariaLabel={t('homeworkPage.uploadImageAria')}
      />
      <HomeworkPreview src={previewUrl} alt={t('homeworkPage.previewAlt')} />

      <div>
        <p className="font-semibold text-blue-900 mb-2">{t('homeworkFeature.genLanguage')}</p>
        <LanguageToggle
          value={genLanguage}
          onChange={setGenLanguage}
          labelEn={t('homeworkFeature.langEn')}
          labelEs={t('homeworkFeature.langEs')}
        />
      </div>

      <div>
        <p className="font-semibold text-blue-900 mb-2">{t('homeworkFeature.modeLabel')}</p>
        <ModeSelector
          value={mode}
          onChange={setMode}
          explainLabel={t('homeworkFeature.modeExplain')}
          storyLabel={t('homeworkFeature.modeStory')}
        />
      </div>

      <label className="block">
        <span className="font-semibold text-blue-900">{t('homeworkFeature.gradeOptional')}</span>
        <select
          className="mt-1 w-full max-w-md rounded-lg border border-blue-200 px-3 py-2"
          value={gradeBandId}
          onChange={(e) => {
            const v = e.target.value
            setGradeBandId(v === '' ? '' : (v as AgeBandId))
          }}
        >
          <option value="">{t('homeworkFeature.gradePlaceholder')}</option>
          <option value="tots">{t('homeworkFeature.gradeBandTots')}</option>
          <option value="kids">{t('homeworkFeature.gradeBandKids')}</option>
          <option value="crew">{t('homeworkFeature.gradeBandCrew')}</option>
        </select>
      </label>

      <label className="block">
        <span className="font-semibold text-blue-900">{t('homeworkPage.subjectHintLabel')}</span>
        <input
          type="text"
          className="mt-1 w-full max-w-md rounded-lg border border-blue-200 px-3 py-2"
          value={subjectHint}
          onChange={(e) => setSubjectHint(e.target.value)}
          placeholder={t('homeworkPage.subjectHintPlaceholder')}
          autoComplete="off"
        />
      </label>

      <label className="flex gap-2 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={allowed}
          onChange={(e) => setAllowed(e.target.checked)}
          className="mt-1"
        />
        <span>{t('homeworkFeature.permissionCheckbox')}</span>
      </label>

      {needsCheckout ? (
        <p className="quiz-error" role="alert">
          {t('homeworkPage.errorLockedByPass')}
        </p>
      ) : null}

      {phase ? <p className="text-blue-800 font-medium">{phase}</p> : null}
      {error ? <p className="quiz-error">{error}</p> : null}

      <GenerateButton type="submit" loading={loading} disabled={needsCheckout}>
        {t('homeworkFeature.generate')}
      </GenerateButton>
    </form>
  )
}
