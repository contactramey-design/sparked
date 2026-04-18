import { useEffect, useState } from 'react'

/**
 * True when the prod UI should not block homework for a missing Stripe session:
 * `ALLOW_UNAUTH_HOMEWORK` on the server, or `HOMEWORK_REQUIRE_CHECKOUT` is not enabled.
 */
export function useHomeworkSkipCheckoutGate(): boolean {
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { homeworkAllowUnauth?: boolean; homeworkRequireCheckout?: boolean }) => {
        if (cancelled) return
        const requireCheckout = data.homeworkRequireCheckout === true
        setSkip(Boolean(data.homeworkAllowUnauth) || !requireCheckout)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return skip
}

/** @deprecated Use useHomeworkSkipCheckoutGate — same return value. */
export function useHomeworkAllowUnauth(): boolean {
  return useHomeworkSkipCheckoutGate()
}
