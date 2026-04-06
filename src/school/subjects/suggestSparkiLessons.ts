/**
 * Map generated weekly unit text + homework adventure fields to static subject lessons.
 * Used for "Suggested Sparki practice" links (hybrid: no extra LLM cost).
 */
import type { AgeBandId } from '@/ageBand'
import { SCHOOL_SUBJECT_IDS, type SchoolSubjectId } from './types'
import { getLessonsForSubjectAndBand } from './registry'

export type SparkiLessonSuggestion = {
  subjectId: SchoolSubjectId
  lessonId: string
  source: 'keyword' | 'subject-label' | 'teacher-pinned'
}

/** lessonId -> keywords that may appear in English/Spanish unit text */
const LESSON_KEYWORDS: Record<string, string[]> = {
  // Math
  'math-tots-count-1-5': ['count', 'counting', 'how many', 'cuánt', 'contar', 'número', 'number'],
  'math-tots-patterns': ['pattern', 'patrón', 'repeat', 'color pattern', 'ab pattern'],
  'math-kids-add-within-10': ['add', 'sum', 'plus', 'together', 'suma', 'más', 'juntar', 'addition'],
  'math-kids-shapes': ['shape', 'triangle', 'square', 'circle', 'side', 'figura', 'triángulo', 'cuadrado'],
  'math-crew-multiply-thinking': ['multiply', 'times', 'group', 'array', 'multiplic', 'grupo', 'igual'],
  'math-crew-fractions-intro': ['fraction', 'half', 'fourth', 'whole', 'part', 'fracción', 'mitad', 'cuarto'],
  // English
  'eng-tots-rhyme-time': ['rhyme', 'rima', 'sound at the end'],
  'eng-tots-first-sounds': ['first sound', 'beginning sound', 'phon', 'sonido inicial', 'letra'],
  'eng-kids-main-idea': ['main idea', 'mostly about', 'idea principal', 'de qué trata'],
  'eng-kids-sentence-parts': ['sentence', 'fragment', 'question mark', 'oración', 'pregunta'],
  'eng-crew-text-evidence': ['evidence', 'text', 'prove', 'quote', 'evidencia', 'texto'],
  'eng-crew-context-clues': ['context', 'unknown word', 'meaning', 'contexto', 'palabra'],
  // Science
  'sci-tots-five-senses': ['sense', 'see', 'hear', 'touch', 'smell', 'sentido', 'oír', 'ver'],
  'sci-tots-living-nonliving': ['living', 'nonliving', 'alive', 'vivo', 'no vivo', 'grow'],
  'sci-kids-states-matter': ['solid', 'liquid', 'gas', 'water', 'ice', 'sólido', 'líquido', 'matter'],
  'sci-kids-plants-need': ['plant', 'sunlight', 'water', 'root', 'planta', 'luz', 'raíz'],
  'sci-crew-food-web': ['food chain', 'producer', 'consumer', 'cadena', 'consumidor', 'plant eat'],
  'sci-crew-sun-energy': ['sun', 'solar', 'energy', 'light', 'sol', 'energía', 'panel'],
  // History / social studies
  'hist-tots-then-now': ['long ago', 'past', 'today', 'then and now', 'antes', 'ahora', 'pasado'],
  'hist-tots-family-stories': ['family', 'story', 'remember', 'familia', 'historia', 'abuel'],
  'hist-kids-community-helpers': ['community', 'helper', 'firefighter', 'teacher', 'comunidad', 'bombero'],
  'hist-kids-map-landmarks': ['map', 'legend', 'symbol', 'mapa', 'leyenda'],
  'hist-crew-timeline-basics': ['timeline', 'before', 'after', 'order', 'línea de tiempo', 'orden'],
  'hist-crew-sources': ['primary source', 'secondary', 'photograph', 'fuente', 'evidencia histórica'],
  // Internet safety (school track — scaffold lesson ids)
  'safety-tots-screen-balance': ['screen', 'break', 'rest', 'watch', 'pantalla', 'descanso', 'video'],
  'safety-kids-kind-online': ['kind', 'online', 'message', 'chat', 'cyber', 'internet', 'amable', 'mensaje'],
  'safety-crew-privacy-basics': ['privacy', 'settings', 'scam', 'dm', 'location', 'privacidad', 'estafa'],
  // AI literacy (school track)
  'ai-tots-robots-helpers': ['robot', 'steps', 'tool', 'program', 'herramienta'],
  'ai-kids-what-is-ai': ['artificial intelligence', 'ai', 'pattern', 'verify', 'inteligencia artificial', 'patrón'],
  'ai-crew-training-bias-intro': ['training data', 'bias', 'generative', 'cite', 'sesgo', 'datos de entrenamiento'],
}

