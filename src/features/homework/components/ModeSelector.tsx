import type { HomeworkMode } from '../types/homework'

type Props = {
  value: HomeworkMode
  onChange: (m: HomeworkMode) => void
  explainLabel: string
  storyLabel: string
}

export function ModeSelector({ value, onChange, explainLabel, storyLabel }: Props) {
  return (
    <div className="homework-mode-row flex flex-col gap-2 sm:flex-row" role="radiogroup">
      <button
        type="button"
        role="radio"
        aria-checked={value === 'story'}
        className={`secondary-button flex-1 text-left ${value === 'story' ? 'homework-mode--active' : ''}`}
        onClick={() => onChange('story')}
      >
        {storyLabel}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'explain'}
        className={`secondary-button flex-1 text-left ${value === 'explain' ? 'homework-mode--active' : ''}`}
        onClick={() => onChange('explain')}
      >
        {explainLabel}
      </button>
    </div>
  )
}
