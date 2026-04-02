import type { Locale } from '@/contexts/LocaleContext'
import type { SchoolSubjectLesson } from '../types'
import { canvaPracticeGameSrc } from '../canvaLessonGames'
import { CanvaHtmlPractice } from './CanvaHtmlPractice'
import { PickOnePractice } from './PickOnePractice'
import { renderSchoolSubjectPracticeGame } from './registry'
import { getPickOnePayload } from './lessonPickOneConfigs'
import type { OrderedTapLabels } from './OrderedTapPractice'

type Props = {
  lesson: SchoolSubjectLesson
  title: string
  locale: Locale
  practiceGameId: string
  orderedTapLabels: OrderedTapLabels
  onContinue: () => void
  continueLabel: string
  wrongHint: string
  tryAgainLabel: string
}

export function LessonPractice({
  lesson,
  title,
  locale,
  practiceGameId,
  orderedTapLabels,
  onContinue,
  continueLabel,
  wrongHint,
  tryAgainLabel,
}: Props) {
  const canvaSrc = canvaPracticeGameSrc(lesson.id)
  const pick = getPickOnePayload(lesson.id, locale)

  if (canvaSrc) {
    return (
      <div className="school-subj-practice-wrap school-subj-practice-wrap--canva">
        <CanvaHtmlPractice
          src={canvaSrc}
          locale={locale}
          title={title}
          onContinue={onContinue}
          continueLabel={continueLabel}
        />
      </div>
    )
  }

  if (pick) {
    return (
      <div className="school-subj-practice-wrap">
        <PickOnePractice
          {...pick}
          onContinue={onContinue}
          continueLabel={continueLabel}
          wrongHint={wrongHint}
          tryAgainLabel={tryAgainLabel}
        />
      </div>
    )
  }

  return (
    <div className="school-subj-practice-wrap">
      {renderSchoolSubjectPracticeGame(practiceGameId, {
        onContinue,
        labels: orderedTapLabels,
      })}
    </div>
  )
}
