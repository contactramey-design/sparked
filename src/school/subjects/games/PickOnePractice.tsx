import { useCallback, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { PickOneLessonPayload } from './lessonPickOneConfigs'

type Props = PickOneLessonPayload & {
  onContinue: () => void
  continueLabel: string
  wrongHint: string
  tryAgainLabel: string
}

function shuffleOptions<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = a[i]!
    a[i] = a[j]!
    a[j] = t
  }
  return a
}

/** Large touch targets, single correct choice — fits narrow screens without horizontal scroll. */
export function PickOnePractice({
  prompt,
  options,
  correctId,
  successLine,
  onContinue,
  continueLabel,
  wrongHint,
  tryAgainLabel,
}: Props) {
  const order = useMemo(() => shuffleOptions(options), [options])
  const [picked, setPicked] = useState<string | null>(null)
  const [phase, setPhase] = useState<'pick' | 'wrong' | 'done'>('pick')

  const choose = useCallback(
    (id: string) => {
      if (phase !== 'pick') return
      setPicked(id)
      if (id === correctId) {
        setPhase('done')
      } else {
        setPhase('wrong')
      }
    },
    [correctId, phase],
  )

  const retry = useCallback(() => {
    setPicked(null)
    setPhase('pick')
  }, [])

  return (
    <div className="school-subj-practice-panel school-subj-pick-one space-y-4">
      <p className="school-subj-pick-one__prompt">{prompt}</p>
      {phase === 'wrong' ? (
        <p className="text-sm text-amber-900 font-medium">{wrongHint}</p>
      ) : null}
      {phase !== 'done' ? (
        <div className="school-subj-pick-one__grid" role="group" aria-label={prompt}>
          {order.map((opt) => {
            const isSel = picked === opt.id
            const showWrong = phase === 'wrong' && isSel
            const cls = [
              'school-subj-pick-one__btn',
              showWrong ? 'school-subj-pick-one__btn--wrong' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <button
                key={opt.id}
                type="button"
                className={cls}
                disabled={phase === 'wrong'}
                onClick={() => choose(opt.id)}
              >
                <span className="school-subj-pick-one__emoji" aria-hidden>
                  {opt.emoji}
                </span>
                <span className="school-subj-pick-one__label">{opt.label}</span>
              </button>
            )
          })}
        </div>
      ) : null}
      {phase === 'wrong' ? (
        <Button type="button" variant="secondary" onClick={retry}>
          {tryAgainLabel}
        </Button>
      ) : null}
      {phase === 'done' ? (
        <div className="school-subj-pick-one__done space-y-3">
          <p className="font-semibold text-emerald-900">{successLine}</p>
          <Button type="button" onClick={onContinue}>
            {continueLabel}
          </Button>
        </div>
      ) : null}
    </div>
  )
}
