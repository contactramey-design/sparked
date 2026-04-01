/**
 * Richer “teach this idea” copy for school subject lessons (per lesson id, EN + ES).
 * Keeps curriculum files slimmer; adjust pedagogy here.
 */
const LESSON_DEEP_DIVES: Record<string, { en: string; es: string }> = {
  'math-tots-count-1-5': {
    en: 'Cardinality is the idea that the last number you say tells how many are in the set—not just a chant. Pair this with one-to-one correspondence: each object touched once, in order, with one number name. Watch for double-counting and skipping; both break the link between quantity and the number word. Use real classroom objects and slow modeling so students hear, see, and feel the rhythm of stable order.',
    es: 'La cardinalidad es que el último número dice cuántos hay, no solo un canto. Va de la mano con la correspondencia uno a uno: cada objeto tocado una vez, en orden, con un nombre de número. Evita contar dos veces o saltar; ambos rompen el vínculo entre cantidad y palabra. Usa objetos reales del salón y modelado lento para que vean, oigan y sientan el orden estable.',
  },
  'math-tots-patterns': {
    en: 'Patterns are predictable repeats—core to early algebra. Help children notice the “unit of repeat” (AB, AAB, ABC) and extend it before naming it abstractly. Use color, sound, and motion so the pattern is multisensory. Mistakes often come from copying only the last piece instead of the whole cycle; explicitly mark the repeating chunk.',
    es: 'Los patrones son repeticiones predecibles — base del álgebra temprana. Ayuda a notar la “unidad que se repite” (AB, AAB, ABC) y a extenderla antes de nombrarla en abstracto. Usa color, sonido y movimiento. Un error común es copiar solo el último trozo en vez de todo el ciclo; señala explícitamente el bloque que se repite.',
  },
  'math-kids-add-within-10': {
    en: 'Addition within 10 builds on composing and decomposing numbers (make-a-ten, doubles, near-doubles). Represent with objects, drawings, and number sentences together so symbols stay tied to meaning. Stress that addition combines parts into a whole; common confusion is treating the plus sign as “next number to say” without joining quantities.',
    es: 'Sumar hasta 10 se apoya en componer y descomponer (hacer diez, dobles, casi dobles). Representa con objetos, dibujos y expresiones numéricas para que los símbolos tengan sentido. La suma une partes en un todo; un error frecuente es tratar el + como “siguiente número” sin juntar cantidades.',
  },
  'math-kids-shapes': {
    en: 'Geometry at this level mixes naming shapes with describing attributes (sides, vertices, curves). Distinguish examples from non-examples: a “triangle” must be closed with three straight sides. Rotate shapes and use different sizes so students generalize the definition, not a single prototype. Connect to the world—signs, tiles, book covers.',
    es: 'La geometría aquí mezcla nombrar figuras con describir atributos (lados, vértices, curvas). Separa ejemplos de no ejemplos: un triángulo es cerrado con tres lados rectos. Gira figuras y usa distintos tamaños para generalizar la definición, no un solo dibujo típico. Conecta con señales, baldosas, portadas.',
  },
  'math-crew-multiply-thinking': {
    en: 'Multiplication is often introduced as equal groups or repeated addition; arrays bridge to area later. Stress the two factors: number of groups and size of each group—swapping them changes the story but not the product (commutativity). Link word problems to models so “3 boxes of 4” is not confused with “4 boxes of 3” in context even when the product matches.',
    es: 'La multiplicación suele verse como grupos iguales o suma repetida; las matrices enlazan con el área. Enfatiza los dos factores: cuántos grupos y cuánto en cada grupo — intercambiarlos cambia la historia pero no el producto. En problemas verbales, modela “3 cajas de 4” frente a “4 cajas de 3” aunque el producto coincida.',
  },
  'math-crew-fractions-intro': {
    en: 'Fractions are numbers, not two separate counts—numerator and denominator work together to describe one quantity. Start with fair shares of the same whole; mismatched wholes are a classic pitfall. Use length, area, and set models so students see fractions in multiple contexts. Equivalence comes later but preview with simple diagrams (two fourths as one half).',
    es: 'Las fracciones son un número, no dos conteos sueltos: numerador y denominador describen una cantidad juntos. Empieza con partes justas del mismo entero; mezclar “enteros” distintos es un error clásico. Usa longitud, área y conjuntos. La equivalencia viene después, pero anticipa con dibujos simples (dos cuartos como un medio).',
  },
  'eng-tots-rhyme-time': {
    en: 'Rhyming trains phonological awareness—the ear for sounds inside words. Focus on the rime (the vowel + what follows), not just first letters. Nursery play and silly songs lower anxiety. If a child invents a nonsense rhyme that fits the pattern, celebrate the sound skill before correcting meaning.',
    es: 'La rima entrena la conciencia fonológica — oír sonidos dentro de las palabras. Enfócate en la rima (vocal + lo que sigue), no solo en la primera letra. Canciones y juegos reducen ansiedad. Si inventan una palabra disparatada que rima, celebra el oído antes de corregir el sentido.',
  },
  'eng-tots-first-sounds': {
    en: 'Initial sounds are the on-ramp to phonics. Isolate the first phoneme (“ssssun”), not the letter name (“ess”). Use mirrors for mouth shapes and pair with pictures. Avoid over-relying on letter names alone—students need to hear the sound in different positions as they grow.',
    es: 'Los sonidos iniciales son la entrada al fonoaúdito. Aísla el primer fonema (“ssssol”), no el nombre de la letra (“e”). Usa espejo para la boca e imágenes. No te quedes solo con nombres de letras — deben oír el sonido en distintas posiciones.',
  },
  'eng-kids-main-idea': {
    en: 'Main idea is the point the author wants you to carry away—not a random detail or the first sentence by default. Model with short paragraphs: name details, then ask what they have in common. Distinguish topic (“dogs”) from main idea (“Dogs use smell to learn about the world”). Graphic organizers help English learners hold the thread.',
    es: 'La idea principal es lo que el autor quiere que te lleves — no un detalle suelto ni la primera oración por defecto. Modela con textos cortos: lista detalles y pregunta qué comparten. Separa tema (“perros”) de idea principal (“Los perros usan el olfato para entender el mundo”). Organizadores gráficos ayudan a mantener el hilo.',
  },
  'eng-kids-sentence-parts': {
    en: 'Who did what?—subject and predicate build every clause. Use color-coding or movement (stand for subject, jump for action) to make grammar concrete. Avoid drowning beginners in exceptions; start with clear SVO sentences, then stretch with adjectives and where/when phrases.',
    es: '¿Quién hizo qué? — sujeto y predicado sostienen la oración. Usa colores o movimiento (pararse = sujeto, saltar = acción). Evita saturar con excepciones al inicio; empieza con oraciones claras sujeto-verbo-objeto y luego añade adjetivos y dónde/cuándo.',
  },
  'eng-crew-text-evidence': {
    en: 'Claims need warrants from the text—paraphrase or quote, then link. Teach students to flag strong verbs (“states,” “shows”) vs weak filler (“says stuff”). Model citing line or paragraph and explaining why that line supports the claim. This is the bridge to argumentative writing across subjects.',
    es: 'Las afirmaciones necesitan respaldo del texto — parafrasea o cita y enlaza. Enseña verbos fuertes (“afirma”, “muestra”) frente a relleno débil. Modela citar línea o párrafo y explicar por qué apoya la afirmación. Es el puente hacia la argumentación en todas las materias.',
  },
  'eng-crew-context-clues': {
    en: 'Context clues are educated guesses, not magic. Teach types: definition in the sentence, synonym/antonym, example, or general mood. If clues conflict, reread a wider chunk. Pair with morphology (prefixes/roots) so students have two strategies, not one.',
    es: 'Las pistas del contexto son inferencias, no adivinanza. Tipos: definición en la oración, sinónimo/antónimo, ejemplo o tono general. Si chocan, relee un trozo más amplio. Suma morfología (prefijos/raíces) para tener dos estrategias.',
  },
  'sci-tots-five-senses': {
    en: 'The five senses are tools for gathering information—noticing, comparing, and describing properties of objects. Clarify that some senses work together (taste and smell). Safety first: never taste unknown substances at school. Push beyond naming the sense to what information it gives (“rough,” “loud,” “sour”).',
    es: 'Los cinco sentidos sirven para observar, comparar y describir propiedades. Algunos trabajan juntos (gusto y olfato). Seguridad: no probar sustancias desconocidas. Ve más allá del nombre del sentido: qué información da (“áspero”, “fuerte”, “ácido”).',
  },
  'sci-tots-living-nonliving': {
    en: 'Living things grow, respond, reproduce, and use energy (simplified for tots). Nonliving may change but not in the same organized way—a rock erodes; it does not eat. Use clear examples and borderline cases (seed, robot toy) to spark discussion rather than trick questions.',
    es: 'Lo vivo crece, responde, se reproduce y usa energía (versión simple). Lo no vivo puede cambiar pero no igual — la roca se erosiona; no come. Usa ejemplos claros y casos límite (semilla, robot de juguete) para conversar, no para trampas.',
  },
  'sci-kids-states-matter': {
    en: 'Solids hold shape, liquids flow with fixed volume, gases fill space—the particle model comes later but language matters now. Heating and cooling drive many changes; distinguish melting from dissolving. Use everyday phase changes (ice, steam) and stress observation words.',
    es: 'Sólidos mantienen forma, líquidos fluyen con volumen fijo, gases llenan el espacio — el modelo de partículas viene después. Calentar y enfriar provocan cambios; separa fundir de disolver. Usa hielo y vapor y vocabulario de observación.',
  },
  'sci-kids-plants-need': {
    en: 'Plants need light, water, air, space, and nutrients—usually framed as what leaves, roots, and soil do together. Avoid teleology (“wants sun”); use “responds to” and “needs for growth.” Connect to classroom plants and fair tests (same plant, change one variable when age-appropriate).',
    es: 'Las plantas necesitan luz, agua, aire, espacio y nutrientes — hojas, raíces y suelo trabajan juntos. Evita teleología (“quiere sol”); usa “responde a” y “necesita para crecer”. Conecta con plantas del salón y pruebas justas cuando toque.',
  },
  'sci-crew-food-web': {
    en: 'Energy flows; matter cycles—introduce flow with arrows from food to eater. Producers anchor most terrestrial webs in sunlight. Omnivores complicate simple chains; that is why “web” is more honest than one straight line. Discuss local examples to ground abstraction.',
    es: 'La energía fluye; la materia cicla — flechas de comida a quien come. Los productores anclan muchas redes terrestres con luz solar. Los omnívoros enredan las cadenas; por eso “red” es más honesto que una línea. Usa ejemplos locales.',
  },
  'sci-crew-sun-energy': {
    en: 'Almost all surface ecosystems trace energy to the Sun, sometimes stored for millions of years in fuels. Solar panels and wind connect to uneven heating and light. Tie in responsible use: energy choices affect air, water, and climate—age-appropriate, solutions-oriented framing.',
    es: 'Casi toda la energía en la superficie viene del Sol, a veces guardada millones de años en combustibles. Paneles y viento enlazan con luz y calentamiento desigual. Enlaza uso responsable: las decisiones energéticas afectan aire, agua y clima — con soluciones a su nivel.',
  },
  'hist-tots-then-now': {
    en: 'Time words build historical thinking before dates. Compare kindly—change is not “good vs bad” automatically. Photos and objects are evidence that the past looked different. Help students connect family stories to the classroom timeline so history feels human-sized.',
    es: 'Las palabras del tiempo construyen pensamiento histórico antes que fechas. Compara con respeto — el cambio no es automáticamente bueno o malo. Fotos y objetos prueban que el pasado se veía distinto. Conecta historias familiares con la línea del salón.',
  },
  'hist-tots-family-stories': {
    en: 'Every family holds history; diversity of structure should be honored. Oral history is valid evidence for young learners even before documents. Practice listening protocols: eye contact, no interrupting, thank-you closing. Link one memory to a feeling or place to deepen recall.',
    es: 'Toda familia guarda historia; honra la diversidad de formas. La historia oral es evidencia válida. Practica escuchar: mirar, no interrumpir, agradecer. Enlaza un recuerdo con emoción o lugar para profundizar.',
  },
  'hist-kids-community-helpers': {
    en: 'Community roles form a civic web—visibility builds gratitude and safety literacy. Connect jobs to problems they solve (fire, illness, learning, waste). Discuss respectful interaction: 911 for true emergencies, not pranks. Invite a helper visit or video to make abstract roles concrete.',
    es: 'Los oficios forman una red cívica — verlos genera gratitud y literacia de seguridad. Conecta trabajos con problemas que resuelven (fuego, salud, aprendizaje, basura). Habla de respeto: 911 para emergencias reales. Visita o video hace concreto lo abstracto.',
  },
  'hist-kids-map-landmarks': {
    en: 'Maps are models—always partial, always purposeful. Legend first, then scale and direction. Practice translating 2D map to 3D walk to build spatial reasoning. Landmarks anchor mental maps; ask students to draw their own messy-but-meaningful sketch of school or neighborhood.',
    es: 'Los mapas son modelos — siempre parciales y con propósito. Primero leyenda, luego escala y dirección. Pasar del mapa 2D al paseo 3D fortalece el espacio. Los hitos anclan memoria; pide un dibujo “feo pero significativo” del cole o barrio.',
  },
  'hist-crew-timeline-basics': {
    en: 'Timelines encode order, not automatic causation—teach both. Scale jumps matter: a century vs a day. BCE/CE is a convention; emphasize zero is not “nothing happened.” Have students caption events with date + short claim to practice precision.',
    es: 'Las líneas guardan orden, no causa automática — enseña ambas. La escala importa: un siglo vs un día. a.C./d.C. es convención; el cero no es “no pasó nada”. Pide pies de foto con fecha + afirmación breve.',
  },
  'hist-crew-sources': {
    en: 'Primary sources were created close to the event; secondary sources interpret later—both can be biased. Sourcing questions: Who made this? When? For what audience? Corroboration across types beats one perfect doc. Model comparing photo vs textbook caption vs diary.',
    es: 'Primarias cerca del hecho; secundarias interpretan después — ambas pueden sesgarse. Preguntas: ¿quién?, ¿cuándo?, ¿para quién? Corroborar tipos distintos vence un solo documento “perfecto”. Modela foto vs libro vs diario.',
  },
}

export function getSchoolSubjectDeepDive(lessonId: string, locale: 'en' | 'es'): string | undefined {
  const row = LESSON_DEEP_DIVES[lessonId]
  if (!row) return undefined
  return locale === 'es' ? row.es : row.en
}
