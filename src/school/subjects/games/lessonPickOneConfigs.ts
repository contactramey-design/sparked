import type { Locale } from '@/contexts/LocaleContext'
import { getLocalDateKey, mulberry32, quizDaySeed } from '../dailyPracticeSeed'

export type PickOneOption = { id: string; label: string; emoji: string }

export type PickOneLessonPayload = {
  prompt: string
  options: PickOneOption[]
  correctId: string
  successLine: string
}

const DIGIT_EMOJI: Record<number, string> = {
  0: '0️⃣',
  1: '1️⃣',
  2: '2️⃣',
  3: '3️⃣',
  4: '4️⃣',
  5: '5️⃣',
  6: '6️⃣',
  7: '7️⃣',
  8: '8️⃣',
  9: '9️⃣',
}

function buildSubtractWithin10Pick(lessonId: string, locale: Locale, dayKey: string): PickOneLessonPayload {
  const seed = quizDaySeed(lessonId, 'pick-one-practice', dayKey)
  const rng = mulberry32(seed)
  const minM = 4
  const maxM = 10
  const m = minM + Math.floor(rng() * (maxM - minM + 1))
  const maxS = m - 2
  const s = 1 + Math.floor(rng() * Math.max(1, maxS))
  const ans = m - s

  const pool: number[] = []
  for (let n = 0; n <= 10; n++) {
    if (n !== ans) pool.push(n)
  }
  let w1 = pool[Math.floor(rng() * pool.length)]!
  let w2 = pool[Math.floor(rng() * pool.length)]!
  let guard = 0
  while (w2 === w1 && guard++ < 24) {
    w2 = pool[Math.floor(rng() * pool.length)]!
  }
  if (w2 === w1) w2 = pool.find((x) => x !== w1) ?? 0

  type Tagged = { id: string; label: string; emoji: string; value: number }
  const raw: Tagged[] = [
    { id: 'a', label: String(ans), emoji: DIGIT_EMOJI[ans] ?? '🔢', value: ans },
    { id: 'b', label: String(w1), emoji: DIGIT_EMOJI[w1] ?? '🔢', value: w1 },
    { id: 'c', label: String(w2), emoji: DIGIT_EMOJI[w2] ?? '🔢', value: w2 },
  ]
  for (let i = raw.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = raw[i]!
    raw[i] = raw[j]!
    raw[j] = tmp
  }
  const correctId = raw.find((o) => o.value === ans)!.id
  const options: PickOneOption[] = raw.map(({ id, label, emoji }) => ({ id, label, emoji }))
  const prompt = locale === 'es' ? `¿Cuánto es ${m} − ${s}?` : `What is ${m} − ${s}?`
  const successLine = `${m} − ${s} = ${ans}`
  return { prompt, options, correctId, successLine }
}

