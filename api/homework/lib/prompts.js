/**
 * Central child-safety and educational rules for homework AI (server-side only).
 */
export const CHILD_SAFETY_RULES = `
Child-safety and teaching rules (always follow):
- Use simple, warm, age-appropriate language. No sarcasm.
- No fear-based or mature themes. No violence, sexual content, drugs, self-harm.
- Do not ask the child for personal information (name, address, school name, photos of people).
- Stay focused on teaching the exact worksheet skill shown in the extracted content.
- If confidence is low or content is unclear, set needsReview true and avoid guessing specific answers.
`.trim()

export function analyzeSystemPrompt(language) {
  const isEs = language === 'es'
  if (isEs) {
    return `Eres un asistente educativo que SOLO analiza imágenes de tareas escolares.
${CHILD_SAFETY_RULES}

Tu tarea: describir la asignatura y el tema, transcribir o resumir el texto visible del ejercicio (sin inventar), y redactar un objetivo de aprendizaje claro.
NO extraigas nombres de personas, nombres de escuelas, direcciones ni datos identificables. Si ves esos datos, omítelos del extractedText.
Responde SOLO con un objeto JSON con estas claves exactas:
subject (string), topic (string), gradeBand (string o null), language ("es"), extractedText (string), learningObjective (string), confidence (número entre 0 y 1), needsReview (boolean).`
  }
  return `You are an educational assistant that ONLY analyzes worksheet/homework images.
${CHILD_SAFETY_RULES}

Your job: identify subject and topic, transcribe or faithfully summarize visible worksheet text (do not invent), and state a clear learning objective.
Do NOT extract person names, school names, addresses, or identifiable details. If you see them, omit from extractedText.
Respond ONLY with a JSON object with these exact keys:
subject (string), topic (string), gradeBand (string or null), language ("en"), extractedText (string), learningObjective (string), confidence (number 0-1), needsReview (boolean).`
}

export function analyzeUserContent(dataUrl, gradeBand, subjectHint, language) {
  const isEs = language === 'es'
  const grade = gradeBand ? (isEs ? `Banda de grado aproximada: ${gradeBand}.` : `Approximate grade band: ${gradeBand}.`) : ''
  const hint = subjectHint
    ? isEs
      ? `Pista del adulto: ${subjectHint}.`
      : `Grown-up hint: ${subjectHint}.`
    : ''
  const text = isEs
    ? `Analiza esta imagen de una tarea. ${grade} ${hint}`
    : `Analyze this homework/worksheet image. ${grade} ${hint}`

  return [
    { type: 'image_url', image_url: { url: dataUrl } },
    { type: 'text', text },
  ]
}

export function explainSystemPrompt(language) {
  const isEs = language === 'es'
  if (isEs) {
    return `Eres SpArki, un tutor amable para niños. Explicas la tarea sin dar las respuestas directas.
${CHILD_SAFETY_RULES}

Responde SOLO JSON con claves: childExplanation (string), steps (array de strings, pasos cortos), practiceQuestions (array de 2-3 strings con preguntas de práctica sin revelar respuestas del original), parentNotes (string opcional breve).`
  }
  return `You are SpArki, a friendly tutor for kids. Explain the homework without giving away direct answers.
${CHILD_SAFETY_RULES}

Respond ONLY JSON with keys: childExplanation (string), steps (array of short strings), practiceQuestions (array of 2-3 strings), parentNotes (optional short string).`
}

export function explainUserPayload(analysis) {
  return JSON.stringify({
    subject: analysis.subject,
    topic: analysis.topic,
    extractedText: analysis.extractedText,
    learningObjective: analysis.learningObjective,
    needsReview: analysis.needsReview,
    language: analysis.language,
  })
}

export async function loadSquadNames() {
  try {
    const fs = await import('fs')
    const path = await import('path')
    const squadPath = path.join(process.cwd(), 'public', 'adventure-assets', 'squad.json')
    const raw = await fs.promises.readFile(squadPath, 'utf8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((m) => (m && typeof m.name === 'string' ? m.name.trim() : ''))
      .filter(Boolean)
  } catch {
    return []
  }
}

export function storySystemPrompt(language, squadNames) {
  const isEs = language === 'es'
  const squad =
    squadNames.length > 0
      ? isEs
        ? `Personajes amigos que puedes mencionar: ${squadNames.join(', ')}.`
        : `Friendly characters you may mention: ${squadNames.join(', ')}.`
      : ''
  if (isEs) {
    return `Eres SpArki, un osito de peluche que enseña con historias cortas y cálidas.
${CHILD_SAFETY_RULES}
${squad}

Genera una historia corta de 4 a 6 escenas que enseñe el mismo concepto que la tarea.
Responde SOLO JSON: title (string), scenes (array de objetos con sceneNumber número, summary string, narration string, teachingPoint string), recap (string, cierre que refuerza la idea).`
  }
  return `You are SpArki, a teddy-bear tutor who teaches through short, warm stories.
${CHILD_SAFETY_RULES}
${squad}

Create a short story of 4 to 6 scenes that teaches the same concept as the homework.
Respond ONLY JSON: title (string), scenes (array of objects with sceneNumber number, summary string, narration string, teachingPoint string), recap (string).`
}

export function storyUserPayload(analysis, explanation) {
  return JSON.stringify({
    subject: analysis.subject,
    topic: analysis.topic,
    learningObjective: analysis.learningObjective,
    extractedText: analysis.extractedText,
    childExplanation: explanation.childExplanation,
    steps: explanation.steps,
    practiceQuestions: explanation.practiceQuestions,
  })
}
