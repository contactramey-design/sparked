/**
 * School Math — pluggable curriculum
 * ---------------------------------
 * Add lessons by appending to `SCHOOL_MATH_LESSONS`. Each lesson needs:
 * - `id` (stable slug for URLs)
 * - `order` (sort order within a band)
 * - `ageBands` (who sees it)
 * - `en` / `es` content blocks (title, teach sections, quiz, tip)
 *
 * Optional: `standardsNote`, `estMinutes`, `cardImageUrl` (public path), `cardEmoji`
 */
import type { AgeBandId } from '@/ageBand'

export type SchoolMathTeachSection = {
  heading: string
  body: string
}

export type SchoolMathQuizItem = {
  id: string
  prompt: string
  options: [string, string, string]
  correctIndex: 0 | 1 | 2
}

export type SchoolMathLessonLocale = {
  title: string
  summary: string
  objectives: string[]
  teachSections: SchoolMathTeachSection[]
  quiz: SchoolMathQuizItem[]
  realWorldTip: string
}

export type SchoolMathLesson = {
  id: string
  order: number
  ageBands: AgeBandId[]
  estMinutes: number
  /** e.g. "TEKS K.2.B" — display-only for educators */
  standardsNote?: string
  cardEmoji?: string
  cardImageUrl?: string
  en: SchoolMathLessonLocale
  es: SchoolMathLessonLocale
}

export const SCHOOL_MATH_TRACK_ID = 'school-math' as const

