import type { FC, ReactNode } from 'react'
import { OrderedTapPractice, type OrderedTapLabels } from './OrderedTapPractice'

export type PracticeGameContinueProps = {
  onContinue: () => void
  labels: OrderedTapLabels
}

const REGISTRY: Record<string, FC<PracticeGameContinueProps>> = {
  'sparki-ordered-tap': OrderedTapPractice,
}

export function renderSchoolSubjectPracticeGame(
  gameId: string,
  props: PracticeGameContinueProps,
): ReactNode {
  const Comp = REGISTRY[gameId] ?? REGISTRY['sparki-ordered-tap']
  return <Comp {...props} />
}
