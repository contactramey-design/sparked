/**
 * Light SFX / optional speech used by PDF-faithful mini-games (Sparki Tots / Crew).
 */

export function playBeep(frequency = 800, duration = 0.2): void {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    const audioContext = new Ctx()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    const now = audioContext.currentTime
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0.25, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
    oscillator.start(now)
    oscillator.stop(now + duration)
  } catch {
    /* ignore */
  }
}

/** Matches PDF games that use speechSynthesis; skipped when reduced motion is preferred. */
export function speakPdfLine(text: string, rate = 0.85, pitch = 1): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  } catch {
    /* ignore */
  }
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = rate
  u.pitch = pitch
  window.speechSynthesis.speak(u)
}
