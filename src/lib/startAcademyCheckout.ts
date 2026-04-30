/**
 * Opens Stripe Checkout for Adventure Academy. Server allowlists returnTo paths.
 */
export async function startAcademyCheckout(returnTo: string): Promise<void> {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: 'academy', returnTo }),
  })
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
  if (!res.ok || !data?.url) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Unable to open checkout.')
  }
  window.location.assign(data.url)
}
