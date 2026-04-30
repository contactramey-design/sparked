import { TutorApp } from './TutorApp'

/** @deprecated Use `/tutor` route; kept for compatibility. */
export default function AiTutorPage() {
  return <TutorApp checkoutReturnPath="/tutor" />
}
