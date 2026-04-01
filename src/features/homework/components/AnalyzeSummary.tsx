import type { HomeworkAnalysis } from '../types/homework'

type Props = {
  analysis: HomeworkAnalysis
  labels: {
    subject: string
    topic: string
    grade: string
    learning: string
    confidence: string
    review: string
    extracted: string
  }
}

export function AnalyzeSummary({ analysis, labels }: Props) {
  return (
    <div className="card homework-analyze-summary space-y-3">
      <p>
        <strong>{labels.subject}</strong> {analysis.subject}
      </p>
      <p>
        <strong>{labels.topic}</strong> {analysis.topic}
      </p>
      {analysis.gradeBand ? (
        <p>
          <strong>{labels.grade}</strong> {analysis.gradeBand}
        </p>
      ) : null}
      <p>
        <strong>{labels.learning}</strong> {analysis.learningObjective}
      </p>
      <p>
        <strong>{labels.confidence}</strong> {Math.round(analysis.confidence * 100)}%
        {analysis.needsReview ? ` · ${labels.review}` : ''}
      </p>
      {analysis.extractedText ? (
        <div>
          <strong className="block mb-1">{labels.extracted}</strong>
          <pre className="whitespace-pre-wrap text-sm bg-blue-50/80 p-3 rounded-xl">{analysis.extractedText}</pre>
        </div>
      ) : null}
    </div>
  )
}
