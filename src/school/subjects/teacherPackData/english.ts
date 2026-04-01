import type { BilingualTeacherPack } from '../types'

export const ENGLISH_TEACHER_PACKS: Record<string, BilingualTeacherPack> = {
  'eng-tots-rhyme-time': {
    en: {
      conceptualDeepDive:
        'Rhyming trains phonological awareness—the ear for sounds inside words. Focus on the rime (the vowel + what follows), not just first letters. Nursery play and silly songs lower anxiety. If a child invents a nonsense rhyme that fits the pattern, celebrate the sound skill before correcting meaning.',
      vocabularyTerms: [
        { term: 'Rhyme', definition: 'Words that share the same ending sound (rime), not always the same spelling.' },
        { term: 'Rime', definition: 'The vowel and sounds after it in a syllable (e.g., -at in cat/hat).' },
        { term: 'Onset', definition: 'The consonant sound(s) before the vowel in a syllable—optional stretch goal.' },
        { term: 'Phonological awareness', definition: 'Hearing and playing with sounds in spoken words before heavy print focus.' },
      ],
      sayThisAloud:
        'Listen to the ends: cat, hat, bat—they sound the same at the end. That is a rhyme. Sparki says star… what else could rhyme in our game? We are training our ears, not spelling yet.',
      misconceptions: [
        {
          myth: 'Rhyme is only about matching letters.',
          correction: 'Ear first: phone and stone can rhyme in songs even when letters differ.',
        },
        {
          myth: 'Nonsense rhymes are wrong.',
          correction: 'If the sound pattern is right, praise the pattern skill, then offer a real word option.',
        },
      ],
      supportEmergingLearners:
        'Use picture cards and exaggerated final sounds. Echo pairs in a call-and-response. Reduce choices to two when guessing rhymes.',
      extendForDepth:
        'Sort rhyming families. Play “odd one out.” Bridge to onset-rime with one-syllable words.',
      extraPracticeIdeas: [
        'Rhyming basket: objects that rhyme with a target word.',
        'Read-aloud pause: fill in the rhyming word.',
        'Movement: jump on rhymes, freeze on non-rhymes.',
      ],
    },
    es: {
      conceptualDeepDive:
        'La rima entrena la conciencia fonológica — oír sonidos dentro de las palabras. Enfócate en la rima (vocal + lo que sigue), no solo en la primera letra. Canciones y juegos reducen ansiedad. Si inventan una palabra disparatada que rima, celebra el oído antes de corregir el sentido.',
      vocabularyTerms: [
        { term: 'Rima', definition: 'Palabras que comparten sonido al final; la ortografía puede variar.' },
        { term: 'Núcleo silábico', definition: 'Vocal y sonidos posteriores en la sílaba.' },
        { term: 'Ataque silábico', definition: 'Consonantes antes del núcleo — extensión opcional.' },
        { term: 'Conciencia fonológica', definition: 'Jugar con sonidos del habla antes de cargar la lectura.' },
      ],
      sayThisAloud:
        'Escuchen los finales: sol, col, rol — suenan parecido al final. Eso es rima. Sparki dice “mar”… ¿qué más podría rimar en nuestro juego? Entrenamos el oído, todavía no la ortografía.',
      misconceptions: [
        {
          myth: 'La rima es solo letras iguales.',
          correction: 'Primero el oído; en español muchas rimas son visuales y sonoras a la vez, pero el sonido manda.',
        },
        {
          myth: 'Palabras inventadas no sirven.',
          correction: 'Si el patrón sonoro es correcto, celebra y luego ofrece palabra real.',
        },
      ],
      supportEmergingLearners:
        'Tarjetas con imágenes y finales exagerados. Eco en coro. Dos opciones al adivinar.',
      extendForDepth:
        'Familias de rimas. “Cuál no pertenece.” Ataque + núcleo en monosílabos.',
      extraPracticeIdeas: [
        'Canasta de objetos que riman con una palabra clave.',
        'Lectura con pausa para la rima.',
        'Saltar en rimas, quietos si no riman.',
      ],
    },
  },
  'eng-tots-first-sounds': {
    en: {
      conceptualDeepDive:
        'Initial sounds are the on-ramp to phonics. Isolate the first phoneme (“ssssun”), not the letter name (“ess”). Use mirrors for mouth shapes and pair with pictures. Avoid over-relying on letter names alone—students need to hear the sound in different positions as they grow.',
      vocabularyTerms: [
        { term: 'Phoneme', definition: 'The smallest speech sound that changes meaning.' },
        { term: 'Initial sound', definition: 'The first phoneme you hear in a word.' },
        { term: 'Letter name vs sound', definition: '“Bee” names the letter; /b/ is the sound in bat.' },
        { term: 'Isolate', definition: 'Stretch the word and clip everything after the first sound.' },
      ],
      sayThisAloud:
        'Stretch it with me: ssssun. The first sound I hear is /s/. Not the name “ess”—the hissing sound. Look in the mirror: my teeth are together for /s/.',
      misconceptions: [
        {
          myth: 'Always say letter names when teaching sounds.',
          correction: 'Oral sound-first work reduces confusion when blending later.',
        },
        {
          myth: 'First sound includes the vowel.',
          correction: 'For “sun,” initial is /s/, not /su/—practice clipping carefully.',
        },
      ],
      supportEmergingLearners:
        'Use continuous sounds (/m/, /s/) before stops (/t/, /p/). Hold the sound longer. Compare two picture words: same start?',
      extendForDepth:
        'Sort by initial sound baskets. Introduce ending sounds on a different day to avoid overload.',
      extraPracticeIdeas: [
        'Sound scavenger hunt for items starting like “turtle.”',
        'Use a puppet that only eats /p/ words.',
        'Body code: touch head for first sound.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Los sonidos iniciales son la entrada al fonoaúdito. Aísla el primer fonema (“ssssol”), no el nombre de la letra (“e”). Usa espejo para la boca e imágenes. No te quedes solo con nombres de letras — deben oír el sonido en distintas posiciones.',
      vocabularyTerms: [
        { term: 'Fonema', definition: 'Sonido mínimo que cambia el significado.' },
        { term: 'Sonido inicial', definition: 'Primer fonema que oyes en la palabra.' },
        { term: 'Nombre de letra vs sonido', definition: '“Be” nombra la letra; /b/ es el sonido.' },
        { term: 'Aislar', definition: 'Estirar la palabra y cortar lo que sigue al primer sonido.' },
      ],
      sayThisAloud:
        'Estiren conmigo: ssssol. El primer sonido que oigo es /s/. Miren el espejo: dientes juntos para /s/.',
      misconceptions: [
        {
          myth: 'Siempre enseñar con nombre de letra.',
          correction: 'El sonido oral primero reduce confusión al leer después.',
        },
        {
          myth: 'El inicio incluye la vocal.',
          correction: 'En “sol” el inicio es /s/, no /so/ — practiquen cortar con cuidado.',
        },
      ],
      supportEmergingLearners:
        'Sonidos continuos primero. Sostener el sonido. Dos imágenes: ¿mismo inicio?',
      extendForDepth:
        'Clasificar por canastas de sonido inicial. Finales en otro día.',
      extraPracticeIdeas: [
        'Caza de objetos que empiecen como “luna.”',
        'Títere que solo come palabras con /p/.',
        'Toca la cabeza en el primer sonido.',
      ],
    },
  },
  'eng-kids-main-idea': {
    en: {
      conceptualDeepDive:
        'Main idea is the point the author wants you to carry away—not a random detail or the first sentence by default. Model with short paragraphs: name details, then ask what they have in common. Distinguish topic (“dogs”) from main idea (“Dogs use smell to learn about the world”). Graphic organizers help English learners hold the thread.',
      vocabularyTerms: [
        { term: 'Main idea', definition: 'The central point the text is mostly about.' },
        { term: 'Topic', definition: 'The subject; narrower than a full main-idea sentence.' },
        { term: 'Supporting detail', definition: 'A fact or example that backs the main idea.' },
        { term: 'Summary', definition: 'A short retell capturing main idea, not every detail.' },
      ],
      sayThisAloud:
        'We list three details the author gave. Now ask: what is the author trying to teach me overall? That is the main idea. The title is a clue, but we check the details to be sure.',
      misconceptions: [
        {
          myth: 'The first sentence is always the main idea.',
          correction: 'Sometimes it is; often it is not—evidence must match several parts of the text.',
        },
        {
          myth: 'A cool detail is the main idea because it is interesting.',
          correction: 'Interesting details support the point; they are not always the point.',
        },
      ],
      supportEmergingLearners:
        'Use one short paragraph at a time. Provide sentence frames: “This text teaches that ___.” Pair visuals with informational text.',
      extendForDepth:
        'Compare two paragraphs on the same topic with different main ideas. Highlight evidence that supports a claim.',
      extraPracticeIdeas: [
        'Headline write: give a title that matches the main idea.',
        'Two-column chart: detail vs how it supports the idea.',
        'Peer teach: partner A states idea, partner B finds one supporting sentence.',
      ],
    },
    es: {
      conceptualDeepDive:
        'La idea principal es lo que el autor quiere que te lleves — no un detalle suelto ni la primera oración por defecto. Modela con textos cortos: lista detalles y pregunta qué comparten. Separa tema (“perros”) de idea principal (“Los perros usan el olfato para entender el mundo”). Organizadores gráficos ayudan a mantener el hilo.',
      vocabularyTerms: [
        { term: 'Idea principal', definition: 'El punto central de lo que trata el texto.' },
        { term: 'Tema', definition: 'El asunto; más estrecho que una oración completa de idea principal.' },
        { term: 'Detalle de apoyo', definition: 'Dato o ejemplo que respalda la idea principal.' },
        { term: 'Resumen', definition: 'Retell breve con la idea central, no cada detalle.' },
      ],
      sayThisAloud:
        'Listamos tres detalles. Ahora: ¿qué nos quiere enseñar el autor en conjunto? Esa es la idea principal. El título ayuda, pero confirmamos con los detalles.',
      misconceptions: [
        {
          myth: 'La primera oración siempre es la idea principal.',
          correction: 'A veces sí; hay que cruzar con varias partes del texto.',
        },
        {
          myth: 'El detalle más llamativo es la idea principal.',
          correction: 'Los detalles interesantes apoyan; no siempre son el mensaje.',
        },
      ],
      supportEmergingLearners:
        'Un párrafo a la vez. Marco: “Este texto enseña que ___.” Imagen + texto informativo.',
      extendForDepth:
        'Dos párrafos sobre el mismo tema con ideas distintas. Resaltar evidencia.',
      extraPracticeIdeas: [
        'Titular: propón un título que refleje la idea principal.',
        'Tabla detalle vs cómo apoya.',
        'En parejas: A dice la idea, B encuentra una oración que apoya.',
      ],
    },
  },
  'eng-kids-sentence-parts': {
    en: {
      conceptualDeepDive:
        'Who did what?—subject and predicate build every clause. Use color-coding or movement (stand for subject, jump for action) to make grammar concrete. Avoid drowning beginners in exceptions; start with clear SVO sentences, then stretch with adjectives and where/when phrases.',
      vocabularyTerms: [
        { term: 'Sentence', definition: 'A complete thought with a subject and a predicate.' },
        { term: 'Fragment', definition: 'A group of words that does not express a complete thought alone.' },
        { term: 'Question', definition: 'A sentence seeking information; often begins with a question word.' },
        { term: 'Statement', definition: 'A sentence that tells something; often ends with a period.' },
      ],
      sayThisAloud:
        'The dog runs. Who is the sentence about? The dog—that is the subject. What did the dog do? Runs—that is the predicate. On the table is not a sentence by itself; we ask, what is on the table?',
      misconceptions: [
        {
          myth: 'Any group of words with a capital and period is a sentence.',
          correction: 'It must express a full thought someone can understand alone.',
        },
        {
          myth: 'Commands are fragments.',
          correction: 'Imperatives have an implied “you” subject—they can be complete.',
        },
      ],
      supportEmergingLearners:
        'Act out subjects and actions. Use red/blue highlighting on pocket-chart sentences. Build from oral to written.',
      extendForDepth:
        'Compound subjects/predicates with clear examples. Sort run-ons vs complete sentences.',
      extraPracticeIdeas: [
        'Sentence or not? thumbs up/down with justification.',
        'Fix the fragment by adding who or what happens.',
        'Question day: convert statements to questions and back.',
      ],
    },
    es: {
      conceptualDeepDive:
        '¿Quién hizo qué? — sujeto y predicado sostienen la oración. Usa colores o movimiento (pararse = sujeto, saltar = acción). Evita saturar con excepciones al inicio; empieza con oraciones claras sujeto-verbo-objeto y luego añade adjetivos y dónde/cuándo.',
      vocabularyTerms: [
        { term: 'Oración', definition: 'Pensamiento completo con sujeto y predicado.' },
        { term: 'Fragmento', definition: 'Palabras que no bastan solas para un pensamiento completo.' },
        { term: 'Pregunta', definition: 'Busca información; suele empezar con palabra interrogativa.' },
        { term: 'Enunciado', definition: 'Afirmación; suele terminar en punto.' },
      ],
      sayThisAloud:
        'El perro corre. ¿De quién habla la oración? El perro — sujeto. ¿Qué hace? Corre — predicado. “En la mesa” solo no basta; preguntamos ¿qué hay en la mesa?',
      misconceptions: [
        {
          myth: 'Mayúscula y punto bastan.',
          correction: 'Tiene que expresar un pensamiento completo comprensible.',
        },
        {
          myth: 'Las órdenes son fragmentos.',
          correction: 'Tienen sujeto tú elidido; pueden ser completas.',
        },
      ],
      supportEmergingLearners:
        'Teatro de sujeto y acción. Colores en oraciones de bolsillo. Oral antes que escrito.',
      extendForDepth:
        'Sujetos/predicados compuestos. Enredaderas vs oraciones completas.',
      extraPracticeIdeas: [
        '¿Oración o no? con justificación.',
        'Arreglar fragmento añadiendo quién o qué pasa.',
        'Convertir enunciados en preguntas y viceversa.',
      ],
    },
  },
  'eng-crew-text-evidence': {
    en: {
      conceptualDeepDive:
        'Claims need warrants from the text—paraphrase or quote, then link. Teach students to flag strong verbs (“states,” “shows”) vs weak filler (“says stuff”). Model citing line or paragraph and explaining why that line supports the claim. This is the bridge to argumentative writing across subjects.',
      vocabularyTerms: [
        { term: 'Evidence', definition: 'Specific words or details from the text that support an answer.' },
        { term: 'Cite', definition: 'Point to where the text says it—quote or paraphrase accurately.' },
        { term: 'Paraphrase', definition: 'Restate in your own words while keeping the author’s meaning.' },
        { term: 'Inference vs evidence', definition: 'Inferences are okay if grounded in text clues, not pure guesswork.' },
      ],
      sayThisAloud:
        'If I say the character felt nervous, I cannot stop at my feelings. I point to where the text shows it—her hands shook. That line is my evidence. Now I explain how shaking hands connects to nervous.',
      misconceptions: [
        {
          myth: 'Long quotes equal strong answers.',
          correction: 'The shortest precise evidence plus explanation beats dumping a paragraph.',
        },
        {
          myth: '“Because I think so” counts as evidence.',
          correction: 'Personal opinion without text is not textual evidence.',
        },
      ],
      supportEmergingLearners:
        'Provide sentence starters and paragraph numbers on the page. Highlight one line together before independent work.',
      extendForDepth:
        'Compare weak vs strong evidence for the same claim. Integrate two citations. Discuss author’s word choice as evidence of tone.',
      extraPracticeIdeas: [
        'Evidence tournament: which pair best supports the claim?',
        'Color-code claim (green) and evidence (yellow) in a short paragraph.',
        'Cross-curricular: evidence in science reading responses.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las afirmaciones necesitan respaldo del texto — parafrasea o cita y enlaza. Enseña verbos fuertes (“afirma”, “muestra”) frente a relleno débil. Modela citar línea o párrafo y explicar por qué apoya la afirmación. Es el puente hacia la argumentación en todas las materias.',
      vocabularyTerms: [
        { term: 'Evidencia', definition: 'Palabras o detalles del texto que apoyan una respuesta.' },
        { term: 'Citar', definition: 'Señalar dónde lo dice el texto — cita o parafrasis fiel.' },
        { term: 'Parafrasear', definition: 'Decir con tus palabras manteniendo el sentido del autor.' },
        { term: 'Inferencia vs evidencia', definition: 'Inferir está bien si hay pistas en el texto, no pura suposición.' },
      ],
      sayThisAloud:
        'Si digo que el personaje estaba nervioso, no me quedo en mi opinión. Señalo dónde el texto lo muestra: le temblaban las manos. Esa línea es evidencia. Explico cómo temblar conecta con nervios.',
      misconceptions: [
        {
          myth: 'Citas largas siempre ganan.',
          correction: 'La evidencia precisa más explicación breve vence al copiar párrafos.',
        },
        {
          myth: '“Porque yo creo” es evidencia.',
          correction: 'Opinión sin texto no es evidencia textual.',
        },
      ],
      supportEmergingLearners:
        'Inicios de oración y números de párrafo. Resaltar una línea juntos.',
      extendForDepth:
        'Debil vs fuerte para la misma afirmación. Dos citas. Tono y elección léxica.',
      extraPracticeIdeas: [
        'Torneo: ¿qué par apoya mejor?',
        'Colores: afirmación vs evidencia.',
        'Ciencias: evidencia en lectura.',
      ],
    },
  },
  'eng-crew-context-clues': {
    en: {
      conceptualDeepDive:
        'Context clues are educated guesses, not magic. Teach types: definition in the sentence, synonym/antonym, example, or general mood. If clues conflict, reread a wider chunk. Pair with morphology (prefixes/roots) so students have two strategies, not one.',
      vocabularyTerms: [
        { term: 'Context clue', definition: 'Nearby language that hints at an unknown word’s meaning.' },
        { term: 'Synonym clue', definition: 'A word with similar meaning appears nearby.' },
        { term: 'Antonym / contrast clue', definition: '“Unlike,” “but,” or “however” signal an opposite idea.' },
        { term: 'Inference', definition: 'A reasoned guess supported by multiple clues—not wild guessing.' },
      ],
      sayThisAloud:
        'When I hit a hard word, I read the sentence before and after. I ask: did the author define it, give an example, or compare it to something else? I try a substitute word—does the sentence still make sense?',
      misconceptions: [
        {
          myth: 'First guess must be right immediately.',
          correction: 'Good readers revise after rereading; model changing your mind with evidence.',
        },
        {
          myth: 'Context always gives the exact definition.',
          correction: 'Sometimes you only narrow the meaning—that is still useful.',
        },
      ],
      supportEmergingLearners:
        'Underline clue words in three colors for three strategies. Offer a bank of synonym choices to test fit.',
      extendForDepth:
        'Combine morphology + context on the same word. Discuss multiple meanings (homographs) with context.',
      extraPracticeIdeas: [
        'Replace-the-word game with whiteboards.',
        'Create a “clue map” around a target vocabulary word.',
        'Partner A picks a word; Partner B finds the clue phrase.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las pistas del contexto son inferencias, no adivinanza. Tipos: definición en la oración, sinónimo/antónimo, ejemplo o tono general. Si chocan, relee un trozo más amplio. Suma morfología (prefijos/raíces) para tener dos estrategias.',
      vocabularyTerms: [
        { term: 'Pista de contexto', definition: 'Lenguaje cercano que sugiere el significado de una palabra desconocida.' },
        { term: 'Pista sinónima', definition: 'Aparece una palabra de significado parecido cerca.' },
        { term: 'Contraste', definition: '“A diferencia de”, “pero”, “sin embargo” marcan oposición.' },
        { term: 'Inferencia', definition: 'Conjetura razonada apoyada en varias pistas.' },
      ],
      sayThisAloud:
        'Si encuentro una palabra difícil, leo la oración anterior y la siguiente. ¿Definición, ejemplo o comparación? Pruebo otra palabra en su lugar: ¿sigue teniendo sentido?',
      misconceptions: [
        {
          myth: 'La primera suposición debe ser definitiva.',
          correction: 'Los buenos lectores corrigen al releer; modela cambiar de idea con evidencia.',
        },
        {
          myth: 'El contexto siempre da la definición exacta.',
          correction: 'A veces solo acotas el significado — igual sirve.',
        },
      ],
      supportEmergingLearners:
        'Subrayar pistas con colores. Banco de sinónimos para probar encaje.',
      extendForDepth:
        'Morfología + contexto. Homógrafos según el contexto.',
      extraPracticeIdeas: [
        'Sustituir la palabra en pizarra blanca.',
        'Mapa de pistas alrededor del vocablo.',
        'A elige palabra; B encuentra la frase pista.',
      ],
    },
  },
}
