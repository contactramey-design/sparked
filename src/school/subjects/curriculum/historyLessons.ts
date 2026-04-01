import type { SchoolSubjectLesson } from '../types'

export const HISTORY_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'hist-tots-then-now',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 12,
    caStandards: {
      framework: 'PTKLF',
      codes: ['History–Social Science: sense of time; past vs. present'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations history social science time',
    },
    standardsNote: 'CA PTKLF HSS — time, change, then & now (PK/TK)',
    cardEmoji: '⏳',
    en: {
      title: 'Then and Now',
      summary: 'Compare past and present with photos and stories.',
      objectives: ['Use words “long ago” and “today”', 'Notice one way life changed'],
      teachSections: [
        {
          heading: 'Stories',
          body: 'Long ago, people listened to radio for news. Today many use phones. Both can be true in different times.',
        },
        {
          heading: 'Pictures',
          body: 'Show an old black-and-white street photo vs today. What looks different?',
        },
        {
          heading: 'Kind framing',
          body: 'We are not ranking “better” — we are noticing change.',
        },
        {
          heading: 'Words for time',
          body: '“Today,” “yesterday,” “when I was little,” and “long ago” are all time words — practice putting a family story on that ladder.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-then-q1',
          prompt: '“Long ago” usually means…',
          options: ['A time in the past', 'Only tomorrow', 'Only lunch time'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q2',
          prompt: 'Old photos can help us learn…',
          options: ['How life looked in the past', 'Only the weather tomorrow', 'Nothing at all'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q3',
          prompt: '“Today” usually means…',
          options: ['The time we are living in now', 'Only dinosaur times', 'A made-up planet'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q4',
          prompt: 'When we compare then and now, a good goal is to…',
          options: ['Notice what changed', 'Decide people in the past were silly', 'Ignore all stories'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q5',
          prompt: 'A grown-up’s memory about their childhood is…',
          options: ['A small piece of history we can listen to', 'Never useful', 'Only pretend'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Grandparent interview: “What did you use to listen to music?”',
    },
    es: {
      title: 'Antes y ahora',
      summary: 'Comparar pasado y presente con fotos e historias.',
      objectives: ['Usar “hace mucho tiempo” y “hoy”', 'Notar un cambio en la vida'],
      teachSections: [
        {
          heading: 'Historias',
          body: 'Hace mucho, la gente oía noticias en la radio. Hoy muchos usan el teléfono. Ambas cosas pueden ser ciertas en distintos tiempos.',
        },
        {
          heading: 'Fotos',
          body: 'Muestren una calle antigua en blanco y negro y la calle hoy. ¿Qué cambió?',
        },
        {
          heading: 'Con respeto',
          body: 'No decimos qué era “mejor” — observamos cambios.',
        },
        {
          heading: 'Palabras del tiempo',
          body: '“Hoy,” “ayer,” “cuando era pequeño/a” y “hace mucho” son escalones — practiquen poner una historia familiar en esa escalera.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-then-q1',
          prompt: '“Hace mucho tiempo” suele significar…',
          options: ['Un tiempo en el pasado', 'Solo mañana', 'Solo la hora del almuerzo'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q2',
          prompt: 'Las fotos viejas pueden ayudarnos a…',
          options: ['Ver cómo era la vida antes', 'Solo el clima de mañana', 'Nada'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q3',
          prompt: '“Hoy” suele significar…',
          options: ['El tiempo en que vivimos ahora', 'Solo la era de los dinosaurios', 'Un planeta inventado'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q4',
          prompt: 'Al comparar antes y ahora, un buen objetivo es…',
          options: ['Notar qué cambió', 'Decir que el pasado era tonto', 'Ignorar todas las historias'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-then-q5',
          prompt: 'El recuerdo de un adulto sobre su infancia es…',
          options: ['Un pedacito de historia que podemos escuchar', 'Nunca útil', 'Solo imaginación'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Entrevista familiar: “¿Cómo escuchabas música de niño/a?”',
    },
  },
  {
    id: 'hist-tots-family-stories',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 12,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Self in social context; family roles and personal history'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations history social science family',
    },
    standardsNote: 'CA PTKLF HSS — self, family, personal stories (PK/TK)',
    cardEmoji: '👪',
    en: {
      title: 'My Family Story',
      summary: 'Name family members and a simple story from “when you were little.”',
      objectives: ['Draw or tell one family memory', 'Understand everyone has a history'],
      teachSections: [
        {
          heading: 'Map',
          body: 'Families can look many ways. Sparki draws a simple family map with names.',
        },
        {
          heading: 'Memory',
          body: '“When I was little, we…” — one sentence is enough.',
        },
        {
          heading: 'Listen',
          body: 'We respect every story. No comparing whose family is “best.”',
        },
        {
          heading: 'Then and now in families',
          body: 'Some families live near grandparents; some connect by video — both hold real memories worth sharing.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-fam-q1',
          prompt: 'A family story can tell us…',
          options: ['About people in the past', 'Only about aliens', 'Only about toys for sale'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q2',
          prompt: 'History can include…',
          options: ['Stories from real people’s lives', 'Only made-up movies', 'Only numbers with no people'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q3',
          prompt: 'When someone shares a family memory, we should…',
          options: ['Listen with respect', 'Laugh at them', 'Interrupt every word'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q4',
          prompt: 'Families can look different and still…',
          options: ['Have true stories and history', 'Have no stories', 'Only exist in books'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q5',
          prompt: 'A simple drawing of “when I was little” is…',
          options: ['A way to show history', 'Not allowed', 'Only for adults'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Send home a “one memory” sticky note for grown-ups to help complete.',
    },
    es: {
      title: 'La historia de mi familia',
      summary: 'Nombrar familiares y un recuerdo sencillo de “cuando eras pequeño/a”.',
      objectives: ['Dibujar o contar un recuerdo', 'Entender que todos tienen historia'],
      teachSections: [
        {
          heading: 'Mapa',
          body: 'Las familias son diversas. Sparki dibuja un mapa con nombres.',
        },
        {
          heading: 'Recuerdo',
          body: '“Cuando era pequeño/a, nosotros…” — una oración basta.',
        },
        {
          heading: 'Escuchar',
          body: 'Respetamos cada historia. Sin competir por “la mejor familia.”',
        },
        {
          heading: 'Familias en el tiempo',
          body: 'Algunas familias viven cerca de abuelos; otras se conectan por video — ambas guardan recuerdos reales.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-fam-q1',
          prompt: 'Una historia familiar puede contarnos…',
          options: ['Sobre personas del pasado', 'Solo sobre extraterrestres', 'Solo juguetes en venta'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q2',
          prompt: 'La historia puede incluir…',
          options: ['Historias de vidas reales', 'Solo películas inventadas', 'Solo números sin personas'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q3',
          prompt: 'Cuando alguien cuenta un recuerdo familiar, debemos…',
          options: ['Escuchar con respeto', 'Reírse de la persona', 'Interrumpir cada palabra'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q4',
          prompt: 'Las familias pueden verse distintas y aun así…',
          options: ['Tener historias verdaderas', 'No tener historias', 'Existir solo en libros'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fam-q5',
          prompt: 'Un dibujo sencillo de “cuando era pequeño/a” es…',
          options: ['Una forma de mostrar historia', 'No permitido', 'Solo para adultos'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Nota para casa: “un recuerdo” con ayuda de un adulto.',
    },
  },
  {
    id: 'hist-kids-community-helpers',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 14,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['1.1'],
      gradeSpan: '1',
      cdeSearchQuery: 'California HSS grade 1.1 citizenship community helpers',
    },
    standardsNote: 'CA HSS Gr.1; citizenship & community; 1.1',
    cardEmoji: '🚒',
    en: {
      title: 'Community Helpers',
      summary: 'Name roles that keep a town safe, healthy, and learning.',
      objectives: ['List several helpers', 'Explain one way they help'],
      teachSections: [
        {
          heading: 'Who helps?',
          body: 'Firefighters, nurses, teachers, postal workers, librarians, sanitation workers — many jobs support the community.',
        },
        {
          heading: 'Gratitude',
          body: 'We say thank you with words and by following safety rules that protect helpers too.',
        },
        {
          heading: 'Sparki visit',
          body: 'If you cannot visit in person, watch a short trusted video tour of a fire station or library.',
        },
        {
          heading: 'Rules help everyone',
          body: 'Crosswalks, library voices, and fire drills exist so helpers can do their jobs and people stay safer.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-help-q1',
          prompt: 'A librarian often helps people…',
          options: ['Find books and information', 'Put out house fires alone', 'Fly airplanes only'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q2',
          prompt: 'Community helpers work to…',
          options: ['Support many people in a town or city', 'Only play games all day', 'Hide from neighbors'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q3',
          prompt: 'A firefighter’s job often includes…',
          options: ['Helping during fires and emergencies', 'Only selling ice cream', 'Delivering mail to Mars'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q4',
          prompt: 'A teacher’s job is mainly to…',
          options: ['Help students learn in school', 'Drive the fire truck', 'Print all the money'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q5',
          prompt: 'Sanitation workers help a community by…',
          options: ['Keeping streets and services cleaner and healthier', 'Stopping all learning', 'Removing all parks'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Write thank-you cards to one helper group after a unit.',
    },
    es: {
      title: 'Personas que ayudan en la comunidad',
      summary: 'Nombrar oficios que mantienen segura y sana a la ciudad.',
      objectives: ['Enumerar varios oficios', 'Explicar cómo ayudan'],
      teachSections: [
        {
          heading: '¿Quién ayuda?',
          body: 'Bomberos, enfermeras, maestros, carteros, bibliotecarios, trabajadores de limpieza — muchos trabajos sostienen la comunidad.',
        },
        {
          heading: 'Gratitud',
          body: 'Agradecemos con palabras y siguiendo reglas de seguridad que también protegen a quienes ayudan.',
        },
        {
          heading: 'Visita Sparki',
          body: 'Si no pueden visitar, un video confiable de estación de bomberos o biblioteca.',
        },
        {
          heading: 'Las reglas ayudan',
          body: 'Cruces seguros, voz baja en biblioteca y simulacros permiten que los ayudantes hagan bien su trabajo.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-help-q1',
          prompt: 'Un bibliotecario suele ayudar a…',
          options: ['Encontrar libros e información', 'Apagar incendios solo', 'Solo pilotar aviones'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q2',
          prompt: 'Las personas que ayudan en la comunidad trabajan para…',
          options: ['Apoyar a muchas personas en el pueblo o ciudad', 'Solo jugar todo el día', 'Esconderse de los vecinos'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q3',
          prompt: 'El trabajo de un bombero suele incluir…',
          options: ['Ayudar en incendios y emergencias', 'Solo vender helado', 'Llevar correo a Marte'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q4',
          prompt: 'El trabajo principal de un maestro es…',
          options: ['Ayudar a los estudiantes a aprender', 'Conducir el camión de bomberos', 'Imprimir todo el dinero'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-help-q5',
          prompt: 'Los trabajadores de limpieza ayudan a la comunidad…',
          options: ['Manteniendo calles y servicios más sanos', 'Deteniendo todo aprendizaje', 'Quitando todos los parques'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Tarjetas de gracias a un grupo de ayudantes al terminar la unidad.',
    },
  },
  {
    id: 'hist-kids-map-landmarks',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 14,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['2.2'],
      gradeSpan: '2',
      cdeSearchQuery: 'California HSS grade 2.2 maps geography',
    },
    standardsNote: 'CA HSS Gr.2; geographic skills & maps; 2.2',
    cardEmoji: '🗺️',
    en: {
      title: 'Maps and Landmarks',
      summary: 'Read a simple map: symbols, legend, and “where am I?”',
      objectives: ['Use a map key/legend', 'Find a landmark on a map'],
      teachSections: [
        {
          heading: 'Bird’s-eye view',
          body: 'A map is a drawing from above. It shrinks real places to fit on paper or screen.',
        },
        {
          heading: 'Symbols',
          body: 'A blue shape might be water; a green patch might be a park — check the legend!',
        },
        {
          heading: 'Try it',
          body: 'Sparki hides a sticker on a simple school map — kids point: north, south, office, playground.',
        },
        {
          heading: 'Directions',
          body: 'North, south, east, and west are directions on Earth — a compass rose on the map shows which way is which.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-map-q1',
          prompt: 'A map legend explains…',
          options: ['What symbols mean', 'Only jokes', 'Only the weather next year'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q2',
          prompt: 'A map shows places from…',
          options: ['Above, like a bird looking down', 'Inside the ground only', 'Only underwater only'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q3',
          prompt: 'If the legend shows a tree symbol for a park, that symbol means…',
          options: ['Park (in this map’s key)', 'Always a pizza shop', 'Nothing'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q4',
          prompt: 'A landmark is…',
          options: [
            'A place that is easy to notice and find',
            'Only a made-up dragon',
            'Always underwater',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q5',
          prompt: 'Using a map on a trip can help you…',
          options: ['Plan where to go', 'Remove all streets', 'Ignore safety'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Walk the school map: start at the door, trace the path to the library.',
    },
    es: {
      title: 'Mapas y lugares emblemáticos',
      summary: 'Leer un mapa sencillo: símbolos, leyenda y “¿dónde estoy?”',
      objectives: ['Usar la leyenda del mapa', 'Encontrar un lugar en el mapa'],
      teachSections: [
        {
          heading: 'Vista de pájaro',
          body: 'Un mapa es un dibujo desde arriba. Encoge lugares reales para caber en papel o pantalla.',
        },
        {
          heading: 'Símbolos',
          body: 'Una forma azul puede ser agua; un parche verde un parque — ¡revisen la leyenda!',
        },
        {
          heading: 'Pruébalo',
          body: 'Sparki esconde una calcomanía en un mapa del cole — señalen norte, sur, oficina, patio.',
        },
        {
          heading: 'Direcciones',
          body: 'Norte, sur, este y oeste son direcciones — la rosa de los vientos en el mapa muestra hacia dónde apuntan.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-map-q1',
          prompt: 'La leyenda del mapa explica…',
          options: ['Qué significan los símbolos', 'Solo chistes', 'Solo el clima del año que viene'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q2',
          prompt: 'Un mapa muestra lugares desde…',
          options: ['Arriba, como un pájaro', 'Solo bajo tierra', 'Solo bajo el agua'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q3',
          prompt: 'Si la leyenda muestra un árbol para un parque, ese símbolo en este mapa significa…',
          options: ['Parque (según la leyenda)', 'Siempre una pizzería', 'Nada'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q4',
          prompt: 'Un lugar emblemático (landmark) es…',
          options: [
            'Un sitio fácil de notar y encontrar',
            'Solo un dragón inventado',
            'Siempre bajo el agua',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-map-q5',
          prompt: 'Usar un mapa en un viaje puede ayudar a…',
          options: ['Planear a dónde ir', 'Quitar todas las calles', 'Ignorar la seguridad'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Camino real siguiendo el mapa hasta la biblioteca.',
    },
  },
  {
    id: 'hist-crew-timeline-basics',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 16,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['Historical & Social Sciences Analysis Skills: Chronological thinking (Gr. 4–5)'],
      gradeSpan: '4–5',
      cdeSearchQuery: 'California HSS chronological thinking grade 4',
    },
    standardsNote: 'CA HSS Gr.4–5; chronological reasoning & timelines',
    cardEmoji: '📅',
    en: {
      title: 'Timelines Tell Time Order',
      summary: 'Place events on a line from earlier to later.',
      objectives: ['Use BCE/CE or “long ago / more recent” appropriately', 'Avoid telling cause just from order alone'],
      teachSections: [
        {
          heading: 'Number line for history',
          body: 'Timelines show order. Earlier events go to the left (or bottom) depending on your template.',
        },
        {
          heading: 'Scale',
          body: 'Some timelines show centuries; others show one day. Check the spacing!',
        },
        {
          heading: 'Careful thinking',
          body: 'Because B happened after A does not always mean A caused B — order is a clue, not proof.',
        },
        {
          heading: 'Approximate dates',
          body: 'Historians often use rounded years (“around 1800”) when exact days are unknown — honesty about uncertainty matters.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-time-q1',
          prompt: 'On a typical left-to-right timeline, earlier events appear…',
          options: ['To the left', 'Only in the middle', 'Only off the page'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q2',
          prompt: 'If event B is after event A on a timeline, we know for sure…',
          options: ['B happened later in time', 'A caused B with no other factors', 'B is unimportant'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q3',
          prompt: 'The spacing between dates on a timeline tells you…',
          options: [
            'How much time passed between events (the scale)',
            'Nothing at all',
            'Only the weather',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q4',
          prompt: 'BCE and CE labels help historians…',
          options: [
            'Place years relative to a common reference point',
            'Remove all numbers',
            'Ignore chronology',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q5',
          prompt: 'A good caption for a timeline event should usually include…',
          options: [
            'A short label and a date or time period',
            'Only a doodle with no words',
            'A random guess with no source',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Make a class timeline of the school year — field trips, projects, holidays.',
    },
    es: {
      title: 'Las líneas de tiempo ordenan el pasado',
      summary: 'Colocar eventos de antes a después.',
      objectives: ['Usar “más antiguo / más reciente” o siglas apropiadas', 'No confundir orden con causa'],
      teachSections: [
        {
          heading: 'Recta numérica histórica',
          body: 'Las líneas de tiempo muestran orden. Lo más antiguo va a un lado según tu plantilla.',
        },
        {
          heading: 'Escala',
          body: 'Algunas muestran siglos; otras un solo día. ¡Miren el espacio entre fechas!',
        },
        {
          heading: 'Pensar con cuidado',
          body: 'Que B sea después de A no prueba que A causó B — el orden es pista, no prueba sola.',
        },
        {
          heading: 'Fechas aproximadas',
          body: 'A veces usamos años redondeados (“hacia 1800”) cuando no hay día exacto — es honesto decir qué sabemos y qué no.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-time-q1',
          prompt: 'En una línea de tiempo de izquierda a derecha, lo más antiguo suele estar…',
          options: ['A la izquierda', 'Solo al centro', 'Fuera de la página'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q2',
          prompt: 'Si B está después de A en la línea, sabemos seguro que…',
          options: ['B ocurrió más tarde', 'A causó B sin otros factores', 'B no importa'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q3',
          prompt: 'El espacio entre fechas en una línea de tiempo indica…',
          options: [
            'Cuánto tiempo pasó entre eventos (la escala)',
            'Nada',
            'Solo el clima',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q4',
          prompt: 'Las etiquetas a.C. y d.C. ayudan a…',
          options: [
            'Ubicar años respecto a un punto de referencia común',
            'Quitar todos los números',
            'Ignorar la cronología',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-time-q5',
          prompt: 'Un buen pie de foto para un evento en la línea suele incluir…',
          options: [
            'Una etiqueta breve y una fecha o periodo',
            'Solo un garabato sin palabras',
            'Una suposición al azar sin fuente',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Línea de tiempo del año escolar: excursiones, proyectos, festividades.',
    },
  },
  {
    id: 'hist-crew-sources',
    order: 2,
    ageBands: ['crew'],
    estMinutes: 16,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['Historical & Social Sciences Analysis Skills: Research, evidence, point of view (Gr. 4–5)'],
      gradeSpan: '4–5',
      cdeSearchQuery: 'California HSS primary secondary sources grade 4',
    },
    standardsNote: 'CA HSS Gr.4–5; primary & secondary sources',
    cardEmoji: '📰',
    en: {
      title: 'Primary and Secondary Sources',
      summary: 'Tell an eyewitness artifact from a later retelling.',
      objectives: ['Sort examples into primary vs secondary', 'Explain why both matter'],
      teachSections: [
        {
          heading: 'Primary',
          body: 'Created at or near the time: letters, photographs from the day, artifacts, some interviews.',
        },
        {
          heading: 'Secondary',
          body: 'Later analysis: textbooks, documentaries made years later, many websites that summarize.',
        },
        {
          heading: 'Together',
          body: 'Historians compare many sources. Sparki asks: who made this, when, and why?',
        },
        {
          heading: 'Bias and purpose',
          body: 'Every source has a point of view. Ads, speeches, and diaries can all be “real” yet push different angles — read the purpose.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-src-q1',
          prompt: 'A photograph taken during a 1969 parade is most likely…',
          options: ['A primary source', 'Always fiction', 'A secondary source only'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q2',
          prompt: 'A textbook chapter written in 2020 about ancient Rome is usually…',
          options: ['A secondary source', 'A primary letter from a Roman senator', 'Not a source at all'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q3',
          prompt: 'A diary entry written the day an event happened is usually…',
          options: [
            'Closer to a primary source than a textbook written decades later',
            'Never useful',
            'Automatically 100% complete and unbiased',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q4',
          prompt: 'Why check multiple sources on the same topic?',
          options: [
            'To compare details, spot gaps, and reduce one-sided mistakes',
            'To always pick the shortest website',
            'To avoid ever reading anything',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q5',
          prompt: 'A museum label explaining an object is often…',
          options: [
            'A secondary interpretation, even if the object itself is primary',
            'Never connected to history',
            'Always the same as the object with no added words',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Bring in a family photo vs a story about the photo — compare source types.',
    },
    es: {
      title: 'Fuentes primarias y secundarias',
      summary: 'Distinguir un testimonio cercano de un relato posterior.',
      objectives: ['Clasificar ejemplos', 'Explicar por qué ambas importan'],
      teachSections: [
        {
          heading: 'Primaria',
          body: 'Creada en o cerca del momento: cartas, fotos del día, objetos, algunas entrevistas.',
        },
        {
          heading: 'Secundaria',
          body: 'Análisis posterior: libros de texto, documentales años después, sitios que resumen.',
        },
        {
          heading: 'Juntas',
          body: 'Los historiadores comparan fuentes. Sparki pregunta: ¿quién hizo esto, cuándo y por qué?',
        },
        {
          heading: 'Sesgo y propósito',
          body: 'Toda fuente tiene un ángulo. Anuncios, discursos y diarios pueden ser “reales” y empujar ideas distintas — lean el propósito.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-src-q1',
          prompt: 'Una foto tomada durante un desfile de 1969 probablemente es…',
          options: ['Una fuente primaria', 'Siempre ficción', 'Solo secundaria'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q2',
          prompt: 'Un capítulo de libro de texto de 2020 sobre la Roma antigua suele ser…',
          options: ['Una fuente secundaria', 'Una carta primaria de un senador romano', 'No es fuente'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q3',
          prompt: 'Una entrada de diario escrita el día del suceso suele ser…',
          options: [
            'Más cercana a fuente primaria que un libro décadas después',
            'Nunca útil',
            'Automáticamente 100% completa e imparcial',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q4',
          prompt: '¿Por qué contrastar varias fuentes sobre un tema?',
          options: [
            'Para comparar detalles, ver vacíos y reducir errores de un solo lado',
            'Para elegir siempre el sitio más corto',
            'Para no leer nunca',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-src-q5',
          prompt: 'La etiqueta de un museo que explica un objeto suele ser…',
          options: [
            'Una interpretación secundaria, aunque el objeto sea primario',
            'Nunca relacionada con historia',
            'Siempre idéntica al objeto sin palabras añadidas',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Foto familiar vs historia sobre la foto — comparen tipos de fuente.',
    },
  },
  {
    id: 'hist-tots-fairness-rules',
    order: 3,
    ageBands: ['tots'],
    estMinutes: 12,
    caStandards: {
      framework: 'PTKLF',
      codes: ['History–Social Science: fairness, classroom rules, taking turns'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations social studies fairness',
    },
    standardsNote: 'CA PTKLF HSS — fairness, rules, classroom community (PK/TK)',
    cardEmoji: '🤝',
    en: {
      title: 'Fair and Kind in Our Class',
      summary: 'Why we have rules: safety, fairness, and taking turns.',
      objectives: ['Name one classroom rule and why it helps', 'Practice taking turns with a game'],
      teachSections: [
        {
          heading: 'Rules help everyone',
          body: 'Rules are not punishments—they are promises so everyone can learn and play safely. “Walking feet in the hall” keeps bodies safe.',
        },
        {
          heading: 'Fair vs same',
          body: 'Fair sometimes means everyone gets what they need, not always identical treats. Sparki needs headphones; you might not—that can still be fair.',
        },
        {
          heading: 'Turns',
          body: 'A timer or teacher signal can mark turns so every voice gets a chance.',
        },
        {
          heading: 'Repair',
          body: 'When we forget a rule, we can say sorry and try again—communities grow that way.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-fair-q1',
          prompt: 'A classroom rule is meant to…',
          options: ['Help everyone learn and stay safe', 'Trick students only', 'Remove all fun'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q2',
          prompt: 'Taking turns is important because…',
          options: [
            'Everyone gets a chance to participate',
            'Only one person should ever talk',
            'Turns mean we never share',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q3',
          prompt: 'Fair can mean…',
          options: [
            'People get what they need, which may look different',
            'Everyone always gets the exact same item in every case',
            'Ignoring feelings',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q4',
          prompt: 'If someone breaks a rule on accident, a kind next step is…',
          options: [
            'Say sorry and try the rule again',
            'Never speak to them',
            'Hide forever',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q5',
          prompt: 'Rules connect to being a good citizen in class because…',
          options: [
            'They show care for the group',
            'They mean we ignore friends',
            'They only matter at home',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Home: one family rule and how it keeps everyone safe.',
    },
    es: {
      title: 'Justos y amables en clase',
      summary: 'Para qué sirven las reglas: seguridad, equidad y turnos.',
      objectives: ['Nombrar una regla del salón y por qué ayuda', 'Practicar turnos con un juego'],
      teachSections: [
        {
          heading: 'Reglas para todos',
          body: 'No son castigo — son acuerdos para aprender y jugar seguros. “Caminar en el pasillo” cuida cuerpos.',
        },
        {
          heading: 'Justo vs igual',
          body: 'Justo a veces es que cada quien reciba lo que necesita, no lo mismo siempre. Sparki usa audífonos; tú quizá no — puede ser justo igual.',
        },
        {
          heading: 'Turnos',
          body: 'Temporizador o señal del docente marcan turnos para que cada voz tenga espacio.',
        },
        {
          heading: 'Reparar',
          body: 'Si olvidamos una regla, podemos disculpar e intentar de nuevo.',
        },
      ],
      quiz: [
        {
          id: 'hist-tots-fair-q1',
          prompt: 'Una regla del salón sirve para…',
          options: ['Ayudar a todos a aprender y estar seguros', 'Solo engañar', 'Quitar toda diversión'],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q2',
          prompt: 'Los turnos importan porque…',
          options: [
            'Todos pueden participar',
            'Solo una persona habla siempre',
            'Turnos = nunca compartir',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q3',
          prompt: 'Justo puede significar…',
          options: [
            'Cada quien recibe lo que necesita (puede verse distinto)',
            'Siempre lo mismo exacto en todo',
            'Ignorar sentimientos',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q4',
          prompt: 'Si alguien rompe una regla sin querer, un paso amable es…',
          options: [
            'Disculparse e intentar otra vez',
            'No hablarle nunca',
            'Esconderse siempre',
          ],
          correctIndex: 0,
        },
        {
          id: 'hist-tots-fair-q5',
          prompt: 'Las reglas conectan con ser buen ciudadano en clase porque…',
          options: [
            'Muestran cuidado por el grupo',
            'Significan ignorar amigos',
            'Solo valen en casa',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En casa: una regla familiar y cómo protege a todos.',
    },
  },
  {
    id: 'hist-kids-goods-services',
    order: 3,
    ageBands: ['kids'],
    estMinutes: 14,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['1.2'],
      gradeSpan: '1',
      cdeSearchQuery: 'California HSS grade 1 goods services economics',
    },
    standardsNote: 'CA HSS Gr.1; goods, services, economic choices',
    cardEmoji: '🏪',
    en: {
      title: 'Goods and Services',
      summary: 'Things we touch (goods) vs help people do (services).',
      objectives: ['Sort examples into goods and services', 'Explain one job that provides a service in town'],
      teachSections: [
        {
          heading: 'Goods',
          body: 'Goods are things you can buy or trade—apple, book, bicycle. You can often hold them.',
        },
        {
          heading: 'Services',
          body: 'Services are jobs people do to help—haircut, bus ride, teaching, firefighting. You pay for the help, not a thing to keep forever.',
        },
        {
          heading: 'Choices',
          body: 'Families choose how to spend time and money; communities provide mix of goods and services.',
        },
        {
          heading: 'Map it',
          body: 'Walk a mental map: bakery = good bread; librarian = service of finding books.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-gs-q1',
          prompt: 'A haircut is mainly…',
          options: ['A service', 'A good you take home in a box always', 'Only a plant'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q2',
          prompt: 'A loaf of bread at the store is…',
          options: ['A good', 'A service', 'Only weather'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q3',
          prompt: 'Teaching in a school is…',
          options: ['A service', 'A good like a shoe', 'Not part of community'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q4',
          prompt: 'Which pair is good + service?',
          options: ['Toy + doctor check-up', 'Two different toys only', 'Rain + snow'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q5',
          prompt: 'Communities need both goods and services because…',
          options: [
            'People need things to use and people to help',
            'Only goods matter',
            'Services never help learning',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Grocery trip: name three goods and one service you see.',
    },
    es: {
      title: 'Bienes y servicios',
      summary: 'Cosas que tocamos vs ayuda que recibimos.',
      objectives: ['Clasificar ejemplos en bienes y servicios', 'Explicar un oficio de servicio en el pueblo'],
      teachSections: [
        {
          heading: 'Bienes',
          body: 'Cosas que compras o cambias — manzana, libro, bicicleta. A menudo las puedes sostener.',
        },
        {
          heading: 'Servicios',
          body: 'Trabajos que hacen personas para ayudar — corte de pelo, autobús, enseñar, bomberos. Pagas por la ayuda.',
        },
        {
          heading: 'Decisiones',
          body: 'Las familias eligen tiempo y dinero; la comunidad ofrece bienes y servicios.',
        },
        {
          heading: 'Mapa mental',
          body: 'Panadería = bien pan; bibliotecario = servicio de hallar libros.',
        },
      ],
      quiz: [
        {
          id: 'hist-kids-gs-q1',
          prompt: 'Un corte de pelo es sobre todo…',
          options: ['Un servicio', 'Un bien en caja siempre', 'Solo una planta'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q2',
          prompt: 'Un pan en la tienda es…',
          options: ['Un bien', 'Un servicio', 'Solo clima'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q3',
          prompt: 'Enseñar en la escuela es…',
          options: ['Un servicio', 'Un bien como un zapato', 'No parte de la comunidad'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q4',
          prompt: '¿Qué par es bien + servicio?',
          options: ['Juguete + revisión médica', 'Solo dos juguetes', 'Lluvia + nieve'],
          correctIndex: 0,
        },
        {
          id: 'hist-kids-gs-q5',
          prompt: 'La comunidad necesita bienes y servicios porque…',
          options: [
            'La gente necesita cosas y personas que ayuden',
            'Solo importan bienes',
            'Los servicios no ayudan al aprendizaje',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Super: nombra tres bienes y un servicio.',
    },
  },
  {
    id: 'hist-crew-ca-symbols-regions',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CA_HSS',
      codes: ['4.1', '4.4'],
      gradeSpan: '4',
      cdeSearchQuery: 'California HSS grade 4 state symbols geography',
    },
    standardsNote: 'CA HSS Gr.4; California geography & identity',
    cardEmoji: '🐻',
    en: {
      title: 'California: Symbols and Regions',
      summary: 'State symbols, a huge diverse geography, and why place matters.',
      objectives: ['Name the state capital and one official symbol', 'Describe coast, valley, mountain, desert in simple terms'],
      teachSections: [
        {
          heading: 'Golden State',
          body: 'California is a U.S. state with many environments. Geography affects how people live, farm, and travel.',
        },
        {
          heading: 'Symbols',
          body: 'Flags, seals, and emblems tell stories—grizzly bear (historic population), golden poppy, redwood trees. Sacramento is the state capital.',
        },
        {
          heading: 'Regions preview',
          body: 'Coast with ocean and fog; Central Valley farms; Sierra mountains and snow; southeastern deserts hot and dry.',
        },
        {
          heading: 'Maps again',
          body: 'Use a California wall map: find your county, trace a route from coast to mountains.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-ca-q1',
          prompt: 'The capital of California is…',
          options: ['Sacramento', 'Los Angeles', 'San Francisco'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q2',
          prompt: 'The Pacific Ocean borders California on the…',
          options: ['West', 'East', 'North only always'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q3',
          prompt: 'Which is a California state symbol students often learn?',
          options: ['Golden poppy', 'Palm tree only in Florida', 'Liberty Bell'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q4',
          prompt: 'The Sierra Nevada are mainly…',
          options: ['A mountain range in eastern California', 'An ocean', 'A desert in Europe'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q5',
          prompt: 'Why study regions within one state?',
          options: [
            'Different places have different resources and challenges',
            'Every place is identical',
            'Maps are decorative only',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'License plates, state parks, and county fair—spot California identity.',
    },
    es: {
      title: 'California: símbolos y regiones',
      summary: 'Símbolos del estado, geografía diversa y por qué importa el lugar.',
      objectives: ['Nombrar la capital y un símbolo oficial', 'Describir costa, valle, montaña y desierto'],
      teachSections: [
        {
          heading: 'Estado dorado',
          body: 'California es un estado de EE.UU. con muchos ambientes. La geografía afecta cómo vive la gente.',
        },
        {
          heading: 'Símbolos',
          body: 'Banderas y emblemas cuentan historias — oso grizzly, amapola dorada, secuoyas. Sacramento es la capital.',
        },
        {
          heading: 'Regiones',
          body: 'Costa con océano; Valle Central agrícola; Sierra con nieve; desiertos al sureste.',
        },
        {
          heading: 'Mapas',
          body: 'Mapa mural: encuentra tu condado, ruta costa a montaña.',
        },
      ],
      quiz: [
        {
          id: 'hist-crew-ca-q1',
          prompt: 'La capital de California es…',
          options: ['Sacramento', 'Los Ángeles', 'San Francisco'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q2',
          prompt: 'El océano Pacífico limita California al…',
          options: ['Oeste', 'Este', 'Solo norte siempre'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q3',
          prompt: '¿Qué símbolo del estado estudian mucho?',
          options: ['Amapola dorada', 'Solo palmera de Florida', 'Campana de la Libertad'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q4',
          prompt: 'La Sierra Nevada es sobre todo…',
          options: ['Una cordillera al este de California', 'Un océano', 'Un desierto en Europa'],
          correctIndex: 0,
        },
        {
          id: 'hist-crew-ca-q5',
          prompt: '¿Por qué estudiar regiones dentro de un estado?',
          options: [
            'Distintos lugares tienen distintos recursos y retos',
            'Todo es idéntico',
            'Los mapas son solo decoración',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Placas, parques estatales y feria del condado — identidad californiana.',
    },
  },
]
