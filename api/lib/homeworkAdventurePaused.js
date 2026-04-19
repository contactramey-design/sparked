/**
 * When HOMEWORK_ADVENTURE_PAUSED=true, Homework Adventure Video (Claude script + TTS + worker video)
 * returns 503 so marketing can focus on other surfaces without burning Anthropic / worker credits.
 */
export function isHomeworkAdventurePaused() {
  return process.env.HOMEWORK_ADVENTURE_PAUSED === 'true'
}
