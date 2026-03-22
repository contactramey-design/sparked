import type { ScenarioQuestion } from '../ScenarioMcQuiz'

type Bilingual = { en: ScenarioQuestion[]; es: ScenarioQuestion[] }

function pick(bundle: Bilingual, locale: string): ScenarioQuestion[] {
  return locale === 'es' ? bundle.es : bundle.en
}

/** Sparki Crew — one scenario set per social-safety unit (matches platform themes). */
const CREW_SAFETY: Record<string, Bilingual> = {
  'safety-tiktok': {
    en: [
      {
        prompt: 'A stranger DMs you a cool dance challenge and asks for your school name. What’s safest?',
        options: ['Share it — it’s just for fun', 'Ignore and tell a trusted adult', 'Send a voice note instead'],
        correctIndex: 1,
      },
      {
        prompt: 'Your video gets mean comments. What should you do first?',
        options: ['Argue back in the comments', 'Delete the app forever', 'Pause, don’t reply, and get help from a grown-up'],
        correctIndex: 2,
      },
      {
        prompt: 'A “free robux/skin” link pops up in a TikTok comment. Best move?',
        options: ['Click fast before it expires', 'Never tap — scams and viruses hide behind those', 'Share it with friends to test it'],
        correctIndex: 1,
      },
      {
        prompt: 'Someone asks you to move the chat to a private app you don’t use with family. You should…',
        options: ['Switch apps to be polite', 'Say no and stay where your adults can help you stay safe', 'Give them your phone number'],
        correctIndex: 1,
      },
      {
        prompt: 'You want to post a video that shows your house number and street sign. Good idea?',
        options: ['Yes — it’s in the background', 'Crop or film without addresses and landmarks', 'Tag your location for more views'],
        correctIndex: 1,
      },
      {
        prompt: 'A trend asks you to share passwords “for trust.” That’s…',
        options: ['A fun friendship test', 'Never safe — passwords stay private', 'Okay if you change it after'],
        correctIndex: 1,
      },
      {
        prompt: 'You see cyberbullying in a live stream. What helps most?',
        options: ['Join in as a joke', 'Report, block, and tell a trusted adult', 'Record it and repost everywhere'],
        correctIndex: 1,
      },
      {
        prompt: 'Before you post, the best habit is…',
        options: ['Post first, think later', 'Ask: “Would I be okay if classmates saw this?”', 'Turn off all privacy settings for views'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'Un desconocido te escribe con un reto de baile y pide el nombre de tu escuela. ¿Qué es más seguro?',
        options: ['Decirlo — es solo por diversión', 'Ignorar y contárselo a un adulto de confianza', 'Mandar una nota de voz'],
        correctIndex: 1,
      },
      {
        prompt: 'A tu video le ponen comentarios crueles. ¿Qué hacer primero?',
        options: ['Responder peleando en comentarios', 'Borrar la app para siempre', 'Pausar, no responder y pedir ayuda a un adulto'],
        correctIndex: 2,
      },
      {
        prompt: 'Aparece un enlace de “robux/skins gratis” en un comentario. ¿Mejor paso?',
        options: ['Clic rápido antes de que caduque', 'No tocar — estafas y virus se esconden ahí', 'Compartirlo con amigos para probarlo'],
        correctIndex: 1,
      },
      {
        prompt: 'Te piden pasar el chat a otra app privada que no usas con tu familia. Deberías…',
        options: ['Cambiar de app para ser amable', 'Decir no y quedarte donde un adulto pueda ayudarte', 'Dar tu número'],
        correctIndex: 1,
      },
      {
        prompt: 'Quieres publicar un video con el número de tu casa y la calle. ¿Buena idea?',
        options: ['Sí — está de fondo', 'Recortar o grabar sin direcciones ni señales', 'Poner ubicación para más vistas'],
        correctIndex: 1,
      },
      {
        prompt: 'Un reto pide compartir contraseñas “por confianza.” Eso es…',
        options: ['Una prueba de amistad', 'Nunca seguro — las contraseñas son privadas', 'Vale si luego la cambias'],
        correctIndex: 1,
      },
      {
        prompt: 'Ves ciberacoso en una transmisión en vivo. ¿Qué ayuda más?',
        options: ['Unirte en broma', 'Reportar, bloquear y contar a un adulto de confianza', 'Grabarlo y republicarlo'],
        correctIndex: 1,
      },
      {
        prompt: 'Antes de publicar, el mejor hábito es…',
        options: ['Publicar primero, pensar después', 'Preguntarte: “¿Me sentiría bien si compañeros vieran esto?”', 'Apagar la privacidad para más vistas'],
        correctIndex: 1,
      },
    ],
  },
  'safety-snapchat': {
    en: [
      {
        prompt: 'Someone you only know online opens a Snap map near your real location. You should…',
        options: ['Meet them “just for a minute”', 'Turn off precise location sharing and tell a trusted adult', 'Send them your address to be friendly'],
        correctIndex: 1,
      },
      {
        prompt: 'A streak partner asks for a photo in underwear to “keep the streak.” That’s…',
        options: ['Normal for streaks', 'Never okay — say no, block, and get help', 'Okay if it disappears in 24 hours'],
        correctIndex: 1,
      },
      {
        prompt: 'Screenshots can still happen even if a Snap “disappears.” Remember…',
        options: ['Nothing online is truly private', 'Disappearing means nobody can save it', 'Only friends can screenshot'],
        correctIndex: 0,
      },
      {
        prompt: 'A random add says they’re your cousin’s friend. Best step?',
        options: ['Add them back to be nice', 'Verify with your cousin or adult before chatting', 'Share your class schedule'],
        correctIndex: 1,
      },
      {
        prompt: 'You get pressured to send money for a “premium account.” You should…',
        options: ['Send a small amount to test', 'Stop — it’s a scam; tell an adult', 'Share your parent’s card “just once”'],
        correctIndex: 1,
      },
      {
        prompt: 'Your group chat starts roasting one person hard. You…',
        options: ['Pile on so you fit in', 'Stand up or leave, and tell an adult if it’s bullying', 'Record it for later laughs'],
        correctIndex: 1,
      },
      {
        prompt: 'Best privacy habit for Stories and location?',
        options: ['Public to everyone for clout', 'Friends only + location off or ghost mode with adult guidance', 'Share live location 24/7'],
        correctIndex: 1,
      },
      {
        prompt: 'If a Snap feels unsafe or scary, the first move is…',
        options: ['Keep it secret', 'Screenshot, block, report, and talk to a trusted adult', 'Forward it to more people'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'Alguien que solo conoces online abre el mapa cerca de tu ubicación real. Deberías…',
        options: ['Quedar “solo un minuto”', 'Apagar ubicación precisa y contar a un adulto de confianza', 'Mandar tu dirección para ser amable'],
        correctIndex: 1,
      },
      {
        prompt: 'Un amigo de racha pide una foto en ropa interior para “mantener la racha.” Eso es…',
        options: ['Normal en las rachas', 'Nunca está bien — di no, bloquea y pide ayuda', 'Vale si desaparece en 24 horas'],
        correctIndex: 1,
      },
      {
        prompt: 'Aunque un Snap “desaparezca”, aún pueden hacer captura. Recuerda…',
        options: ['Nada en línea es totalmente privado', 'Si desaparece nadie puede guardarlo', 'Solo amigos pueden capturar'],
        correctIndex: 0,
      },
      {
        prompt: 'Un desconocido dice ser amigo de tu primo. ¿Mejor paso?',
        options: ['Aceptarlo para ser amable', 'Confirmar con tu primo o un adulto antes de chatear', 'Compartir tu horario de clases'],
        correctIndex: 1,
      },
      {
        prompt: 'Te presionan a mandar dinero por una “cuenta premium.” Deberías…',
        options: ['Mandar poco para probar', 'Parar — es estafa; cuéntaselo a un adulto', 'Usar la tarjeta de un adulto “una vez”'],
        correctIndex: 1,
      },
      {
        prompt: 'Un grupo empieza a molestar mucho a una persona. Tú…',
        options: ['Te unes para encajar', 'Defiendes o sales, y avisas si es acoso', 'Grabas para reírte después'],
        correctIndex: 1,
      },
      {
        prompt: 'Mejor hábito de privacidad para Historias y ubicación?',
        options: ['Público para todos', 'Solo amigos + ubicación apagada o modo fantasma con guía adulta', 'Ubicación en vivo 24/7'],
        correctIndex: 1,
      },
      {
        prompt: 'Si un Snap te asusta, lo primero es…',
        options: ['Guardarlo en secreto', 'Captura, bloquear, reportar y hablar con un adulto de confianza', 'Reenviarlo a más gente'],
        correctIndex: 1,
      },
    ],
  },
  'safety-roblox': {
    en: [
      {
        prompt: 'A player offers “free Robux” if you go to a link. You…',
        options: ['Click it quickly', 'Never click — it’s usually a scam', 'Share the link in chat'],
        correctIndex: 1,
      },
      {
        prompt: 'Someone in-game asks for your real name and age. Best answer?',
        options: ['Tell them everything', 'Keep personal info private; use a safe nickname', 'Send a photo of your ID “as a joke”'],
        correctIndex: 1,
      },
      {
        prompt: 'Voice chat gets toxic. What’s a strong safety move?',
        options: ['Yell louder', 'Mute, leave, block, and report; tell an adult if needed', 'Turn up volume to “win” the argument'],
        correctIndex: 1,
      },
      {
        prompt: 'A “friend” wants to move chat to Discord or another app. You should…',
        options: ['Go if they seem cool', 'Check with a grown-up first; stay on safer paths they approve', 'Share your phone number'],
        correctIndex: 1,
      },
      {
        prompt: 'You see someone bullying a younger player. You…',
        options: ['Ignore it — not your problem', 'Support the target, report the bully, or get an adult’s help', 'Help the bully for laughs'],
        correctIndex: 1,
      },
      {
        prompt: 'Password sharing for “account boosts” is…',
        options: ['Smart teamwork', 'Never safe', 'Fine if you trust them'],
        correctIndex: 1,
      },
      {
        prompt: 'If something online makes you feel weird or scared, you should…',
        options: ['Hide it', 'Talk to a trusted adult right away', 'Only tell random players'],
        correctIndex: 1,
      },
      {
        prompt: 'Strongest account safety habit?',
        options: ['Reuse one easy password everywhere', 'Unique password + 2-step if available, with adult help', 'Put password in your profile bio'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'Un jugador ofrece “Robux gratis” si entras a un enlace. Tú…',
        options: ['Clic rápido', 'Nunca — suele ser estafa', 'Compartir el enlace en el chat'],
        correctIndex: 1,
      },
      {
        prompt: 'Alguien pide tu nombre y edad reales. ¿Mejor respuesta?',
        options: ['Decir todo', 'Mantener datos privados; usar apodo seguro', 'Mandar foto del documento “en broma”'],
        correctIndex: 1,
      },
      {
        prompt: 'El chat de voz se pone tóxico. ¿Qué hacer?',
        options: ['Gritar más fuerte', 'Silenciar, salir, bloquear y reportar; avisar a un adulto', 'Subir el volumen para “ganar”'],
        correctIndex: 1,
      },
      {
        prompt: 'Un “amigo” quiere pasar el chat a Discord u otra app. Deberías…',
        options: ['Ir si parece genial', 'Preguntar a un adulto; quedarte en caminos más seguros', 'Dar tu número'],
        correctIndex: 1,
      },
      {
        prompt: 'Ves acoso a un jugador más pequeño. Tú…',
        options: ['Ignorar — no es tu problema', 'Apoyar, reportar o pedir ayuda adulta', 'Ayudar al acosador en broma'],
        correctIndex: 1,
      },
      {
        prompt: 'Compartir contraseña para “mejorar la cuenta” es…',
        options: ['Trabajo en equipo', 'Nunca seguro', 'Vale si confías'],
        correctIndex: 1,
      },
      {
        prompt: 'Si algo en línea te hace sentir raro o miedo, deberías…',
        options: ['Esconderlo', 'Hablar ya con un adulto de confianza', 'Solo contárselo a desconocidos'],
        correctIndex: 1,
      },
      {
        prompt: 'Mejor hábito para la cuenta?',
        options: ['Una contraseña fácil para todo', 'Contraseña única + doble paso si hay, con ayuda adulta', 'Poner la contraseña en la biografía'],
        correctIndex: 1,
      },
    ],
  },
  'safety-fortnite': {
    en: [
      {
        prompt: 'A random squadmate asks where you live “to send gifts.” You…',
        options: ['Tell them your city', 'Never share location or address', 'Send a map pin “just once”'],
        correctIndex: 1,
      },
      {
        prompt: 'Voice chat turns mean. Best first step?',
        options: ['Mute/leave and report if needed', 'Insult them back', 'Turn mic to max volume'],
        correctIndex: 0,
      },
      {
        prompt: 'Someone says they’ll “dupe” your account if you share login. That’s…',
        options: ['A cool trick', 'A scam — never share logins', 'Safe if they’re a high level'],
        correctIndex: 1,
      },
      {
        prompt: 'You feel pressured to buy V-Bucks to fit in. You should…',
        options: ['Use a card without asking', 'Talk to a grown-up about spending and peer pressure', 'Share a parent’s card in chat'],
        correctIndex: 1,
      },
      {
        prompt: 'A player sends links for “free skins.” You…',
        options: ['Avoid — phishing and scams', 'Click to see if it works', 'Download anything they send'],
        correctIndex: 0,
      },
      {
        prompt: 'Healthy gaming boundary?',
        options: ['Play all night secretly', 'Breaks, kind chat, and adult you can talk to', 'Ignore sleep and meals for ranks'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'Un compañero de escuadrón pregunta dónde vives “para mandar regalos.” Tú…',
        options: ['Decir tu ciudad', 'Nunca compartir ubicación ni dirección', 'Mandar un pin “solo una vez”'],
        correctIndex: 1,
      },
      {
        prompt: 'El chat de voz se pone cruel. ¿Primer paso?',
        options: ['Silenciar/salir y reportar si hace falta', 'Insultar de vuelta', 'Subir el micrófono al máximo'],
        correctIndex: 0,
      },
      {
        prompt: 'Dicen que “duplicarán” tu cuenta si das el inicio de sesión. Eso es…',
        options: ['Un truco genial', 'Estafa — nunca compartas accesos', 'Seguro si son de nivel alto'],
        correctIndex: 1,
      },
      {
        prompt: 'Te presionan a comprar paVos para encajar. Deberías…',
        options: ['Usar una tarjeta sin preguntar', 'Hablar con un adulto sobre gastos y presión', 'Pasar la tarjeta de un adulto en el chat'],
        correctIndex: 1,
      },
      {
        prompt: 'Te mandan enlaces de “skins gratis.” Tú…',
        options: ['Evitar — phishing y estafas', 'Clic para ver si funciona', 'Descargar lo que manden'],
        correctIndex: 0,
      },
      {
        prompt: 'Límite saludable al jugar?',
        options: ['Jugar toda la noche en secreto', 'Pausas, chat amable y un adulto con quien hablar', 'Ignorar sueño y comida por el rango'],
        correctIndex: 1,
      },
    ],
  },
  'safety-reddit': {
    en: [
      {
        prompt: 'A subreddit asks for your full name and school for a “study.” You…',
        options: ['Post it publicly', 'Keep personal details private; ask a grown-up', 'DM moderators your address'],
        correctIndex: 1,
      },
      {
        prompt: 'You see cruel comments piling on one user. Best action?',
        options: ['Join the pile-on', 'Don’t add harm; report and support kindness or tell an adult', 'Screenshot and share everywhere'],
        correctIndex: 1,
      },
      {
        prompt: 'Someone sends a “must-click” link in DMs. You…',
        options: ['Open it immediately', 'Don’t open random links; block/report if weird', 'Forward to friends first'],
        correctIndex: 1,
      },
      {
        prompt: 'Forums can feel anonymous. That means you should…',
        options: ['Be meaner because “it’s not real”', 'Remember real people read words; stay respectful', 'Share secrets because nobody knows you'],
        correctIndex: 1,
      },
      {
        prompt: 'You disagree with a post. The respectful move is…',
        options: ['Attack the person', 'Argue the idea calmly or move on', 'Dox them to win'],
        correctIndex: 1,
      },
      {
        prompt: 'An adult online asks to move chat private and keep it secret. You…',
        options: ['Say yes to be polite', 'Say no and tell a trusted adult immediately', 'Send photos to prove you’re “mature”'],
        correctIndex: 1,
      },
      {
        prompt: 'If content upsets you (violence, hate, scary threads), you should…',
        options: ['Keep scrolling for hours', 'Leave, report if needed, and talk to an adult', 'Save it to watch again'],
        correctIndex: 1,
      },
      {
        prompt: 'Strong info habit on forums?',
        options: ['Overshare for upvotes', 'Think before you post; protect your identity', 'Use real address in flair'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'Un subreddit pide tu nombre completo y escuela para un “estudio.” Tú…',
        options: ['Publicarlo', 'Mantener datos privados; preguntar a un adulto', 'Mandar la dirección por MD a mods'],
        correctIndex: 1,
      },
      {
        prompt: 'Ves comentarios crueles contra un usuario. ¿Mejor acción?',
        options: ['Unirte al ataque', 'No sumar daño; reportar y apoyar la amabilidad o avisar a un adulto', 'Capturar y compartir'],
        correctIndex: 1,
      },
      {
        prompt: 'Te mandan un enlace “tienes que abrir” por MD. Tú…',
        options: ['Abrir ya', 'No abrir enlaces raros; bloquear/reportar', 'Reenviar primero a amigos'],
        correctIndex: 1,
      },
      {
        prompt: 'Los foros pueden parecer anónimos. Eso significa que debes…',
        options: ['Ser más cruel porque “no es real”', 'Recordar que hay personas reales; ser respetuoso', 'Contar secretos porque nadie te conoce'],
        correctIndex: 1,
      },
      {
        prompt: 'No estás de acuerdo con un post. Lo respetuoso es…',
        options: ['Atacar a la persona', 'Debatir la idea con calma o seguir', 'Filtrar datos para ganar'],
        correctIndex: 1,
      },
      {
        prompt: 'Un adulto online pide chat privado y guardar secreto. Tú…',
        options: ['Decir que sí por educación', 'Decir no y contar ya a un adulto de confianza', 'Mandar fotos para “demostrar madurez”'],
        correctIndex: 1,
      },
      {
        prompt: 'Si el contenido te molesta (violencia, odio, miedo), deberías…',
        options: ['Seguir scrolleando horas', 'Salir, reportar si hace falta y hablar con un adulto', 'Guardarlo para ver otra vez'],
        correctIndex: 1,
      },
      {
        prompt: 'Buen hábito de información en foros?',
        options: ['Contar de más por votos', 'Pensar antes de publicar; proteger tu identidad', 'Poner dirección real en el perfil'],
        correctIndex: 1,
      },
    ],
  },
}

const CREW_AI: Record<string, Bilingual> = {
  'ai-1-what-is-ai': {
    en: [
      {
        prompt: 'AI learns patterns from examples. Which is closest to “training data”?',
        options: ['Only random guesses', 'Lots of labeled photos, text, or tasks used to teach the model', 'The computer’s wallpaper'],
        correctIndex: 1,
      },
      {
        prompt: 'A chatbot might sound confident but be wrong. That’s often called…',
        options: ['A perfect fact machine', 'Hallucination / mistake — always double-check important facts', 'Wi-Fi lag'],
        correctIndex: 1,
      },
      {
        prompt: 'Which job is AI good at assisting (with human oversight)?',
        options: ['Replacing all doctors instantly with no checks', 'Drafting ideas, summarizing notes, coding helpers — humans still decide', 'Guessing your passwords'],
        correctIndex: 1,
      },
      {
        prompt: 'Bias in AI means…',
        options: ['The robot likes colors', 'Unfair patterns from bad or limited data', 'Batteries are low'],
        correctIndex: 1,
      },
      {
        prompt: 'You should not paste into AI: ',
        options: ['A fun story idea', 'Passwords, full address, or private medical details', 'A spelling list for practice'],
        correctIndex: 1,
      },
      {
        prompt: '“Model” in AI usually means…',
        options: ['A plastic toy', 'The trained program that maps inputs to outputs', 'A type of video game'],
        correctIndex: 1,
      },
      {
        prompt: 'Responsible use includes…',
        options: ['Cheating secretly on graded work', 'Following school rules and citing help from tools when allowed', 'Letting AI vote for you'],
        correctIndex: 1,
      },
      {
        prompt: 'AI can help creativity by…',
        options: ['Doing your thinking so you stop learning', 'Brainstorming options you still edit and own', 'Deleting your homework folder'],
        correctIndex: 1,
      },
    ],
    es: [
      {
        prompt: 'La IA aprende patrones con ejemplos. ¿Qué se parece más a “datos de entrenamiento”?',
        options: ['Solo adivinanzas al azar', 'Muchas fotos, textos o tareas etiquetadas para enseñar el modelo', 'El fondo de pantalla'],
        correctIndex: 1,
      },
      {
        prompt: 'Un chatbot puede sonar seguro y estar equivocado. Eso suele llamarse…',
        options: ['Máquina de hechos perfecta', 'Alucinación / error — verifica hechos importantes', 'Lag del Wi‑Fi'],
        correctIndex: 1,
      },
      {
        prompt: '¿En qué ayuda bien la IA (con supervisión humana)?',
        options: ['Reemplazar a todos los médicos al instante', 'Borrador de ideas, resúmenes, ayuda con código — la persona decide', 'Adivinar contraseñas'],
        correctIndex: 1,
      },
      {
        prompt: 'Sesgo en IA significa…',
        options: ['Al robot le gustan los colores', 'Patrones injustos por datos malos o limitados', 'Batería baja'],
        correctIndex: 1,
      },
      {
        prompt: 'No debes pegar en la IA: ',
        options: ['Una idea divertida para un cuento', 'Contraseñas, dirección completa o datos médicos privados', 'Lista de ortografía para practicar'],
        correctIndex: 1,
      },
      {
        prompt: '“Modelo” en IA suele ser…',
        options: ['Un juguete de plástico', 'El programa entrenado que relaciona entradas y salidas', 'Un tipo de videojuego'],
        correctIndex: 1,
      },
      {
        prompt: 'Uso responsable incluye…',
        options: ['Hacer trampa escondida en tareas calificadas', 'Seguir reglas del colegio y citar ayuda de herramientas si se permite', 'Dejar que la IA vote por ti'],
        correctIndex: 1,
      },
      {
        prompt: 'La IA puede ayudar la creatividad…',
        options: ['Pensando por ti para que dejes de aprender', 'Proponiendo ideas que tú sigues editando y haces tuyas', 'Borrando tu carpeta de tareas'],
        correctIndex: 1,
      },
    ],
  },
  'ai-2-coding-games': {
    en: [
      {
        prompt: 'In coding, a step-by-step recipe is like…',
        options: ['An algorithm', 'A sandwich only', 'A random emoji'],
        correctIndex: 0,
      },
      {
        prompt: 'A loop repeats instructions. That helps when you…',
        options: ['Need the same action many times', 'Never need repeats', 'Want to delete your code'],
        correctIndex: 0,
      },
      {
        prompt: 'An “if” statement lets the program…',
        options: ['Choose different paths based on a condition', 'Always do the same thing', 'Print lunch menus only'],
        correctIndex: 0,
      },
      {
        prompt: 'Debugging means…',
        options: ['Removing all comments', 'Finding and fixing mistakes in your code', 'Deleting the project'],
        correctIndex: 1,
      },
      {
        prompt: 'A variable stores…',
        options: ['A value that can change', 'Only the color blue', 'Nothing ever'],
        correctIndex: 0,
      },
      {
        prompt: 'Good habit when code fails: ',
        options: ['Give up forever', 'Read the error, test small pieces, ask for help', 'Click random keys'],
        correctIndex: 1,
      },
      {
        prompt: 'Functions help because they…',
        options: ['Bundle reusable steps with a name', 'Remove the need to think', 'Always run backwards'],
        correctIndex: 0,
      },
      {
        prompt: 'Comments in code are mainly for…',
        options: ['Humans to understand intent', 'The CPU to eat', 'Making the program slower on purpose'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: 'En programación, una receta paso a paso es como…',
        options: ['Un algoritmo', 'Solo un sándwich', 'Un emoji al azar'],
        correctIndex: 0,
      },
      {
        prompt: 'Un bucle repite instrucciones. Ayuda cuando…',
        options: ['Necesitas la misma acción muchas veces', 'Nunca repites', 'Quieres borrar tu código'],
        correctIndex: 0,
      },
      {
        prompt: 'Un “if” permite al programa…',
        options: ['Elegir caminos según una condición', 'Siempre hacer lo mismo', 'Solo imprimir menús'],
        correctIndex: 0,
      },
      {
        prompt: 'Depurar (debug) significa…',
        options: ['Quitar todos los comentarios', 'Encontrar y arreglar errores', 'Borrar el proyecto'],
        correctIndex: 1,
      },
      {
        prompt: 'Una variable guarda…',
        options: ['Un valor que puede cambiar', 'Solo el color azul', 'Nada nunca'],
        correctIndex: 0,
      },
      {
        prompt: 'Buen hábito si falla el código: ',
        options: ['Rendirse para siempre', 'Leer el error, probar partes pequeñas, pedir ayuda', 'Pulsar teclas al azar'],
        correctIndex: 1,
      },
      {
        prompt: 'Las funciones ayudan porque…',
        options: ['Agrupan pasos reutilizables con nombre', 'Quitan la necesidad de pensar', 'Siempre van al revés'],
        correctIndex: 0,
      },
      {
        prompt: 'Los comentarios en código son sobre todo para…',
        options: ['Que humanos entiendan la intención', 'Que el CPU “coma”', 'Hacer el programa más lento a propósito'],
        correctIndex: 0,
      },
    ],
  },
  'ai-3-software-explorers': {
    en: [
      {
        prompt: 'Software is…',
        options: ['Programs and apps you can update', 'Only the monitor', 'The chair at the desk'],
        correctIndex: 0,
      },
      {
        prompt: 'Hardware is…',
        options: ['Physical parts like CPU, keyboard, screen', 'A cloud folder only', 'A cartoon character'],
        correctIndex: 0,
      },
      {
        prompt: 'An operating system (like updates on a device) mainly…',
        options: ['Manages hardware and runs other programs', 'Is only a single video', 'Replaces the internet'],
        correctIndex: 0,
      },
      {
        prompt: 'A browser is software used to…',
        options: ['View websites', 'Cool the CPU with ice', 'Store electricity'],
        correctIndex: 0,
      },
      {
        prompt: 'Installing an app from official stores is safer because…',
        options: ['There are more checks than random download sites', 'It always costs money', 'It deletes your files'],
        correctIndex: 0,
      },
      {
        prompt: 'Updates often include…',
        options: ['Security fixes and improvements', 'Only new emojis', 'Nothing important ever'],
        correctIndex: 0,
      },
      {
        prompt: 'A file extension like .png or .pdf hints at…',
        options: ['The type of data / program that opens it', 'Your Wi-Fi password', 'Screen brightness'],
        correctIndex: 0,
      },
      {
        prompt: 'Backup means…',
        options: ['Extra copy of important files in case a device fails', 'Deleting everything twice', 'Turning off the router forever'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: 'El software es…',
        options: ['Programas y apps que puedes actualizar', 'Solo el monitor', 'La silla del escritorio'],
        correctIndex: 0,
      },
      {
        prompt: 'El hardware es…',
        options: ['Partes físicas como CPU, teclado, pantalla', 'Solo una carpeta en la nube', 'Un personaje de dibujos'],
        correctIndex: 0,
      },
      {
        prompt: 'Un sistema operativo (actualizaciones del dispositivo) sobre todo…',
        options: ['Gestiona el hardware y ejecuta otros programas', 'Es solo un video', 'Reemplaza internet'],
        correctIndex: 0,
      },
      {
        prompt: 'Un navegador es software para…',
        options: ['Ver sitios web', 'Enfriar el CPU con hielo', 'Guardar electricidad'],
        correctIndex: 0,
      },
      {
        prompt: 'Instalar desde tiendas oficiales suele ser más seguro porque…',
        options: ['Hay más revisiones que en sitios al azar', 'Siempre cuesta dinero', 'Borra tus archivos'],
        correctIndex: 0,
      },
      {
        prompt: 'Las actualizaciones suelen incluir…',
        options: ['Arreglos de seguridad y mejoras', 'Solo emojis nuevos', 'Nada importante nunca'],
        correctIndex: 0,
      },
      {
        prompt: 'Una extensión como .png o .pdf indica…',
        options: ['El tipo de dato / programa que lo abre', 'Tu contraseña Wi‑Fi', 'Brillo de pantalla'],
        correctIndex: 0,
      },
      {
        prompt: 'Copia de seguridad (backup) significa…',
        options: ['Copia extra de archivos importantes por si falla el dispositivo', 'Borrar todo dos veces', 'Apagar el router para siempre'],
        correctIndex: 0,
      },
    ],
  },
  'ai-4-ai-in-the-world': {
    en: [
      {
        prompt: 'AI in hospitals might help doctors by…',
        options: ['Suggesting patterns in scans — doctors still decide', 'Replacing parents at home', 'Guessing passwords'],
        correctIndex: 0,
      },
      {
        prompt: 'Face recognition in public can raise concerns about…',
        options: ['Privacy and fairness', 'Pizza toppings only', 'How fast birds fly'],
        correctIndex: 0,
      },
      {
        prompt: 'Self-driving tech still needs…',
        options: ['Safety rules, testing, and human oversight', 'No laws at all', 'Only funny stickers'],
        correctIndex: 0,
      },
      {
        prompt: 'When AI recommends videos, it can create…',
        options: ['Filter bubbles — same ideas repeated', 'Perfect truth always', 'A new sun'],
        correctIndex: 0,
      },
      {
        prompt: 'Green AI thinking includes…',
        options: ['Using big models only when needed and saving energy when possible', 'Running servers underwater for fun with no plan', 'Printing more paper'],
        correctIndex: 0,
      },
      {
        prompt: 'A fair AI goal in schools is…',
        options: ['Help more students learn without replacing honest effort', 'Auto-submit all homework secretly', 'Hide grades from teachers'],
        correctIndex: 0,
      },
      {
        prompt: 'If an AI tool is blocked at school, you should…',
        options: ['Follow school policy and ask teachers for allowed tools', 'Use personal hotspots to break rules', 'Share logins publicly'],
        correctIndex: 0,
      },
      {
        prompt: 'Being a good digital citizen with AI means…',
        options: ['Credit sources, be kind, and verify important claims', 'Copy everything without reading', 'Spread rumors faster'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: 'La IA en hospitales puede ayudar a médicos…',
        options: ['Sugiriendo patrones en imágenes — el médico decide', 'Reemplazar a padres en casa', 'Adivinar contraseñas'],
        correctIndex: 0,
      },
      {
        prompt: 'Reconocimiento facial en público puede preocupar por…',
        options: ['Privacidad y equidad', 'Solo ingredientes de pizza', 'Velocidad de pájaros'],
        correctIndex: 0,
      },
      {
        prompt: 'La conducción autónoma aún necesita…',
        options: ['Reglas de seguridad, pruebas y supervisión humana', 'Ninguna ley', 'Solo pegatinas graciosas'],
        correctIndex: 0,
      },
      {
        prompt: 'Cuando la IA recomienda videos, puede crear…',
        options: ['Burbujas — mismas ideas una y otra vez', 'Verdad perfecta siempre', 'Un sol nuevo'],
        correctIndex: 0,
      },
      {
        prompt: 'Pensar en IA “verde” incluye…',
        options: ['Usar modelos grandes solo cuando hace falta y ahorrar energía', 'Servidores bajo el agua sin plan', 'Imprimir más papel'],
        correctIndex: 0,
      },
      {
        prompt: 'Un objetivo justo de IA en la escuela es…',
        options: ['Ayudar a aprender sin reemplazar el esfuerzo honesto', 'Entregar tareas en secreto', 'Esconder notas a profes'],
        correctIndex: 0,
      },
      {
        prompt: 'Si una herramienta de IA está bloqueada en el colegio, debes…',
        options: ['Seguir la norma y preguntar por herramientas permitidas', 'Usar datos para saltarte reglas', 'Compartir accesos en público'],
        correctIndex: 0,
      },
      {
        prompt: 'Ser buen ciudadano digital con IA es…',
        options: ['Citar fuentes, ser amable y verificar lo importante', 'Copiar todo sin leer', 'Difundir rumores más rápido'],
        correctIndex: 0,
      },
    ],
  },
}

/** Sparki Tots — shorter scenario sets for AI units 3–5 (unit 1: Sort & Cheer; unit 2: Kind or Not Kind component). */
const TOTS_AI: Record<string, Bilingual> = {
  'ai-3-software-explorers': {
    en: [
      {
        prompt: 'Which one is an app on a tablet?',
        options: ['The plastic case', 'A drawing game you tap to open', 'The table legs'],
        correctIndex: 1,
      },
      {
        prompt: 'The screen you touch is…',
        options: ['Hardware', 'A sandwich', 'A cloud'],
        correctIndex: 0,
      },
      {
        prompt: 'Software is…',
        options: ['Programs inside the device', 'Only the wall', 'Your shoes'],
        correctIndex: 0,
      },
      {
        prompt: 'To open a safe kids’ game, you…',
        options: ['Ask a grown-up and use trusted stores', 'Click any pop-up', 'Share passwords'],
        correctIndex: 0,
      },
      {
        prompt: 'An update can help…',
        options: ['Keep the device safer', 'Break the screen on purpose', 'Delete all chargers'],
        correctIndex: 0,
      },
      {
        prompt: 'A keyboard is…',
        options: ['Hardware you type on', 'A fish', 'Only a song'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: '¿Cuál es una app en una tablet?',
        options: ['La funda de plástico', 'Un juego de dibujar que abres con el dedo', 'Las patas de la mesa'],
        correctIndex: 1,
      },
      {
        prompt: 'La pantalla que tocas es…',
        options: ['Hardware', 'Un sándwich', 'Una nube'],
        correctIndex: 0,
      },
      {
        prompt: 'El software es…',
        options: ['Programas dentro del aparato', 'Solo la pared', 'Tus zapatos'],
        correctIndex: 0,
      },
      {
        prompt: 'Para abrir un juego seguro…',
        options: ['Pides ayuda a un adulto y usas tiendas de confianza', 'Clic en cualquier ventana', 'Compartir contraseñas'],
        correctIndex: 0,
      },
      {
        prompt: 'Una actualización puede ayudar a…',
        options: ['Mantener el aparato más seguro', 'Romper la pantalla a propósito', 'Borrar cargadores'],
        correctIndex: 0,
      },
      {
        prompt: 'Un teclado es…',
        options: ['Hardware donde escribes', 'Un pez', 'Solo una canción'],
        correctIndex: 0,
      },
    ],
  },
  'ai-4-ai-in-the-world': {
    en: [
      {
        prompt: 'Robots in factories sometimes help humans by…',
        options: ['Doing heavy or repeat tasks', 'Eating homework', 'Sleeping all day'],
        correctIndex: 0,
      },
      {
        prompt: 'Maps on a phone use computers to…',
        options: ['Suggest routes — still watch the road with adults', 'Drive the car alone always', 'Cook dinner'],
        correctIndex: 0,
      },
      {
        prompt: 'Voice helpers (like asking for a timer) are…',
        options: ['Tools that follow rules from grown-ups', 'Magic that never makes mistakes', 'Invisible friends only'],
        correctIndex: 0,
      },
      {
        prompt: 'If a screen shows something scary, you…',
        options: ['Tell a trusted adult and take a break', 'Keep watching alone all night', 'Share with strangers'],
        correctIndex: 0,
      },
      {
        prompt: 'AI can help learning by…',
        options: ['Practice games with your teacher’s okay', 'Doing all your thinking for you', 'Skipping sleep'],
        correctIndex: 0,
      },
      {
        prompt: 'Being kind online with AI means…',
        options: ['Use words that help, not hurt', 'Send mean jokes faster', 'Ignore friends'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: 'Robots en fábricas a veces ayudan…',
        options: ['Con tareas pesadas o repetidas', 'Comiendo tareas', 'Durmiendo todo el día'],
        correctIndex: 0,
      },
      {
        prompt: 'Los mapas en el teléfono usan computación para…',
        options: ['Sugerir rutas — aún miras el camino con adultos', 'Manejar solo siempre', 'Cocinar la cena'],
        correctIndex: 0,
      },
      {
        prompt: 'Asistentes de voz (como un temporizador) son…',
        options: ['Herramientas con reglas de los adultos', 'Magia sin errores', 'Solo amigos invisibles'],
        correctIndex: 0,
      },
      {
        prompt: 'Si la pantalla muestra algo que asusta, tú…',
        options: ['Cuentas a un adulto y descansas', 'Sigues solo toda la noche', 'Compartes con desconocidos'],
        correctIndex: 0,
      },
      {
        prompt: 'La IA puede ayudar a aprender con…',
        options: ['Juegos de práctica si el maestro permite', 'Pensar todo por ti', 'Sin dormir'],
        correctIndex: 0,
      },
      {
        prompt: 'Ser amable en línea con IA es…',
        options: ['Usar palabras que ayudan', 'Mandar bromas crueles más rápido', 'Ignorar amigos'],
        correctIndex: 0,
      },
    ],
  },
  'ai-5-ethical-coding': {
    en: [
      {
        prompt: 'A fair rule for a game is…',
        options: ['Everyone gets a turn', 'Only one friend always wins', 'Hide the rules'],
        correctIndex: 0,
      },
      {
        prompt: 'If a tool writes your homework, honest choice is…',
        options: ['Use ideas you understand and follow class rules', 'Copy everything secretly', 'Delete the teacher’s email'],
        correctIndex: 0,
      },
      {
        prompt: 'Inclusive design means…',
        options: ['More people can use and enjoy it', 'Fewer people allowed', 'Louder colors only'],
        correctIndex: 0,
      },
      {
        prompt: 'If data about people is used, we should…',
        options: ['Protect privacy and ask when needed', 'Share it with everyone online', 'Ignore consent'],
        correctIndex: 0,
      },
      {
        prompt: 'When something feels unfair online, you…',
        options: ['Pause, tell a trusted adult, and don’t spread harm', 'Attack back fast', 'Stay silent forever'],
        correctIndex: 0,
      },
    ],
    es: [
      {
        prompt: 'Una regla justa para un juego es…',
        options: ['Que todos tengan turno', 'Que un amigo gane siempre', 'Esconder las reglas'],
        correctIndex: 0,
      },
      {
        prompt: 'Si una herramienta escribe tu tarea, lo honesto es…',
        options: ['Usar ideas que entiendas y seguir reglas de clase', 'Copiar todo en secreto', 'Borrar el correo del maestro'],
        correctIndex: 0,
      },
      {
        prompt: 'Diseño inclusivo significa…',
        options: ['Que más personas puedan usarlo y disfrutarlo', 'Menos personas permitidas', 'Solo colores fuertes'],
        correctIndex: 0,
      },
      {
        prompt: 'Si se usan datos de personas, debemos…',
        options: ['Proteger privacidad y pedir permiso cuando toca', 'Compartirlo con todos', 'Ignorar el consentimiento'],
        correctIndex: 0,
      },
      {
        prompt: 'Si algo se siente injusto en línea, tú…',
        options: ['Pausas, cuentas a un adulto y no dañas a otros', 'Atacas rápido', 'Callas para siempre'],
        correctIndex: 0,
      },
    ],
  },
}

export function getCrewSafetyScenarioQuestions(unitId: string, locale: string): ScenarioQuestion[] | null {
  const b = CREW_SAFETY[unitId]
  return b ? pick(b, locale) : null
}

export function getCrewAiScenarioQuestions(unitId: string, locale: string): ScenarioQuestion[] | null {
  const b = CREW_AI[unitId]
  return b ? pick(b, locale) : null
}

export function getTotsAiScenarioQuestions(unitId: string, locale: string): ScenarioQuestion[] | null {
  const b = TOTS_AI[unitId]
  if (!b) return null
  const qs = pick(b, locale)
  return qs.length > 0 ? qs : null
}
