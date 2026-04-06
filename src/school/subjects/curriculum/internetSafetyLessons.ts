/**
 * School Internet safety — structured like other school subjects.
 * Scaffold lessons: replace copy and expand to mirror consumer `social-safety` track depth.
 */
import type { SchoolSubjectLesson } from '../types'

export const INTERNET_SAFETY_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'safety-tots-screen-balance',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 12,
    gradeSpan: { en: 'Typical US grades: Pre-K–K', es: 'Grados EE. UU. típicos: Pre-K–K' },
    standardsNote: 'Pilot: pair with your district’s media-literacy / digital citizenship scope (early childhood).',
    cardEmoji: '🛡️',
    cardImageUrl: '/safety-card.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'Screens rest & kind watching (scaffold)',
      summary: 'Short, gentle routines: breaks, grown-up help, and kind choices when we watch together.',
      objectives: ['Name one “pause and rest” idea', 'Ask a grown-up when something feels confusing'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Screens can be fun and also tiring. Our bodies need wiggles, water, and eyes-away time.\n\nWhen something on a screen feels loud, scary, or confusing, a trusted grown-up is the right helper — not a stranger online.',
          bullets: ['Practice “pause the show” and stretch', 'Name one person at school or home who helps with tricky clicks'],
        },
        {
          heading: 'Try it',
          body: 'Pretend you finished a short clip. What could we do next that is not a screen? (draw, blocks, outside, snack)\n\nKind watching means we do not laugh at someone who is upset on a video — we turn to a grown-up.',
          bullets: ['Draw a “rest break” picture', 'Role-play asking for help with one simple phrase'],
        },
      ],
      quiz: [
        {
          id: 'safety-tots-screen-balance-q1',
          prompt: 'If a video feels scary or confusing, a good next step is…',
          options: ['Tell a trusted grown-up', 'Keep watching alone', 'Click every pop-up'],
          correctIndex: 0,
        },
        {
          id: 'safety-tots-screen-balance-q2',
          prompt: 'After screen time, our bodies often need…',
          options: ['A break to move or rest', 'Only more screen time', 'To hide the tablet forever'],
          correctIndex: 0,
        },
        {
          id: 'safety-tots-screen-balance-q3',
          prompt: 'Kind watching means…',
          options: [
            'We ask for help when something feels wrong',
            'We only watch in the dark alone',
            'We share passwords with new friends',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Set a visual timer for a short watch, then do a two-minute “wiggle break” together.',
      realWorldTip:
        'Young children learn habits from routines. A predictable “watch → break → play” rhythm builds balance without shame.',
    },
    es: {
      title: 'Pantallas, descanso y ver con amabilidad (borrador)',
      summary: 'Rutinas breves: pausas, ayuda de un adulto y decisiones amables cuando vemos juntos.',
      objectives: ['Nombrar una idea de “pausa y descanso”', 'Pedir ayuda a un adulto si algo confunde'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Las pantallas pueden ser divertidas y también cansar. Necesitamos movernos, beber agua y descansar la vista.\n\nSi algo se siente fuerte, raro o confuso, un adulto de confianza ayuda — no un desconocido en internet.',
          bullets: ['Practiquen “pausa al show” y estirarse', 'Nombren a alguien en casa o escuela que ayuda con clics difíciles'],
        },
        {
          heading: 'Pruébalo',
          body: 'Imaginen que terminaron un video corto. ¿Qué podemos hacer después que no sea pantalla? (dibujar, bloques, afuera, snack)\n\nVer con amabilidad: no nos reímos si alguien se siente mal en un video — vamos con un adulto.',
          bullets: ['Dibuja un dibujo de “pausa de descanso”', 'Juega a pedir ayuda con una frase corta'],
        },
      ],
      quiz: [
        {
          id: 'safety-tots-screen-balance-q1',
          prompt: 'Si un video da miedo o confunde, un buen paso es…',
          options: ['Decírselo a un adulto de confianza', 'Seguir viendo solo', 'Pulsar todo lo que salga'],
          correctIndex: 0,
        },
        {
          id: 'safety-tots-screen-balance-q2',
          prompt: 'Después de pantalla, el cuerpo suele necesitar…',
          options: ['Una pausa para moverse o descansar', 'Solo más pantalla', 'Esconder la tablet para siempre'],
          correctIndex: 0,
        },
        {
          id: 'safety-tots-screen-balance-q3',
          prompt: 'Ver con amabilidad significa…',
          options: [
            'Pedir ayuda cuando algo se siente mal',
            'Solo ver a oscuras y solo',
            'Compartir contraseñas con amigos nuevos',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Usen un temporizador visual para ver poco tiempo y luego dos minutos de “movimiento”.',
      realWorldTip:
        'Los hábitos se aprenden con rutinas. Un ritmo “ver → pausa → jugar” enseña equilibrio sin culpa.',
    },
  },
  {
    id: 'safety-kids-kind-online',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 14,
    gradeSpan: { en: 'Typical US grades: 1–2', es: 'Grados EE. UU. típicos: 1.º–2.º' },
    standardsNote: 'Pilot: map to ISTE / state digital citizenship indicators for grades 1–2 as you expand lessons.',
    cardEmoji: '💬',
    cardImageUrl: '/social-safety-covers/instagram.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'Kind words & asking for help online (scaffold)',
      summary: 'Treat chats like the playground: kind words, no meanness, and tell an adult if something is off.',
      objectives: ['Compare kind vs hurtful messages', 'Name two trusted adults for “something feels wrong”'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Online spaces are still real people. Words can help classmates feel brave — or hurt.\n\nWe do not share private family info, passwords, or meet-ups with strangers. If someone asks for those, we stop and get a grown-up.',
          bullets: ['Sort examples: “fun joke” vs “targeting someone”', 'Practice “I’m getting an adult” as a full sentence'],
        },
        {
          heading: 'Try it',
          body: 'Read two short pretend messages. Which one is kind? Which one should we show a teacher?\n\nIf you see meanness, you are not a tattletale — you are helping keep the community safe.',
          bullets: ['Write a kind reply to a friend who is nervous about homework', 'Circle who you would tell: teacher, parent, counselor'],
        },
      ],
      quiz: [
        {
          id: 'safety-kids-kind-online-q1',
          prompt: 'A stranger in a game asks for your address. You should…',
          options: ['Say no and tell a trusted adult', 'Share only the street name', 'Send a funny picture'],
          correctIndex: 0,
        },
        {
          id: 'safety-kids-kind-online-q2',
          prompt: 'Kind online behavior is closest to…',
          options: ['Encouraging and including others', 'Only winning arguments', 'Sharing someone’s secret to be funny'],
          correctIndex: 0,
        },
        {
          id: 'safety-kids-kind-online-q3',
          prompt: 'If a message makes you feel unsafe, a strong plan is…',
          options: [
            'Stop, screenshot or remember it, tell a trusted adult',
            'Reply with your full name',
            'Delete your account without telling anyone',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Family practice: agree on two “go-to” adults for online worries (home + school).',
      realWorldTip:
        'Normalize asking for help before a crisis. Kids who rehearse the phrase use it sooner when something is actually wrong.',
    },
    es: {
      title: 'Palabras amables y pedir ayuda en línea (borrador)',
      summary: 'Los chats son como el patio: palabras amables, sin crueldad, y avisar a un adulto si algo está mal.',
      objectives: ['Comparar mensajes amables y hirientes', 'Nombrar dos adultos de confianza si “algo se siente mal”'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'En línea también hay personas reales. Las palabras pueden animar — o lastimar.\n\nNo compartimos datos privados, contraseñas ni citas con desconocidos. Si alguien pide eso, paramos y buscamos un adulto.',
          bullets: ['Clasificar: “broma divertida” vs “burlarse de alguien”', 'Practicar “Voy a buscar a un adulto” en voz alta'],
        },
        {
          heading: 'Pruébalo',
          body: 'Lean dos mensajes de ejemplo. ¿Cuál es amable? ¿Cuál le mostrarían a un maestro?\n\nSi ven crueldad, no son “sapos”: ayudan a cuidar la comunidad.',
          bullets: [
            'Escriban una respuesta amable a un amigo nervioso por la tarea',
            'Marquen a quién avisarían: maestro, familia, orientación',
          ],
        },
      ],
      quiz: [
        {
          id: 'safety-kids-kind-online-q1',
          prompt: 'Un desconocido en un juego pide tu dirección. Debes…',
          options: ['Decir que no y avisar a un adulto de confianza', 'Dar solo la calle', 'Mandar una foto graciosa'],
          correctIndex: 0,
        },
        {
          id: 'safety-kids-kind-online-q2',
          prompt: 'Comportarse bien en línea se parece más a…',
          options: ['Animar e incluir a otros', 'Solo ganar discusiones', 'Contar un secreto para burlarse'],
          correctIndex: 0,
        },
        {
          id: 'safety-kids-kind-online-q3',
          prompt: 'Si un mensaje te hace sentir inseguro, un buen plan es…',
          options: [
            'Parar, guardar o recordar, contar a un adulto de confianza',
            'Responder con tu nombre completo',
            'Borrar la cuenta sin decir nada',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'En familia: elijan dos adultos “de acuerdo” para preocupaciones en línea (casa y escuela).',
      realWorldTip:
        'Normalizar pedir ayuda antes de una crisis. Quienes practican la frase la usan antes cuando algo va mal.',
    },
  },
  {
    id: 'safety-crew-privacy-basics',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 16,
    gradeSpan: { en: 'Typical US grades: 3–5', es: 'Grados EE. UU. típicos: 3.º–5.º' },
    standardsNote: 'Pilot: extend with platform-specific modules (social apps, games) aligned to consumer safety units.',
    cardEmoji: '🔐',
    cardImageUrl: '/social-safety-covers/tiktok.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'Privacy, settings & healthy skepticism (scaffold)',
      summary: 'Default private, least sharing, and verify before you trust — especially with AI-generated or forwarded content.',
      objectives: ['Explain why “public forever” matters', 'List two safer settings habits (accounts, DMs, location)'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Assume anything shared can be copied. Privacy settings reduce risk but do not erase mistakes.\n\nScams and fake profiles use urgency (“act now!”). Slow down, verify with a trusted adult or official site.',
          bullets: ['Compare friends-only vs public posts with a quick diagram', 'Discuss location tags on photos at school events'],
        },
        {
          heading: 'Try it',
          body: 'Walk through a settings checklist: who can message you? Who can see stories? Are school accounts required to stay educational-only?\n\nIf content looks too perfect, it might be AI-made — that is not automatically bad, but it is a reason to double-check sources.',
          bullets: ['Draft a class norm: “no filming others without consent”', 'Pair-share one red flag phrase used by scammers'],
        },
      ],
      quiz: [
        {
          id: 'safety-crew-privacy-basics-q1',
          prompt: 'The safest default for new accounts is usually…',
          options: ['Private / friends-only until you understand each toggle', 'Public so more people follow you', 'Share your school email in your bio'],
          correctIndex: 0,
        },
        {
          id: 'safety-crew-privacy-basics-q2',
          prompt: 'A message says “Your account will be deleted in 10 minutes!” You should…',
          options: [
            'Pause, do not click links, verify through the real app or a grown-up',
            'Click the link immediately',
            'Send your password to prove it is you',
          ],
          correctIndex: 0,
        },
        {
          id: 'safety-crew-privacy-basics-q3',
          prompt: 'AI-generated images or text online can be…',
          options: [
            'Convincing but wrong — verify with trusted sources',
            'Always illegal to view',
            'Guaranteed true because computers made them',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Audit one app’s settings as a class demo (projector), then students check one setting at home with a grown-up.',
      realWorldTip:
        'Digital citizenship is practice, not a one-time lecture. Short, repeated check-ins beat a single “internet safety day.”',
    },
    es: {
      title: 'Privacidad, ajustes y escepticismo sano (borrador)',
      summary: 'Por defecto privado, compartir menos y verificar antes de confiar — también con contenido de IA o reenviado.',
      objectives: ['Explicar por qué “público para siempre” importa', 'Listar dos hábitos de ajustes más seguros'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Lo que compartes puede copiarse. La privacidad reduce riesgo pero no borra errores.\n\nEstafas y perfiles falsos usan prisa (“¡actúa ya!”). Hay que frenar, verificar con un adulto o sitio oficial.',
          bullets: ['Comparen solo-amigos vs público con un diagrama rápido', 'Hablen de ubicación en fotos de eventos escolares'],
        },
        {
          heading: 'Pruébalo',
          body: 'Revisen una lista de ajustes: ¿quién puede escribirte? ¿quién ve historias? ¿Las cuentas escolares son solo educativas?\n\nSi algo se ve demasiado perfecto, puede ser IA — no es malo por sí, pero hay que revisar fuentes.',
          bullets: [
            'Escriban una norma: “no filmar a otros sin permiso”',
            'En parejas, una frase típica de estafa',
          ],
        },
      ],
      quiz: [
        {
          id: 'safety-crew-privacy-basics-q1',
          prompt: 'Lo más seguro al crear cuentas suele ser…',
          options: ['Privado / solo amigos hasta entender cada opción', 'Público para más seguidores', 'Poner el correo del colegio en la biografía'],
          correctIndex: 0,
        },
        {
          id: 'safety-crew-privacy-basics-q2',
          prompt: 'Un mensaje dice: “¡Tu cuenta se borrará en 10 minutos!” Debes…',
          options: [
            'Parar, no pulsar enlaces, verificar en la app real o con un adulto',
            'Pulsar el enlace ya',
            'Mandar tu contraseña para demostrar que eres tú',
          ],
          correctIndex: 0,
        },
        {
          id: 'safety-crew-privacy-basics-q3',
          prompt: 'Imágenes o textos hechos con IA en línea pueden ser…',
          options: [
            'Muy creíbles pero incorrectos — hay que verificar fuentes',
            'Siempre ilegales de ver',
            'Verdaderos seguro porque los hizo una computadora',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Revisen en clase un ajuste de una app (proyector); en casa revisan uno con un adulto.',
      realWorldTip:
        'La ciudadanía digital es hábito. Charlas cortas y repetidas ganan a un solo “día de seguridad en internet”.',
    },
  },
]
