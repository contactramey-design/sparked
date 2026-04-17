
type Props = {
  open: boolean
  onAccept: () => void
  onDecline: () => void
  title: string
  body: string
  acceptLabel: string
  declineLabel: string
}

/**
 * Parent-facing consent before voice input/output (large touch targets for iPad).
 */
export function TutorConsentModal({ open, onAccept, onDecline, title, body, acceptLabel, declineLabel }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutor-consent-title"
    >
      <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="tutor-consent-title" className="font-heading text-xl text-slate-900">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">{body}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:justify-end">
          <button
            type="button"
            className="min-h-[52px] min-w-[140px] rounded-xl bg-sky-600 px-5 text-lg font-semibold text-white active:bg-sky-700"
            onClick={onAccept}
          >
            {acceptLabel}
          </button>
          <button
            type="button"
            className="min-h-[52px] min-w-[140px] rounded-xl border-2 border-slate-300 bg-white px-5 text-lg text-slate-800"
            onClick={onDecline}
          >
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
