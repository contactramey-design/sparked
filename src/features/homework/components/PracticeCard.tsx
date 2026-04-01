type Props = {
  questions: string[]
  title: string
}

export function PracticeCard({ questions, title }: Props) {
  if (questions.length === 0) return null
  return (
    <div className="card space-y-2">
      <h3 className="text-lg font-bold text-blue-900">{title}</h3>
      <ul className="list-disc pl-5 space-y-2">
        {questions.map((q, i) => (
          <li key={i}>{q}</li>
        ))}
      </ul>
    </div>
  )
}
