import type { Locale } from '@/contexts/LocaleContext'
import { mulberry32, quizDaySeed } from './dailyPracticeSeed'
import type { SchoolSubjectQuizItem } from './types'

function layoutMcOptions(
  correct: string,
  wrongA: string,
  wrongB: string,
  shuffleSeed: number,
): { options: [string, string, string]; correctIndex: 0 | 1 | 2 } {
  const rng = mulberry32(shuffleSeed)
  const arr = [correct, wrongA, wrongB]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = arr[i]!
    arr[i] = arr[j]!
    arr[j] = tmp
  }
  const ci = arr.indexOf(correct)
  return { options: arr as [string, string, string], correctIndex: ci as 0 | 1 | 2 }
}

function uniqueNumericWrong(correct: number, max: number, rng: () => number): [string, string] {
  const pool: number[] = []
  for (let n = 0; n <= max; n++) {
    if (n !== correct) pool.push(n)
  }
  const a = pool[Math.floor(rng() * pool.length)]!
  let b = pool[Math.floor(rng() * pool.length)]!
  let guard = 0
  while (b === a && guard++ < 20) {
    b = pool[Math.floor(rng() * pool.length)]!
  }
  if (b === a) {
    b = pool.find((x) => x !== a) ?? (a === 0 ? 1 : 0)
  }
  return [String(a), String(b)]
}

function subtractPair(rng: () => number, maxMinuend: number): { m: number; s: number; ans: number } {
  const minM = 3
  const m = minM + Math.floor(rng() * (maxMinuend - minM + 1))
  const maxS = m - 2
  const s = 1 + Math.floor(rng() * Math.max(1, maxS))
  return { m, s, ans: m - s }
}

export function resolveSchoolSubjectQuizItem(
  item: SchoolSubjectQuizItem,
  lessonId: string,
  dayKey: string,
  locale: Locale,
): SchoolSubjectQuizItem {
  const dyn = item.dynamic
  if (!dyn) return item

  const seed = quizDaySeed(lessonId, item.id, dayKey)
  const rng = mulberry32(seed)

  if (dyn.kind === 'choice_variants') {
    const v = dyn.variants.length ? dyn.variants[seed % dyn.variants.length]! : null
    if (!v) return item
    return {
      ...item,
      prompt: v.prompt,
      options: v.options,
      correctIndex: v.correctIndex,
      dynamic: undefined,
    }
  }

  if (dyn.kind === 'subtract_equation') {
    const { m, s, ans } = subtractPair(rng, dyn.maxMinuend)
    const wrongs = uniqueNumericWrong(ans, dyn.maxMinuend, rng)
    const prompt = locale === 'es' ? `${m} − ${s} es igual a…` : `${m} − ${s} equals…`
    const { options, correctIndex } = layoutMcOptions(String(ans), wrongs[0], wrongs[1], seed ^ 0x9e3779b9)
    const feedback =
      locale === 'es'
        ? 'Cuenta hacia atrás desde el número mayor, o piensa: ¿qué más el número quitado da el total?'
        : 'Count back from the bigger number, or think: what plus the part taken away equals the whole?'
    return { ...item, prompt, options, correctIndex, feedback, dynamic: undefined }
  }

  if (dyn.kind === 'subtract_story_pick') {
    const { m, s } = subtractPair(rng, dyn.maxMinuend)
    const prompt =
      locale === 'es' ? `¿Qué historia va con ${m} − ${s}?` : `Which story fits ${m} − ${s}?`
    const correct =
      locale === 'es'
        ? `${m} manzanas, ${s} se comen — ¿cuántas quedan?`
        : `${m} apples, ${s} are eaten—how many left?`
    const w1 =
      locale === 'es'
        ? `${m} pájaros se unen a ${s} más`
        : `${m} birds join ${s} more birds`
    const w2 = locale === 'es' ? `El doble de ${m}` : `Double ${m}`
    const { options, correctIndex } = layoutMcOptions(correct, w1, w2, seed ^ 0x85ebca6b)
    const feedback =
      locale === 'es'
        ? 'Quitar manzanas encaja con la resta; juntar pájaros sería suma.'
        : 'Taking apples away matches subtraction; joining birds would be addition.'
    return { ...item, prompt, options, correctIndex, feedback, dynamic: undefined }
  }

  if (dyn.kind === 'sum_inverse_fact') {
    const maxSum = dyn.maxSum
    const sMin = 3
    const sum = sMin + Math.floor(rng() * Math.max(1, maxSum - sMin + 1))
    const a = 1 + Math.floor(rng() * (sum - 1))
    const b = sum - a
    const prompt =
      locale === 'es'
        ? `Si ${a} + ${b} = ${sum}, entonces ${sum} − ${b} =`
        : `If ${a} + ${b} = ${sum}, then ${sum} − ${b} =`
    const wrongs = uniqueNumericWrong(a, maxSum, rng)
    const { options, correctIndex } = layoutMcOptions(String(a), wrongs[0], wrongs[1], seed ^ 0xc2b2ae35)
    const feedback =
      locale === 'es'
        ? 'En la familia de operaciones, al quitar una parte queda la otra parte.'
        : 'In a fact family, subtracting one part leaves the other part.'
    return { ...item, prompt, options, correctIndex, feedback, dynamic: undefined }
  }

  if (dyn.kind === 'subtract_drawing_pick') {
    const { m, s } = subtractPair(rng, dyn.maxMinuend)
    const prompt =
      locale === 'es'
        ? `Un buen dibujo para ${m} − ${s} muestra…`
        : `A good drawing for ${m} − ${s} might show…`
    const correct =
      locale === 'es'
        ? `${m} círculos con ${s} tachados`
        : `${m} circles with ${s} crossed out`
    const w1 = locale === 'es' ? `Solo el número ${m}` : `Only the number ${m}`
    const w2 =
      locale === 'es'
        ? `Solo ${s} cajas vacías`
        : `Only ${s} empty boxes`
    const { options, correctIndex } = layoutMcOptions(correct, w1, w2, seed ^ 0x27d4eb2d)
    const feedback =
      locale === 'es'
        ? 'Tachar lo que se quita muestra claramente lo que queda.'
        : 'Crossing out the part taken away shows what remains.'
    return { ...item, prompt, options, correctIndex, feedback, dynamic: undefined }
  }

  return item
}
