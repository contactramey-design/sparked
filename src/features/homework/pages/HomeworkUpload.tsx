import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/contexts/LocaleContext'
import { useAgeBand } from '@/contexts/AgeBandContext'
import type { AgeBandId } from '@/ageBand'
import { homeworkAgeHintForBand, isAgeBandId } from '@/ageBand'
import { getSchoolSession } from '@/school/schoolSession'
import { getHomeworkCheckoutSessionId } from '@/progress'
import {
  analyzeHomeworkInput,
  explainWorksheet,
  saveHomeworkAdventureSession,
  storyFromLesson,
} from '../api/homeworkApi'
import { useHomeworkUpload } from '../hooks/useHomeworkUpload'
import { saveHomeworkJob } from '../hooks/useHomeworkJob'
import type { HomeworkJob, HomeworkLanguage, HomeworkMode } from '../types/homework'
import { UploadCard } from '../components/UploadCard'
import { HomeworkPreview } from '../components/HomeworkPreview'
import { LanguageToggle } from '../components/LanguageToggle'
import { ModeSelector } from '../components/ModeSelector'
import { GenerateButton } from '../components/GenerateButton'
import { useHomeworkSkipCheckoutGate } from '../hooks/useHomeworkAllowUnauth'
import { useAuth } from '@/AuthContext'
import { supabase } from '@/lib/supabaseClient'

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

function childLabelFromRow(row: Record<string, string | null | undefined>): string {
  const a = row.display_name?.trim()
  const b = row.name?.trim()
  const c = row.nickname?.trim()
  return a || b || c || 'Child'
}

type ChildOption = { id: string; label: string }

