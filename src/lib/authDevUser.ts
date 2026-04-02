import type { User } from '@supabase/supabase-js'

/** Minimal user for local “already have access” login when no Supabase session exists yet. */
export function createLocalDevTeacherUser(): User {
  return {
    id: '11111111-1111-4111-8111-111111111111',
    aud: 'authenticated',
    role: 'authenticated',
    email: 'teacher-dev@local.invalid',
    phone: '',
    app_metadata: { role: 'teacher' },
    user_metadata: {},
    identities: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
  } as User
}
