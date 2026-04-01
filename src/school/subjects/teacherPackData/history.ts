import type { BilingualTeacherPack } from '../types'

export const HISTORY_TEACHER_PACKS: Record<string, BilingualTeacherPack> = {
  'hist-tots-then-now': {
    en: {
      conceptualDeepDive:
        'Time words build historical thinking before dates. Compare kindly—change is not “good vs bad” automatically. Photos and objects are evidence that the past looked different. Help students connect family stories to the classroom timeline so history feels human-sized.',
      vocabularyTerms: [
        { term: 'Past / present', definition: 'Then vs now; relative to the speaker’s life and community.' },
        { term: 'Source', definition: 'Something that gives clues about the past (photo, toy, story).' },
        { term: 'Change over time', definition: 'How people, tools, or places become different across years.' },
        { term: 'Compare', definition: 'Notice similarities and differences without ranking people as better/worse.' },
      ],
      sayThisAloud:
        'Long ago is a time before we were born or when our grandparents were little. Today is now. This old photo shows cars looked different—change. We are not saying people were silly; we are noticing what changed.',
      misconceptions: [
        {
          myth: 'Older always means worse.',
          correction: 'Historians describe change, not automatic superiority of the present.',
        },
        {
          myth: 'If I did not see it, it is not real history.',
          correction: 'We learn from stories, photos, and objects even when we were not there.',
        },
      ],
      supportEmergingLearners:
        'Use a concrete object from home (with permission) and a photo replica. Pair “then/now” cards side by side.',
      extendForDepth:
        'Make a class timeline string with three anchors: baby photo, start of school, today.',
      extraPracticeIdeas: [
        'Interview a family member for one “then vs now” fact.',
        'Draw two panels: phone long ago vs phone today.',
        'Museum virtual field trip with “find something old” task.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las palabras del tiempo construyen pensamiento histórico antes que fechas. Compara con respeto — el cambio no es automáticamente bueno o malo. Fotos y objetos prueban que el pasado se veía distinto. Conecta historias familiares con la línea del salón.',
      vocabularyTerms: [
        { term: 'Pasado / presente', definition: 'Antes vs ahora; relativo a nuestras vidas.' },
        { term: 'Fuente', definition: 'Algo que da pistas del pasado (foto, juguete, historia).' },
        { term: 'Cambio en el tiempo', definition: 'Cómo personas, herramientas o lugares se transforman.' },
        { term: 'Comparar', definition: 'Notar semejanzas y diferencias sin jerarquizar personas.' },
      ],
      sayThisAloud:
        'Hace mucho es antes de que nacieras o cuando tus abuelos eran pequeños. Hoy es ahora. Esta foto vieja muestra autos distintos — cambio. No decimos que eran tontos; observamos qué cambió.',
      misconceptions: [
        {
          myth: 'Más viejo = peor.',
          correction: 'Los historiadores describen cambio, no superioridad automática del presente.',
        },
        {
          myth: 'Si no lo vi, no es historia real.',
          correction: 'Aprendemos con historias, fotos y objetos aunque no estuvimos ahí.',
        },
      ],
      supportEmergingLearners:
        'Objeto de casa con permiso y foto. Tarjetas “antes/ahora” juntas.',
      extendForDepth:
        'Línea del tiempo con foto de bebé, inicio de escuela y hoy.',
      extraPracticeIdeas: [
        'Entrevista familiar: un dato antes vs ahora.',
        'Dos viñetas: teléfono antes vs hoy.',
        'Museo virtual: encuentra algo antiguo.',
      ],
    },
  },
  'hist-tots-family-stories': {
    en: {
      conceptualDeepDive:
        'Every family holds history; diversity of structure should be honored. Oral history is valid evidence for young learners even before documents. Practice listening protocols: eye contact, no interrupting, thank-you closing. Link one memory to a feeling or place to deepen recall.',
      vocabularyTerms: [
        { term: 'Oral history', definition: 'Stories passed by speaking and listening, not only books.' },
        { term: 'Memory', definition: 'A person’s recollection of an experience from the past.' },
        { term: 'Respectful listening', definition: 'Body language and patience that honor the speaker.' },
        { term: 'Diversity', definition: 'Families can look different and still hold real histories.' },
      ],
      sayThisAloud:
        'History is not only kings in books—it is also your grown-up remembering when they were little. We listen with eyes and quiet bodies. Afterward we say thank you. Every family’s story matters here.',
      misconceptions: [
        {
          myth: 'Only famous people have history worth telling.',
          correction: 'Ordinary lives are the main fabric of history.',
        },
        {
          myth: 'If stories differ, someone is lying.',
          correction: 'People remember different details; we compare kindly and ask curious questions.',
        },
      ],
      supportEmergingLearners:
        'Model interview with a puppet. Give one question prompt only. Draw the memory after listening.',
      extendForDepth:
        'Record audio with permission; transcribe one sentence as a class artifact.',
      extraPracticeIdeas: [
        'Story stone: touch and tell one memory.',
        'Class book: one sentence per child from home.',
        'Thank-you card to the storyteller.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Toda familia guarda historia; honra la diversidad de formas. La historia oral es evidencia válida. Practica escuchar: mirar, no interrumpir, agradecer. Enlaza un recuerdo con emoción o lugar.',
      vocabularyTerms: [
        { term: 'Historia oral', definition: 'Historias contadas y escuchadas, no solo en libros.' },
        { term: 'Recuerdo', definition: 'Lo que alguien evoca de una experiencia pasada.' },
        { term: 'Escuchar con respeto', definition: 'Cuerpo calmado y paciencia con quien habla.' },
        { term: 'Diversidad', definition: 'Familias distintas con historias verdaderas.' },
      ],
      sayThisAloud:
        'La historia no son solo reyes en libros — también es tu adulto recordando cuando era pequeño. Escuchamos con ojos y cuerpo quieto. Después agradecemos. Cada historia familiar importa aquí.',
      misconceptions: [
        {
          myth: 'Solo los famosos tienen historia.',
          correction: 'Las vidas cotidianas son el tejido de la historia.',
        },
        {
          myth: 'Si los relatos difieren, alguien miente.',
          correction: 'Cada quien recuerda detalles distintos; preguntamos con curiosidad y respeto.',
        },
      ],
      supportEmergingLearners:
        'Entrevista con títere. Una pregunta. Dibujar el recuerdo tras escuchar.',
      extendForDepth:
        'Audio con permiso; transcribir una oración como artefacto de clase.',
      extraPracticeIdeas: [
        'Piedra historia: tocar y contar un recuerdo.',
        'Libro de clase: una oración por niño del hogar.',
        'Tarjeta de gracias al narrador.',
      ],
    },
  },
  'hist-kids-community-helpers': {
    en: {
      conceptualDeepDive:
        'Community roles form a civic web—visibility builds gratitude and safety literacy. Connect jobs to problems they solve (fire, illness, learning, waste). Discuss respectful interaction: 911 for true emergencies, not pranks. Invite a helper visit or video to make abstract roles concrete.',
      vocabularyTerms: [
        { term: 'Community', definition: 'A group of people who live, work, or learn together.' },
        { term: 'Civic role', definition: 'A job or action that helps the common good.' },
        { term: 'Emergency', definition: 'A dangerous situation needing trained helpers quickly.' },
        { term: 'Service', definition: 'Work that supports health, safety, or learning for many people.' },
      ],
      sayThisAloud:
        'Helpers solve real problems: firefighters help when something is burning; teachers help us learn; sanitation workers help keep places clean so we stay healthy. We show respect by following rules that keep them safe too.',
      misconceptions: [
        {
          myth: 'Only uniforms mean important jobs.',
          correction: 'Many vital roles look ordinary—highlight unseen helpers too.',
        },
        {
          myth: 'Calling 911 is for any problem.',
          correction: 'True emergencies only; pair with school protocols for other needs.',
        },
      ],
      supportEmergingLearners:
        'Picture sort: match helper to tool or vehicle. Role-play polite greetings, not dangerous scenarios.',
      extendForDepth:
        'Write a class thank-you with specific examples of how a helper group improved your week.',
      extraPracticeIdeas: [
        'Map of helpers near school.',
        'Guest speaker or recorded tour.',
        'Design a poster: “We can help helpers by ___.”',
      ],
    },
    es: {
      conceptualDeepDive:
        'Los oficios forman una red cívica — verlos genera gratitud y literacia de seguridad. Conecta trabajos con problemas que resuelven (fuego, salud, aprendizaje, basura). Habla de respeto: 911 solo para emergencias reales. Visita o video hace concreto lo abstracto.',
      vocabularyTerms: [
        { term: 'Comunidad', definition: 'Personas que viven, trabajan o aprenden juntas.' },
        { term: 'Rol cívico', definition: 'Trabajo que ayuda al bien común.' },
        { term: 'Emergencia', definition: 'Situación peligrosa que requiere ayuda rápida.' },
        { term: 'Servicio', definition: 'Labor que sostiene salud, seguridad o aprendizaje de muchos.' },
      ],
      sayThisAloud:
        'Los ayudantes resuelven problemas: bomberos cuando hay fuego; maestros para aprender; limpieza para lugares sanos. Respetamos siguiendo reglas que también los protegen.',
      misconceptions: [
        {
          myth: 'Solo uniforme = trabajo importante.',
          correction: 'Muchos roles vitales se ven ordinarios — incluye invisibles.',
        },
        {
          myth: '911 sirve para cualquier cosa.',
          correction: 'Solo emergencias reales; protocolos del cole para lo demás.',
        },
      ],
      supportEmergingLearners:
        'Emparejar foto de ayudante con herramienta. Rol de saludo respetuoso.',
      extendForDepth:
        'Carta de gracias con ejemplos concretos de la semana.',
      extraPracticeIdeas: [
        'Mapa de ayudantes cerca del cole.',
        'Invitado o video.',
        'Póster: “Podemos ayudar a los ayudantes ___.”',
      ],
    },
  },
  'hist-kids-map-landmarks': {
    en: {
      conceptualDeepDive:
        'Maps are models—always partial, always purposeful. Legend first, then scale and direction. Practice translating 2D map to 3D walk to build spatial reasoning. Landmarks anchor mental maps; ask students to draw their own messy-but-meaningful sketch of school or neighborhood.',
      vocabularyTerms: [
        { term: 'Map', definition: 'A simplified picture showing where places are.' },
        { term: 'Legend / key', definition: 'Explains what symbols on the map mean.' },
        { term: 'Symbol', definition: 'A picture standing for a real feature (tree for park).' },
        { term: 'Landmark', definition: 'A noticeable place used to find your way.' },
      ],
      sayThisAloud:
        'Maps lie a little on purpose—they shrink the real world to fit the page. First we read the legend: this blue squiggle is water on our map. Then we walk the route and see if the map matches our steps.',
      misconceptions: [
        {
          myth: 'North is always at the top of every map.',
          correction: 'Check the compass rose or app setting—orientation varies.',
        },
        {
          myth: 'Symbols mean the same on every map.',
          correction: 'Always trust this map’s legend, not memory from another map.',
        },
      ],
      supportEmergingLearners:
        'Large floor map with toy cars. Match photo of school entrance to map symbol.',
      extendForDepth:
        'Measure hallway tiles vs map distance as a rough scale conversation.',
      extraPracticeIdeas: [
        'Treasure hunt with map clues.',
        'Compare globe, map, and satellite image of same region (simplified).',
        'Design a silly map of the playground with a friend.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Los mapas son modelos — siempre parciales y con propósito. Primero leyenda, luego escala y dirección. Pasar del mapa 2D al paseo 3D fortalece el espacio. Los hitos anclan memoria; dibuja un croquis “feo pero significativo” del cole o barrio.',
      vocabularyTerms: [
        { term: 'Mapa', definition: 'Dibujo simplificado de dónde están los lugares.' },
        { term: 'Leyenda', definition: 'Explica qué significan los símbolos.' },
        { term: 'Símbolo', definition: 'Imagen que representa algo real (árbol = parque).' },
        { term: 'Hito / landmark', definition: 'Lugar notable para orientarse.' },
      ],
      sayThisAloud:
        'Los mapas simplifican a propósito — encogen el mundo real. Primero leemos la leyenda: este zigzag azul es agua en nuestro mapa. Luego caminamos y vemos si coincide con nuestros pasos.',
      misconceptions: [
        {
          myth: 'El norte siempre arriba.',
          correction: 'Mira la rosa de los vientos o la app — varía.',
        },
        {
          myth: 'Los símbolos son iguales en todos los mapas.',
          correction: 'Confía en la leyenda de este mapa, no en otro.',
        },
      ],
      supportEmergingLearners:
        'Mapa en el suelo con carritos. Foto de la entrada vs símbolo.',
      extendForDepth:
        'Baldosas del pasillo vs distancia en mapa (escala aproximada).',
      extraPracticeIdeas: [
        'Búsqueda del tesoro con pistas en mapa.',
        'Globo, mapa e imagen satelital simple.',
        'Mapa divertido del patio en parejas.',
      ],
    },
  },
  'hist-crew-timeline-basics': {
    en: {
      conceptualDeepDive:
        'Timelines encode order, not automatic causation—teach both. Scale jumps matter: a century vs a day. BCE/CE is a convention; emphasize zero is not “nothing happened.” Have students caption events with date + short claim to practice precision.',
      vocabularyTerms: [
        { term: 'Chronology', definition: 'The order of events in time.' },
        { term: 'Scale', definition: 'How much time a gap on the line represents.' },
        { term: 'BCE / CE', definition: 'Labels counting backward/forward from a conventional pivot year.' },
        { term: 'Causation', definition: 'Why something happened—needs evidence beyond sequence alone.' },
      ],
      sayThisAloud:
        'This line is a story of order: earlier left, later right. If B is after A, we know timing—not automatically that A caused B. Big spaces can mean long waits between events; tiny spaces can mean a busy day.',
      misconceptions: [
        {
          myth: 'Closer on the timeline always means more related.',
          correction: 'Proximity shows time, not relationship—verify with sources.',
        },
        {
          myth: 'Timelines are only for wars.',
          correction: 'Use them for science, arts, migrations, and everyday class history too.',
        },
      ],
      supportEmergingLearners:
        'Build a human timeline with cards; step forward for each century spoken aloud.',
      extendForDepth:
        'Layer two timelines: local city and national event in same years.',
      extraPracticeIdeas: [
        'Caption contest: best date + one-sentence claim.',
        'Sort shuffled events into order with justification.',
        'Digital timeline tool for one biography.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las líneas guardan orden, no causa automática — enseña ambas. La escala importa: un siglo vs un día. a.C./d.C. es convención; el cero no es “no pasó nada”. Pide pies de foto con fecha + afirmación breve.',
      vocabularyTerms: [
        { term: 'Cronología', definition: 'Orden de eventos en el tiempo.' },
        { term: 'Escala', definition: 'Cuánto tiempo representa un espacio en la línea.' },
        { term: 'a.C. / d.C.', definition: 'Etiquetas que cuentan hacia atrás/adelante desde un punto convencional.' },
        { term: 'Causalidad', definition: 'Por qué ocurrió algo — requiere evidencia, no solo orden.' },
      ],
      sayThisAloud:
        'Esta línea cuenta orden: más antiguo a la izquierda, más reciente a la derecha. Si B va después de A, sabemos tiempo — no que A causó B. Espacios grandes pueden ser siglos; pequeños, un día intenso.',
      misconceptions: [
        {
          myth: 'Cerca en la línea = más relacionado.',
          correction: 'La cercanía es tiempo; hay que verificar con fuentes.',
        },
        {
          myth: 'Solo sirven para guerras.',
          correction: 'Úsalas en ciencia, arte, migraciones e historia del salón.',
        },
      ],
      supportEmergingLearners:
        'Línea humana con tarjetas; un paso por siglo dicho en voz alta.',
      extendForDepth:
        'Dos capas: ciudad y nación en los mismos años.',
      extraPracticeIdeas: [
        'Concurso de pie de foto: fecha + una oración.',
        'Ordenar eventos mezclados con razón.',
        'Herramienta digital para una biografía.',
      ],
    },
  },
  'hist-crew-sources': {
    en: {
      conceptualDeepDive:
        'Primary sources were created close to the event; secondary sources interpret later—both can be biased. Sourcing questions: Who made this? When? For what audience? Corroboration across types beats one perfect doc. Model comparing photo vs textbook caption vs diary.',
      vocabularyTerms: [
        { term: 'Primary source', definition: 'Artifact or record from the time under study.' },
        { term: 'Secondary source', definition: 'Later analysis or summary by someone not present.' },
        { term: 'Bias', definition: 'A tilt influenced by viewpoint, purpose, or missing information.' },
        { term: 'Corroborate', definition: 'Check details across multiple sources.' },
      ],
      sayThisAloud:
        'A photograph from the day can be primary; a textbook chapter written this year is secondary. Both can be useful. Ask: who made it, and why? If only one source says something wild, we hunt for a second source before we believe it.',
      misconceptions: [
        {
          myth: 'Primary always means true; secondary always means false.',
          correction: 'Each type can be accurate or misleading—evaluate with sourcing questions.',
        },
        {
          myth: 'Older sources are automatically better.',
          correction: 'Age is a clue, not proof—check purpose and perspective.',
        },
      ],
      supportEmergingLearners:
        'Provide three labeled baggies: photo, diary excerpt, textbook blurb—sort primary vs secondary as a team.',
      extendForDepth:
        'Analyze two sources that disagree; list possible reasons (audience, error, bias).',
      extraPracticeIdeas: [
        'Source detective worksheet with the same event.',
        'Create a fake “breaking news” post vs a diary—discuss reliability.',
        'Museum primary kit handling rules + discussion.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Primarias cerca del hecho; secundarias interpretan después — ambas pueden sesgarse. Preguntas: ¿quién?, ¿cuándo?, ¿para quién? Corroborar tipos distintos vence un solo documento “perfecto”. Modela foto vs libro vs diario.',
      vocabularyTerms: [
        { term: 'Fuente primaria', definition: 'Objeto o registro de la época estudiada.' },
        { term: 'Fuente secundaria', definition: 'Análisis o resumen posterior de quien no estuvo ahí.' },
        { term: 'Sesgo', definition: 'Inclinación por punto de vista, propósito o información faltante.' },
        { term: 'Corroborar', definition: 'Contrastar detalles en varias fuentes.' },
      ],
      sayThisAloud:
        'Una foto del día puede ser primaria; un capítulo de libro de este año es secundaria. Ambas sirven. Preguntamos quién la hizo y por qué. Si solo una fuente dice algo extremo, buscamos una segunda antes de creer.',
      misconceptions: [
        {
          myth: 'Primaria = verdad; secundaria = mentira.',
          correction: 'Cada tipo puede acertar o engañar — evaluar con preguntas de procedencia.',
        },
        {
          myth: 'Más vieja siempre es mejor.',
          correction: 'La antigüedad es pista, no prueba — mirar propósito y perspectiva.',
        },
      ],
      supportEmergingLearners:
        'Tres sobres: foto, diario, texto de libro — clasificar primaria/secundaria en equipo.',
      extendForDepth:
        'Dos fuentes que discrepan; razones posibles (audiencia, error, sesgo).',
      extraPracticeIdeas: [
        'Ficha detective con el mismo evento.',
        'Noticia falsa vs diario — fiabilidad.',
        'Normas de manejo de objetos de museo + conversación.',
      ],
    },
  },
}
