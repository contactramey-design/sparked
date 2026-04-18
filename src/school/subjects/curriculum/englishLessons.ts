import type { SchoolSubjectLesson } from '../types'

export const ENGLISH_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'eng-tots-rhyme-time',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Language & Literacy / Phonological Awareness: rhyme and alliteration'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations language literacy phonological awareness',
    },
    standardsNote: 'CA PTKLF ELA — Phonological awareness; rhyme (PK/TK)',
    cardEmoji: '📚',
    en: {
      title: 'Rhyme Time with Sparki',
      summary: 'Hear same ending sounds and finish simple rhymes.',
      objectives: ['Notice words that rhyme', 'Repeat a rhyming pair'],
      teachSections: [
        {
          heading: 'Listen',
          body: 'Rhyming words sound alike at the end: cat, hat, bat. Sparki says “star” — what rhymes? car, far!',
        },
        {
          heading: 'Play',
          body: 'Clap when you hear a rhyme. “Dog — log” clap! “Sun — moon” no clap.',
        },
        {
          heading: 'Together',
          body: 'Make up silly rhymes with names in your class. Fun beats perfect.',
        },
        {
          heading: 'Why rhyme matters',
          body: 'Hearing ending sounds builds the sound system kids need before spelling. Keep it playful and oral-first.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-rhyme-q1',
          prompt: 'Which word rhymes with “tree”?',
          options: ['Free', 'Truck', 'Table'],
          correctIndex: 0,
          dynamic: {
            kind: 'choice_variants',
            variants: [
              { prompt: 'Which word rhymes with “tree”?', options: ['Free', 'Truck', 'Table'], correctIndex: 0 },
              { prompt: 'Which word rhymes with “cake”?', options: ['Bake', 'Chair', 'Door'], correctIndex: 0 },
              { prompt: 'Which word rhymes with “star”?', options: ['Car', 'Kite', 'Book'], correctIndex: 0 },
              { prompt: 'Which word rhymes with “light”?', options: ['Bright', 'Chair', 'Table'], correctIndex: 0 },
            ],
          },
        },
        {
          id: 'eng-tots-rhyme-q2',
          prompt: 'Rhyming words have the same sound…',
          options: ['At the end', 'Only at the start', 'In the middle only'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q3',
          prompt: 'Which pair rhymes?',
          options: ['Cat — hat', 'Cat — dog', 'Sun — truck'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q4',
          prompt: 'Sparki says “king.” Which word could rhyme?',
          options: ['Ring', 'Kite', 'Table'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q5',
          prompt: 'Rhyme practice helps us later with…',
          options: ['Spelling and reading new words', 'Only jumping rope', 'Only art class'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Read a short rhyming book and pause — let kids shout the rhyming word.',
    },
    es: {
      title: 'Rimas con Sparki',
      summary: 'Escuchar sonidos finales iguales y completar rimas sencillas.',
      objectives: ['Notar palabras que riman', 'Repetir un par que rima'],
      teachSections: [
        {
          heading: 'Escuchar',
          body: 'Las palabras que riman suenan parecido al final: gato, plato, pato. Sparki dice “mar” — ¿qué rima? ¡luz… no! “farol” puede rimar en juego.',
        },
        {
          heading: 'Jugar',
          body: 'Aplaudan cuando oigan una rima. “Sol — rol” ¡aplauso! “Casa — perro” no.',
        },
        {
          heading: 'Juntos',
          body: 'Inventen rimas divertidas con nombres del salón. La risa ayuda a aprender.',
        },
        {
          heading: 'Por qué importan las rimas',
          body: 'Oír sonidos finales construye el sistema de sonidos que luego apoya la lectoescritura. Oral primero.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-rhyme-q1',
          prompt: '¿Qué palabra rima con “flor”?',
          options: ['Amor', 'Casa', 'Mesa'],
          correctIndex: 0,
          dynamic: {
            kind: 'choice_variants',
            variants: [
              { prompt: '¿Qué palabra rima con “flor”?', options: ['Amor', 'Casa', 'Mesa'], correctIndex: 0 },
              { prompt: '¿Qué palabra rima con “sol”?', options: ['farol', 'casa', 'mesa'], correctIndex: 0 },
              { prompt: '¿Qué palabra rima con “mar”?', options: ['luz (en juego creativo)', 'silla', 'mesa'], correctIndex: 0 },
              { prompt: '¿Qué palabra rima con “gato”?', options: ['pato', 'mesa', 'luna'], correctIndex: 0 },
            ],
          },
        },
        {
          id: 'eng-tots-rhyme-q2',
          prompt: 'Las palabras que riman suenan parecido…',
          options: ['Al final', 'Solo al inicio', 'Solo en medio'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q3',
          prompt: '¿Qué par rima?',
          options: ['Sol — rol', 'Sol — casa', 'Mesa — luna'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q4',
          prompt: 'Sparki dice “mar.” ¿Qué podría rimar en juego?',
          options: ['Farol (en rimas creativas)', 'Mesa', 'Silla'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-rhyme-q5',
          prompt: 'Practicar rimas ayuda después a…',
          options: ['Leer y escribir palabras nuevas', 'Solo saltar la cuerda', 'Solo clase de arte'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Lean un cuento con rimas y hagan pausa para que digan la palabra que sigue.',
    },
  },
  {
    id: 'eng-tots-first-sounds',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Phonological Awareness: isolate initial sounds in spoken words'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations beginning sounds phonological',
    },
    standardsNote: 'CA PTKLF ELA — Phonological awareness; initial sounds (PK/TK)',
    cardEmoji: '🔤',
    en: {
      title: 'First Sounds',
      summary: 'Hear the first sound in a word.',
      objectives: ['Say the first sound (not the letter name yet)', 'Match two words with the same first sound'],
      teachSections: [
        {
          heading: 'Slow motion',
          body: 'Stretch the word: sssssun. The first sound is /s/. Sparki touches nose for /n/ in “nose.”',
        },
        {
          heading: 'Same sound sort',
          body: '“Ball, bat, bear” all start with /b/. “Cat, cup, kite” — wait, kite starts with /k/!',
        },
        {
          heading: 'Keep it oral',
          body: 'At this age, listening comes before spelling. Celebrate ears, not tests.',
        },
        {
          heading: 'Screening tip',
          body: 'If a child confuses letter names with sounds, return to “stretch and isolate” with picture supports.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-sound-q1',
          prompt: 'The first sound in “milk” is…',
          options: ['/m/', '/k/', '/l/'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q2',
          prompt: 'Which word starts like “turtle”?',
          options: ['Tiger', 'Panda', 'Seal'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q3',
          prompt: 'The first sound in “sun” is…',
          options: ['/s/', '/n/', '/u/'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q4',
          prompt: 'Which does NOT start with /p/?',
          options: ['Pig', 'Table', 'Pan'],
          correctIndex: 1,
        },
        {
          id: 'eng-tots-sound-q5',
          prompt: 'Listening for first sounds helps us later…',
          options: ['Sound out new words', 'Only draw pictures', 'Skip reading'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'On a walk: “What sound do you hear first in ‘leaf’?”',
    },
    es: {
      title: 'Sonidos iniciales',
      summary: 'Escuchar el primer sonido de una palabra.',
      objectives: ['Decir el primer sonido', 'Emparejar dos palabras con el mismo inicio'],
      teachSections: [
        {
          heading: 'Cámara lenta',
          body: 'Estira la palabra: ssssol. El primer sonido es /s/. Sparki toca la nariz con /n/ de “nariz.”',
        },
        {
          heading: 'Clasificar mismo sonido',
          body: '“Casa, coche, cuna” empiezan con /k/. “Gato, galleta” con /g/.',
        },
        {
          heading: 'Solo oral',
          body: 'A esta edad, escuchar viene antes de escribir. Celebren el oído.',
        },
        {
          heading: 'Observación',
          body: 'Si mezclan nombre de letra y sonido, vuelve a “estirar y aislar” con apoyo visual.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-sound-q1',
          prompt: 'El primer sonido en “mesa” es…',
          options: ['/m/', '/a/', '/s/'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q2',
          prompt: '¿Qué palabra empieza como “luna”?',
          options: ['Lápiz', 'Pato', 'Rana'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q3',
          prompt: 'El primer sonido en “sol” es…',
          options: ['/s/', '/l/', '/o/'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-sound-q4',
          prompt: '¿Cuál NO empieza con /p/?',
          options: ['Pelota', 'Mesa', 'Pato'],
          correctIndex: 1,
        },
        {
          id: 'eng-tots-sound-q5',
          prompt: 'Escuchar el inicio ayuda después a…',
          options: ['Descifrar palabras nuevas', 'Solo dibujar', 'Evitar leer'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En un paseo: “¿Qué sonido oyes primero en ‘hoja’?”',
    },
  },
  {
    id: 'eng-kids-main-idea',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['1.RI.2', '1.RL.2'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core ELA 1.RI.2 main topic',
    },
    standardsNote: 'CA CCSS ELA Gr.1; central topic / main idea; 1.RI.2',
    cardEmoji: '📖',
    en: {
      title: 'What Is This Mostly About?',
      summary: 'Find the main idea in a short text or read-aloud.',
      objectives: ['Tell what the text is mostly about in one short sentence', 'Notice title and pictures as clues'],
      teachSections: [
        {
          heading: 'Big picture',
          body: 'The main idea is what the author wants you to remember overall — not every tiny detail.',
        },
        {
          heading: 'Clues',
          body: 'Look at the title: “How Seeds Travel” — the passage is probably about… seeds traveling!',
        },
        {
          heading: 'Sparki check',
          body: 'Ask: “If I only had 10 seconds, what would I tell a friend?” That is often the main idea.',
        },
        {
          heading: 'Detail vs. main',
          body: 'Details support the main idea like bricks; they are important but not the whole house.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-main-q1',
          prompt: 'The main idea tells us…',
          options: [
            'What the text is mostly about',
            'The smallest detail only',
            'Only the last sentence',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q2',
          prompt: 'A good clue for main idea can be…',
          options: ['The title and pictures', 'Only one random word', 'The page number'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q3',
          prompt: 'A paragraph about how bees help plants grow is mostly about…',
          options: ['Bees and pollination', 'Only the color yellow', 'Only a bee’s favorite song'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q4',
          prompt: 'Which is usually a detail, not the main idea?',
          options: [
            'A fact about one tool the character used',
            'The big lesson the whole text teaches',
            'The topic in one sentence',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q5',
          prompt: 'Strong readers fix main idea when…',
          options: [
            'New paragraphs add a bigger picture',
            'They read only the first letter',
            'They ignore the title',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'After a read-aloud, pair-share: “What was that mostly about?”',
    },
    es: {
      title: '¿De qué trata en general?',
      summary: 'Hallar la idea principal en un texto corto o lectura en voz alta.',
      objectives: ['Decir de qué trata el texto en una oración corta', 'Usar título e imágenes como pistas'],
      teachSections: [
        {
          heading: 'Panorama',
          body: 'La idea principal es lo que el autor quiere que recuerdes en conjunto, no cada detalle pequeño.',
        },
        {
          heading: 'Pistas',
          body: 'Mira el título: “Cómo viajan las semillas” — el texto probablemente trata de… ¡semillas que viajan!',
        },
        {
          heading: 'Chequeo Sparki',
          body: 'Pregunta: “Si solo tuviera 10 segundos, ¿qué le diría a un amigo?” Eso suele ser la idea principal.',
        },
        {
          heading: 'Detalle vs. idea',
          body: 'Los detalles apoyan la idea principal; son importantes pero no son el mensaje completo.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-main-q1',
          prompt: 'La idea principal nos dice…',
          options: [
            'De qué trata el texto en general',
            'Solo el detalle más pequeño',
            'Solo la última oración',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q2',
          prompt: 'Una buena pista para la idea principal puede ser…',
          options: ['El título y las imágenes', 'Una palabra al azar', 'El número de página'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q3',
          prompt: 'Un párrafo sobre cómo las abejas ayudan a las plantas trata sobre…',
          options: ['Abejas y polinización', 'Solo el color amarillo', 'La canción favorita de una abeja'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q4',
          prompt: '¿Qué suele ser un detalle y no la idea principal?',
          options: [
            'Un dato sobre una herramienta que usó el personaje',
            'La gran enseñanza de todo el texto',
            'El tema en una oración',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-main-q5',
          prompt: 'Los lectores fuertes ajustan la idea principal cuando…',
          options: [
            'Nuevos párrafos dan una imagen más amplia',
            'Solo leen la primera letra',
            'Ignoran el título',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Después de leer en voz alta, en parejas: “¿De qué se trató en general?”',
    },
  },
  {
    id: 'eng-kids-sentence-parts',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['1.L.1.j', '1.L.2'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core ELA 1.L.1 conventions',
    },
    standardsNote: 'CA CCSS ELA Gr.1; conventions; types of sentences; 1.L.1',
    cardEmoji: '✏️',
    en: {
      title: 'Sentences Tell Complete Thoughts',
      summary: 'Tell a sentence from a fragment; spot asking vs telling sentences.',
      objectives: ['Recognize a complete sentence', 'Know questions often start with question words'],
      teachSections: [
        {
          heading: 'Complete thought',
          body: '“The dog runs.” — sentence. “On the table.” — fragment; we wonder what is on the table?',
        },
        {
          heading: 'Questions',
          body: 'Questions can start with who, what, where, when, why, how — and often end with “?”',
        },
        {
          heading: 'Act it out',
          body: 'Sparki reads aloud: kids stand for a sentence, crouch for a fragment.',
        },
        {
          heading: 'Command sentences',
          body: 'Commands can be short but complete: “Line up quietly.” They tell someone what to do.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-sent-q1',
          prompt: 'Which is a complete sentence?',
          options: ['The frog jumped.', 'Under the bed.', 'Running fast.'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q2',
          prompt: 'A question often ends with…',
          options: ['?', '.', '!'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q3',
          prompt: 'Which is a telling sentence (statement)?',
          options: ['The bus is yellow.', 'Where is the bus?', 'What a bus!'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q4',
          prompt: 'A fragment is…',
          options: [
            'An incomplete thought that leaves us wanting more',
            'Always wrong to write',
            'The same as a paragraph',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q5',
          prompt: 'Which needs more words to be a sentence?',
          options: ['After lunch.', 'We read after lunch.', 'Lunch was tasty.'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'During writing, ask: “Does this tell a full thought someone could understand alone?”',
    },
    es: {
      title: 'Las oraciones cuentan ideas completas',
      summary: 'Distinguir oración de fragmento; reconocer preguntas.',
      objectives: ['Reconocer una oración completa', 'Saber que las preguntas suelen empezar con palabras interrogativas'],
      teachSections: [
        {
          heading: 'Idea completa',
          body: '“El perro corre.” — oración. “En la mesa.” — fragmento; ¿qué hay en la mesa?',
        },
        {
          heading: 'Preguntas',
          body: 'Las preguntas pueden empezar con quién, qué, dónde, cuándo, por qué, cómo — y suelen terminar en “¿…?”',
        },
        {
          heading: 'Representar',
          body: 'Sparki lee: los niños se paran si es oración, se agachan si es fragmento.',
        },
        {
          heading: 'Órdenes',
          body: 'Las órdenes pueden ser cortas pero completas: “Formen fila en silencio.” Dicen qué hacer.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-sent-q1',
          prompt: '¿Cuál es una oración completa?',
          options: ['La rana saltó.', 'Bajo la cama.', 'Corriendo rápido.'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q2',
          prompt: 'Una pregunta suele terminar con…',
          options: ['¿?', '.', '¡!'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q3',
          prompt: '¿Cuál es una oración enunciativa?',
          options: ['El autobús es amarillo.', '¿Dónde está el autobús?', '¡Qué autobús!'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q4',
          prompt: 'Un fragmento es…',
          options: [
            'Una idea incompleta que deja preguntas',
            'Siempre incorrecto escribirlo',
            'Lo mismo que un párrafo',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-sent-q5',
          prompt: '¿Qué necesita más palabras para ser oración?',
          options: ['Después del almuerzo.', 'Leemos después del almuerzo.', 'El almuerzo estuvo rico.'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Al escribir: “¿Esto cuenta una idea que se entiende sola?”',
    },
  },
  {
    id: 'eng-crew-text-evidence',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['4.RI.1', '4.RL.1'],
      gradeSpan: '4',
      cdeSearchQuery: 'California Common Core ELA 4.RI.1 textual evidence',
    },
    standardsNote: 'CA CCSS ELA Gr.4; refer to details and evidence; 4.RI.1',
    cardEmoji: '📝',
    en: {
      title: 'Prove It with the Text',
      summary: 'Support answers with words or lines from the passage.',
      objectives: ['Quote or paraphrase evidence', 'Avoid “just because I think so” answers'],
      teachSections: [
        {
          heading: 'Why evidence?',
          body: 'Strong readers show where the idea comes from in the text — it makes arguments fair and clear.',
        },
        {
          heading: 'Sentence starters',
          body: 'Try: “In paragraph 2, it says…” or “The author explains…”',
        },
        {
          heading: 'Sparki rule',
          body: 'If you cannot point to it, it might be a guess. Guesses are okay for predictions — not for “what happened.”',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-ev-q1',
          prompt: 'Text evidence means…',
          options: [
            'Words or details from the passage that support your answer',
            'Only your opinion with no proof',
            'A picture you drew that is not in the text',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q2',
          prompt: 'Which is stronger for “The character felt nervous”?',
          options: [
            '“Her hands shook before the test.” (from the story)',
            '“I would be nervous too.”',
            '“Nervous is a feeling.”',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q3',
          prompt: 'Paraphrasing evidence still counts if…',
          options: [
            'It stays true to the passage meaning',
            'You change the story completely',
            'You avoid the text entirely',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q4',
          prompt: 'Which question checks for evidence?',
          options: [
            '“Where does the text say that?”',
            '“What is your favorite color?”',
            '“Do you like pizza?”',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q5',
          prompt: 'Two details from the text that agree strengthen an answer because…',
          options: [
            'They show a pattern, not a lucky guess',
            'Longer answers are always true',
            'Pictures replace reading',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Highlight one line together on the board before students write.',
    },
    es: {
      title: 'Pruébalo con el texto',
      summary: 'Apoyar respuestas con palabras o líneas del pasaje.',
      objectives: ['Citar o parafrasear evidencia', 'Evitar respuestas solo por opinión'],
      teachSections: [
        {
          heading: '¿Por qué evidencia?',
          body: 'Los lectores fuertes muestran de dónde sale la idea en el texto — hace el argumento claro y justo.',
        },
        {
          heading: 'Inicios de oración',
          body: 'Prueba: “En el párrafo 2 dice…” o “El autor explica…”',
        },
        {
          heading: 'Regla Sparki',
          body: 'Si no puedes señalarlo en el texto, puede ser una suposición. Las predicciones son distintas a “qué pasó.”',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-ev-q1',
          prompt: 'Evidencia del texto significa…',
          options: [
            'Palabras o detalles del pasaje que apoyan tu respuesta',
            'Solo tu opinión sin prueba',
            'Un dibujo que no está en el texto',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q2',
          prompt: '¿Qué es más fuerte para “El personaje estaba nervioso”?',
          options: [
            '“Le temblaban las manos antes del examen.” (del cuento)',
            '“Yo también estaría nervioso.”',
            '“Nervioso es un sentimiento.”',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q3',
          prompt: 'Parafrasear evidencia cuenta si…',
          options: [
            'Se mantiene fiel al sentido del texto',
            'Cambias la historia por completo',
            'Evitas el texto por completo',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q4',
          prompt: '¿Qué pregunta revisa si hay evidencia?',
          options: [
            '“¿Dónde dice el texto eso?”',
            '“¿Cuál es tu color favorito?”',
            '“¿Te gusta la pizza?”',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-ev-q5',
          prompt: 'Dos detalles del texto que coinciden fortalecen una respuesta porque…',
          options: [
            'Muestran un patrón, no una suposición aislada',
            'Las respuestas largas siempre son verdad',
            'Las imágenes reemplazan la lectura',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Resalten juntos una línea en la pizarra antes de escribir.',
    },
  },
  {
    id: 'eng-crew-context-clues',
    order: 2,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['4.L.4.a', '5.L.4.a'],
      gradeSpan: '4–5',
      cdeSearchQuery: 'California Common Core ELA 4.L.4 context clues',
    },
    standardsNote: 'CA CCSS ELA Gr.4–5; context clues; 4.L.4.a',
    cardEmoji: '🔍',
    en: {
      title: 'Context Clues for New Words',
      summary: 'Use nearby sentences to guess a word’s meaning.',
      objectives: ['Identify definition, example, or contrast clues', 'Revise a guess after rereading'],
      teachSections: [
        {
          heading: 'Clue types',
          body: 'Sometimes an author gives a definition: “Nocturnal, meaning active at night…” Sometimes an example: “like eagles and hawks.”',
        },
        {
          heading: 'Replace test',
          body: 'Swap the hard word with a guess. If the sentence still makes sense, you might be close.',
        },
        {
          heading: 'Reread',
          body: 'Sparki reads the sentence before and after — context is a neighborhood, not one word alone.',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-cc-q1',
          prompt: 'Context clues are found…',
          options: [
            'Near the unknown word in the passage',
            'Only in the dictionary at the back',
            'Only in the title',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q2',
          prompt: '“Unlike his shy sister, Marco was gregarious.” A good guess for gregarious is…',
          options: ['Outgoing or social', 'Very quiet', 'Exactly like his sister'],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q3',
          prompt: 'A contrast clue often uses words like…',
          options: ['Unlike, but, however', 'Always, never, forever', 'Red, blue, green'],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q4',
          prompt: 'After your first guess from context, you should…',
          options: [
            'Reread to confirm or revise',
            'Stop reading completely',
            'Skip every hard word',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q5',
          prompt: 'Which is a sign you mis-guessed a word’s meaning?',
          options: [
            'The next sentences contradict your idea',
            'The font is large',
            'The page number is even',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Keep a “clue chart”: word, guess, evidence phrase, final meaning.',
    },
    es: {
      title: 'Pistas del contexto para palabras nuevas',
      summary: 'Usar oraciones cercanas para inferir el significado.',
      objectives: ['Identificar definición, ejemplo o contraste', 'Ajustar la hipótesis al releer'],
      teachSections: [
        {
          heading: 'Tipos de pista',
          body: 'A veces el autor define: “Nocturno, es decir, activo de noche…” A veces da ejemplo: “como águilas y halcones.”',
        },
        {
          heading: 'Prueba de sustitución',
          body: 'Cambia la palabra difícil por una suposición. Si la oración sigue teniendo sentido, vas cerca.',
        },
        {
          heading: 'Releer',
          body: 'Sparki lee la oración de antes y la de después — el contexto es un vecindario, no una sola palabra.',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-cc-q1',
          prompt: 'Las pistas de contexto están…',
          options: [
            'Cerca de la palabra desconocida',
            'Solo en el diccionario del final',
            'Solo en el título',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q2',
          prompt: '“A diferencia de su hermana tímida, Marco era gregario.” Una buena suposición es…',
          options: ['Sociable o extrovertido', 'Muy callado', 'Igual que su hermana'],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q3',
          prompt: 'Una pista de contraste suele usar palabras como…',
          options: ['A diferencia de, pero, sin embargo', 'Siempre, nunca, para siempre', 'Rojo, azul, verde'],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q4',
          prompt: 'Después de tu primera suposición con contexto, debes…',
          options: [
            'Releer para confirmar o ajustar',
            'Dejar de leer por completo',
            'Saltarte cada palabra difícil',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-cc-q5',
          prompt: '¿Qué señal indica que te equivocaste con el significado?',
          options: [
            'Las siguientes oraciones contradicen tu idea',
            'La letra es grande',
            'El número de página es par',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Cuadro: palabra, suposición, frase de evidencia, significado final.',
    },
  },
  {
    id: 'eng-tots-story-three-pictures',
    order: 3,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Language & Literacy: retell events in sequence from pictures'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations listening comprehension sequence',
    },
    standardsNote: 'CA PTKLF ELA — listen & retell; beginning, middle, end (PK/TK)',
    cardEmoji: '🖼️',
    en: {
      title: 'Picture Story Order',
      summary: 'Put three pictures in order and tell what happens first, next, last.',
      objectives: ['Sequence three familiar events', 'Use words: first, next, last'],
      teachSections: [
        {
          heading: 'Story time',
          body: 'Stories have a beginning, middle, and end. Show three pictures out of order—invite children to arrange them so the story makes sense.',
        },
        {
          heading: 'Clue words',
          body: 'Model: “First we wash hands. Next we get snack. Last we sit down.” Point to each picture as you say the word.',
        },
        {
          heading: 'Sparki mix-up',
          body: 'Sparki puts “sleep” before “brush teeth”—laugh gently and fix the order together. Logic matters more than perfect grammar.',
        },
        {
          heading: 'Oral only',
          body: 'At this age, focus on listening and speaking; writing comes later.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-seq-q1',
          prompt: 'A story usually has…',
          options: ['A beginning, middle, and end', 'Only one picture', 'No order'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q2',
          prompt: '“First” tells us…',
          options: ['What happens at the start', 'What happens last only', 'A color'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q3',
          prompt: 'If picture 2 shows eating and picture 1 shows cooking, which usually comes first?',
          options: ['Cooking', 'Eating', 'They are the same moment'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q4',
          prompt: '“Last” means…',
          options: ['The final step', 'The first step', 'The middle only'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q5',
          prompt: 'Putting pictures in story order helps us…',
          options: ['Understand what happened and when', 'Skip listening', 'Remove all words'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Bedtime: three photos on phone—child narrates first, next, last.',
    },
    es: {
      title: 'Orden de cuento con imágenes',
      summary: 'Ordena tres dibujos y cuenta primero, luego, al final.',
      objectives: ['Secuenciar tres eventos conocidos', 'Usar: primero, luego, al final'],
      teachSections: [
        {
          heading: 'Hora del cuento',
          body: 'Los cuentos tienen inicio, medio y final. Muestra tres imágenes desordenadas — ordénenlas para que tengan sentido.',
        },
        {
          heading: 'Palabras pista',
          body: '“Primero nos lavamos las manos. Luego tomamos merienda. Al final nos sentamos.” Señala cada imagen.',
        },
        {
          heading: 'Sparki se equivoca',
          body: 'Sparki pone dormir antes de cepillar — corrijan con risa. La lógica importa más que la gramática perfecta.',
        },
        {
          heading: 'Solo oral',
          body: 'A esta edad: escuchar y hablar; escribir después.',
        },
      ],
      quiz: [
        {
          id: 'eng-tots-seq-q1',
          prompt: 'Un cuento suele tener…',
          options: ['Inicio, medio y final', 'Solo una imagen', 'Sin orden'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q2',
          prompt: '“Primero” nos dice…',
          options: ['Lo que pasa al comienzo', 'Solo lo último', 'Un color'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q3',
          prompt: 'Si 2 es comer y 1 es cocinar, ¿qué suele ir primero?',
          options: ['Cocinar', 'Comer', 'Es el mismo momento'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q4',
          prompt: '“Al final” significa…',
          options: ['El último paso', 'El primero', 'Solo el medio'],
          correctIndex: 0,
        },
        {
          id: 'eng-tots-seq-q5',
          prompt: 'Ordenar imágenes ayuda a…',
          options: ['Entender qué pasó y cuándo', 'No escuchar', 'Quitar las palabras'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Antes de dormir: tres fotos — narra primero, luego, al final.',
    },
  },
  {
    id: 'eng-kids-blend-sounds-cvc',
    order: 3,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['1.RF.B.4', '1.RF.C.3'],
      gradeSpan: '1',
      cdeSearchQuery: 'California Common Core ELA grade 1 phonics blending',
    },
    standardsNote: 'CA CCSS ELA Gr.1; blend sounds; decode one-syllable words',
    cardEmoji: '🔡',
    en: {
      title: 'Blend Sounds into Words',
      summary: 'Stretch sounds together to read CVC words (consonant-vowel-consonant).',
      objectives: ['Blend three phonemes orally', 'Read simple CVC words with familiar patterns'],
      teachSections: [
        {
          heading: 'What is blending?',
          body: '/c/ /a/ /t/ said smoothly becomes “cat.” Start by stretching, then speed up until it sounds like a word.',
        },
        {
          heading: 'Tap and blend',
          body: 'Tap shoulder–elbow–wrist for each sound, then sweep your hand to blend. Sparki uses robot voice then smooth voice.',
        },
        {
          heading: 'Change one sound',
          body: 'Change cat → mat → map to show how one sound swap changes the whole word.',
        },
        {
          heading: 'Meaning check',
          body: 'After blending, ask: is that a real word? If not, re-blend or check the vowel.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-blend-q1',
          prompt: 'Blend /s/ /i/ /t/ — what word?',
          options: ['Sit', 'Set', 'Sat'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q2',
          prompt: 'Blending means…',
          options: [
            'Putting sounds together smoothly to hear a word',
            'Saying only letter names',
            'Skipping the middle sound always',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q3',
          prompt: 'Which word is CVC?',
          options: ['Dog', 'Play', 'Train'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q4',
          prompt: 'If you have /h/ /o/ /p/, you get…',
          options: ['Hop', 'Hope', 'Hoop'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q5',
          prompt: 'After you blend, a good reader…',
          options: [
            'Checks if it sounds like a real word they know',
            'Stops without thinking',
            'Ignores vowels',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Label toy bins with CVC words—blend aloud before opening.',
    },
    es: {
      title: 'Juntar sonidos en palabras',
      summary: 'Estira y une sonidos para leer palabras CVC.',
      objectives: ['Unir tres fonemas en oral', 'Leer CVC con patrones conocidos'],
      teachSections: [
        {
          heading: '¿Qué es fusionar?',
          body: '/m/ /a/ /n/ dicho fluido se vuelve “man.” Empieza estirando y acelera hasta oír palabra.',
        },
        {
          heading: 'Toca y fusiona',
          body: 'Toca hombro–codo–muñeca por cada sonido, luego barre la mano para fusionar. Sparki: voz de robot y luego voz suave.',
        },
        {
          heading: 'Cambia un sonido',
          body: 'Casa → masa → mesa: un cambio de sonido cambia la palabra entera.',
        },
        {
          heading: 'Chequeo de sentido',
          body: 'Después de fusionar: ¿es palabra real? Si no, vuelve a fusionar o revisa la vocal.',
        },
      ],
      quiz: [
        {
          id: 'eng-kids-blend-q1',
          prompt: 'Fusiona /s/ /o/ /l/ — ¿qué palabra?',
          options: ['Sol', 'Sal', 'Sil'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q2',
          prompt: 'Fusionar significa…',
          options: [
            'Juntar sonidos con fluidez para oír una palabra',
            'Solo decir nombres de letras',
            'Saltarse siempre el sonido del medio',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q3',
          prompt: '¿Qué palabra es tipo CVC?',
          options: ['Pan', 'Clase', 'Brillo'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q4',
          prompt: 'Fusiona /s/ /a/ /l/ — ¿qué palabra?',
          options: ['Sal', 'Sol', 'Sil'],
          correctIndex: 0,
        },
        {
          id: 'eng-kids-blend-q5',
          prompt: 'Tras fusionar, un buen lector…',
          options: [
            'Comprueba si suena como palabra que conoce',
            'Se detiene sin pensar',
            'Ignora las vocales',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Etiquetas CVC en cajas de juguetes — fusiona en voz alta antes de abrir.',
    },
  },
  {
    id: 'eng-crew-summary-paragraph',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CCSS_ELA',
      codes: ['4.RI.2', '4.RL.2'],
      gradeSpan: '4',
      cdeSearchQuery: 'California Common Core ELA 4.RI.2 summary',
    },
    standardsNote: 'CA CCSS ELA Gr.4; summarize in a paragraph',
    cardEmoji: '📄',
    en: {
      title: 'Summarize in Your Own Words',
      summary: 'Turn a short passage into one tight paragraph—main ideas only.',
      objectives: ['Leave out minor details', 'Use a topic sentence + supporting sentence(s)'],
      teachSections: [
        {
          heading: 'Summary vs retell',
          body: 'A retell can include many details; a summary is shorter and stresses the most important ideas the author wants remembered.',
        },
        {
          heading: 'Ban copy-paste',
          body: 'Change wording and sentence structure—summaries are paraphrases, not lifted phrases (except short quotes when assigned).',
        },
        {
          heading: 'Shrink steps',
          body: 'List 3–5 key ideas, combine related ones, then write one topic sentence that names the focus.',
        },
        {
          heading: 'Length target',
          body: 'Aim for 3–5 sentences for a page of text; adjust for longer passages by scaling.',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-sum-q1',
          prompt: 'A summary should mainly…',
          options: [
            'Capture the most important ideas in fewer words',
            'Repeat every detail in the same order',
            'Add new facts the author did not say',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q2',
          prompt: 'Which belongs in a summary least?',
          options: [
            'A tiny side joke that does not change the main point',
            'The central problem the text explains',
            'The author’s main claim in informational text',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q3',
          prompt: 'Good summaries usually…',
          options: [
            'Use your own words with new sentence shapes',
            'Copy the whole first paragraph only',
            'Ignore the title',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q4',
          prompt: 'A strong topic sentence for a summary…',
          options: [
            'Names what the whole passage is mostly about',
            'Lists only the last detail',
            'Says “Once upon a time” always',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q5',
          prompt: 'If your summary is as long as the original, you probably…',
          options: [
            'Need to cut details and merge ideas',
            'Are finished',
            'Should add more jokes',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'News article: challenge students to headline + 3-sentence summary.',
    },
    es: {
      title: 'Resumir con tus palabras',
      summary: 'Convierte un texto corto en un párrafo breve — solo ideas principales.',
      objectives: ['Dejar fuera detalles menores', 'Usar tema + apoyo en oraciones propias'],
      teachSections: [
        {
          heading: 'Resumen vs relato',
          body: 'El relato puede traer muchos detalles; el resumen es más corto y enfatiza lo que el autor quiere que recuerdes.',
        },
        {
          heading: 'Sin copiar',
          body: 'Cambia palabras y estructura — el resumen parafrasea, no copia frases largas.',
        },
        {
          heading: 'Encoger',
          body: 'Lista 3–5 ideas clave, combina las relacionadas, escribe una oración tópico.',
        },
        {
          heading: 'Extensión',
          body: 'Apunta a 3–5 oraciones por página de texto; ajusta si el pasaje es más largo.',
        },
      ],
      quiz: [
        {
          id: 'eng-crew-sum-q1',
          prompt: 'Un resumen debe sobre todo…',
          options: [
            'Captar las ideas más importantes con menos palabras',
            'Repetir cada detalle en el mismo orden',
            'Añadir datos que el autor no dijo',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q2',
          prompt: '¿Qué encaja menos en un resumen?',
          options: [
            'Un chiste menor que no cambia el punto central',
            'El problema central que explica el texto',
            'La afirmación principal en texto informativo',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q3',
          prompt: 'Los buenos resúmenes suelen…',
          options: [
            'Usar tus palabras con estructuras nuevas',
            'Copiar solo el primer párrafo entero',
            'Ignorar el título',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q4',
          prompt: 'Una buena oración tópico de resumen…',
          options: [
            'Nombra de qué trata el pasaje en conjunto',
            'Lista solo el último detalle',
            'Dice “Érase una vez” siempre',
          ],
          correctIndex: 0,
        },
        {
          id: 'eng-crew-sum-q5',
          prompt: 'Si tu resumen es tan largo como el original, probablemente…',
          options: [
            'Debes cortar detalles y fusionar ideas',
            'Ya terminaste',
            'Debes añadir más chistes',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Noticia: titular + resumen de 3 oraciones.',
    },
  },
]
