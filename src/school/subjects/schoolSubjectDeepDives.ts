/**
 * @deprecated Use `getSchoolSubjectTeacherPack` for full pedagogy; this returns only the conceptual paragraph.
 */
import { getSchoolSubjectTeacherPack } from './schoolSubjectTeacherPack'

export function getSchoolSubjectDeepDive(lessonId: string, locale: 'en' | 'es'): string | undefined {
  return getSchoolSubjectTeacherPack(lessonId, locale)?.conceptualDeepDive
}
