/**
 * iOS/Safari often blocks `HTMLAudioElement.play()` if it happens after an `await`
 * (e.g. after `fetch` for TTS). Call this synchronously from the user's click/tap
 * handler *before* starting any async TTS work to improve autoplay success.
 */
let sharedAudioContext: AudioContext | null = null

export function primeWebAudioFromUserGesture(): void {
  if (typeof window === 'undefined') return
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new AC()
    }
    void sharedAudioContext.resume()
  } catch {
    /* ignore — TTS will still try; may fall back to device speech */
  }
}
