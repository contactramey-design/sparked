import { useState } from 'react'

type Props = {
  open: boolean
  title: string
  body: string
  parentNote: string
  privacyNote: string
  emailLabel: string
  emailPlaceholder: string
  submitLabel: string
  submittingLabel: string
  dismissLabel: string
  onSubmit: (email: string) => Promise<void>
  onDismiss: () => void
}

export function TutorLeadCaptureModal({
  open,
  title,
  body,
  parentNote,
  privacyNote,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  submittingLabel,
  dismissLabel,
  onSubmit,
  onDismiss,
}: Props) {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const handleSubmit = async () => {
    if (busy) return
    setError(null)
    setBusy(true)
    try {
      await onSubmit(email.trim())
      setEmail('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-lead-title"
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) onDismiss()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="tutor-lead-title" className="font-heading text-xl text-slate-900">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">{body}</p>
        <p className="mt-2 text-sm font-medium text-slate-600">{parentNote}</p>

        <div className="mt-5 space-y-2">
          <label htmlFor="tutor-lead-email" className="block text-sm font-semibold text-slate-800">
            {emailLabel}
          </label>
          <input
            id="tutor-lead-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[52px] w-full rounded-xl border-2 border-slate-300 px-4 text-lg text-slate-900"
          />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-500">{privacyNote}</p>

        {error ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
          <button
            type="button"
            className="min-h-[52px] min-w-[160px] rounded-xl bg-teal-600 px-5 text-lg font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
            onClick={() => void handleSubmit()}
            disabled={busy || !email.trim()}
          >
            {busy ? submittingLabel : submitLabel}
          </button>
          <button
            type="button"
            className="min-h-[52px] min-w-[120px] rounded-xl border-2 border-slate-300 bg-white px-5 text-lg text-slate-800"
            onClick={onDismiss}
            disabled={busy}
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
