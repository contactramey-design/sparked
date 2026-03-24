/** 6-char codes for `school_classes.class_code` (matches teacher dashboard). */
export function randomSchoolClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i += 1) out += chars[Math.floor(Math.random() * chars.length)]!
  return out
}
