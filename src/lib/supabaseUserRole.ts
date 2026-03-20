import type { User } from '@supabase/supabase-js'

function readRoleFromMetadata(meta: unknown): string | null {
  if (!meta || typeof meta !== 'object') return null
  const m = meta as Record<string, unknown>
  if (typeof m.role === 'string') return m.role
  const roles = m.roles
  if (Array.isArray(roles) && roles.length > 0 && typeof roles[0] === 'string') return roles[0]
  return null
}

/** True if JWT claims mark this user as a teacher, or pilot: any signed-in non-anonymous user. */
export function isTeacherUser(user: User): boolean {
  const roleAny =
    readRoleFromMetadata(user.app_metadata) ?? readRoleFromMetadata(user.user_metadata)
  if (roleAny === 'teacher') return true
  const isAnon = 'is_anonymous' in user && (user as { is_anonymous?: boolean }).is_anonymous === true
  return !isAnon
}
