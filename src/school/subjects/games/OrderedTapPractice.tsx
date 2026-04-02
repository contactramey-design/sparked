import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

export type OrderedTapLabels = {
  title: string
  hint: string
  wrong: string
  done: string
  continueLabel: string
}

type Props = {
  onContinue: () => void
  labels: OrderedTapLabels
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = a[i]!
    a[i] = a[j]!
    a[j] = t
  }
  return a
}

/** Zero-asset practice: tap 1 → 2 → 3 in order (labels from locales). */
export function OrderedTapPractice({ onContinue, labels }: Props) {
  const order = useMemo(() => shuffle([1, 2, 3] as const), [])
  const [expecting, setExpecting] = useState(1)
  const [finished, setFinished] = useState(false)
  const [showWrong, setShowWrong] = useState(false)

  const pick = useCallback(
    (n: number) => {
      if (finished) return
      setShowWrong(false)
      if (n !== expecting) {
        setShowWrong(true)
        setExpecting(1)
        return
      }
      if (n === 3) {
        setFinished(true)
        return
      }
      setExpecting((e) => e + 1)
    },
    [expecting, finished],
  )

  return (
    <div className="school-subj-practice-panel space-y-4">
      <h2 className="school-subj-lesson__section-title">{labels.title}</h2>
      <p className="muted text-sm">{labels.hint}</p>
      {showWrong ? <p className="text-sm text-amber-800">{labels.wrong}</p> : null}
      {!finished ? (
        <div className="school-subj-practice-taps" role="group" aria-label={labels.hint}>
          {order.map((n) => (
            <button
              key={n}
              type="button"
              className="school-subj-practice-tap-btn"
              onClick={() => pick(n)}
            >
              {n}
            </button>
          ))}
        </div>
      ) : (
        <div className="school-subj-practice-done space-y-3">
          <p className="font-medium text-emerald-900">{labels.done}</p>
          <Button type="button" onClick={onContinue}>
            {labels.continueLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
