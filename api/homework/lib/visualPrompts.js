/**
 * Shared Pixar-style scene prompts for homework story visuals (server-only).
 * Keeps Sparki + squad wording aligned with story prompts in prompts.js.
 */

const SPARKI_CORE_EN =
  'SpArki: a friendly small blue robotic teddy bear with soft rounded panels, gentle LED eyes, and a warm smile—Pixar-style 3D, not photorealistic.'

const SPARKI_CORE_ES =
  'SpArki: un osito de peluche robótico azul pequeño y amable, paneles redondeados, ojos LED suaves y sonrisa cálida—estilo 3D tipo Pixar, no fotorrealista.'

/**
 * @param {string[]} squadNames
 * @param {'en'|'es'} language
 */
export function squadCharacterBlock(squadNames, language) {
  const isEs = language === 'es'
  const names = Array.isArray(squadNames) ? squadNames.filter(Boolean) : []
  if (names.length === 0) {
    return isEs
      ? 'Incluye compañeros animales amigables estilo caricatura 3D (castor, cachorro, ardilla) como en un equipo de aventura infantil.'
      : 'Include friendly cartoon 3D animal teammates (beaver, puppy, squirrel) like a kids adventure squad.'
  }
  const list = names.join(', ')
  return isEs
    ? `Incluye a estos personajes con diseño coherente tipo Pixar 3D: ${list}.`
    : `Include these characters with consistent Pixar-style 3D designs: ${list}.`
}

/**
 * @param {{
 *   storyTitle: string
 *   sceneNumber: number
 *   narration: string
 *   summary: string
 *   teachingPoint: string
 *   squadNames: string[]
 *   language: 'en'|'es'
 *   avatarDescription?: string
 * }} opts
 */
export function buildSceneImagePrompt(opts) {
  const isEs = opts.language === 'es'
  const sparki = isEs ? SPARKI_CORE_ES : SPARKI_CORE_EN
  const squad = squadCharacterBlock(opts.squadNames, opts.language)
  const sceneText = [opts.summary, opts.narration, opts.teachingPoint].filter(Boolean).join(' ')
  const child = (opts.avatarDescription || '').trim()
  const childLine = child
    ? isEs
      ? `Un niño o niña protagonista: ${child}. Debe verse acogedor, en segundo plano o compartiendo la escena, sin detalles identificables reales.`
      : `A child co-hero in the scene: ${child}. Warm and welcoming, part of the scene, no photorealistic identifiable real child.`
    : isEs
      ? 'Un niño genérico estilo caricatura 3D (sin rasgos identificables) aprende junto al equipo.'
      : 'A generic cartoon 3D child learner (no identifiable real person) learning alongside the team.'

  const rules = isEs
    ? 'Sin texto largo en la imagen, sin marcas, sin violencia, sin temas adultos. Iluminación suave, partículas ligeras, ambiente positivo. Formato panorámico 16:9.'
    : 'No long text in the image, no logos, no violence, no mature themes. Soft rim light, subtle sparkles, empowering mood. Wide cinematic 16:9.'

  return [
    isEs
      ? 'Escena de dibujos animados 3D estilo Pixar, colores vivos, detallada.'
      : 'Pixar-style 3D cartoon scene, vibrant colors, highly detailed.',
    `${sparki}`,
    squad,
    childLine,
    isEs ? `Historia: «${opts.storyTitle}». Escena ${opts.sceneNumber}.` : `Story: "${opts.storyTitle}". Scene ${opts.sceneNumber}.`,
    `Scene: ${sceneText}`,
    rules,
  ].join(' ')
}