export const SCHOOL_MATH_LESSONS: SchoolMathLesson[] = [
  {
    id: 'math-tots-count-1-5',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Counting & cardinality (pre-K)',
    cardEmoji: '🔢',
    en: {
      title: 'Counting 1 to 5 with Sparki',
      summary: 'Touch-count objects in order and say the number name.',
      objectives: ['Say number names 1–5 in order', 'Match one number to one object'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Numbers help us tell “how many.” Sparki lines up 5 blocks. We touch each block once and say: one, two, three, four, five.',
        },
        {
          heading: 'Try it',
          body: 'Hold up fingers as you count. Start at 1. Stop when you run out of objects. The last number you say is how many!',
        },
        {
          heading: 'Teacher tip',
          body: 'Use classroom objects (crayons, counters). Slow counting beats fast guessing.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-count-1-5-q1',
          prompt: 'When we count, we say each number…',
          options: ['Only once for each thing', 'As fast as possible skipping some', 'Only for red things'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q2',
          prompt: 'If you count 3 bears, the last number you say is…',
          options: ['Two', 'Three', 'Five'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'At snack time, count crackers on the plate together: one touch, one number.',
    },
    es: {
      title: 'Contar del 1 al 5 con Sparki',
      summary: 'Tocar cada objeto al contar y decir el nombre del número.',
      objectives: ['Decir los números del 1 al 5 en orden', 'Emparejar un número con un objeto'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Los números nos dicen “cuántos.” Sparki alinea 5 bloques. Tocamos cada bloque una vez y decimos: uno, dos, tres, cuatro, cinco.',
        },
        {
          heading: 'Pruébalo',
          body: 'Levanta dedos mientras cuentas. Empieza en 1. Para cuando se acaben los objetos. ¡El último número es cuántos hay!',
        },
        {
          heading: 'Tip para el maestro',
          body: 'Usa objetos del salón (crayones, fichas). Contar despacio es mejor que adivinar rápido.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-count-1-5-q1',
          prompt: 'Cuando contamos, decimos cada número…',
          options: ['Solo una vez por cada cosa', 'Muy rápido saltando algunas', 'Solo para las cosas rojas'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q2',
          prompt: 'Si cuentas 3 ositos, el último número que dices es…',
          options: ['Dos', 'Tres', 'Cinco'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'En la merienda, cuenten juntos las galletas en el plato: un toque, un número.',
    },
  },
  {
    id: 'math-tots-patterns',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Repeating patterns (pre-K)',
    cardEmoji: '🎨',
    en: {
      title: 'Color Patterns',
      summary: 'Copy and extend simple AB patterns.',
      objectives: ['Recognize “repeats”', 'Say what comes next in a simple pattern'],
      teachSections: [
        {
          heading: 'What is a pattern?',
          body: 'A pattern repeats the same order again and again. Red, blue, red, blue — that is an AB pattern.',
        },
        {
          heading: 'Build with Sparki',
          body: 'Use two colors of blocks. Build: red, yellow, red, yellow. Ask: what color comes next?',
        },
        {
          heading: 'Extend',
          body: 'Clap patterns: clap, tap, clap, tap. Patterns are everywhere: music, art, and movement.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-patterns-q1',
          prompt: 'In red, blue, red, blue, the next color is…',
          options: ['Red', 'Green', 'Purple'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q2',
          prompt: 'A pattern is something that…',
          options: ['Never repeats', 'Repeats in the same order', 'Only works with numbers'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'Line up shoes in a pattern by color for a quick math walk.',
    },
    es: {
      title: 'Patrones de color',
      summary: 'Copiar y alargar patrones simples AB.',
      objectives: ['Reconocer repeticiones', 'Decir qué sigue en un patrón simple'],
      teachSections: [
        {
          heading: '¿Qué es un patrón?',
          body: 'Un patrón repite el mismo orden una y otra vez. Rojo, azul, rojo, azul — es un patrón AB.',
        },
        {
          heading: 'Construir con Sparki',
          body: 'Usa dos colores de bloques. Arma: rojo, amarillo, rojo, amarillo. Pregunta: ¿qué color sigue?',
        },
        {
          heading: 'Alargar',
          body: 'Patrones con palmas: palma, dedos, palma, dedos. Los patrones están en música, arte y movimiento.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-patterns-q1',
          prompt: 'En rojo, azul, rojo, azul, el siguiente color es…',
          options: ['Rojo', 'Verde', 'Morado'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q2',
          prompt: 'Un patrón es algo que…',
          options: ['Nunca se repite', 'Se repite en el mismo orden', 'Solo funciona con números'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'Ordena zapatos por color en un patrón para un paseo matemático rápido.',
    },
  },
  {
    id: 'math-kids-add-within-10',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: 'Addition within 10 (Grades 1–2)',
    cardEmoji: '➕',
    en: {
      title: 'Addition Stories Within 10',
      summary: 'Put together two groups and find the total.',
      objectives: ['Model addition with objects or drawings', 'Relate “put together” to +'],
      teachSections: [
        {
          heading: 'Concept',
          body: 'Addition means putting parts together to get a whole. 4 apples + 3 apples: put them in one basket and count the total.',
        },
        {
          heading: 'Strategy',
          body: 'Count on from the bigger number. For 4 + 3, start at 4 and count three more: 5, 6, 7.',
        },
        {
          heading: 'Check',
          body: 'Sparki draws circles for each part, then counts all. Drawing helps catch mistakes.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-add-q1',
          prompt: '5 + 2 equals…',
          options: ['6', '7', '8'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-add-q2',
          prompt: 'Which story matches 3 + 4?',
          options: [
            '3 birds fly away, 4 stay',
            '3 stickers and 4 more stickers',
            '3 is bigger than 4',
          ],
          correctIndex: 1,
        },
        {
          id: 'math-kids-add-q3',
          prompt: 'To add, we often…',
          options: ['Put groups together', 'Remove objects', 'Skip counting by 10 only'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'At line-up: “3 girls were here, 4 more arrived. How many now?”',
    },
    es: {
      title: 'Historias de suma hasta 10',
      summary: 'Juntar dos grupos y hallar el total.',
      objectives: ['Representar sumas con objetos o dibujos', 'Relacionar “juntar” con +'],
      teachSections: [
        {
          heading: 'Concepto',
          body: 'Sumar es juntar partes para tener un todo. 4 manzanas + 3 manzanas: mételas en una canasta y cuenta el total.',
        },
        {
          heading: 'Estrategia',
          body: 'Cuenta desde el número mayor. En 4 + 3, empieza en 4 y cuenta tres más: 5, 6, 7.',
        },
        {
          heading: 'Comprobar',
          body: 'Sparki dibuja círculos para cada parte y luego cuenta todos. Dibujar ayuda a ver errores.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-add-q1',
          prompt: '5 + 2 es igual a…',
          options: ['6', '7', '8'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-add-q2',
          prompt: '¿Qué historia va con 3 + 4?',
          options: [
            '3 pájaros vuelan, 4 se quedan',
            '3 calcomanías y 4 calcomanías más',
            '3 es mayor que 4',
          ],
          correctIndex: 1,
        },
        {
          id: 'math-kids-add-q3',
          prompt: 'Para sumar, a menudo…',
          options: ['Juntamos grupos', 'Quitamos objetos', 'Solo contamos de 10 en 10'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En la fila: “había 3 niñas, llegaron 4 más. ¿Cuántas hay ahora?”',
    },
  },
  {
    id: 'math-kids-shapes',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: '2D shapes & attributes (Grades 1–2)',
    cardEmoji: '🔷',
    en: {
      title: 'Shapes and Attributes',
      summary: 'Name shapes and count sides and corners.',
      objectives: ['Identify triangle, square, rectangle, circle', 'Describe sides and vertices'],
      teachSections: [
        {
          heading: 'Look closely',
          body: 'A triangle has 3 straight sides. A square has 4 equal sides. A rectangle has 4 sides with opposite sides equal.',
        },
        {
          heading: 'Sort',
          body: 'Sparki sorts shape cards. Ask: how did you decide? Color can trick us — focus on sides and corners.',
        },
        {
          heading: 'Draw in the air',
          body: 'Trace a square with your finger, then a triangle. Feel the difference in corners.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-shapes-q1',
          prompt: 'A shape with 3 straight sides is a…',
          options: ['Circle', 'Triangle', 'Square'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-shapes-q2',
          prompt: 'A square has…',
          options: ['3 equal sides', '4 equal sides', '0 sides'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'Shape hunt: find rectangles (doors) and circles (clocks) in the classroom.',
    },
    es: {
      title: 'Figuras y atributos',
      summary: 'Nombrar figuras y contar lados y vértices.',
      objectives: ['Identificar triángulo, cuadrado, rectángulo, círculo', 'Describir lados y vértices'],
      teachSections: [
        {
          heading: 'Mirar de cerca',
          body: 'Un triángulo tiene 3 lados rectos. Un cuadrado tiene 4 lados iguales. Un rectángulo tiene 4 lados; los opuestos son iguales.',
        },
        {
          heading: 'Clasificar',
          body: 'Sparki ordena tarjetas de figuras. Pregunta: ¿cómo decidiste? El color puede engañar — mira lados y esquinas.',
        },
        {
          heading: 'Dibujar en el aire',
          body: 'Traza un cuadrado con el dedo, luego un triángulo. Siente la diferencia en las esquinas.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-shapes-q1',
          prompt: 'Una figura con 3 lados rectos es un…',
          options: ['Círculo', 'Triángulo', 'Cuadrado'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-shapes-q2',
          prompt: 'Un cuadrado tiene…',
          options: ['3 lados iguales', '4 lados iguales', '0 lados'],
          correctIndex: 1,
        },
      ],
      realWorldTip: 'Caza de figuras: busca rectángulos (puertas) y círculos (relojes) en el salón.',
    },
  },
  {
    id: 'math-crew-multiply-thinking',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Multiplication as equal groups (Grades 3–5)',
    cardEmoji: '✖️',
    en: {
      title: 'Equal Groups & Multiplication',
      summary: 'See multiplication as repeated equal groups.',
      objectives: ['Write a situation as groups × size', 'Connect to repeated addition'],
      teachSections: [
        {
          heading: 'Big idea',
          body: '3 boxes with 4 pencils each: 3 groups of 4 → 3 × 4 = 12. Multiplication tracks equal groups quickly.',
        },
        {
          heading: 'Repeated addition link',
          body: '3 × 4 is also 4 + 4 + 4. When groups are equal, multiplication is the shortcut.',
        },
        {
          heading: 'Sparki challenge',
          body: 'Draw an array: 3 rows of 5 dots. Rows and columns both tell a multiplication story.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-mult-q1',
          prompt: '4 groups of 6 is written…',
          options: ['4 + 6', '4 × 6', '6 ÷ 4'],
          correctIndex: 1,
        },
        {
          id: 'math-crew-mult-q2',
          prompt: '5 × 2 is the same as…',
          options: ['2 + 2 + 2 + 2 + 2', '5 + 5 + 5', '2 + 5'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-mult-q3',
          prompt: 'Equal groups means…',
          options: [
            'Each group has the same number of objects',
            'Each group is a different size',
            'There is only one group',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Pack granola bars: “4 packs, 2 bars each — how many bars?” Draw groups first.',
    },
    es: {
      title: 'Grupos iguales y multiplicación',
      summary: 'Ver la multiplicación como grupos iguales repetidos.',
      objectives: ['Escribir una situación como grupos × tamaño', 'Conectar con suma repetida'],
      teachSections: [
        {
          heading: 'Idea central',
          body: '3 cajas con 4 lápices cada una: 3 grupos de 4 → 3 × 4 = 12. La multiplicación resume grupos iguales.',
        },
        {
          heading: 'Suma repetida',
          body: '3 × 4 también es 4 + 4 + 4. Si los grupos son iguales, la multiplicación es el atajo.',
        },
        {
          heading: 'Reto Sparki',
          body: 'Dibuja una matriz: 3 filas de 5 puntos. Filas y columnas cuentan una historia de multiplicación.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-mult-q1',
          prompt: '4 grupos de 6 se escribe…',
          options: ['4 + 6', '4 × 6', '6 ÷ 4'],
          correctIndex: 1,
        },
        {
          id: 'math-crew-mult-q2',
          prompt: '5 × 2 es lo mismo que…',
          options: ['2 + 2 + 2 + 2 + 2', '5 + 5 + 5', '2 + 5'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-mult-q3',
          prompt: 'Grupos iguales significa…',
          options: [
            'Cada grupo tiene la misma cantidad de objetos',
            'Cada grupo es de un tamaño distinto',
            'Solo hay un grupo',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Barras de granola: “4 paquetes, 2 barras cada uno — ¿cuántas barras?” Dibuja grupos primero.',
    },
  },
  {
    id: 'math-crew-fractions-intro',
    order: 2,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Unit fractions & parts of a whole (Grades 3–5)',
    cardEmoji: '½',
    en: {
      title: 'Parts of a Whole',
      summary: 'Understand fractions as equal parts of one whole.',
      objectives: ['Name unit fractions like 1/2, 1/3, 1/4', 'Explain numerator and denominator in kid language'],
      teachSections: [
        {
          heading: 'Share fairly',
          body: 'One brownie shared by 2 people: each gets one of two equal parts → one half (1/2). Equal parts matter.',
        },
        {
          heading: 'Words for parts',
          body: 'Denominator = how many equal parts in the whole. Numerator = how many parts we are talking about.',
        },
        {
          heading: 'Sparki model',
          body: 'Fold a paper strip in half, then in half again. Open it: four equal parts — fourths.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-frac-q1',
          prompt: 'If a pizza is cut into 4 equal slices and you eat 1 slice, you ate…',
          options: ['One fourth', 'The whole pizza', 'Two wholes'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q2',
          prompt: 'For fractions to make sense, parts should be…',
          options: ['Equal', 'Different sizes', 'Only triangles'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Cooking: “Fill the measuring cup halfway” connects to 1/2 in the real world.',
    },
    es: {
      title: 'Partes de un entero',
      summary: 'Entender fracciones como partes iguales de un todo.',
      objectives: ['Nombrar fracciones unitarias como 1/2, 1/3, 1/4', 'Explicar numerador y denominador con palabras sencillas'],
      teachSections: [
        {
          heading: 'Repartir justo',
          body: 'Un brownie para 2 personas: cada uno recibe una de dos partes iguales → una mitad (1/2). Las partes iguales importan.',
        },
        {
          heading: 'Palabras para las partes',
          body: 'Denominador = en cuántas partes iguales se divide el entero. Numerador = de cuántas partes hablamos.',
        },
        {
          heading: 'Modelo Sparki',
          body: 'Dobla una tira de papel por la mitad, y otra vez. Al abrir: cuatro partes iguales — cuartos.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-frac-q1',
          prompt: 'Si una pizza se corta en 4 rebanadas iguales y comes 1, comiste…',
          options: ['Un cuarto', 'La pizza entera', 'Dos enteros'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q2',
          prompt: 'Para que las fracciones tengan sentido, las partes deben ser…',
          options: ['Iguales', 'De distinto tamaño', 'Solo triángulos'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En la cocina: “Llena la taza hasta la mitad” conecta con 1/2 en la vida real.',
    },
  },
]

export function getSchoolMathLessonsForBand(band: AgeBandId): SchoolMathLesson[] {
  return SCHOOL_MATH_LESSONS.filter((l) => l.ageBands.includes(band)).sort((a, b) => a.order - b.order)
}

export function getSchoolMathLessonById(id: string): SchoolMathLesson | undefined {
  return SCHOOL_MATH_LESSONS.find((l) => l.id === id)
}

export function lessonLocale(lesson: SchoolMathLesson, locale: 'en' | 'es'): SchoolMathLessonLocale {
  return locale === 'es' ? lesson.es : lesson.en
}

export function isLessonInBand(lesson: SchoolMathLesson, band: AgeBandId): boolean {
  return lesson.ageBands.includes(band)
}
