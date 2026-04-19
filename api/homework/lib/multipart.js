import { verifyHomeworkCheckoutSession } from '../../lib/verifyBundleEntitlement.js'
import { isVercelProduction } from '../../lib/deployMode.js'

export const MAX_BODY_BYTES = 4.5 * 1024 * 1024

/**
 * When false, homework APIs verify Adventure Academy checkout session.
 * Vercel Production defaults to verification unless HOMEWORK_REQUIRE_CHECKOUT=false or ALLOW_UNAUTH_HOMEWORK.
 */
export function isHomeworkEntitlementBypassed() {
  if (process.env.ALLOW_UNAUTH_HOMEWORK === 'true') return true
  if (process.env.HOMEWORK_REQUIRE_CHECKOUT === 'false') return true
  if (process.env.HOMEWORK_REQUIRE_CHECKOUT === 'true') return false
  return !isVercelProduction()
}

export async function parseMultipart(req) {
  const { IncomingForm } = await import('formidable')
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: MAX_BODY_BYTES,
      maxTotalFileSize: MAX_BODY_BYTES,
    })
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export async function requireHomeworkEntitlement(checkoutSessionId) {
  if (isHomeworkEntitlementBypassed()) return { ok: true }
  const entitlement = await verifyHomeworkCheckoutSession((checkoutSessionId || '').trim())
  if (!entitlement.ok) {
    return {
      ok: false,
      status: entitlement.status,
      message:
        entitlement.status === 403
          ? 'Parent unlock required. Subscribe to Adventure Academy, then try again.'
          : entitlement.message,
    }
  }
  return { ok: true }
}
