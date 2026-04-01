import type { BilingualTeacherPack } from '../types'

export const MATH_TEACHER_PACKS: Record<string, BilingualTeacherPack> = {
  'math-tots-count-1-5': {
    en: {
      conceptualDeepDive:
        'Cardinality is the idea that the last number you say tells how many are in the set—not just a chant. Pair this with one-to-one correspondence: each object touched once, in order, with one number name. Watch for double-counting and skipping; both break the link between quantity and the number word. Use real classroom objects and slow modeling so students hear, see, and feel the rhythm of stable order.',
      vocabularyTerms: [
        { term: 'One-to-one correspondence', definition: 'Each object is tagged with exactly one count word, in order.' },
        { term: 'Stable order', definition: 'Count words are always spoken in the same sequence (1, 2, 3…).' },
        { term: 'Cardinality', definition: 'The last number tells how many in the whole set.' },
        { term: 'Subitize (preview)', definition: 'Recognizing small amounts without counting—optional extension for 1–3.' },
      ],
      sayThisAloud:
        'Watch my finger—I touch one block and say “one.” I touch the next and say “two.” I did not skip any, and I did not touch the same block twice. The last number I said is how many blocks there are. Let’s try together, slower than usual.',
      misconceptions: [
        {
          myth: 'Faster counting is always better.',
          correction: 'Accuracy beats speed. Slow, synchronized touch-and-say builds a reliable count.',
        },
        {
          myth: 'The last number only names the last object.',
          correction: 'Name it as the whole amount: “There are five bears,” not only “this is five.”',
        },
      ],
      supportEmergingLearners:
        'Use five or fewer objects; arrange in a line. Pair the child with an adult hand guiding finger taps. Accept whispered or echoed counts. If they lose track, reset and count aloud together once before they try alone.',
      extendForDepth:
        'Ask “How many if I spread these out?” after counting in a tight group to preview conservation. Compare two sets: “Which has more?” after counting each. Introduce a five-frame to bound the set.',
      extraPracticeIdeas: [
        'Count classroom objects during transitions (chairs, crayons in a cup).',
        'Error analysis: show a wrong count on the board and fix it as a class.',
        'Send-home note: “Count 5 spoons at dinner—touch each once.”',
      ],
    },
    es: {
      conceptualDeepDive:
        'La cardinalidad es que el último número dice cuántos hay, no solo un canto. Va de la mano con la correspondencia uno a uno: cada objeto tocado una vez, en orden, con un nombre de número. Evita contar dos veces o saltar; ambos rompen el vínculo entre cantidad y palabra. Usa objetos reales del salón y modelado lento para que vean, oigan y sientan el orden estable.',
      vocabularyTerms: [
        { term: 'Correspondencia uno a uno', definition: 'Cada objeto recibe exactamente un número, en orden.' },
        { term: 'Orden estable', definition: 'Los números se dicen siempre en la misma secuencia (1, 2, 3…).' },
        { term: 'Cardinalidad', definition: 'El último número dice cuántos hay en todo el conjunto.' },
        { term: 'Subitizar (avance)', definition: 'Reconocer cantidades pequeñas sin contar—opcional con 1–3.' },
      ],
      sayThisAloud:
        'Miren mi dedo—toco un bloque y digo “uno.” Toco el siguiente y digo “dos.” No salté ninguno ni toqué dos veces el mismo. El último número que digo es cuántos bloques hay. Probemos juntos, más despacio de lo normal.',
      misconceptions: [
        {
          myth: 'Contar muy rápido es mejor.',
          correction: 'La precisión importa más. Toque y palabra lentos construyen un conteo confiable.',
        },
        {
          myth: 'El último número solo nombra el último objeto.',
          correction: 'Nombrar el total: “Hay cinco osos,” no solo “esto es cinco.”',
        },
      ],
      supportEmergingLearners:
        'Cinco objetos o menos; fila recta. Guía el dedo con un adulto. Acepta eco o susurro. Si pierden el hilo, cuenten juntos una vez y reintenten.',
      extendForDepth:
        'Después de contar junto, desparrama: “¿Sigue habiendo la misma cantidad?” Compara dos montones tras contar. Usa marco de cinco.',
      extraPracticeIdeas: [
        'Contar objetos en transiciones (sillas, crayones).',
        'Analizar un conteo incorrecto en la pizarra y corregirlo.',
        'Nota para casa: “Cuenta 5 cucharas en la cena—toca cada una.”',
      ],
    },
  },
  'math-tots-patterns': {
    en: {
      conceptualDeepDive:
        'Patterns are predictable repeats—core to early algebra. Help children notice the “unit of repeat” (AB, AAB, ABC) and extend it before naming it abstractly. Use color, sound, and motion so the pattern is multisensory. Mistakes often come from copying only the last piece instead of the whole cycle; explicitly mark the repeating chunk.',
      vocabularyTerms: [
        { term: 'Unit of repeat', definition: 'The smallest chunk that copies over and over (e.g., red-blue in AB).' },
        { term: 'Extend', definition: 'Continue the same rule so the rhythm stays the same.' },
        { term: 'Core / stem', definition: 'Another name for the repeating part teachers sometimes use.' },
        { term: 'Generalize', definition: 'Recognize the same pattern in new colors or sounds.' },
      ],
      sayThisAloud:
        'Listen: red, blue, red, blue. The part that repeats is red-blue, red-blue. If I hide the next spot, what color must come next to keep the pattern fair? Let’s say the whole repeat out loud before we answer.',
      misconceptions: [
        {
          myth: 'Any two colors in a row mean “pattern.”',
          correction: 'A pattern needs a predictable rule you can continue—not random alternation.',
        },
        {
          myth: 'Copying the last bead is enough.',
          correction: 'Students must rehearse the full unit of repeat, not only the final item.',
        },
      ],
      supportEmergingLearners:
        'Keep AB only; use large manipulatives. Chant the pattern while pointing. Cover the next slot and reveal after the group says the repeat.',
      extendForDepth:
        'Introduce AAB or ABC with clear color coding. Ask students to label the unit in words. Transfer to clap–snap patterns.',
      extraPracticeIdeas: [
        'Pattern walk: stomp–clap down the hall.',
        'Wrong pattern repair: fix a deliberate mistake together.',
        'Draw the next two units on paper.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Los patrones son repeticiones predecibles — base del álgebra temprana. Ayuda a notar la “unidad que se repite” (AB, AAB, ABC) y a extenderla antes de nombrarla en abstracto. Usa color, sonido y movimiento. Un error común es copiar solo el último trozo en vez de todo el ciclo; señala explícitamente el bloque que se repite.',
      vocabularyTerms: [
        { term: 'Unidad que se repite', definition: 'El trozo mínimo que se copia una y otra vez (ej. rojo-azul en AB).' },
        { term: 'Extender', definition: 'Seguir la misma regla para que el ritmo se mantenga.' },
        { term: 'Núcleo / tallo', definition: 'Otro nombre para la parte repetida.' },
        { term: 'Generalizar', definition: 'Ver el mismo patrón con otros colores o sonidos.' },
      ],
      sayThisAloud:
        'Escuchen: rojo, azul, rojo, azul. Lo que se repite es rojo-azul, rojo-azul. Si tapo el siguiente, ¿qué color sigue para que sea justo? Digamos juntos la unidad antes de responder.',
      misconceptions: [
        {
          myth: 'Dos colores seguidos siempre son patrón.',
          correction: 'Hace falta una regla predecible que puedas continuar, no azar.',
        },
        {
          myth: 'Basta copiar la última pieza.',
          correction: 'Hay que practicar la unidad completa, no solo el último elemento.',
        },
      ],
      supportEmergingLearners:
        'Solo AB; fichas grandes. Canten señalando. Tapa el siguiente hueco y revela tras decir la unidad.',
      extendForDepth:
        'AAB o ABC con colores claros. Que nombren la unidad. Pasa a palmadas–chasquidos.',
      extraPracticeIdeas: [
        'Patrón en el pasillo: pisada–palma.',
        'Reparar un patrón incorrecto a propósito.',
        'Dibujar las dos siguientes unidades.',
      ],
    },
  },
  'math-kids-add-within-10': {
    en: {
      conceptualDeepDive:
        'Addition within 10 builds on composing and decomposing numbers (make-a-ten, doubles, near-doubles). Represent with objects, drawings, and number sentences together so symbols stay tied to meaning. Stress that addition combines parts into a whole; common confusion is treating the plus sign as “next number to say” without joining quantities.',
      vocabularyTerms: [
        { term: 'Compose / decompose', definition: 'Put numbers together or break them apart (e.g., 7 is 3 and 4).' },
        { term: 'Count on', definition: 'Start from the larger part and count up by the smaller part.' },
        { term: 'Sum', definition: 'The whole amount after combining parts.' },
        { term: 'Addend', definition: 'Each part being joined in an addition expression.' },
      ],
      sayThisAloud:
        'I have 5 cubes in this hand and 2 in this hand. Addition means I put them together and ask how many in all. I can count on from 5: six, seven. I can also draw 5 and 2 and count all. The equation 5 + 2 = 7 tells the same story.',
      misconceptions: [
        {
          myth: 'The + sign means “the next number in counting.”',
          correction: '+ joins two quantities; both parts must be represented before finding the total.',
        },
        {
          myth: 'Bigger answer always means correct.',
          correction: 'Match the story: “2 more than 6” is 8, not just any larger number.',
        },
      ],
      supportEmergingLearners:
        'Keep totals under 8 first if needed. Use two-color counters and a ten-frame. Act out “join” with a story mat before writing the equation.',
      extendForDepth:
        'Pose missing-addend stories (“I need 10; I have 7; how many more?”). Compare 4+4 and 5+3. Record multiple strategies and discuss efficiency.',
      extraPracticeIdeas: [
        'Number talks: show a dot image and ask how they see the total.',
        'Write a word problem to match 3 + 5.',
        'Fluency sprint with make-ten cards (friendly pairs).',
      ],
    },
    es: {
      conceptualDeepDive:
        'Sumar hasta 10 se apoya en componer y descomponer (hacer diez, dobles, casi dobles). Representa con objetos, dibujos y expresiones numéricas para que los símbolos tengan sentido. La suma une partes en un todo; un error frecuente es tratar el + como “siguiente número” sin juntar cantidades.',
      vocabularyTerms: [
        { term: 'Componer / descomponer', definition: 'Juntar o partir números (ej. 7 es 3 y 4).' },
        { term: 'Contar desde', definition: 'Empezar en la parte mayor y subir la menor.' },
        { term: 'Suma', definition: 'El total al juntar partes.' },
        { term: 'Sumando', definition: 'Cada parte que se junta en una suma.' },
      ],
      sayThisAloud:
        'Tengo 5 cubos aquí y 2 acá. Sumar es juntarlos y preguntar cuántos en total. Puedo contar desde 5: seis, siete. O dibujar 5 y 2 y contar todo. 5 + 2 = 7 cuenta la misma historia.',
      misconceptions: [
        {
          myth: 'El + es “el número que sigue al contar.”',
          correction: '+ junta dos cantidades; hay que mostrar ambas partes antes del total.',
        },
        {
          myth: 'Respuesta más grande siempre es correcta.',
          correction: 'Que cuadre con el cuento: “2 más que 6” es 8.',
        },
      ],
      supportEmergingLearners:
        'Totales bajo 8 si hace falta. Fichas bicolor y marco de 10. Representen “juntar” antes de escribir.',
      extendForDepth:
        'Suma oculta (“Necesito 10; tengo 7; ¿cuánto más?”). Comparen 4+4 y 5+3. Varias estrategias en la pizarra.',
      extraPracticeIdeas: [
        'Charla numérica con imagen de puntos.',
        'Inventen un problema para 3 + 5.',
        'Pares amigos del 10 con tarjetas.',
      ],
    },
  },
  'math-kids-shapes': {
    en: {
      conceptualDeepDive:
        'Geometry at this level mixes naming shapes with describing attributes (sides, vertices, curves). Distinguish examples from non-examples: a “triangle” must be closed with three straight sides. Rotate shapes and use different sizes so students generalize the definition, not a single prototype. Connect to the world—signs, tiles, book covers.',
      vocabularyTerms: [
        { term: 'Attribute', definition: 'A property you can describe (sides, vertices, color is not defining).' },
        { term: 'Vertex / vertices', definition: 'Corners where sides meet.' },
        { term: 'Closed figure', definition: 'The shape boundary connects back to the start with no gaps.' },
        { term: 'Non-example', definition: 'A shape that looks “almost” right but breaks a rule—powerful for definitions.' },
      ],
      sayThisAloud:
        'This is a triangle because it is closed and has three straight sides. If I tilt it, is it still a triangle? Yes—the name follows the rule, not the direction on the page. This open shape is a non-example: it is not closed.',
      misconceptions: [
        {
          myth: 'Triangles always sit on a flat base.',
          correction: 'Orientation does not change the shape name if the defining attributes hold.',
        },
        {
          myth: '“Thinner” means not a rectangle.',
          correction: 'A long skinny rectangle is still a rectangle if it has four right angles and opposite sides equal.',
        },
      ],
      supportEmergingLearners:
        'Use tracing and toothpick builds. Sort physical shapes into hoops labeled with rules, not only names. Start with triangle vs circle before quadrilaterals.',
      extendForDepth:
        'Compose shapes (two triangles make a rhombus). Draw shapes on dot paper. Sort hierarchy: squares are special rectangles.',
      extraPracticeIdeas: [
        'Shape scavenger hunt with attribute checklist.',
        'Build on geoboards and justify with a sentence frame.',
        'Which one doesn’t belong? (multiple valid reasons)',
      ],
    },
    es: {
      conceptualDeepDive:
        'La geometría aquí mezcla nombrar figuras con describir atributos (lados, vértices, curvas). Separa ejemplos de no ejemplos: un triángulo es cerrado con tres lados rectos. Gira figuras y usa distintos tamaños para generalizar la definición. Conecta con señales, baldosas, portadas.',
      vocabularyTerms: [
        { term: 'Atributo', definition: 'Propiedad que describes (lados, vértices; el color no define).' },
        { term: 'Vértice / vértices', definition: 'Esquinas donde se encuentran los lados.' },
        { term: 'Figura cerrada', definition: 'El contorno vuelve al inicio sin aberturas.' },
        { term: 'No ejemplo', definition: 'Casi correcto pero rompe una regla—útil para definir.' },
      ],
      sayThisAloud:
        'Esto es un triángulo porque está cerrado y tiene tres lados rectos. Si lo inclino, ¿sigue siendo triángulo? Sí—el nombre sigue la regla, no cómo está en la hoja. Esta figura abierta no es ejemplo: no está cerrada.',
      misconceptions: [
        {
          myth: 'Los triángulos siempre apoyan en una base.',
          correction: 'La orientación no cambia el nombre si se cumplen los atributos.',
        },
        {
          myth: '“Más delgado” ya no es rectángulo.',
          correction: 'Un rectángulo largo sigue siendo rectángulo con cuatro ángulos rectos.',
        },
      ],
      supportEmergingLearners:
        'Trazar y armar con palillos. Clasificar con aros por reglas. Empieza triángulo vs círculo.',
      extendForDepth:
        'Componer figuras (dos triángulos → rombo). Puntos en cuadriculado. Jerarquía: cuadrados son rectángulos especiales.',
      extraPracticeIdeas: [
        'Caza de figuras con lista de atributos.',
        'Geoplano y justificar con marco de oración.',
        '¿Cuál no pertenece? (varias respuestas válidas)',
      ],
    },
  },
  'math-crew-multiply-thinking': {
    en: {
      conceptualDeepDive:
        'Multiplication is often introduced as equal groups or repeated addition; arrays bridge to area later. Stress the two factors: number of groups and size of each group—swapping them changes the story but not the product (commutativity). Link word problems to models so “3 boxes of 4” is not confused with “4 boxes of 3” in context even when the product matches.',
      vocabularyTerms: [
        { term: 'Factor', definition: 'A number multiplied; here, groups × size in context.' },
        { term: 'Product', definition: 'The result of multiplication.' },
        { term: 'Array', definition: 'Rows and columns showing equal groups.' },
        { term: 'Commutative property', definition: 'Order of factors can swap; product stays same—story may change.' },
      ],
      sayThisAloud:
        'Three groups of four means I make three circles and put four in each. Four groups of three is a different story in real life, but the total objects can match. Let’s draw both and label “groups of” so our model matches the words.',
      misconceptions: [
        {
          myth: 'Multiplication always makes numbers bigger.',
          correction: 'Later, fractions and decimals break that shortcut; stick to whole-number stories now.',
        },
        {
          myth: 'Repeated addition is unrelated to multiplication.',
          correction: 'It is a valid early model; connect to groups to build structure.',
        },
      ],
      supportEmergingLearners:
        'Start with 2, 5, and 10 as group sizes. Use counters in egg cartons or plates. Sentence frame: “___ groups of ___.”',
      extendForDepth:
        'Compare 6×4 and 4×6 with different contexts (chairs vs rows). Introduce bare expressions and ask for two stories. Bridge to area with grid paper.',
      extraPracticeIdeas: [
        'Create a poster of “groups of” photos from the classroom.',
        'Match equations to tape diagrams.',
        'Which equation fits this story? (distractors with wrong grouping)',
      ],
    },
    es: {
      conceptualDeepDive:
        'La multiplicación suele verse como grupos iguales o suma repetida; las matrices enlazan con el área. Enfatiza los dos factores: cuántos grupos y cuánto en cada grupo — intercambiarlos cambia la historia pero no el producto. En problemas verbales, modela “3 cajas de 4” frente a “4 cajas de 3” aunque el producto coincida.',
      vocabularyTerms: [
        { term: 'Factor', definition: 'Número que multiplicas; aquí grupos × tamaño.' },
        { term: 'Producto', definition: 'Resultado de la multiplicación.' },
        { term: 'Arreglo / matriz', definition: 'Filas y columnas que muestran grupos iguales.' },
        { term: 'Propiedad conmutativa', definition: 'Cambiar el orden de factores no cambia el producto; la historia sí puede cambiar.' },
      ],
      sayThisAloud:
        'Tres grupos de cuatro: tres círculos con cuatro en cada uno. Cuatro grupos de tres es otra historia en la vida real, pero el total puede coincidir. Dibujemos ambos y etiquetemos “grupos de” para que el modelo coincida con las palabras.',
      misconceptions: [
        {
          myth: 'Multiplicar siempre agranda.',
          correction: 'Con fracciones y decimales no; por ahora quédense en enteros.',
        },
        {
          myth: 'Suma repetida no es multiplicación.',
          correction: 'Es un modelo válido al inicio; conéctalo con grupos.',
        },
      ],
      supportEmergingLearners:
        'Tamaños de grupo 2, 5 y 10. Fichas en bandejas. Marco: “___ grupos de ___.”',
      extendForDepth:
        'Comparen 6×4 y 4×6 con contextos distintos. Dos historias para una expresión. Cuadrícula para área.',
      extraPracticeIdeas: [
        'Póster de fotos “grupos de” del salón.',
        'Relacionar ecuaciones con diagramas de cinta.',
        '¿Qué ecuación va con este cuento?',
      ],
    },
  },
  'math-crew-fractions-intro': {
    en: {
      conceptualDeepDive:
        'Fractions are numbers, not two separate counts—numerator and denominator work together to describe one quantity. Start with fair shares of the same whole; mismatched wholes are a classic pitfall. Use length, area, and set models so students see fractions in multiple contexts. Equivalence comes later but preview with simple diagrams (two fourths as one half).',
      vocabularyTerms: [
        { term: 'Numerator', definition: 'Counts how many of the equal parts you are talking about.' },
        { term: 'Denominator', definition: 'Tells how many equal parts the whole is divided into.' },
        { term: 'Unit fraction', definition: 'One equal part of the whole (e.g., 1/4).' },
        { term: 'Equivalent fractions', definition: 'Different names for the same amount (preview).' },
      ],
      sayThisAloud:
        'We split the same brownie into four equal pieces. One piece is one fourth of the whole brownie. The 4 says “four equal parts,” the 1 says “we are thinking about one of them.” If the parts are not equal, we cannot trust the fraction name.',
      misconceptions: [
        {
          myth: 'Bigger denominator means bigger piece.',
          correction: 'More parts means each part is smaller when the whole is the same.',
        },
        {
          myth: 'Fractions are two separate numbers to add across.',
          correction: 'They are one number describing a relationship to a defined whole.',
        },
      ],
      supportEmergingLearners:
        'Fold paper strips; use transparent overlays on the same rectangle. Color one part at a time. Compare 1/2 and 1/4 on identical wholes only.',
      extendForDepth:
        'Number line placements from 0 to 1. Compare with reasoning, not only cross-multiplying. Connect to measurement (1/2 inch).',
      extraPracticeIdeas: [
        'Fair share disputes—role-play cutting “equal” pieces.',
        'Which fraction is larger on the same strip? Justify with a drawing.',
        'Recipe math: half a cup as a concrete referent.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las fracciones son un número, no dos conteos sueltos: numerador y denominador describen una cantidad juntos. Empieza con partes justas del mismo entero; mezclar “enteros” distintos es un error clásico. Usa longitud, área y conjuntos. La equivalencia viene después, pero anticipa con dibujos simples (dos cuartos como un medio).',
      vocabularyTerms: [
        { term: 'Numerador', definition: 'Cuenta cuántas partes iguales estás considerando.' },
        { term: 'Denominador', definition: 'Indica en cuántas partes iguales se partió el entero.' },
        { term: 'Fracción unitaria', definition: 'Una parte igual del entero (ej. 1/4).' },
        { term: 'Fracciones equivalentes', definition: 'Distintos nombres para la misma cantidad (avance).' },
      ],
      sayThisAloud:
        'Partimos el mismo brownie en cuatro partes iguales. Una pieza es un cuarto del brownie entero. El 4 dice “cuatro partes iguales,” el 1 dice “pensamos en una.” Si las partes no son iguales, el nombre de fracción no sirve.',
      misconceptions: [
        {
          myth: 'Denominador más grande, pieza más grande.',
          correction: 'Más partes implica piezas más pequeñas si el entero es el mismo.',
        },
        {
          myth: 'Las fracciones son dos números sueltos.',
          correction: 'Son un número que describe la relación con un entero definido.',
        },
      ],
      supportEmergingLearners:
        'Tiras de papel plegadas; mismos rectángulos. Colorear una parte. Comparen 1/2 y 1/4 solo en el mismo entero.',
      extendForDepth:
        'Recta numérica de 0 a 1. Comparar con razonamiento. Medidas (1/2 pulgada).',
      extraPracticeIdeas: [
        'Juego de repartir justo.',
        '¿Cuál fracción es mayor en la misma tira?',
        'Receta: media taza como referente.',
      ],
    },
  },
  'math-tots-more-less-same': {
    en: {
      conceptualDeepDive:
        'Comparison builds on counting: children must coordinate cardinality with relational language. Matching one-to-one reveals equality; leftovers reveal “more.” Spreading objects out challenges naive “longer line = more” ideas—re-count to anchor truth.',
      vocabularyTerms: [
        { term: 'More / fewer / same', definition: 'Relational words comparing two quantities.' },
        { term: 'Match', definition: 'Pair items across groups to test equality.' },
        { term: 'Conservation (preview)', definition: 'Amount stays the same when layout changes if nothing is added or removed.' },
        { term: 'Compare', definition: 'Decide which set has greater cardinality or if they match.' },
      ],
      sayThisAloud:
        'Let’s line up bears and cups—one bear, one cup. Everyone has a partner, so the number is the same. If one bear has no cup, that group has more bears than cups.',
      misconceptions: [
        {
          myth: 'A longer spread-out row always means more.',
          correction: 'Count or match; length without count is misleading.',
        },
        {
          myth: '“Bigger object” means more in the set.',
          correction: 'We compare how many, not object size, unless the task says so.',
        },
      ],
      supportEmergingLearners:
        'Use five or fewer per set; use matching mats with dots. Color-code each pair.',
      extendForDepth:
        'Introduce “How many more?” with a matched core plus extras only on one side.',
      extraPracticeIdeas: [
        'Snack compare with consent.',
        'Build two towers; predict then verify by counting.',
        'Story: “Same birthday cupcakes for each friend.”',
      ],
    },
    es: {
      conceptualDeepDive:
        'Comparar se apoya en contar: coordinar cardinalidad con lenguaje relacional. El emparejamiento uno a uno muestra igualdad; lo que sobra muestra “más.” Esparcir objetos desafía la idea de “fila más larga = más” — recontar ancla la verdad.',
      vocabularyTerms: [
        { term: 'Más / menos / igual', definition: 'Palabras que comparan dos cantidades.' },
        { term: 'Emparejar', definition: 'Unir elementos de dos grupos para probar igualdad.' },
        { term: 'Conservación (avance)', definition: 'La cantidad se mantiene si no se añade ni quita.' },
        { term: 'Comparar', definition: 'Decidir cuál conjunto tiene más o si coinciden.' },
      ],
      sayThisAloud:
        'Alineemos osos y vasos — un oso, un vaso. Todos tienen pareja: la cantidad es igual. Si sobra un oso, hay más osos que vasos.',
      misconceptions: [
        {
          myth: 'Fila más larga siempre es más.',
          correction: 'Cuenta o empareja; la longitud sin conteo engaña.',
        },
        {
          myth: 'Objeto más grande = más en el conjunto.',
          correction: 'Comparamos cuántos hay, no el tamaño del objeto.',
        },
      ],
      supportEmergingLearners:
        'Cinco o menos por conjunto; tapete con puntos; color por pareja.',
      extendForDepth:
        '“¿Cuántos más?” con núcleo emparejado y extras a un lado.',
      extraPracticeIdeas: [
        'Merienda con permiso.',
        'Torres; predecir y contar.',
        'Cuento: mismos cupcakes para cada amigo.',
      ],
    },
  },
  'math-kids-subtract-within-10': {
    en: {
      conceptualDeepDive:
        'Subtraction is take-away, compare, and missing-addend situations—all within the same fact family as addition. Represent with objects crossed out, number lines, and equations. Fluency grows from understanding, not only speed drills.',
      vocabularyTerms: [
        { term: 'Difference', definition: 'The result of subtraction; gap between quantities.' },
        { term: 'Take away', definition: 'Remove a part from a whole set.' },
        { term: 'Fact family', definition: 'Related + and − facts using the same three numbers.' },
        { term: 'Inverse', definition: 'Subtraction undoes addition when the whole is known.' },
      ],
      sayThisAloud:
        'I had 9 stickers. I gave 4 away. I cross out four circles from my drawing—what’s left is the difference, 5. I check: 5 + 4 = 9.',
      misconceptions: [
        {
          myth: 'Subtraction always makes a smaller number in every context forever.',
          correction: 'Later contexts vary; within K–2 whole numbers, taking away reduces the minuend’s visible amount.',
        },
        {
          myth: 'The bigger number must always be second.',
          correction: 'Standard form puts the whole first: 9 − 4, not 4 − 9 for this story.',
        },
      ],
      supportEmergingLearners:
        'Start with totals ≤ 8; use two-color counters flipped to show take-away.',
      extendForDepth:
        'Pose compare problems with bar diagrams; link to “how many more” language.',
      extraPracticeIdeas: [
        'Number line hop games backward.',
        'Write two stories for the same expression.',
        'Fluency check with known doubles facts.',
      ],
    },
    es: {
      conceptualDeepDive:
        'La resta es quitar, comparar y hallar lo que falta — en la misma familia de operaciones que la suma. Representa tachando, recta numérica y ecuación. La fluidez nace del sentido, no solo de la velocidad.',
      vocabularyTerms: [
        { term: 'Diferencia', definition: 'Resultado de restar; brecha entre cantidades.' },
        { term: 'Quitar', definition: 'Sacar una parte de un todo.' },
        { term: 'Familia de operaciones', definition: 'Sumas y restas relacionadas con los mismos tres números.' },
        { term: 'Inversa', definition: 'La resta deshace la suma cuando conoces el todo.' },
      ],
      sayThisAloud:
        'Tenía 9 calcomanías. Regalé 4. Tacho cuatro círculos — lo que queda es la diferencia, 5. Compruebo: 5 + 4 = 9.',
      misconceptions: [
        {
          myth: 'Restar siempre deja menor en todo contexto para siempre.',
          correction: 'Más adelante varía; en enteros pequeños, quitar reduce lo visible.',
        },
        {
          myth: 'El número mayor va segundo.',
          correction: 'Forma estándar: todo primero: 9 − 4, no 4 − 9 para este cuento.',
        },
      ],
      supportEmergingLearners:
        'Totales ≤ 8; fichas bicolor volteadas para quitar.',
      extendForDepth:
        'Problemas de comparación con diagramas de barras; “cuántos más”.',
      extraPracticeIdeas: [
        'Saltos hacia atrás en recta numérica.',
        'Dos cuentos para la misma expresión.',
        'Fluidez con dobles conocidos.',
      ],
    },
  },
  'math-crew-area-tiles': {
    en: {
      conceptualDeepDive:
        'Area is a covering measure; perimeter is a boundary length. Arrays connect multiplication to area. Emphasize square units and alignment—gaps and overlaps break the count. Relate to real flooring and screens only after the unit-square concept is firm.',
      vocabularyTerms: [
        { term: 'Square unit', definition: 'A tile with equal sides used to measure area.' },
        { term: 'Area', definition: 'Number of unit squares covering a region without gaps or overlap.' },
        { term: 'Perimeter', definition: 'Distance around a figure—different from area.' },
        { term: 'Composite shape', definition: 'A shape made by joining simpler shapes; area adds if no overlap.' },
      ],
      sayThisAloud:
        'Watch me cover this rectangle with blue tiles—no holes, no stacking. I count 12 tiles: 12 square units. Walking around the edge would be perimeter, not area.',
      misconceptions: [
        {
          myth: 'Area and perimeter are interchangeable words.',
          correction: 'Always pair correct units: square units vs linear units.',
        },
        {
          myth: 'Tilted squares are not square units.',
          correction: 'Same-size squares can be rotated; alignment on a grid helps beginners.',
        },
      ],
      supportEmergingLearners:
        'Use inch or centimeter grid paper with pre-drawn rectangles first.',
      extendForDepth:
        'Decompose an L-shape into two rectangles; sum areas. Compare to counting every tile.',
      extraPracticeIdeas: [
        'Design a “dream desk” on grid paper—compute area.',
        'Which rectangle has larger area with same perimeter? (exploration)',
        'Measure a book cover with sticky-note squares.',
      ],
    },
    es: {
      conceptualDeepDive:
        'El área mide cubrimiento; el perímetro, longitud del borde. Las matrices conectan multiplicación y área. Enfatiza unidades cuadradas y alineación — huecos y traslapes rompen el conteo.',
      vocabularyTerms: [
        { term: 'Unidad cuadrada', definition: 'Ficha con lados iguales para medir área.' },
        { term: 'Área', definition: 'Cantidad de cuadrados que cubren una región sin huecos ni solape.' },
        { term: 'Perímetro', definition: 'Distancia alrededor — distinto del área.' },
        { term: 'Figura compuesta', definition: 'Varias figuras juntas; el área suma si no hay solape.' },
      ],
      sayThisAloud:
        'Cubro este rectángulo con fichas azules — sin huecos ni montones. Cuento 12: 12 unidades cuadradas. Caminar el borde sería perímetro, no área.',
      misconceptions: [
        {
          myth: 'Área y perímetro son lo mismo.',
          correction: 'Unidades distintas: cuadradas vs lineales.',
        },
        {
          myth: 'Cuadrados inclinados no cuentan.',
          correction: 'Cuadrados del mismo tamaño rotan; la cuadrícula ayuda al inicio.',
        },
      ],
      supportEmergingLearners:
        'Papel cuadriculado con rectángulos dibujados primero.',
      extendForDepth:
        'Forma en L en dos rectángulos; sumar áreas.',
      extraPracticeIdeas: [
        '“Escritorio soñado” en cuadrícula.',
        'Mismo perímetro, distinto área (exploración).',
        'Portada de libro con notas adhesivas cuadradas.',
      ],
    },
  },
}
