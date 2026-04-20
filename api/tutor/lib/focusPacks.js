/**
 * Server-resolved tutor “focus” packs (slug allowlist only — client sends tutor_focus_slug).
 * Keep in sync with product expectations in docs/CSTA-ALIGNMENT.md.
 */

const SLUGS = new Set(['ai-literacy', 'internet-safety', 'ai-media-trust', 'coding-challenge'])

/**
 * @param {string} slug
 * @param {string} ageBand
 * @param {'en'|'es'} locale
 * @returns {string}
 */
export function resolveTutorFocusQuest(slug, ageBand, locale) {
  const s = typeof slug === 'string' ? slug.trim().toLowerCase() : ''
  if (!SLUGS.has(s)) return ''
  const band = (ageBand || 'kids').toLowerCase()
  const loc = locale === 'es' ? 'es' : 'en'
  const isTots = band === 'tots'
  const isCrew = band === 'crew'

  if (s === 'ai-literacy') {
    if (loc === 'es') {
      if (isTots) {
        return [
          'Enfoque: alfabetización de IA (Tots).',
          'Objetivo: la IA es como ayuda que aprende de ejemplos; a veces se equivoca.',
          'Guía: usa frases muy cortas; pregunta “¿qué ves?” y “¿qué crees que pasará después?”',
          'Nunca pidas datos personales; si el niño los dice, reconócelo en una frase y vuelve al tema.',
        ].join('\n')
      }
      if (isCrew) {
        return [
          'Enfoque: alfabetización de IA (Crew).',
          'Objetivos: datos de entrenamiento, errores y sesgos, límites de la IA, responsabilidad humana.',
          'Enseña con preguntas socráticas: ¿de dónde podría venir la respuesta? ¿qué podría faltar? ¿cómo comprobarías?',
          'Conecta con ética digital brevemente; sin alarmismo.',
        ].join('\n')
      }
      return [
        'Enfoque: alfabetización de IA (Kids).',
        'Objetivos: la IA aprende de ejemplos; puede equivocarse; las personas diseñan y usan la IA.',
        'Usa analogías simples (ordenar juguetes, recomendaciones) y pide un ejemplo del niño.',
        'Termina con una micro-acción: “pregunta a un adulto de confianza antes de confiar en una respuesta rara”.',
      ].join('\n')
    }
    if (isTots) {
      return [
        'Focus: AI literacy (Tots).',
        'Goal: AI is helper-stuff that learns from examples; sometimes it is wrong.',
        'Guide: very short sentences; ask “what do you notice?” and “what might happen next?”',
        'Never ask for personal details; if the child shares any, acknowledge once briefly and pivot back.',
      ].join('\n')
    }
    if (isCrew) {
      return [
        'Focus: AI literacy (Crew).',
        'Objectives: training data, mistakes and bias, limits of AI, human responsibility for tools.',
        'Use Socratic questions: where might an answer come from? what could be missing? how would you verify?',
        'Tie to digital ethics briefly; stay calm and non-alarmist.',
      ].join('\n')
    }
    return [
      'Focus: AI literacy (Kids).',
      'Objectives: AI learns from examples; it can be wrong; people design and use AI.',
      'Use simple analogies (sorting toys, recommendations) and ask the child for one real example.',
      'Close with a micro-habit: “check with a trusted adult before trusting a weird answer.”',
    ].join('\n')
  }

  if (s === 'internet-safety') {
    if (loc === 'es') {
      return [
        'Modo: seguridad en Internet (escenarios cortos).',
        'Vigneta A: alguien en un juego pide tu nombre real o dirección — guía: decir no, salir, avisar a un adulto.',
        'Vigneta B: mensaje de premio o enlace raro — guía: no clicar; mostrar a un adulto.',
        'Vigneta C: alguien pide foto o video incómodo — guía: parar, bloquear si aplica, adulto de confianza.',
        'Ramifica con pistas; no dramatizar; refuerza que pedir ayuda es valiente.',
      ].join('\n')
    }
    return [
      'Mode: Internet safety (short scenarios).',
      'Vignette A: someone in a game asks for real name or address — guide: say no, leave, tell a trusted adult.',
      'Vignette B: prize message or strange link — guide: do not click; show a trusted adult.',
      'Vignette C: someone asks for an uncomfortable photo or video — guide: stop, block if needed, trusted adult.',
      'Branch with gentle hints; avoid fear-mongering; praise asking for help.',
    ].join('\n')
  }

  if (s === 'ai-media-trust') {
    if (loc === 'es') {
      return [
        'Enfoque: medios e IA (2026) — Crew/Kids según edad.',
        'Temas: videos o fotos que parecen reales pero son generados; voz clonada; anuncios engañosos.',
        'En Crew: menciona “deepfake” en términos simples y cómo verificar con fuentes y adultos.',
        'En Kids/Tots: “a veces la pantalla miente con caras y voces”; siempre comprobar con un adulto de confianza.',
      ].join('\n')
    }
    return [
      'Focus: AI media & trust (2026) — adjust depth for Crew vs Kids/Tots.',
      'Topics: photos/videos that look real but are generated; cloned voice; tricky ads.',
      'Crew: explain “deepfake” in plain language and how to verify with sources and adults.',
      'Kids/Tots: “screens can trick us with faces and voices”; always check with a trusted adult.',
    ].join('\n')
  }

  if (s === 'coding-challenge') {
    if (loc === 'es') {
      return [
        'Enfoque: pensamiento computacional y práctica con bloques.',
        'El alumno puede estar en /coding-lab con Blockly o Scratch embebido; el tutor da retos cortos paso a paso.',
        'No ejecutes código arbitrario del niño en el servidor; guía conceptos (secuencia, repetición, eventos).',
        'Celebra intentos; si se atasca, ofrece un ejemplo paralelo más simple.',
      ].join('\n')
    }
    return [
      'Focus: computational thinking + block-based practice.',
      'The learner may be on /coding-lab with Blockly or Scratch embed; tutor gives short step-by-step challenges.',
      'Do not run arbitrary child code server-side; teach ideas (sequence, loops, events).',
      'Celebrate tries; if stuck, offer a simpler parallel example.',
    ].join('\n')
  }

  return ''
}

export function isKnownTutorFocusSlug(slug) {
  return SLUGS.has(typeof slug === 'string' ? slug.trim().toLowerCase() : '')
}
