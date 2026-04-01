import { Navigate, useParams } from 'react-router-dom'

/** Old URLs `/schools/math` and `/schools/math/:lessonId` → `/schools/subjects/math/...` */
export default function SchoolMathLegacyRedirect() {
  const { lessonId } = useParams<{ lessonId?: string }>()
  if (lessonId) {
    return <Navigate to={`/schools/subjects/math/${encodeURIComponent(lessonId)}`} replace />
  }
  return <Navigate to="/schools/subjects/math" replace />
}
