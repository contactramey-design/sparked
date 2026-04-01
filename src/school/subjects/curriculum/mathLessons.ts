/**
 * School Math — append to `MATH_LESSONS`. See `../types.ts`.
 */
import type { SchoolSubjectLesson } from '../types'

export const MATH_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'math-tots-count-1-5',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: [
        'Mathematics / Number Sense: oral counting in sequence',
        'One-to-one correspondence while counting objects',
      ],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations mathematics number sense',
    },
    standardsNote: 'CA PTKLF Mathematics — Number Sense; counting (PK/TK)',
    cardEmoji: '🔢',
    en: {
      title: 'Counting 1 to 5 with Sparki',
      summary: 'Touch-count objects in order and say the number name.',
      objectives: ['Say number names 1–5 in order', 'Match one number to one object'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Numbers help us tell “how many.” Sparki lines up 5 blocks. We touch each block once and say: one, two, three, four, five.\n\nStable order matters: the count words must match objects in a line or circle so nothing is counted twice.',
          bullets: [
            'Say the sequence 1–5 aloud as a class before touching objects.',
            'Pair each touch with one spoken number—pause slightly between pairs.',
          ],
        },
        {
          heading: 'Try it',
          body: 'Hold up fingers as you count. Start at 1. Stop when you run out of objects. The last number you say is how many!\n\nIf you rearrange the objects, the total stays the same—conservation of number is the deeper idea you are previewing.',
          bullets: [
            'Try “count on” from 1 with a small set, then scatter the objects and count again.',
            'Ask: “Did we still get the same last number?”',
          ],
        },
        {
          heading: 'Teacher tip',
          body: 'Use classroom objects (crayons, counters). Slow counting beats fast guessing.\n\nWatch for sub-vocal skipping—some students mouth numbers faster than their finger moves.',
          bullets: [
            'Use a 5-frame or ten-frame to bound the set when beginners lose track.',
            'Celebrate self-corrections when a child notices a double-count.',
          ],
        },
        {
          heading: 'Formative check',
          body: 'Ask: “Show me 4 cubes—touch and count aloud.” If a child skips or double-touches, model finger-tracking slowly.\n\nExtend with “Which is more, 4 or 3?” after they count two separate piles—links cardinality to comparison.',
          bullets: [
            'Note whether the last word said matches the pile you asked for.',
            'If wrong, have them re-count with a slower partner or teacher finger.',
          ],
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
        {
          id: 'math-tots-count-1-5-q3',
          prompt: 'The last number you say when you count tells…',
          options: ['How many are in the set', 'Only the biggest object', 'What time lunch is'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q4',
          prompt: 'Sparki counts: 1, 2, 3, 4, 5. How many objects did Sparki count?',
          options: ['5', '4', '3'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q5',
          prompt: 'Which choice shows one-to-one counting?',
          options: [
            'Touch each block once while saying the next number',
            'Say numbers fast without touching',
            'Skip every other object',
          ],
          correctIndex: 0,
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
          body: 'Los números nos dicen “cuántos.” Sparki alinea 5 bloques. Tocamos cada bloque una vez y decimos: uno, dos, tres, cuatro, cinco.\n\nEl orden estable importa: cada palabra va con un objeto, sin saltos ni repeticiones.',
          bullets: [
            'Digan juntos la secuencia 1–5 antes de tocar objetos.',
            'Cada toque con un número — pausa breve entre pares.',
          ],
        },
        {
          heading: 'Pruébalo',
          body: 'Levanta dedos mientras cuentas. Empieza en 1. Para cuando se acaben los objetos. ¡El último número es cuántos hay!\n\nSi mueves los objetos, el total puede ser el mismo — es la idea de conservación del número.',
          bullets: [
            'Cuenta un montoncito, luego desparrama y cuenta otra vez.',
            'Pregunta: “¿Seguimos llegando al mismo último número?”',
          ],
        },
        {
          heading: 'Tip para el maestro',
          body: 'Usa objetos del salón (crayones, fichas). Contar despacio es mejor que adivinar rápido.\n\nOjo con quien dice números más rápido que mueve el dedo.',
          bullets: [
            'Un marco de 5 o 10 acota el conjunto si pierden el hilo.',
            'Celebra cuando se corrigen solos tras un doble conteo.',
          ],
        },
        {
          heading: 'Comprobación formativa',
          body: 'Pide: “Muéstrame 4 cubos—toca y cuenta en voz alta.” Si saltan o tocan dos veces, modela lento con el dedo.\n\nAmplía con “¿Qué hay más, 4 o 3?” tras contar dos montones — enlaza cardinalidad y comparación.',
          bullets: [
            'Fíjate si la última palabra coincide con la cantidad pedida.',
            'Si fallan, que cuenten otra vez contigo señalando despacio.',
          ],
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
        {
          id: 'math-tots-count-1-5-q3',
          prompt: 'El último número que dices al contar dice…',
          options: ['Cuántos hay en total', 'Solo el objeto más grande', 'La hora del recreo'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q4',
          prompt: 'Sparki cuenta: 1, 2, 3, 4, 5. ¿Cuántos objetos contó?',
          options: ['5', '4', '3'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-count-1-5-q5',
          prompt: '¿Qué es contar uno a uno?',
          options: [
            'Tocar cada bloque una vez mientras dices el siguiente número',
            'Decir números rápido sin tocar',
            'Saltarse cada dos objetos',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En la merienda, cuenten juntos las galletas en el plato: un toque, un número.',
    },
  },
  {
    id: 'math-tots-patterns',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Algebra & Functions: recognize and duplicate simple repeating patterns', 'Sort and classify by attribute'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations algebra functions pattern',
    },
    standardsNote: 'CA PTKLF Math — Algebra & Functions; repeating patterns (PK/TK)',
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
        {
          heading: 'Differentiation',
          body: 'Start with AB; invite ready learners to try AAB or ABC. Keep patterns visible on a sentence strip for reference.',
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
        {
          id: 'math-tots-patterns-q3',
          prompt: 'In yellow, yellow, green, yellow, yellow, green, what comes next?',
          options: ['Yellow', 'Purple', 'Orange'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q4',
          prompt: 'The “unit” in an AB pattern is…',
          options: ['The part that repeats (A then B)', 'Only the first color', 'The longest word'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q5',
          prompt: 'Which shows a repeating pattern?',
          options: ['Circle, square, circle, square', 'Random stickers mixed up', 'One color only'],
          correctIndex: 0,
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
        {
          heading: 'Diferenciación',
          body: 'Empieza con AB; los que avanzan prueban AAB o ABC. Deja el patrón visible en una tira.',
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
        {
          id: 'math-tots-patterns-q3',
          prompt: 'En amarillo, amarillo, verde, amarillo, amarillo, verde, ¿qué sigue?',
          options: ['Amarillo', 'Morado', 'Naranja'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q4',
          prompt: 'La “unidad” en un patrón AB es…',
          options: ['La parte que se repite (A y luego B)', 'Solo el primer color', 'La palabra más larga'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-patterns-q5',
          prompt: '¿Cuál muestra un patrón que se repite?',
          options: ['Círculo, cuadrado, círculo, cuadrado', 'Calcomanías mezcladas al azar', 'Un solo color'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Ordena zapatos por color en un patrón para un paseo matemático rápido.',
    },
  },
  {
    id: 'math-kids-add-within-10',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['1.OA.A.1', '1.OA.C.5'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core 1.OA.A.1',
    },
    standardsNote: 'CA CCSS Math Gr.1; operations & algebraic thinking; 1.OA.A.1',
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
        {
          heading: 'Academic language',
          body: 'Model words: “part,” “whole,” “in all,” “altogether.” They appear in story problems on assessments.',
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
        {
          id: 'math-kids-add-q4',
          prompt: 'Maya has 6 pencils. Her teacher gives 2 more. Which expression fits?',
          options: ['6 + 2', '6 − 2', '2 + 2 + 2'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-add-q5',
          prompt: 'Which strategy matches “count on”?',
          options: [
            'Start at the bigger number and count up',
            'Always start at zero only',
            'Guess without counting',
          ],
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
        {
          heading: 'Lenguaje académico',
          body: 'Modela: “parte,” “todo,” “en total,” “juntos.” Aparecen en problemas verbales.',
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
        {
          id: 'math-kids-add-q4',
          prompt: 'Maya tiene 6 lápices. La maestra da 2 más. ¿Qué expresión encaja?',
          options: ['6 + 2', '6 − 2', '2 + 2 + 2'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-add-q5',
          prompt: '¿Qué es “contar desde”?',
          options: [
            'Empezar en el número mayor y seguir contando',
            'Siempre empezar solo en cero',
            'Adivinar sin contar',
          ],
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
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['1.G.A.1', '1.G.A.2'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core 1.G.A.1 geometry',
    },
    standardsNote: 'CA CCSS Math Gr.1; geometry; 1.G.A.1',
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
        {
          heading: 'Attributes over color',
          body: 'Sort by defining attributes (sides, vertices) rather than color so students generalize shape ideas.',
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
        {
          id: 'math-kids-shapes-q3',
          prompt: 'A rectangle has how many corners (vertices)?',
          options: ['4', '3', '0'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-shapes-q4',
          prompt: 'Which shape has no straight sides?',
          options: ['Circle', 'Triangle', 'Square'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-shapes-q5',
          prompt: 'Why might two triangles look different but still both be triangles?',
          options: [
            'They still have 3 straight sides',
            'They must be the same color',
            'They must be huge',
          ],
          correctIndex: 0,
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
        {
          heading: 'Atributos, no solo color',
          body: 'Clasifica por lados y vértices, no solo por color, para generalizar la idea de figura.',
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
        {
          id: 'math-kids-shapes-q3',
          prompt: '¿Cuántas esquinas (vértices) tiene un rectángulo?',
          options: ['4', '3', '0'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-shapes-q4',
          prompt: '¿Qué figura no tiene lados rectos?',
          options: ['Círculo', 'Triángulo', 'Cuadrado'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-shapes-q5',
          prompt: '¿Por qué dos triángulos pueden verse distintos y ser triángulos?',
          options: [
            'Porque ambos tienen 3 lados rectos',
            'Porque deben ser del mismo color',
            'Porque deben ser enormes',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Caza de figuras: busca rectángulos (puertas) y círculos (relojes) en el salón.',
    },
  },
  {
    id: 'math-crew-multiply-thinking',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['3.OA.A.1', '3.OA.A.3'],
      gradeSpan: '3',
      cdeSearchQuery: 'California Common Core 3.OA.A.1',
    },
    standardsNote: 'CA CCSS Math Gr.3; interpret products; 3.OA.A.1',
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
        {
          id: 'math-crew-mult-q4',
          prompt: 'Which matches 3 × 2?',
          options: ['3 + 3', '2 + 2 + 2 + 2', '3 + 2'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-mult-q5',
          prompt: 'An array with 4 rows and 3 in each row shows…',
          options: ['4 × 3 = 12', '4 + 3 = 7', '4 − 3 = 1'],
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
        {
          id: 'math-crew-mult-q4',
          prompt: '¿Qué va con 3 × 2?',
          options: ['3 + 3', '2 + 2 + 2 + 2', '3 + 2'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-mult-q5',
          prompt: 'Un arreglo con 4 filas y 3 en cada fila muestra…',
          options: ['4 × 3 = 12', '4 + 3 = 7', '4 − 3 = 1'],
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
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['3.NF.A.1', '4.NF.A.1'],
      gradeSpan: '3–4',
      cdeSearchQuery: 'California Common Core 3.NF.A.1 fractions',
    },
    standardsNote: 'CA CCSS Math Gr.3–4; fractions as parts of a whole; 3.NF.A.1',
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
        {
          heading: 'Number line preview',
          body: 'Place 0, 1/2, and 1 on a line from 0 to 1. Fractions are numbers with places between wholes.',
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
        {
          id: 'math-crew-frac-q3',
          prompt: 'In 3/4, the 4 tells us…',
          options: ['The whole is split into 4 equal parts', 'We skip 4 numbers', 'The answer is 4 wholes'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q4',
          prompt: 'Which fraction is larger if the wholes are the same size?',
          options: ['3/4', '1/4', 'They are always equal'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q5',
          prompt: 'A fair share of one brownie for two friends is…',
          options: ['Two equal halves', 'One friend gets the whole', 'Ignore fairness'],
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
        {
          heading: 'Recta numérica',
          body: 'Ubica 0, 1/2 y 1 entre 0 y 1. Las fracciones son números con lugares entre enteros.',
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
        {
          id: 'math-crew-frac-q3',
          prompt: 'En 3/4, el 4 nos dice…',
          options: [
            'El entero se parte en 4 partes iguales',
            'Saltamos 4 números',
            'La respuesta son 4 enteros',
          ],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q4',
          prompt: 'Si los enteros son del mismo tamaño, ¿qué fracción es mayor?',
          options: ['3/4', '1/4', 'Siempre son iguales'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-frac-q5',
          prompt: 'Un reparto justo de un brownie para dos amigos es…',
          options: ['Dos mitades iguales', 'Un amigo se come todo', 'Ignorar lo justo'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En la cocina: “Llena la taza hasta la mitad” conecta con 1/2 en la vida real.',
    },
  },
  {
    id: 'math-tots-more-less-same',
    order: 3,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Number Sense: compare small sets; more, less, same'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations mathematics compare sets',
    },
    standardsNote: 'CA PTKLF Math — compare quantities; more/less/same (PK/TK)',
    cardEmoji: '⚖️',
    en: {
      title: 'More, Less, or the Same?',
      summary: 'Compare two small groups and use “more,” “less,” and “the same.”',
      objectives: ['Match groups that show the same amount', 'Tell which group has more or fewer'],
      teachSections: [
        {
          heading: 'Line them up',
          body: 'Put two groups in two lines, one-to-one. If every bear has a friend across, the groups are the same. If one line has an extra, that line has more.',
        },
        {
          heading: 'Words we use',
          body: 'More means a bigger amount. Less (or fewer) means a smaller amount. The same means equal amounts—same last count.',
        },
        {
          heading: 'Sparki match',
          body: 'Sparki holds 4 blocks; you hold 4 blocks. Same! Sparki adds one—now Sparki has more.',
        },
        {
          heading: 'Avoid tricks',
          body: 'Spreading blocks out does not change how many—preview conservation by re-counting after spreading.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-more-q1',
          prompt: 'You have 3 stickers. Your friend has 3 stickers. The amounts are…',
          options: ['The same', 'You have more', 'Your friend has more'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q2',
          prompt: 'Which word fits: “I have 5 crackers and you have 2. I have ___.”',
          options: ['More', 'Less', 'Zero'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q3',
          prompt: 'To check if two groups are the same, a good way is…',
          options: ['Match one-to-one and see if any are left over', 'Only look at color', 'Close your eyes'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q4',
          prompt: 'You have fewer than 6 cubes. Which could be your number?',
          options: ['4', '7', '10'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q5',
          prompt: 'After you spread your blocks in a long line, the number of blocks…',
          options: ['Stays the same if you did not add or remove', 'Always becomes zero', 'Always doubles'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Snack plates: “Who has more carrots?” Match one-to-one to prove it.',
    },
    es: {
      title: '¿Más, menos o igual?',
      summary: 'Compara dos grupos pequeños y usa “más,” “menos” e “igual.”',
      objectives: ['Emparejar grupos con la misma cantidad', 'Decir cuál grupo tiene más o menos'],
      teachSections: [
        {
          heading: 'Alinea',
          body: 'Dos filas, uno a uno. Si cada oso tiene amigo enfrente, las cantidades son iguales. Si sobra uno, esa fila tiene más.',
        },
        {
          heading: 'Palabras',
          body: 'Más = cantidad mayor. Menos = cantidad menor. Igual = misma cantidad — mismo último número al contar.',
        },
        {
          heading: 'Sparki',
          body: 'Sparki tiene 4 bloques; tú 4. ¡Iguales! Sparki agrega uno — ahora Sparki tiene más.',
        },
        {
          heading: 'Sin trampas',
          body: 'Esparcir bloques no cambia cuántos hay — vuelve a contar tras esparcir.',
        },
      ],
      quiz: [
        {
          id: 'math-tots-more-q1',
          prompt: 'Tienes 3 calcomanías. Tu amigo tiene 3. Las cantidades son…',
          options: ['Iguales', 'Tú tienes más', 'Tu amigo tiene más'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q2',
          prompt: '“Tengo 5 galletas y tú 2. Yo tengo ___.”',
          options: ['Más', 'Menos', 'Cero'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q3',
          prompt: 'Para ver si dos grupos son iguales, conviene…',
          options: ['Emparejar uno a uno y ver si sobra', 'Solo mirar el color', 'Cerrar los ojos'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q4',
          prompt: 'Tienes menos de 6 cubos. ¿Cuál podría ser tu número?',
          options: ['4', '7', '10'],
          correctIndex: 0,
        },
        {
          id: 'math-tots-more-q5',
          prompt: 'Si esparces los bloques en una fila larga, la cantidad…',
          options: ['Se mantiene si no quitas ni pones', 'Siempre es cero', 'Siempre se duplica'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Platos: “¿Quién tiene más zanahorias?” Empareja uno a uno.',
    },
  },
  {
    id: 'math-kids-subtract-within-10',
    order: 3,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['1.OA.A.1', '1.OA.C.6'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core 1.OA.A.1 subtraction',
    },
    standardsNote: 'CA CCSS Math Gr.1; take-apart and compare; subtraction within 10',
    cardEmoji: '➖',
    en: {
      title: 'Take-Away Stories Within 10',
      summary: 'Model subtraction as separating or finding how many more/less.',
      objectives: ['Represent subtraction with objects and drawings', 'Relate “take away” and “difference” to −'],
      teachSections: [
        {
          heading: 'Two meanings',
          body: 'Take away: start with 8 cubes, remove 3, how many left? Compare: Maya has 7 stickers, Jon has 4—how many more does Maya have? Both can use subtraction.',
        },
        {
          heading: 'Count back',
          body: 'For take-away, count backward from the start: 8…7,6,5 (three steps) → 5 left.',
        },
        {
          heading: 'Relate to addition',
          body: 'If 5 + 3 = 8, then 8 − 3 = 5. Fact families help check your work.',
        },
        {
          heading: 'Draw a story',
          body: 'Sparki crosses out circles for items taken away—leftovers show the answer clearly.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-sub-q1',
          prompt: '9 − 4 equals…',
          options: ['4', '5', '6'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q2',
          prompt: 'Which story fits 7 − 2?',
          options: [
            '7 birds join 2 more birds',
            '7 apples, 2 are eaten—how many left?',
            'Double 7',
          ],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q3',
          prompt: 'Subtraction can mean…',
          options: ['Take away from a group', 'Always make a bigger number', 'Only count by tens'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-sub-q4',
          prompt: 'If 6 + 4 = 10, then 10 − 4 =',
          options: ['4', '6', '14'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q5',
          prompt: 'A good drawing for 8 − 3 might show…',
          options: ['8 circles with 3 crossed out', 'Only the number 8', 'Three empty boxes only'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Lunch: “We had 10 napkins; we used 3. How many left?”',
    },
    es: {
      title: 'Historias de quitar hasta 10',
      summary: 'Modela la resta como separar o hallar cuántos más o menos.',
      objectives: ['Representar resta con objetos y dibujos', 'Relacionar “quitar” y “diferencia” con −'],
      teachSections: [
        {
          heading: 'Dos significados',
          body: 'Quitar: empiezas con 8 cubos, quitas 3, ¿cuántos quedan? Comparar: Maya tiene 7 calcomanías, Jon 4 — ¿cuántas más Maya? Ambas pueden usar resta.',
        },
        {
          heading: 'Contar hacia atrás',
          body: 'Para quitar, cuenta desde el inicio: 8…7,6,5 (tres pasos) → quedan 5.',
        },
        {
          heading: 'Relación con la suma',
          body: 'Si 5 + 3 = 8, entonces 8 − 3 = 5. Las familias de operaciones ayudan a comprobar.',
        },
        {
          heading: 'Dibuja el cuento',
          body: 'Sparki tacha círculos de lo que se fue — lo que queda muestra la respuesta.',
        },
      ],
      quiz: [
        {
          id: 'math-kids-sub-q1',
          prompt: '9 − 4 es igual a…',
          options: ['4', '5', '6'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q2',
          prompt: '¿Qué historia va con 7 − 2?',
          options: [
            '7 pájaros se unen a 2 más',
            '7 manzanas, 2 se comen — ¿cuántas quedan?',
            'El doble de 7',
          ],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q3',
          prompt: 'Restar puede significar…',
          options: ['Quitar de un grupo', 'Siempre agrandar el número', 'Solo contar de 10 en 10'],
          correctIndex: 0,
        },
        {
          id: 'math-kids-sub-q4',
          prompt: 'Si 6 + 4 = 10, entonces 10 − 4 =',
          options: ['4', '6', '14'],
          correctIndex: 1,
        },
        {
          id: 'math-kids-sub-q5',
          prompt: 'Un buen dibujo para 8 − 3 muestra…',
          options: ['8 círculos con 3 tachados', 'Solo el número 8', 'Solo tres cajas vacías'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Almuerzo: “Había 10 servilletas; usamos 3. ¿Cuántas quedan?”',
    },
  },
  {
    id: 'math-crew-area-tiles',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CCSS_MATH',
      codes: ['3.MD.C.5', '3.MD.C.6'],
      gradeSpan: '3',
      cdeSearchQuery: 'California Common Core 3.MD.C.5 area unit squares',
    },
    standardsNote: 'CA CCSS Math Gr.3; area as covering with unit squares',
    cardEmoji: '▦',
    en: {
      title: 'Area with Unit Squares',
      summary: 'Cover a rectangle with tiles and count square units.',
      objectives: ['Explain area as the number of unit squares that cover a flat shape', 'Count or multiply rows × columns in a grid'],
      teachSections: [
        {
          heading: 'Cover, don’t guess',
          body: 'Area measures how much flat space is covered. We use square tiles that do not overlap or leave holes—each tile is one square unit.',
        },
        {
          heading: 'Rows and columns',
          body: 'A 4-by-3 grid has 4 rows of 3 squares: 4 × 3 = 12 square units. Trace a row with your finger, then count how many rows.',
        },
        {
          heading: 'Label units',
          body: 'Always say “square units” or “square centimeters” so area is not confused with length around the edge (perimeter).',
        },
        {
          heading: 'Compare areas',
          body: 'Two shapes can look different but have the same area if they use the same number of unit squares—rearranging does not change the count.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-area-q1',
          prompt: 'Area tells us…',
          options: [
            'How much surface is covered inside a shape',
            'How long the boundary is only',
            'How heavy an object is',
          ],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q2',
          prompt: 'A rectangle is covered by 5 rows of 2 unit squares. The area is…',
          options: ['10 square units', '7 square units', '5 square units'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q3',
          prompt: 'Which tool idea matches area best?',
          options: ['Square tiles that cover a region', 'A ruler only along one side', 'A stopwatch'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q4',
          prompt: 'If you count 12 unit squares inside a shape, its area is…',
          options: ['12 square units', '12 inches only', '12 cubes of volume'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q5',
          prompt: 'Perimeter is…',
          options: [
            'Distance around the outside of a shape',
            'The same word as area',
            'Only used for circles',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Floor tiles in the classroom—count how many in one row and one column to estimate area.',
    },
    es: {
      title: 'Área con cuadrados unitarios',
      summary: 'Cubre un rectángulo con fichas y cuenta unidades cuadradas.',
      objectives: ['Explicar el área como cantidad de cuadrados que cubren una figura', 'Contar o multiplicar filas × columnas'],
      teachSections: [
        {
          heading: 'Cubrir, no adivinar',
          body: 'El área mide cuánta superficie plana se cubre. Usamos fichas cuadradas sin solapar ni dejar huecos — cada una es una unidad cuadrada.',
        },
        {
          heading: 'Filas y columnas',
          body: 'Una cuadrícula 4 por 3 tiene 4 filas de 3 cuadrados: 4 × 3 = 12 unidades cuadradas.',
        },
        {
          heading: 'Etiqueta unidades',
          body: 'Di “unidades cuadradas” o “centímetros cuadrados” para no confundir con el perímetro.',
        },
        {
          heading: 'Comparar áreas',
          body: 'Dos figuras pueden verse distintas y tener la misma área si usan el mismo número de cuadrados.',
        },
      ],
      quiz: [
        {
          id: 'math-crew-area-q1',
          prompt: 'El área nos dice…',
          options: [
            'Cuánta superficie cubre el interior de una figura',
            'Solo cuán largo es el borde',
            'Qué tan pesado es un objeto',
          ],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q2',
          prompt: 'Un rectángulo tiene 5 filas de 2 cuadrados unitarios. El área es…',
          options: ['10 unidades cuadradas', '7 unidades cuadradas', '5 unidades cuadradas'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q3',
          prompt: '¿Qué encaja mejor con área?',
          options: ['Fichas cuadradas que cubren una región', 'Solo regla en un lado', 'Cronómetro'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q4',
          prompt: 'Si cuentas 12 cuadrados unitarios dentro de una figura, el área es…',
          options: ['12 unidades cuadradas', 'Solo 12 pulgadas', '12 cubos de volumen'],
          correctIndex: 0,
        },
        {
          id: 'math-crew-area-q5',
          prompt: 'El perímetro es…',
          options: [
            'La distancia alrededor de una figura',
            'Lo mismo que área',
            'Solo para círculos',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Baldosas del salón: cuenta cuántas en una fila y una columna.',
    },
  },
]
