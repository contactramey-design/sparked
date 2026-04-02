import type { HomeworkExplanation } from '../types/homework'

type Props = {
  explanation: HomeworkExplanation
  labels: { title: string; steps: string; parent: string; offline: string }
}

export function ExplanationCard({ explanation, labels }: Props) {
  return (
    <div className="card space-y-3">
      <h3 className="text-lg font-bold text-blue-900">{labels.title}</h3>
      <p className="text-base leading-relaxed">{explanation.childExplanation}</p>
      {explanation.steps.length > 0 ? (
        <div>
          <strong className="block mb-2">{labels.steps}</strong>
          <ol className="list-decimal pl-5 space-y-1">
            {explanation.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      ) : null}
      {explanation.offlineTry ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-2 text-emerald-950">
          <strong className="block text-sm font-semibold text-emerald-900">{labels.offline}</strong>
          <p className="mt-1 text-sm leading-relaxed">{explanation.offlineTry}</p>
        </div>
      ) : null}
      {explanation.parentNotes ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-amber-950">
          <strong className="block text-sm font-semibold text-amber-900">{labels.parent}</strong>
          <p className="mt-1 text-sm leading-relaxed">{explanation.parentNotes}</p>
        </div>
      ) : null}
    </div>
  )
}
