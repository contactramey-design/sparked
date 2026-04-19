/** True on Vercel Production only (not Preview, not local). */
export function isVercelProduction() {
  return process.env.VERCEL_ENV === 'production'
}
