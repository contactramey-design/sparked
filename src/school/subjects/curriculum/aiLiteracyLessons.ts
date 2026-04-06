/**
 * School AI & coding literacy — structured like other school subjects.
 * Scaffold lessons: replace copy and expand to mirror consumer `ai-coding` track depth.
 */
import type { SchoolSubjectLesson } from '../types'

export const AI_LITERACY_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'ai-tots-robots-helpers',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 12,
    gradeSpan: { en: 'Typical US grades: Pre-K–K', es: 'Grados EE. UU. típicos: Pre-K–K' },
    standardsNote: 'Pilot: map to early computational thinking / unplugged CS activities in your state framework.',
    cardEmoji: '🤖',
    cardImageUrl: '/sparkiaicodingcardhomepage.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'Robots, rules & helpful tools (scaffold)',
      summary: 'Some tools follow steps we give them. People still decide what is kind and fair.',
      objectives: ['Name something a “robot helper” can do', 'Name something only a person should decide'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'A robot vacuum follows rules: “go straight, turn, stop.” It does not know if a toy on the floor should be saved.\n\nComputers can be fast helpers, but grown-ups design them and check if they are safe for kids.',
          bullets: ['Act out “follow the steps” vs “change your mind because it is kinder”', 'Name a tool at home that beeps or moves'],
        },
        {
          heading: 'Try it',
          body: 'Give Sparki three silly steps: clap, hop, whisper “ready.” That is a tiny program.\n\nIf a screen talks to you, remember: it is not a friend who knows your heart — it is a tool. Real friends and grown-ups care about your feelings.',
          bullets: ['Draw a robot that helps (not one that scares)', 'Practice telling a grown-up if a device feels “too chatty”'],
        },
      ],
      quiz: [
        {
          id: 'ai-tots-robots-helpers-q1',
          prompt: 'A robot helper usually…',
          options: ['Follow steps people designed', 'Knows your secrets without being told', 'Decides bedtime for everyone'],
          correctIndex: 0,
        },
        {
          id: 'ai-tots-robots-helpers-q2',
          prompt: 'If a talking toy or app feels weird or scary, we…',
          options: ['Tell a trusted grown-up', 'Never tell anyone', 'Give it your real name'],
          correctIndex: 0,
        },
        {
          id: 'ai-tots-robots-helpers-q3',
          prompt: 'People are still in charge of…',
          options: ['Kind choices and safety', 'Every beep the tablet makes by magic', 'Making clouds rain'],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Play “robot and programmer”: one child gives two-step directions, the other follows exactly — then swap.',
      realWorldTip:
        'Early AI literacy is concrete: steps, tools, and trusted humans. Abstract “algorithms” can wait until they have this anchor.',
    },
    es: {
      title: 'Robots, reglas y herramientas útiles (borrador)',
      summary: 'Algunas herramientas siguen pasos que les damos. Las personas deciden qué es amable y justo.',
      objectives: ['Nombrar algo que puede hacer un “robot ayudante”', 'Nombrar algo que solo una persona debe decidir'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Una aspiradora robot sigue reglas: “recto, gira, para.” No sabe si un juguete en el piso hay que guardarlo.\n\nLas computadoras ayudan rápido, pero adultos las diseñan y revisan si son seguras para niños.',
          bullets: ['Representen “seguir pasos” vs “cambiar de idea por ser más amables”', 'Nombren un aparato en casa que pita o se mueve'],
        },
        {
          heading: 'Pruébalo',
          body: 'Denle a Sparki tres pasos divertidos: aplaudir, saltar, susurrar “listo.” Eso es un programita.\n\nSi una pantalla habla, recuerda: no es un amigo que siente — es una herramienta. Amigos y adultos sí se preocupan.',
          bullets: ['Dibuja un robot que ayuda (no uno que asusta)', 'Practica avisar a un adulto si el aparato “habla mucho”'],
        },
      ],
      quiz: [
        {
          id: 'ai-tots-robots-helpers-q1',
          prompt: 'Un robot ayudante normalmente…',
          options: ['Sigue pasos que diseñaron personas', 'Sabe secretos sin que se los digas', 'Decide la hora de dormir de todos'],
          correctIndex: 0,
        },
        {
          id: 'ai-tots-robots-helpers-q2',
          prompt: 'Si un juguete que habla o una app se siente rara,…',
          options: ['Se lo decimos a un adulto de confianza', 'No se lo decimos a nadie', 'Le damos nuestro nombre real'],
          correctIndex: 0,
        },
        {
          id: 'ai-tots-robots-helpers-q3',
          prompt: 'Las personas siguen a cargo de…',
          options: ['Decisiones amables y la seguridad', 'Cada pitido mágico de la tablet', 'Hacer llover'],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Juego “robot y programador”: uno da dos pasos, el otro obedece al pie de la letra — y cambian.',
      realWorldTip:
        'La alfabetización en IA empieza en lo concreto: pasos, herramientas y adultos de confianza. “Algoritmo” puede esperar.',
    },
  },
  {
    id: 'ai-kids-what-is-ai',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 14,
    gradeSpan: { en: 'Typical US grades: 1–2', es: 'Grados EE. UU. típicos: 1.º–2.º' },
    standardsNote: 'Pilot: align with CSTA K–5 “impacts of computing” and your district AI guidance.',
    cardEmoji: '✨',
    cardImageUrl: '/ai-coding-card.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'What is AI here? Predictions & people (scaffold)',
      summary: 'AI guesses patterns from examples. It can be wrong — we check important answers with people and other sources.',
      objectives: ['Describe AI as “pattern guesses, not magic”', 'Try one example where a human must verify'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'Many AI tools predict the next word, pixel, or answer based on huge piles of examples. That is powerful and also imperfect.\n\nAI does not “understand” homework feelings the way your teacher does — it can still help brainstorm if a grown-up says it is okay.',
          bullets: ['Contrast: calculator (rules) vs photo filter (learned patterns)', 'List one question you would never trust only to a chatbot'],
        },
        {
          heading: 'Try it',
          body: 'Give the class a silly pattern: circle, square, circle, __? Humans and AI might agree — now change the rule secretly and discuss how easy it is to be wrong.\n\nGood habit: say “Let me verify” before sharing AI text as facts.',
          bullets: ['Write two sentences: one fact from a book, one playful fiction', 'Circle which one needs a source'],
        },
      ],
      quiz: [
        {
          id: 'ai-kids-what-is-ai-q1',
          prompt: 'Most school-friendly way to describe AI is…',
          options: [
            'Pattern-based predictions that can be wrong',
            'A brain inside the Wi-Fi',
            'Always correct because it is math',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-kids-what-is-ai-q2',
          prompt: 'Before you copy AI text into schoolwork, you should…',
          options: [
            'Check facts with a teacher-approved process',
            'Assume it is original forever',
            'Hide that you used a tool',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-kids-what-is-ai-q3',
          prompt: 'A helpful rule for using AI helpers is…',
          options: [
            'Use them with adult permission and cite or describe how you used them',
            'Never tell anyone you used them',
            'Let them do all your thinking',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Family talk: one approved way your household uses AI (if at all) and one “stop and ask” moment.',
      realWorldTip:
        'Schools that name clear “when verifying matters” rules reduce both fear and misuse better than banning without conversation.',
    },
    es: {
      title: '¿Qué es la IA aquí? Predicciones y personas (borrador)',
      summary: 'La IA adivina patrones con ejemplos. Puede equivocarse — verificamos con personas y otras fuentes.',
      objectives: ['Describir la IA como “patrones, no magia”', 'Probar un ejemplo donde un humano debe verificar'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Muchas herramientas predicen la siguiente palabra, píxel o respuesta usando muchísimos ejemplos. Eso es potente y también imperfecto.\n\nLa IA no “entiende” la tarea como tu maestro — aún puede ayudar a pensar ideas si un adulto dice que sí.',
          bullets: ['Contrasten: calculadora (reglas) vs filtro de foto (patrones aprendidos)', 'Escriban una pregunta que no confiarían solo a un chatbot'],
        },
        {
          heading: 'Pruébalo',
          body: 'Patrón divertido: círculo, cuadrado, círculo, ¿__? Humanos e IA pueden coincidir — cambien la regla en secreto y vean los errores.\n\nBuen hábito: “Déjame verificar” antes de compartir texto de IA como hecho.',
          bullets: [
            'Escriban dos oraciones: un hecho de un libro, una ficción juguetona',
            'Marquen cuál necesita fuente',
          ],
        },
      ],
      quiz: [
        {
          id: 'ai-kids-what-is-ai-q1',
          prompt: 'Para la escuela, la IA se describe mejor como…',
          options: [
            'Predicciones por patrones que pueden fallar',
            'Un cerebro dentro del Wi‑Fi',
            'Siempre correcta porque es matemáticas',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-kids-what-is-ai-q2',
          prompt: 'Antes de copiar texto de IA en una tarea, debes…',
          options: [
            'Revisar hechos con un proceso aprobado por el maestro',
            'Asumir que es original para siempre',
            'Ocultar que usaste la herramienta',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-kids-what-is-ai-q3',
          prompt: 'Una regla útil para ayudantes de IA es…',
          options: [
            'Usarlos con permiso de un adulto y citar o decir cómo los usaste',
            'No contarle a nadie',
            'Dejar que piensen por ti',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Charla en familia: una forma permitida de usar IA (si la hay) y un momento de “parar y preguntar”.',
      realWorldTip:
        'Las escuelas que dicen cuándo importa verificar reducen miedo y mal uso mejor que prohibir sin conversar.',
    },
  },
  {
    id: 'ai-crew-training-bias-intro',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 16,
    gradeSpan: { en: 'Typical US grades: 3–5', es: 'Grados EE. UU. típicos: 3.º–5.º' },
    standardsNote: 'Pilot: extend into data, training sets, and ethics modules tied to consumer AI & coding units.',
    cardEmoji: '🧠',
    cardImageUrl: '/homework-card.png',
    practiceGameId: 'sparki-ordered-tap',
    en: {
      title: 'Training data, bias & responsible use (scaffold)',
      summary: 'Models learn from data; skewed data skews answers. Transparency and citations matter for school work.',
      objectives: ['Explain “training data” in one sentence', 'Give one example of bias showing up in an output'],
      teachSections: [
        {
          heading: 'Warm-up',
          body: 'If a model mostly sees one kind of example, its guesses reflect that slice of the world — fair or unfair.\n\nResponsible use in class: disclose assistance when required, never paste private data into tools your district has not approved, and prefer primary sources for claims.',
          bullets: ['Case study: hiring headlines vs community voices — who is missing?', 'Review school AI policy in plain language on the board'],
        },
        {
          heading: 'Try it',
          body: 'Prompt an approved demo tool (or teacher demo) twice with a small wording change; note how fragile answers can be.\n\nDraft a classroom norm: “AI drafts, human edits, human verifies.”',
          bullets: ['Pairs: rewrite an AI paragraph into your own voice', 'List three things never to paste into public tools'],
        },
      ],
      quiz: [
        {
          id: 'ai-crew-training-bias-intro-q1',
          prompt: 'Training data mostly means…',
          options: [
            'Examples the system learned patterns from',
            'The computer’s favorite color',
            'A list of every password',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-crew-training-bias-intro-q2',
          prompt: 'Bias in AI outputs often starts when…',
          options: [
            'The training data over- or under-represents some groups',
            'The Wi-Fi is slow',
            'The keyboard is loud',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-crew-training-bias-intro-q3',
          prompt: 'A strong school habit when using generative AI is…',
          options: [
            'Follow district rules, disclose when required, verify facts',
            'Assume outputs are neutral truth',
            'Share classmates’ personal details to get better answers',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Collect three “good use” and three “never do” examples from your class and post near devices.',
      realWorldTip:
        'When students see bias as a data story — not a personal attack on the tool — they stay curious instead of cynical.',
    },
    es: {
      title: 'Datos de entrenamiento, sesgo y uso responsable (borrador)',
      summary: 'Los modelos aprenden de datos; datos sesgados sesgan respuestas. Transparencia y fuentes importan en la escuela.',
      objectives: ['Explicar “datos de entrenamiento” en una oración', 'Dar un ejemplo de sesgo en una salida'],
      teachSections: [
        {
          heading: 'Calentamiento',
          body: 'Si un modelo ve sobre todo un tipo de ejemplo, sus respuestas reflejan ese pedazo del mundo — justo o no.\n\nUso responsable: decir cuando ayudó la IA si lo piden, no pegar datos privados en herramientas no aprobadas, preferir fuentes primarias.',
          bullets: [
            'Caso: titulares de empleo vs voces comunitarias — ¿quién falta?',
            'Lean la política de IA del distrito en lenguaje claro',
          ],
        },
        {
          heading: 'Pruébalo',
          body: 'Prueben dos redacciones mínimas en una demo aprobada; vean qué tan frágiles son las respuestas.\n\nNorma de clase: “La IA redacta, el humano edita y verifica.”',
          bullets: [
            'En parejas: reescriban un párrafo de IA con su voz',
            'Tres cosas que nunca pegar en herramientas públicas',
          ],
        },
      ],
      quiz: [
        {
          id: 'ai-crew-training-bias-intro-q1',
          prompt: '“Datos de entrenamiento” suele significar…',
          options: [
            'Ejemplos de los que el sistema aprendió patrones',
            'El color favorito de la computadora',
            'Todas las contraseñas',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-crew-training-bias-intro-q2',
          prompt: 'El sesgo en salidas de IA a menudo empieza cuando…',
          options: [
            'Los datos representan de más o de menos a algunos grupos',
            'El Wi‑Fi va lento',
            'El teclado hace ruido',
          ],
          correctIndex: 0,
        },
        {
          id: 'ai-crew-training-bias-intro-q3',
          prompt: 'Un buen hábito escolar con IA generativa es…',
          options: [
            'Seguir reglas del distrito, declarar cuando toca, verificar hechos',
            'Asumir que la salida es verdad neutral',
            'Compartir datos personales de compañeros para mejores respuestas',
          ],
          correctIndex: 0,
        },
      ],
      offlineApplication: 'Recojan tres usos buenos y tres “nunca” de la clase y pónganlos cerca de los dispositivos.',
      realWorldTip:
        'Si el sesgo se ve como historia de datos — no como ataque al aparato — los estudiantes curiosos no se vuelven cínicos.',
    },
  },
]
