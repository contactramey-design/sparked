import type { HomeworkStory } from '../types/homework'

type Props = {
  story: HomeworkStory
  labels: {
    title: string
    scene: string
    recap: string
    teachingPoint: string
    fictionNote?: string
  }
}

export function StoryCard({ story, labels }: Props) {
  return (
    <div className="card space-y-4">
      {labels.fictionNote ? (
        <p className="text-sm text-slate-600 border-l-4 border-amber-300 pl-3 py-1 bg-amber-50/60 rounded-r">
          {labels.fictionNote}
        </p>
      ) : null}
      <h3 className="text-xl font-bold text-blue-900">{story.title}</h3>
      {story.scenes.map((sc) => (
        <div key={sc.sceneNumber} className="rounded-xl bg-amber-50/80 border border-amber-100 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {labels.scene} {sc.sceneNumber}
          </p>
          {sc.summary ? <p className="text-sm text-slate-700 mt-1">{sc.summary}</p> : null}
          <p className="mt-2 leading-relaxed">{sc.narration}</p>
          <p className="text-sm text-blue-800 mt-2">
            <strong>{labels.teachingPoint}</strong> {sc.teachingPoint}
          </p>
        </div>
      ))}
      {story.recap ? (
        <div className="rounded-xl bg-blue-50 p-4">
          <strong className="text-blue-900">{labels.recap}</strong>
          <p className="mt-1">{story.recap}</p>
        </div>
      ) : null}
    </div>
  )
}