const PACKS: Record<string, Record<Locale, PickOneLessonPayload>> = {
  'eng-tots-rhyme-time': {
    en: {
      prompt: 'Which word rhymes with star?',
      options: [
        { id: 'a', label: 'car', emoji: '🚗' },
        { id: 'b', label: 'desk', emoji: '🪑' },
        { id: 'c', label: 'book', emoji: '📚' },
      ],
      correctId: 'a',
      successLine: 'Great — same ending sound!',
    },
    es: {
      prompt: '¿Qué palabra rima con sol?',
      options: [
        { id: 'a', label: 'luz', emoji: '💡' },
        { id: 'b', label: 'árbol', emoji: '🌳' },
        { id: 'c', label: 'casa', emoji: '🏠' },
      ],
      correctId: 'a',
      successLine: '¡Muy bien — sonido final parecido!',
    },
  },
  'eng-tots-first-sounds': {
    en: {
      prompt: 'Which word starts with the /s/ sound?',
      options: [
        { id: 'a', label: 'sun', emoji: '☀️' },
        { id: 'b', label: 'moon', emoji: '🌙' },
        { id: 'c', label: 'apple', emoji: '🍎' },
      ],
      correctId: 'a',
      successLine: 'Yes — sun starts with /s/.',
    },
    es: {
      prompt: '¿Qué palabra empieza con /m/?',
      options: [
        { id: 'a', label: 'mesa', emoji: '🪑' },
        { id: 'b', label: 'luna', emoji: '🌙' },
        { id: 'c', label: 'casa', emoji: '🏠' },
      ],
      correctId: 'a',
      successLine: '¡Sí — mesa empieza con /m/!',
    },
  },
  'eng-tots-story-three-pictures': {
    en: {
      prompt: 'In order, a story usually starts with…',
      options: [
        { id: 'a', label: 'Beginning', emoji: '1️⃣' },
        { id: 'b', label: 'End only', emoji: '🏁' },
        { id: 'c', label: 'Middle first', emoji: '↔️' },
      ],
      correctId: 'a',
      successLine: 'Right — beginning → middle → end.',
    },
    es: {
      prompt: 'En orden, un cuento suele empezar con…',
      options: [
        { id: 'a', label: 'El principio', emoji: '1️⃣' },
        { id: 'b', label: 'Solo el final', emoji: '🏁' },
        { id: 'c', label: 'El medio primero', emoji: '↔️' },
      ],
      correctId: 'a',
      successLine: '¡Correcto — principio → medio → final!',
    },
  },
  'sci-tots-five-senses': {
    en: {
      prompt: 'We use our eyes to…',
      options: [
        { id: 'a', label: 'see', emoji: '👀' },
        { id: 'b', label: 'taste', emoji: '👅' },
        { id: 'c', label: 'smell', emoji: '👃' },
      ],
      correctId: 'a',
      successLine: 'Eyes help us see!',
    },
    es: {
      prompt: 'Usamos los ojos para…',
      options: [
        { id: 'a', label: 'ver', emoji: '👀' },
        { id: 'b', label: 'probar', emoji: '👅' },
        { id: 'c', label: 'oler', emoji: '👃' },
      ],
      correctId: 'a',
      successLine: '¡Los ojos nos ayudan a ver!',
    },
  },
  'sci-tots-living-nonliving': {
    en: {
      prompt: 'A growing plant is…',
      options: [
        { id: 'a', label: 'living', emoji: '🌱' },
        { id: 'b', label: 'non-living', emoji: '🪨' },
        { id: 'c', label: 'only pretend', emoji: '🎭' },
      ],
      correctId: 'a',
      successLine: 'Plants are living things.',
    },
    es: {
      prompt: 'Una planta que crece es…',
      options: [
        { id: 'a', label: 'un ser vivo', emoji: '🌱' },
        { id: 'b', label: 'sin vida', emoji: '🪨' },
        { id: 'c', label: 'solo de juguete', emoji: '🧸' },
      ],
      correctId: 'a',
      successLine: '¡Las plantas son seres vivos!',
    },
  },
  'sci-tots-weather-sun-cloud': {
    en: {
      prompt: 'We often see the sun on a…',
      options: [
        { id: 'a', label: 'sunny day', emoji: '☀️' },
        { id: 'b', label: 'stormy night', emoji: '⛈️' },
        { id: 'c', label: 'only indoors', emoji: '🏠' },
      ],
      correctId: 'a',
      successLine: 'Sunny days usually have clear skies.',
    },
    es: {
      prompt: 'A menudo vemos el sol en un día…',
      options: [
        { id: 'a', label: 'soleado', emoji: '☀️' },
        { id: 'b', label: 'muy tormentoso', emoji: '⛈️' },
        { id: 'c', label: 'solo adentro', emoji: '🏠' },
      ],
      correctId: 'a',
      successLine: '¡Los días soleados suelen tener cielo claro!',
    },
  },
  'hist-tots-then-now': {
    en: {
      prompt: 'A photo from long ago shows…',
      options: [
        { id: 'a', label: 'the past', emoji: '📜' },
        { id: 'b', label: 'only tomorrow', emoji: '🔮' },
        { id: 'c', label: 'a made-up game', emoji: '🎲' },
      ],
      correctId: 'a',
      successLine: 'Old photos help us learn about the past.',
    },
    es: {
      prompt: 'Una foto de hace mucho tiempo muestra…',
      options: [
        { id: 'a', label: 'el pasado', emoji: '📜' },
        { id: 'b', label: 'solo el mañana', emoji: '🔮' },
        { id: 'c', label: 'un juego inventado', emoji: '🎲' },
      ],
      correctId: 'a',
      successLine: '¡Las fotos viejas nos enseñan el pasado!',
    },
  },
  'hist-tots-family-stories': {
    en: {
      prompt: 'Grandma telling what school was like when she was little is…',
      options: [
        { id: 'a', label: 'family history', emoji: '👵' },
        { id: 'b', label: 'only a joke', emoji: '😂' },
        { id: 'c', label: 'not a real story', emoji: '❌' },
      ],
      correctId: 'a',
      successLine: 'Family stories are a kind of history.',
    },
    es: {
      prompt: 'La abuela contando cómo era la escuela cuando era pequeña es…',
      options: [
        { id: 'a', label: 'historia familiar', emoji: '👵' },
        { id: 'b', label: 'solo una broma', emoji: '😂' },
        { id: 'c', label: 'no es un cuento real', emoji: '❌' },
      ],
      correctId: 'a',
      successLine: '¡Los cuentos de familia son una forma de historia!',
    },
  },
  'hist-tots-fairness-rules': {
    en: {
      prompt: 'Taking turns so everyone gets a chance is…',
      options: [
        { id: 'a', label: 'fair', emoji: '🤝' },
        { id: 'b', label: 'unfair', emoji: '🙅' },
        { id: 'c', label: 'only for grown-ups', emoji: '👔' },
      ],
      correctId: 'a',
      successLine: 'Fair rules help the classroom work.',
    },
    es: {
      prompt: 'Hacer turnos para que todos participen es…',
      options: [
        { id: 'a', label: 'justo', emoji: '🤝' },
        { id: 'b', label: 'injusto', emoji: '🙅' },
        { id: 'c', label: 'solo para adultos', emoji: '👔' },
      ],
      correctId: 'a',
      successLine: '¡Las reglas justas ayudan al salón!',
    },
  },
  'math-kids-add-within-10': {
    en: {
      prompt: 'What is 4 + 3?',
      options: [
        { id: 'a', label: '6', emoji: '6️⃣' },
        { id: 'b', label: '7', emoji: '7️⃣' },
        { id: 'c', label: '8', emoji: '8️⃣' },
      ],
      correctId: 'b',
      successLine: '4 + 3 = 7',
    },
    es: {
      prompt: '¿Cuánto es 4 + 3?',
      options: [
        { id: 'a', label: '6', emoji: '6️⃣' },
        { id: 'b', label: '7', emoji: '7️⃣' },
        { id: 'c', label: '8', emoji: '8️⃣' },
      ],
      correctId: 'b',
      successLine: '4 + 3 = 7',
    },
  },
  'math-kids-shapes': {
    en: {
      prompt: 'How many corners does a triangle have?',
      options: [
        { id: 'a', label: '2', emoji: '2️⃣' },
        { id: 'b', label: '3', emoji: '3️⃣' },
        { id: 'c', label: '4', emoji: '4️⃣' },
      ],
      correctId: 'b',
      successLine: 'A triangle has 3 corners.',
    },
    es: {
      prompt: '¿Cuántas esquinas tiene un triángulo?',
      options: [
        { id: 'a', label: '2', emoji: '2️⃣' },
        { id: 'b', label: '3', emoji: '3️⃣' },
        { id: 'c', label: '4', emoji: '4️⃣' },
      ],
      correctId: 'b',
      successLine: 'Un triángulo tiene 3 esquinas.',
    },
  },
}

export function getPickOnePayload(
  lessonId: string,
  locale: Locale,
  dayKey: string = getLocalDateKey(),
): PickOneLessonPayload | null {
  if (lessonId === 'math-kids-subtract-within-10') {
    return buildSubtractWithin10Pick(lessonId, locale, dayKey)
  }
  const row = PACKS[lessonId]
  if (!row) return null
  return row[locale] ?? row.en
}