export default function HomeworkUpload() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { ageBand } = useAgeBand()
  const { file, previewUrl, error, setError, onFileChange, reset } = useHomeworkUpload()
  const { accessToken, isLoggedIn, user } = useAuth()

  const [genLanguage, setGenLanguage] = useState<HomeworkLanguage>('en')
  const [mode, setMode] = useState<HomeworkMode>('story')
  const [inputMode, setInputMode] = useState<'photo' | 'text'>('photo')
  const [worksheetText, setWorksheetText] = useState('')
  /** Sparki band sent to the API as a localized grade hint; empty = omit hint. */
  const [gradeBandId, setGradeBandId] = useState<'' | AgeBandId>('')
  const gradeBandSynced = useRef(false)
  const [subjectHint, setSubjectHint] = useState('')
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('')
  const [rateRemaining, setRateRemaining] = useState<number | null>(null)
  const [childrenOptions, setChildrenOptions] = useState<ChildOption[]>([])
  const [selectedChildId, setSelectedChildId] = useState('')
  const homeworkSkipCheckoutGate = useHomeworkSkipCheckoutGate()

  useEffect(() => {
    if (gradeBandSynced.current) return
    gradeBandSynced.current = true
    const session = getSchoolSession()
    const band = isAgeBandId(session.classAgeBand) ? session.classAgeBand : ageBand
    setGradeBandId(band)
  }, [ageBand])

  useEffect(() => {
    if (!supabase || !user?.id) {
      setChildrenOptions([])
      setSelectedChildId('')
      return
    }
    let cancelled = false
    void supabase
      .from('children')
      .select('id, name, display_name, nickname')
      .eq('parent_id', user.id)
      .order('id', { ascending: true })
      .then(({ data, error: qErr }) => {
        if (cancelled || qErr || !data) return
        setChildrenOptions(
          data.map((row) => ({
            id: row.id as string,
            label: childLabelFromRow(row as Record<string, string | null | undefined>),
          })),
        )
      })
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const checkoutSessionId = getHomeworkCheckoutSessionId()
  const needsCheckout =
    import.meta.env.PROD && !checkoutSessionId && !homeworkSkipCheckoutGate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const textOk = worksheetText.trim().length > 0
    if (inputMode === 'photo' && !file) {
      setError(t('homeworkFeature.errorNeedFile'))
      return
    }
    if (inputMode === 'text' && !textOk) {
      setError(t('homeworkFeature.errorNeedText'))
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
      const analysis = await analyzeHomeworkInput({
        file: inputMode === 'photo' ? file : null,
        worksheetText: inputMode === 'text' ? worksheetText : undefined,
        language: genLanguage,
        gradeBand,
        subjectHint: subjectHint.trim() || undefined,
        checkoutSessionId,
        accessToken,
      })

      if (typeof analysis.remaining === 'number') setRateRemaining(analysis.remaining)
      else setRateRemaining(null)

      setPhase(t('homeworkFeature.phaseExplain'))
      const explanation = await explainWorksheet(analysis, checkoutSessionId)

      let story = undefined
      if (mode === 'story') {
        setPhase(t('homeworkFeature.phaseStory'))
        story = await storyFromLesson(analysis, explanation, checkoutSessionId)
      }

      const previewDataUrl = inputMode === 'photo' && file ? await fileToDataUrl(file) : undefined
      const { remaining: _remaining, ...analysisForJob } = analysis
      const job: HomeworkJob = {
        jobId,
        createdAt: Date.now(),
        mode,
        language: genLanguage,
        gradeBand,
        analysis: analysisForJob,
        explanation,
        story,
        previewDataUrl,
      }
      saveHomeworkJob(job)

      if (accessToken && isLoggedIn) {
        void saveHomeworkAdventureSession({
          accessToken,
          jobId,
          checkoutSessionId,
          childId: selectedChildId || null,
          analysis: analysisForJob,
          mode,
        }).catch(() => {
          /* optional cloud history */
        })
      }

      reset()
      setWorksheetText('')
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
      <p className="text-base font-medium text-blue-950 max-w-prose">{t('homeworkFeature.adventureIntro')}</p>

      <p
        className="text-sm leading-relaxed text-slate-700 max-w-prose border border-amber-100 bg-amber-50/80 rounded-lg px-3 py-2"
        role="note"
      >
        {t('homeworkFeature.privacyNoticeHomework')}
      </p>

      <div>
        <p className="font-semibold text-blue-900 mb-2">{t('homeworkFeature.inputModeLabel')}</p>
        <div className="flex flex-col gap-2 sm:flex-row" role="radiogroup">
          <button
            type="button"
            role="radio"
            aria-checked={inputMode === 'photo'}
            className={`secondary-button flex-1 text-left ${inputMode === 'photo' ? 'homework-mode--active' : ''}`}
            onClick={() => setInputMode('photo')}
          >
            {t('homeworkFeature.inputModePhoto')}
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={inputMode === 'text'}
            className={`secondary-button flex-1 text-left ${inputMode === 'text' ? 'homework-mode--active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            {t('homeworkFeature.inputModeText')}
          </button>
        </div>
      </div>

      {inputMode === 'photo' ? (
        <>
          <UploadCard
            label={t('homeworkFeature.uploadLabel')}
            onChange={(ev) => onFileChange(ev.target.files?.[0] ?? null, t('homeworkPage.errorFileType'))}
            ariaLabel={t('homeworkPage.uploadImageAria')}
          />
          <HomeworkPreview src={previewUrl} alt={t('homeworkPage.previewAlt')} />
        </>
      ) : (
        <label className="block">
          <span className="font-semibold text-blue-900">{t('homeworkFeature.worksheetTextLabel')}</span>
          <textarea
            className="mt-1 w-full max-w-2xl min-h-[10rem] rounded-lg border border-blue-200 px-3 py-2 text-base"
            value={worksheetText}
            onChange={(e) => setWorksheetText(e.target.value)}
            placeholder={t('homeworkFeature.worksheetTextPlaceholder')}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      )}

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

      {childrenOptions.length > 0 ? (
        <label className="block">
          <span className="font-semibold text-blue-900">{t('homeworkFeature.childOptionalLabel')}</span>
          <select
            className="mt-1 w-full max-w-md rounded-lg border border-blue-200 px-3 py-2"
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
          >
            <option value="">{t('homeworkFeature.childOptionalPlaceholder')}</option>
            {childrenOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

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
          className="mt-1 h-12 w-12 shrink-0 rounded border-blue-300 sm:h-5 sm:w-5"
        />
        <span className="text-base min-h-[48px] flex items-center">{t('homeworkFeature.permissionCheckbox')}</span>
      </label>

      {needsCheckout ? (
        <p className="quiz-error" role="alert">
          {t('homeworkPage.errorLockedByPass')}
        </p>
      ) : null}

      {!isLoggedIn && import.meta.env.PROD && !homeworkSkipCheckoutGate ? (
        <p className="text-sm text-amber-800 max-w-prose">{t('homeworkFeature.signInForAdventuresHint')}</p>
      ) : null}

      {typeof rateRemaining === 'number' && rateRemaining < 3 ? (
        <p className="text-xs text-amber-600">{t('homeworkFeature.homeworkRemainingLow', { count: rateRemaining })}</p>
      ) : null}

      {phase ? <p className="text-blue-800 font-medium">{phase}</p> : null}
      {error ? <p className="quiz-error">{error}</p> : null}

      <GenerateButton type="submit" loading={loading} disabled={needsCheckout}>
        {t('homeworkFeature.generate')}
      </GenerateButton>
    </form>
  )
}