/** Rough map from homework adventure subject line to Sparki subject */
function subjectLabelToSparkiSubjects(subjectRaw: string): SchoolSubjectId[] {
  const s = subjectRaw.toLowerCase()
  const out: SchoolSubjectId[] = []
  if (/safety|internet|online|cyber|digital citizen|screen|privacy|kind online|seguridad|ciber|ciudadan[ií]a digital/i.test(s)) {
    out.push('internet-safety')
  }
  if (
    /\bai\b|artificial intelligence|coding|code|algorithm|computer science|program|generative|inteligencia artificial|programaci[oó]n|algoritm/i.test(
      s,
    )
  ) {
    out.push('ai-literacy')
  }
  if (/math|matem|núm|number|frac|geometry|suma|sum|count/i.test(s)) out.push('math')
  if (/read|writ|english|language|ela|literacy|phon|spell|story|text|vocab/i.test(s)) out.push('english')
  if (/science|sci\b|plant|animal|matter|energy|earth|experiment|observe/i.test(s)) out.push('science')
  if (/history|social|studies|civic|map|timeline|community|past|geograph/i.test(s)) out.push('history')
  return out.length ? out : []
}

function haystack(input: { title: string; summary: string; subject?: string; topic?: string }): string {
  return `${input.title} ${input.summary} ${input.subject ?? ''} ${input.topic ?? ''}`.toLowerCase()
}

export function suggestSparkiLessonsFromGeneratedUnit(input: {
  title: string
  summary: string
  subject?: string
  topic?: string
  ageBand: AgeBandId
}): SparkiLessonSuggestion[] {
  const text = haystack(input)
  const seenLesson = new Set<string>()
  const subjectsWithSuggestion = new Set<SchoolSubjectId>()
  const results: SparkiLessonSuggestion[] = []

  for (const [lessonId, keywords] of Object.entries(LESSON_KEYWORDS)) {
    if (seenLesson.has(lessonId)) continue
    if (!keywords.some((kw) => text.includes(kw.toLowerCase()))) continue

    for (const subjectId of SCHOOL_SUBJECT_IDS) {
      const lessons = getLessonsForSubjectAndBand(subjectId, input.ageBand)
      if (lessons.some((l) => l.id === lessonId)) {
        seenLesson.add(lessonId)
        subjectsWithSuggestion.add(subjectId)
        results.push({ subjectId, lessonId, source: 'keyword' })
        break
      }
    }
  }

  const labelSubjects = subjectLabelToSparkiSubjects(input.subject ?? '')
  for (const subjectId of labelSubjects) {
    if (subjectsWithSuggestion.has(subjectId)) continue
    const first = getLessonsForSubjectAndBand(subjectId, input.ageBand)[0]
    if (first && !seenLesson.has(first.id)) {
      seenLesson.add(first.id)
      subjectsWithSuggestion.add(subjectId)
      results.push({ subjectId, lessonId: first.id, source: 'subject-label' })
    }
  }

  return results.slice(0, 8)
}

export function mergeSuggestionsWithTeacherOverrides(
  auto: SparkiLessonSuggestion[],
  teacherTags: SchoolSubjectId[] | undefined,
  pinned: Partial<Record<SchoolSubjectId, string>> | undefined,
  ageBand: AgeBandId,
): SparkiLessonSuggestion[] {
  const out: SparkiLessonSuggestion[] = []
  const seen = new Set<string>()

  if (pinned) {
    for (const [sid, lid] of Object.entries(pinned) as [SchoolSubjectId, string][]) {
      if (!lid || !SCHOOL_SUBJECT_IDS.includes(sid)) continue
      const key = `${sid}:${lid}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ subjectId: sid, lessonId: lid, source: 'teacher-pinned' })
    }
  }

  const tagSet = teacherTags?.length ? new Set(teacherTags) : null
  const filtered = auto.filter((s) => (tagSet ? tagSet.has(s.subjectId) : true))

  for (const s of filtered) {
    const key = `${s.subjectId}:${s.lessonId}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(s)
  }

  if (out.length === 0 && tagSet) {
    for (const subjectId of tagSet) {
      const first = getLessonsForSubjectAndBand(subjectId, ageBand)[0]
      if (first) out.push({ subjectId, lessonId: first.id, source: 'subject-label' })
    }
  }

  return out.slice(0, 8)
}
