import type { SchoolSubjectLesson } from '../types'

export const HISTORY_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'hist-tots-then-now',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Time & change (pre-K)',
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
      ],
      realWorldTip: 'Entrevista familiar: “¿Cómo escuchabas música de niño/a?”',
    },
  },
  {
    id: 'hist-tots-family-stories',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Self & family in time (pre-K)',
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
      ],
      realWorldTip: 'Nota para casa: “un recuerdo” con ayuda de un adulto.',
    },
  },
  {
    id: 'hist-kids-community-helpers',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: 'Civics & community (Grades 1–2)',
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
      ],
      realWorldTip: 'Tarjetas de gracias a un grupo de ayudantes al terminar la unidad.',
    },
  },
  {
    id: 'hist-kids-map-landmarks',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: 'Geography basics (Grades 1–2)',
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
      ],
      realWorldTip: 'Camino real siguiendo el mapa hasta la biblioteca.',
    },
  },
  {
    id: 'hist-crew-timeline-basics',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Chronological reasoning (Grades 3–5)',
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
      ],
      realWorldTip: 'Línea de tiempo del año escolar: excursiones, proyectos, festividades.',
    },
  },
  {
    id: 'hist-crew-sources',
    order: 2,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Historical sources (Grades 3–5)',
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
      ],
      realWorldTip: 'Foto familiar vs historia sobre la foto — comparen tipos de fuente.',
    },
  },
]
