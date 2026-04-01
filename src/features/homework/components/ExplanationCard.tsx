import type { HomeworkExplanation } from '../types/homework'

type Props = {
  explanation: HomeworkExplanation
  labels: { title: string; steps: string; parent: string }
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
      {explanation.parentNotes ? (
        <p className="text-sm text-slate-600">
          <strong>{labels.parent}</strong> {explanation.parentNotes}
        </p>
      ) : null}
    </div>
  )
}
