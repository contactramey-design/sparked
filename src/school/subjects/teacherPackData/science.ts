import type { BilingualTeacherPack } from '../types'

export const SCIENCE_TEACHER_PACKS: Record<string, BilingualTeacherPack> = {
  'sci-tots-five-senses': {
    en: {
      conceptualDeepDive:
        'The five senses are tools for gathering information—noticing, comparing, and describing properties of objects. Clarify that some senses work together (taste and smell). Safety first: never taste unknown substances at school. Push beyond naming the sense to what information it gives (“rough,” “loud,” “sour”).',
      vocabularyTerms: [
        { term: 'Observe', definition: 'Use senses (safely) to gather information about the world.' },
        { term: 'Property', definition: 'A describable characteristic like texture, color, or sound level.' },
        { term: 'Evidence', definition: 'What you notice that supports a claim about an object or event.' },
        { term: 'Safety protocol', definition: 'Rules like “ask before tasting” that keep science investigations safe.' },
      ],
      sayThisAloud:
        'Scientists use their senses to notice details. Today we only taste what our grown-up says is safe. When I rub this shell, my fingers tell me it is bumpy—that is a property, not just “I used touch.”',
      misconceptions: [
        {
          myth: 'Science is only experiments with chemicals.',
          correction: 'Observation and description are core science practices at every age.',
        },
        {
          myth: 'If two people describe differently, one must be wrong.',
          correction: 'Different viewpoints can notice different properties; compare methods politely.',
        },
      ],
      supportEmergingLearners:
        'Use a sense chart with picture icons. One sense per station rotation. Pair descriptive words with gestures.',
      extendForDepth:
        'Compare two objects with a Venn diagram of properties. Discuss which sense is best for which property.',
      extraPracticeIdeas: [
        'Mystery sound boxes—no peeking.',
        'Texture collage with rubbings.',
        'Safe kitchen science: compare apple vs cracker with sight/smell/touch only.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Los cinco sentidos sirven para observar, comparar y describir propiedades. Algunos trabajan juntos (gusto y olfato). Seguridad: no probar sustancias desconocidas. Ve más allá del nombre del sentido: qué información da (“áspero”, “fuerte”, “ácido”).',
      vocabularyTerms: [
        { term: 'Observar', definition: 'Usar sentidos con seguridad para reunir información.' },
        { term: 'Propiedad', definition: 'Característica describible: textura, color, sonido.' },
        { term: 'Evidencia', definition: 'Lo que notas que apoya una afirmación.' },
        { term: 'Protocolo de seguridad', definition: 'Reglas como “preguntar antes de probar”.' },
      ],
      sayThisAloud:
        'Los científicos usan sentidos para notar detalles. Hoy solo probamos lo que el adulto diga que es seguro. Al frotar esta concha, mis dedos dicen que es rugosa — es una propiedad, no solo “usé el tacto.”',
      misconceptions: [
        {
          myth: 'Ciencia solo es químicos.',
          correction: 'Observar y describir es práctica científica en todas las edades.',
        },
        {
          myth: 'Si dos describen distinto, uno miente.',
          correction: 'Pueden notar propiedades distintas; comparen métodos con respeto.',
        },
      ],
      supportEmergingLearners:
        'Cartel de sentidos con íconos. Una estación por sentido. Palabras + gestos.',
      extendForDepth:
        'Diagrama de Venn de propiedades. Qué sentido sirve mejor para qué.',
      extraPracticeIdeas: [
        'Cajas misteriosas de sonido.',
        'Collage de texturas frottage.',
        'Manzana vs galleta: vista/olfato/tacto solamente.',
      ],
    },
  },
  'sci-tots-living-nonliving': {
    en: {
      conceptualDeepDive:
        'Living things grow, respond, reproduce, and use energy (simplified for tots). Nonliving may change but not in the same organized way—a rock erodes; it does not eat. Use clear examples and borderline cases (seed, robot toy) to spark discussion rather than trick questions.',
      vocabularyTerms: [
        { term: 'Living', definition: 'Organisms that grow, respond, and need energy in biological ways.' },
        { term: 'Nonliving', definition: 'Objects and materials without life processes like growth and eating.' },
        { term: 'Energy (simple)', definition: 'What living things need from food or sunlight to live and move.' },
        { term: 'Model / toy', definition: 'Can look alive but does not eat or grow—important distinction.' },
      ],
      sayThisAloud:
        'This puppy eats and grows—living. This rock can break into smaller pieces, but it does not eat breakfast—nonliving. The toy dog looks like a dog, but it does not breathe; we sort it as nonliving.',
      misconceptions: [
        {
          myth: 'Anything that moves is alive.',
          correction: 'Wind moves flags; cars move—movement alone is not life.',
        },
        {
          myth: 'Plants are nonliving because they do not walk.',
          correction: 'Plants grow, respond, and make food from light—they are living.',
        },
      ],
      supportEmergingLearners:
        'Use a two-hoop sort with photos only. Start with obvious pairs before borderline items.',
      extendForDepth:
        'Discuss seeds (alive but quiet) and fire (moves, uses oxygen—not a cell-based life lesson for tots—keep it wonder-based).',
      extraPracticeIdeas: [
        'Classroom sort: pencil vs class plant.',
        'Draw one living and one nonliving thing from home.',
        'Song/chant: “Does it eat? Does it grow?”',
      ],
    },
    es: {
      conceptualDeepDive:
        'Lo vivo crece, responde, se reproduce y usa energía (versión simple). Lo no vivo puede cambiar pero no igual — la roca se erosiona; no come. Usa ejemplos claros y casos límite (semilla, robot de juguete) para conversar, no para trampas.',
      vocabularyTerms: [
        { term: 'Vivo', definition: 'Seres que crecen, responden y necesitan energía como organismos.' },
        { term: 'No vivo', definition: 'Objetos sin procesos de vida como comer o crecer.' },
        { term: 'Energía (simple)', definition: 'Lo que los seres vivos obtienen de alimento o luz.' },
        { term: 'Juguete / modelo', definition: 'Parece vivo pero no come ni crece.' },
      ],
      sayThisAloud:
        'El cachorro come y crece — vivo. La roca se puede partir, pero no desayuna — no vivo. El perro de juguete parece perro, pero no respira; va a no vivo.',
      misconceptions: [
        {
          myth: 'Lo que se mueve está vivo.',
          correction: 'El viento mueve la bandera; los carros se mueven — no basta.',
        },
        {
          myth: 'Las plantas no están vivas porque no caminan.',
          correction: 'Crecen, responden y usan luz — están vivas.',
        },
      ],
      supportEmergingLearners:
        'Clasificar solo fotos. Dos aros. Obvio primero.',
      extendForDepth:
        'Semillas (vivas pero quietas). Fuego con curiosidad sin detalle celular.',
      extraPracticeIdeas: [
        'Lápiz vs planta del salón.',
        'Dibuja uno vivo y uno no vivo de casa.',
        'Canto: “¿Come? ¿Crece?”',
      ],
    },
  },
  'sci-kids-states-matter': {
    en: {
      conceptualDeepDive:
        'Solids hold shape, liquids flow with fixed volume, gases fill space—the particle model comes later but language matters now. Heating and cooling drive many changes; distinguish melting from dissolving. Use everyday phase changes (ice, steam) and stress observation words.',
      vocabularyTerms: [
        { term: 'Solid', definition: 'Matter with a definite shape and volume (for classroom purposes).' },
        { term: 'Liquid', definition: 'Matter that flows and takes the shape of its container.' },
        { term: 'Gas', definition: 'Matter that spreads out to fill its container; often invisible.' },
        { term: 'State change', definition: 'A change like melting or freezing driven by heating/cooling.' },
      ],
      sayThisAloud:
        'Ice is water in a solid state—it keeps its shape until it warms. Liquid water takes the shape of my cup. Steam is water as a gas; it spreads out in the air. Same substance, different states when heat energy changes.',
      misconceptions: [
        {
          myth: 'Steam is a different element than water.',
          correction: 'It is water in gas form—still H2O in kid-friendly language.',
        },
        {
          myth: 'Dissolving salt is the same as melting ice.',
          correction: 'Dissolving mixes; melting is a state change of a single substance.',
        },
      ],
      supportEmergingLearners:
        'Use water, ice, and a clear cup demo. Picture sort of solids/liquids/gases from magazines.',
      extendForDepth:
        'Track temperature with a simple class chart over a melting ice investigation.',
      extraPracticeIdeas: [
        'Home link: list three liquids in the kitchen.',
        'Predict then observe: crayon in sun (solid softens—preview without full polymer lesson).',
        'Draw particles as dots in tight vs loose arrangements (intro model).',
      ],
    },
    es: {
      conceptualDeepDive:
        'Sólidos mantienen forma, líquidos fluyen con volumen fijo, gases llenan el espacio — el modelo de partículas viene después. Calentar y enfriar provocan cambios; separa fundir de disolver. Usa hielo y vapor y vocabulario de observación.',
      vocabularyTerms: [
        { term: 'Sólido', definition: 'Materia con forma y volumen definidos (en el salón).' },
        { term: 'Líquido', definition: 'Fluye y toma la forma de su recipiente.' },
        { term: 'Gas', definition: 'Se expande; a menudo invisible.' },
        { term: 'Cambio de estado', definition: 'Fundir, congelar, etc., por calor o frío.' },
      ],
      sayThisAloud:
        'El hielo es agua sólida — mantiene forma hasta calentar. El agua líquida toma la forma del vaso. El vapor es agua gaseosa; se esparce. Misma sustancia, distinto estado según energía.',
      misconceptions: [
        {
          myth: 'El vapor no es agua.',
          correction: 'Es agua en forma de gas — mismo material en lenguaje infantil.',
        },
        {
          myth: 'Disolver sal es como fundir hielo.',
          correction: 'Disolver mezcla; fundir cambia estado de una sustancia.',
        },
      ],
      supportEmergingLearners:
        'Demo con hielo y vaso. Clasificar recortes de revista.',
      extendForDepth:
        'Gráfica de temperatura mientras derrite hielo.',
      extraPracticeIdeas: [
        'En casa: tres líquidos en la cocina.',
        'Predecir y observar crayón al sol.',
        'Dibujar puntitos juntos vs sueltos (modelo introductorio).',
      ],
    },
  },
  'sci-kids-plants-need': {
    en: {
      conceptualDeepDive:
        'Plants need light, water, air, space, and nutrients—usually framed as what leaves, roots, and soil do together. Avoid teleology (“wants sun”); use “responds to” and “needs for growth.” Connect to classroom plants and fair tests (same plant, change one variable when age-appropriate).',
      vocabularyTerms: [
        { term: 'Photosynthesis (preview)', definition: 'How plants use light to make food—name lightly; detail later.' },
        { term: 'Nutrient', definition: 'Substances from soil or water that help plants grow strong.' },
        { term: 'Variable', definition: 'Something you change or measure in a simple investigation.' },
        { term: 'Fair test', definition: 'Change one thing at a time so you know what caused the result.' },
      ],
      sayThisAloud:
        'Plants are living, so they need resources. Light helps leaves make food energy. Roots take in water and anchor the plant. If we crowd ten plants in one tiny pot, they compete for space and light.',
      misconceptions: [
        {
          myth: 'Plants “eat” soil like animals eat food.',
          correction: 'They take water and nutrients from soil; most mass comes from air/water via photosynthesis over time.',
        },
        {
          myth: 'Any liquid will help a plant equally.',
          correction: 'Some liquids harm plants—stick to water in class experiments.',
        },
      ],
      supportEmergingLearners:
        'Label a classroom plant’s parts on a photo. Use a chant: “Sun, water, air, space.”',
      extendForDepth:
        'Design a two-week observation: one plant with light, one covered (ethical: short duration, restore light).',
      extraPracticeIdeas: [
        'Plant journal with drawings weekly.',
        'Compare classroom plant to tree outside—same needs, different scale.',
        'Read-aloud on decomposers returning nutrients (bridge).',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las plantas necesitan luz, agua, aire, espacio y nutrientes — hojas, raíces y suelo trabajan juntos. Evita teleología (“quiere sol”); usa “responde a” y “necesita para crecer”. Conecta con plantas del salón y pruebas justas.',
      vocabularyTerms: [
        { term: 'Fotosíntesis (avance)', definition: 'Cómo usan la luz para alimento — nombrar sin profundizar aún.' },
        { term: 'Nutriente', definition: 'Sustancias del suelo o agua que ayudan a crecer.' },
        { term: 'Variable', definition: 'Lo que cambias o mides en una investigación simple.' },
        { term: 'Prueba justa', definition: 'Cambiar una cosa a la vez para saber la causa.' },
      ],
      sayThisAloud:
        'Las plantas están vivas y necesitan recursos. La luz ayuda a las hojas a producir energía. Las raíces absorben agua y sujetan. Si apiñamos diez en una maceta, compiten por espacio y luz.',
      misconceptions: [
        {
          myth: 'Las plantas “comen” tierra como animales.',
          correction: 'Toman agua y nutrientes; gran parte de la masa viene del aire y agua con el tiempo.',
        },
        {
          myth: 'Cualquier líquido sirve igual.',
          correction: 'Algunos dañan — en clase solo agua.',
        },
      ],
      supportEmergingLearners:
        'Etiquetar foto de planta del salón. Canto: “Sol, agua, aire, espacio.”',
      extendForDepth:
        'Dos semanas: con luz vs cubierta breve (restaurar luz después).',
      extraPracticeIdeas: [
        'Diario de planta con dibujos.',
        'Planta del cole vs árbol afuera.',
        'Lectura sobre descomponedores y nutrientes.',
      ],
    },
  },
  'sci-crew-food-web': {
    en: {
      conceptualDeepDive:
        'Energy flows; matter cycles—introduce flow with arrows from food to eater. Producers anchor most terrestrial webs in sunlight. Omnivores complicate simple chains; that is why “web” is more honest than one straight line. Discuss local examples to ground abstraction.',
      vocabularyTerms: [
        { term: 'Producer', definition: 'An organism that makes food from light (plants, algae).' },
        { term: 'Consumer', definition: 'An organism that eats other organisms for energy.' },
        { term: 'Herbivore / carnivore / omnivore', definition: 'Plant-eater, meat-eater, or both.' },
        { term: 'Food web', definition: 'Many linked feeding relationships, not a single chain.' },
      ],
      sayThisAloud:
        'Arrows point to where energy goes next—grass to rabbit, rabbit to fox. The Sun starts most land chains because plants capture that energy. Real animals rarely eat only one thing, so we draw webs, not one skinny line.',
      misconceptions: [
        {
          myth: 'Arrows point from predator to prey.',
          correction: 'Convention: arrow shows energy flow toward the eater.',
        },
        {
          myth: 'The Sun is a producer.',
          correction: 'It is the energy source; producers are living things that capture it.',
        },
      ],
      supportEmergingLearners:
        'Build a desktop web with yarn between picture cards. Start with Sun → plant → two animals.',
      extendForDepth:
        'Add decomposers returning matter. Trace what happens if one population crashes in a simple model.',
      extraPracticeIdeas: [
        'Local park web poster.',
        'Digital or paper simulation: remove one species—predict effects.',
        'Jigsaw: each group masters one organism, then assemble class web.',
      ],
    },
    es: {
      conceptualDeepDive:
        'La energía fluye; la materia cicla — flechas de comida a quien come. Los productores anclan muchas redes terrestres con luz solar. Los omnívoros enredan las cadenas; por eso “red” es más honesto que una línea. Usa ejemplos locales.',
      vocabularyTerms: [
        { term: 'Productor', definition: 'Organismo que hace alimento con luz (plantas, algas).' },
        { term: 'Consumidor', definition: 'Come otros organismos para obtener energía.' },
        { term: 'Herbívoro / carnívoro / omnívoro', definition: 'Come plantas, carne, o ambos.' },
        { term: 'Red alimentaria', definition: 'Muchas relaciones enlazadas, no una sola cadena.' },
      ],
      sayThisAloud:
        'Las flechas muestran hacia dónde va la energía: hierba → conejo → zorro. El Sol inicia muchas cadenas terrestres porque las plantas captan esa energía. Los animales reales comen varias cosas — dibujamos redes.',
      misconceptions: [
        {
          myth: 'La flecha va del depredador a la presa.',
          correction: 'Convención: la flecha va hacia quien come.',
        },
        {
          myth: 'El Sol es un productor.',
          correction: 'Es la fuente de energía; productores son seres vivos que la captan.',
        },
      ],
      supportEmergingLearners:
        'Red con hilos entre tarjetas. Sol → planta → dos animales.',
      extendForDepth:
        'Añadir descomponedores. ¿Qué pasa si desaparece una población?',
      extraPracticeIdeas: [
        'Póster del parque.',
        'Simulación: quitar una especie.',
        'Rompecabezas: cada grupo un organismo y luego armar red.',
      ],
    },
  },
  'sci-crew-sun-energy': {
    en: {
      conceptualDeepDive:
        'Almost all surface ecosystems trace energy to the Sun, sometimes stored for millions of years in fuels. Solar panels and wind connect to uneven heating and light. Tie in responsible use: energy choices affect air, water, and climate—age-appropriate, solutions-oriented framing.',
      vocabularyTerms: [
        { term: 'Solar energy', definition: 'Energy from sunlight used by plants and technologies like panels.' },
        { term: 'Fossil fuel', definition: 'Energy-rich materials formed long ago from ancient organisms.' },
        { term: 'Renewable (intro)', definition: 'Sources like sun and wind that replenish on human time scales.' },
        { term: 'Conservation', definition: 'Using less energy or using it wisely to reduce harm.' },
      ],
      sayThisAloud:
        'Trace it back: my salad’s lettuce captured sunlight; so did the grain that fed the chicken in my sandwich. Coal and natural gas store ancient sunlight. Today we can also turn light directly into electricity with panels—different path, same original star.',
      misconceptions: [
        {
          myth: 'Energy disappears completely when we use it.',
          correction: 'It transforms; emphasize “moves and changes form” rather than vanishing.',
        },
        {
          myth: 'Wind energy is unrelated to the Sun.',
          correction: 'Sun drives weather patterns and heating differences that create wind.',
        },
      ],
      supportEmergingLearners:
        'Use a simple flow diagram Sun → plant → animal. Match pictures to “direct sun” vs “stored ancient energy.”',
      extendForDepth:
        'Discuss one local energy source and one personal conservation action with evidence.',
      extraPracticeIdeas: [
        'Audit classroom: lights off when leaving?',
        'Interview a family member about an electric bill habit (with privacy norms).',
        'Model hydro/solar/wind with kid-safe videos from trusted sources.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Casi toda la energía en la superficie viene del Sol, a veces guardada millones de años en combustibles. Paneles y viento enlazan con luz y calentamiento desigual. Enlaza uso responsable: decisiones energéticas afectan aire, agua y clima — con soluciones a su nivel.',
      vocabularyTerms: [
        { term: 'Energía solar', definition: 'Luz del Sol usada por plantas y tecnologías como paneles.' },
        { term: 'Combustible fósil', definition: 'Materiales ricos en energía formados hace mucho de organismos antiguos.' },
        { term: 'Renovable (intro)', definition: 'Sol y viento se renuevan en escala humana.' },
        { term: 'Conservación', definition: 'Usar menos o con más cuidado para reducir daño.' },
      ],
      sayThisAloud:
        'Retrocedamos: la lechuga captó luz solar; el pollo comió grano que también vino de plantas con luz. Carbón y gas guardan luz antigua. Hoy los paneles convierten luz en electricidad — otro camino, misma estrella.',
      misconceptions: [
        {
          myth: 'La energía desaparece al usarla.',
          correction: 'Se transforma; digamos que “cambia de forma” más que que se pierde.',
        },
        {
          myth: 'El viento no tiene que ver con el Sol.',
          correction: 'El Sol impulsa clima y diferencias de calor que crean viento.',
        },
      ],
      supportEmergingLearners:
        'Diagrama Sol → planta → animal. Fotos: “sol directo” vs “energía antigua guardada.”',
      extendForDepth:
        'Una fuente local de energía y una acción de ahorro personal con razón.',
      extraPracticeIdeas: [
        'Auditoría: ¿apagamos luces al salir?',
        'Conversación en casa sobre un hábito eléctrico (con normas de privacidad).',
        'Videos confiables sobre hidro/solar/eólico.',
      ],
    },
  },
  'sci-tots-weather-sun-cloud': {
    en: {
      conceptualDeepDive:
        'Weather is observable patterns of atmosphere near the ground—cloud type, precipitation, wind, temperature. Distinguish weather (today) from climate (long-term averages). Sun drives heating and evaporation; never stare at the Sun—model safe indirect observation.',
      vocabularyTerms: [
        { term: 'Weather', definition: 'What the sky and air are doing over a short time.' },
        { term: 'Sunny / cloudy / rainy', definition: 'Common child-friendly descriptors tied to observation.' },
        { term: 'Precipitation', definition: 'Water falling from clouds (rain, snow, hail).' },
        { term: 'Observe', definition: 'Use senses and tools safely to gather information.' },
      ],
      sayThisAloud:
        'We look at the sky and feel the air—sunny means bright light and warmth we notice on skin; dark clouds can mean rain might come. We never stare at the Sun; we notice its light on the ground instead.',
      misconceptions: [
        {
          myth: 'Clouds are made of cotton or smoke.',
          correction: 'They are tiny water droplets or ice crystals—too small to hold.',
        },
        {
          myth: 'Thunder causes lightning.',
          correction: 'Lightning happens first; thunder is the sound that follows.',
        },
      ],
      supportEmergingLearners:
        'Weather wheel with icons; one child reports daily from the window.',
      extendForDepth:
        'Simple thermometer read with adult; compare two days on a chart.',
      extraPracticeIdeas: [
        'Dress-for-weather game with paper dolls.',
        'Shadow length at morning vs noon (indirect sun discussion).',
        'Class weather journal for one week.',
      ],
    },
    es: {
      conceptualDeepDive:
        'El clima son patrones observables del aire cerca del suelo. Diferencia clima del día vs clima a largo plazo. El Sol impulsa calor y evaporación; jamás mirar directo — observación indirecta segura.',
      vocabularyTerms: [
        { term: 'Clima (del día)', definition: 'Lo que hace el cielo y el aire en poco tiempo.' },
        { term: 'Soleado / nublado / lluvioso', definition: 'Palabras ligadas a lo que vemos y sentimos.' },
        { term: 'Precipitación', definition: 'Agua que cae de las nubes.' },
        { term: 'Observar', definition: 'Usar sentidos y herramientas con seguridad.' },
      ],
      sayThisAloud:
        'Miramos el cielo y el aire — soleado es luz y calor en la piel; nubes oscuras pueden anunciar lluvia. No miramos al Sol; vemos su luz en el suelo.',
      misconceptions: [
        {
          myth: 'Las nubes son algodón.',
          correction: 'Son gotitas o cristales de hielo muy pequeños.',
        },
        {
          myth: 'El trueno causa el rayo.',
          correction: 'El rayo ocurre primero; el trueno es el sonido que sigue.',
        },
      ],
      supportEmergingLearners:
        'Rueda del tiempo con íconos; un ayudante reporta desde la ventana.',
      extendForDepth:
        'Termómetro con adulto; comparar dos días en tabla.',
      extraPracticeIdeas: [
        'Juego de vestir según el tiempo.',
        'Sombra mañana vs mediodía.',
        'Diario del clima una semana.',
      ],
    },
  },
  'sci-kids-pushes-pulls': {
    en: {
      conceptualDeepDive:
        'Forces are interactions that change motion (speed, direction, start, stop). NGSS K-PS2 emphasizes planning investigations: same object, varied push strength, fair comparison. Friction is a real complication—acknowledge it without overloading vocabulary.',
      vocabularyTerms: [
        { term: 'Push', definition: 'Force that moves something away from the applier.' },
        { term: 'Pull', definition: 'Force that draws something closer.' },
        { term: 'Motion', definition: 'Change of position over time.' },
        { term: 'Fair test', definition: 'Change one factor at a time so results are interpretable.' },
      ],
      sayThisAloud:
        'When I push the car away from my hand, that is a push. When I drag the wagon toward me, that is a pull. If I push harder on the same surface, the car usually speeds up more—unless something else changed.',
      misconceptions: [
        {
          myth: 'Bigger always means faster forever.',
          correction: 'Surface, friction, and obstacles limit motion—patterns have conditions.',
        },
        {
          myth: 'Forces only exist when something moves.',
          correction: 'Balanced forces can hold still; net force is what changes motion.',
        },
      ],
      supportEmergingLearners:
        'Body pushes/pulls with a partner at safe distance; then translate to toys.',
      extendForDepth:
        'Ramp angle as second variable after strength is understood.',
      extraPracticeIdeas: [
        'Predict-then-test with toy cars and masking-tape start lines.',
        'Draw arrows on photos of playground equipment.',
        'Sort classroom scenarios: push, pull, or both.',
      ],
    },
    es: {
      conceptualDeepDive:
        'Las fuerzas son interacciones que cambian el movimiento. K-PS2 pide planear pruebas: mismo objeto, distinta fuerza, comparación justa. La fricción complica — nombrarla sin saturar.',
      vocabularyTerms: [
        { term: 'Empuje', definition: 'Fuerza que aleja del que empuja.' },
        { term: 'Tirón', definition: 'Fuerza que acerca.' },
        { term: 'Movimiento', definition: 'Cambio de posición en el tiempo.' },
        { term: 'Prueba justa', definition: 'Cambiar un factor a la vez.' },
      ],
      sayThisAloud:
        'Empujo el carrito lejos de mi mano — empuje. Arrastro el carrito hacia mí — tirón. Si empujo más fuerte en la misma superficie, suele ir más rápido.',
      misconceptions: [
        {
          myth: 'Más grande siempre más rápido para siempre.',
          correction: 'Superficie y fricción limitan — hay condiciones.',
        },
        {
          myth: 'Solo hay fuerza si hay movimiento.',
          correction: 'Fuerzas equilibradas pueden mantener quieto; la neta cambia el movimiento.',
        },
      ],
      supportEmergingLearners:
        'Empujes y tirones corporales seguros; luego juguetes.',
      extendForDepth:
        'Ángulo de rampa como segunda variable.',
      extraPracticeIdeas: [
        'Predecir y probar con carritos.',
        'Flechas en fotos del patio.',
        'Clasificar escenarios del salón.',
      ],
    },
  },
  'sci-crew-human-body-systems': {
    en: {
      conceptualDeepDive:
        '4-LS1-1 focuses on structures and functions supporting survival, growth, behavior, and reproduction. Systems are conceptual groupings—stress interaction: respiratory supplies O₂, circulatory distributes, digestive provides fuel, musculoskeletal enables action. Avoid overclaiming “the X system does only Y.”',
      vocabularyTerms: [
        { term: 'Organ system', definition: 'Group of organs working together toward related functions.' },
        { term: 'Digestive', definition: 'Breaks down food so nutrients enter the blood.' },
        { term: 'Respiratory', definition: 'Gas exchange between air and blood.' },
        { term: 'Circulatory', definition: 'Heart and blood vessels transport materials.' },
      ],
      sayThisAloud:
        'My brain needs oxygen and sugar—lungs swap gases, heart moves blood, stomach and intestines pull nutrients into that blood, bones and muscles let me go get more food and air. If one part struggles, others feel it.',
      misconceptions: [
        {
          myth: 'Food goes straight into muscles for energy.',
          correction: 'Digestion breaks food into molecules that enter blood for cells.',
        },
        {
          myth: 'Heart makes blood from nothing.',
          correction: 'Heart pumps blood; marrow makes blood cells—different jobs.',
        },
      ],
      supportEmergingLearners:
        'Life-size outline poster; place sticky notes for one job per system.',
      extendForDepth:
        'Compare plant structures to animal systems without forcing one-to-one mapping.',
      extraPracticeIdeas: [
        'Pulse and breathing before/after jumping jacks.',
        'Label a diagram from memory, then self-check.',
        'Jigsaw: each expert group teaches one system.',
      ],
    },
    es: {
      conceptualDeepDive:
        '4-LS1-1: estructuras y funciones para sobrevivir, crecer, comportarse. Los sistemas son agrupaciones conceptuales — enfatiza interacción. Evita “el sistema X solo hace Y”.',
      vocabularyTerms: [
        { term: 'Sistema de órganos', definition: 'Órganos que colaboran en funciones relacionadas.' },
        { term: 'Digestivo', definition: 'Descompone alimento para nutrientes en sangre.' },
        { term: 'Respiratorio', definition: 'Intercambio de gases aire-sangre.' },
        { term: 'Circulatorio', definition: 'Corazón y vasos transportan materiales.' },
      ],
      sayThisAloud:
        'El cerebro necesita oxígeno y glucosa — pulmones, corazón, digestión y músculos/huesos trabajan en red. Si una parte falla, las demás lo notan.',
      misconceptions: [
        {
          myth: 'La comida va directo al músculo.',
          correction: 'Se descompone y entra a la sangre para las células.',
        },
        {
          myth: 'El corazón inventa sangre.',
          correction: 'Bombea; la médula hace células — trabajos distintos.',
        },
      ],
      supportEmergingLearners:
        'Silueta tamaño real; notas adhesivas con una función por sistema.',
      extendForDepth:
        'Comparar plantas y animales sin forzar mapa uno a uno.',
      extraPracticeIdeas: [
        'Pulso y respiración antes/después de saltar.',
        'Diagrama de memoria y autocorrección.',
        'Rompecabezas: cada grupo enseña un sistema.',
      ],
    },
  },
}
