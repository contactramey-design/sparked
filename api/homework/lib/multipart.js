import { verifyBundleCheckoutSession } from '../../lib/verifyBundleEntitlement.js'

export const MAX_BODY_BYTES = 4.5 * 1024 * 1024

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
  const allowUnauth = process.env.ALLOW_UNAUTH_HOMEWORK === 'true'
  if (allowUnauth) return { ok: true }
  const entitlement = await verifyBundleCheckoutSession((checkoutSessionId || '').trim())
  if (!entitlement.ok) {
    return {
      ok: false,
      status: entitlement.status,
      message:
        entitlement.status === 403
          ? 'Parent unlock required. Complete Safety Pass checkout, then try again.'
          : entitlement.message,
    }
  }
  return { ok: true }
}
