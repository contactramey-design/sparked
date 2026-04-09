import { Navigate, useParams } from 'react-router-dom'

import { buildPracticeLessonPath, buildPracticeSubjectPath } from '@/lib/practiceRoutes'

/** Old URLs `/schools/math` and `/schools/math/:lessonId` → `/practice/math/...` */
export default function SchoolMathLegacyRedirect() {
  const { lessonId } = useParams<{ lessonId?: string }>()
  if (lessonId) {
    return <Navigate to={buildPracticeLessonPath('math', lessonId)} replace />
  }
  return <Navigate to={buildPracticeSubjectPath('math')} replace />
}
