import type { SchoolSubjectLesson } from '../types'

export const SCIENCE_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'sci-tots-five-senses',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Observe with senses (pre-K)',
    cardEmoji: '👁️',
    en: {
      title: 'Five Senses Explore',
      summary: 'Use sight, hearing, touch, smell, and taste (when safe) to notice the world.',
      objectives: ['Name the five senses', 'Match a sense to a simple observation'],
      teachSections: [
        {
          heading: 'Sparki’s tools',
          body: 'Scientists notice carefully. We see colors, hear sounds, feel textures, smell scents, and sometimes taste safe foods.',
        },
        {
          heading: 'Safe rules',
          body: 'We only taste when a grown-up says it is safe. We smell gently — no snorting unknown liquids!',
        },
        {
          heading: 'Walk',
          body: 'Find something smooth, something loud, something bright. Which sense?',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-sens-q1',
          prompt: 'We use our ears to…',
          options: ['Hear', 'See', 'Smell'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q2',
          prompt: 'Which sense helps you notice if soup is hot before you sip?',
          options: ['Touch (and careful sight)', 'Only hearing', 'Only taste with a big gulp'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Snack time: “What do you see, smell, and feel on the apple skin?”',
    },
    es: {
      title: 'Explorar con los cinco sentidos',
      summary: 'Usar vista, oído, tacto, olfato y gusto (cuando sea seguro).',
      objectives: ['Nombrar los cinco sentidos', 'Emparejar un sentido con una observación'],
      teachSections: [
        {
          heading: 'Herramientas de Sparki',
          body: 'Los científicos observan con cuidado. Vemos colores, oímos sonidos, sentimos texturas, olemos aromas y a veces probamos alimentos seguros.',
        },
        {
          heading: 'Reglas seguras',
          body: 'Solo probamos si un adulto dice que es seguro. Olemos con suavidad.',
        },
        {
          heading: 'Paseo',
          body: 'Busquen algo liso, algo ruidoso, algo brillante. ¿Qué sentido usaron?',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-sens-q1',
          prompt: 'Usamos los oídos para…',
          options: ['Oír', 'Ver', 'Oler'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q2',
          prompt: '¿Qué sentido ayuda a notar si la sopa está caliente antes de probar?',
          options: ['Tacto (y vista con cuidado)', 'Solo oír', 'Solo gustar de golpe'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'En la merienda: “¿Qué ves, hueles y sientes en la manzana?”',
    },
  },
  {
    id: 'sci-tots-living-nonliving',
    order: 2,
    ageBands: ['tots'],
    estMinutes: 10,
    standardsNote: 'Living vs nonliving (pre-K)',
    cardEmoji: '🌱',
    en: {
      title: 'Living or Nonliving?',
      summary: 'Sort things that grow, eat, and breathe from things that do not.',
      objectives: ['Tell that plants and animals are living', 'Give an example of nonliving'],
      teachSections: [
        {
          heading: 'Living things',
          body: 'Many living things grow, need food or sunlight, and respond to their world. A puppy and a bean plant are living.',
        },
        {
          heading: 'Nonliving',
          body: 'Rocks, blocks, and water (as a material) do not live like a plant or animal. They do not grow and eat like we do.',
        },
        {
          heading: 'Gray zones',
          body: 'Young kids: keep categories simple. Older grades will refine “what is alive.”',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-liv-q1',
          prompt: 'Which is living?',
          options: ['A growing sunflower', 'A rock', 'A plastic spoon'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q2',
          prompt: 'A cat is…',
          options: ['Living', 'Nonliving', 'Neither'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Toy bin sort: “Living in real life?” — action figures are nonliving even if they look like animals.',
    },
    es: {
      title: '¿Vivo o no vivo?',
      summary: 'Clasificar lo que crece y necesita alimento de lo que no.',
      objectives: ['Decir que plantas y animales están vivos', 'Dar un ejemplo de no vivo'],
      teachSections: [
        {
          heading: 'Seres vivos',
          body: 'Muchos seres vivos crecen, necesitan alimento o luz y reaccionan al entorno. Un cachorro y una planta de frijol están vivos.',
        },
        {
          heading: 'No vivos',
          body: 'Las rocas, bloques y el agua como material no viven como planta o animal.',
        },
        {
          heading: 'Zonas grises',
          body: 'En edad pequeña, categorías simples. Más adelante afinan “qué está vivo.”',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-liv-q1',
          prompt: '¿Qué está vivo?',
          options: ['Un girasol que crece', 'Una roca', 'Una cuchara de plástico'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q2',
          prompt: 'Un gato es…',
          options: ['Vivo', 'No vivo', 'Ninguno'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Caja de juguetes: “¿Vivo en la vida real?” — las figuras no están vivas aunque parezcan animales.',
    },
  },
  {
    id: 'sci-kids-states-matter',
    order: 1,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: 'Properties of matter (Grades 1–2)',
    cardEmoji: '💧',
    en: {
      title: 'Solids, Liquids, and Gases',
      summary: 'Describe how shape and volume behave in each state.',
      objectives: ['Give examples of solid, liquid, and gas', 'Connect everyday objects to a state'],
      teachSections: [
        {
          heading: 'Solids',
          body: 'A solid keeps its shape (unless we break it). A wooden block is a solid.',
        },
        {
          heading: 'Liquids',
          body: 'A liquid takes the shape of its container. Water and juice are liquids.',
        },
        {
          heading: 'Gases',
          body: 'A gas spreads out to fill space. Air is a gas we cannot see but can feel when the wind blows.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-mat-q1',
          prompt: 'Water in a cup is a…',
          options: ['Liquid', 'Solid', 'Only a gas'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q2',
          prompt: 'Ice cubes are usually…',
          options: ['Solid water', 'Liquid water', 'Water vapor only'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Freeze water overnight — observe solid vs liquid in the kitchen lab.',
    },
    es: {
      title: 'Sólidos, líquidos y gases',
      summary: 'Describir forma y volumen en cada estado.',
      objectives: ['Dar ejemplos de sólido, líquido y gas', 'Relacionar objetos cotidianos'],
      teachSections: [
        {
          heading: 'Sólidos',
          body: 'Un sólido mantiene su forma (si no lo partimos). Un bloque de madera es sólido.',
        },
        {
          heading: 'Líquidos',
          body: 'Un líquido toma la forma de su recipiente. El agua y el jugo son líquidos.',
        },
        {
          heading: 'Gases',
          body: 'Un gas se expande para llenar espacio. El aire es un gas que no vemos pero sentimos en el viento.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-mat-q1',
          prompt: 'El agua en un vaso es un…',
          options: ['Líquido', 'Sólido', 'Solo gas'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q2',
          prompt: 'Los cubos de hielo suelen ser…',
          options: ['Agua sólida', 'Agua líquida', 'Solo vapor'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Congelen agua — observen sólido vs líquido en la “laboratorio cocina.”',
    },
  },
  {
    id: 'sci-kids-plants-need',
    order: 2,
    ageBands: ['kids'],
    estMinutes: 12,
    standardsNote: 'Plant needs (Grades 1–2)',
    cardEmoji: '🌻',
    en: {
      title: 'What Plants Need',
      summary: 'Connect sunlight, water, air, and space to healthy plants.',
      objectives: ['List basic plant needs', 'Predict what happens if one need is missing'],
      teachSections: [
        {
          heading: 'Energy',
          body: 'Most plants use sunlight to make food — a process you will name more in older grades.',
        },
        {
          heading: 'Water & air',
          body: 'Roots drink water; leaves exchange gases with the air through tiny openings.',
        },
        {
          heading: 'Space',
          body: 'Crowded plants compete. A little space helps each plant get light and water.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-pla-q1',
          prompt: 'Most green plants need…',
          options: ['Sunlight, water, and air', 'Only darkness', 'Zero water'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q2',
          prompt: 'If a plant gets no water for a long time, it will likely…',
          options: ['Struggle or wilt', 'Grow extra fast', 'Turn into an animal'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Classroom plant job chart: water, light check, gentle leaf dusting.',
    },
    es: {
      title: 'Lo que las plantas necesitan',
      summary: 'Relacionar luz, agua, aire y espacio con plantas sanas.',
      objectives: ['Enumerar necesidades básicas', 'Predecir si falta algo'],
      teachSections: [
        {
          heading: 'Energía',
          body: 'La mayoría de plantas usan la luz solar para alimentarse — más adelante le pondrán nombre al proceso.',
        },
        {
          heading: 'Agua y aire',
          body: 'Las raíces absorben agua; las hojas intercambian gases con el aire.',
        },
        {
          heading: 'Espacio',
          body: 'Plantas apiñadas compiten. Un poco de espacio ayuda a cada una.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-pla-q1',
          prompt: 'La mayoría de plantas verdes necesitan…',
          options: ['Luz solar, agua y aire', 'Solo oscuridad', 'Cero agua'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q2',
          prompt: 'Si una planta no recibe agua mucho tiempo, probablemente…',
          options: ['Se debilita o se marchita', 'Crece más rápido', 'Se convierte en animal'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Cartel de cuidado: agua, revisar luz, limpiar polvo de las hojas.',
    },
  },
  {
    id: 'sci-crew-food-web',
    order: 1,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Energy in ecosystems (Grades 3–5)',
    cardEmoji: '🦊',
    en: {
      title: 'Food Chains & Webs',
      summary: 'Trace energy from the Sun through producers to consumers.',
      objectives: ['Identify producer, herbivore, carnivore, omnivore', 'Explain why arrows point “who eats whom”'],
      teachSections: [
        {
          heading: 'Producers',
          body: 'Plants and algae capture Sun energy to make food. They are producers.',
        },
        {
          heading: 'Consumers',
          body: 'Animals eat plants or other animals. Arrows show energy flow: grass → rabbit → fox.',
        },
        {
          heading: 'Webs',
          body: 'Real life is messy — many connections make a food web, not one straight line.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-web-q1',
          prompt: 'A plant in a food chain is usually…',
          options: ['A producer', 'A carnivore', 'The Sun'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q2',
          prompt: 'In “leaf → caterpillar → bird,” the bird is…',
          options: ['A consumer', 'A producer', 'The Sun'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Local park: find a producer, then name one animal that might eat it.',
    },
    es: {
      title: 'Cadenas y redes alimentarias',
      summary: 'Seguir la energía del Sol hasta productores y consumidores.',
      objectives: ['Identificar productor, herbívoro, carnívoro, omnívoro', 'Explicar flechas “quién come a quién”'],
      teachSections: [
        {
          heading: 'Productores',
          body: 'Plantas y algas captan energía solar para producir alimento.',
        },
        {
          heading: 'Consumidores',
          body: 'Los animales comen plantas u otros animales. Las flechas muestran el flujo: hierba → conejo → zorro.',
        },
        {
          heading: 'Redes',
          body: 'La vida real es enredada — muchas conexiones forman una red, no una sola línea.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-web-q1',
          prompt: 'Una planta en la cadena suele ser…',
          options: ['Un productor', 'Un carnívoro', 'El Sol'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q2',
          prompt: 'En “hoja → oruga → pájaro,” el pájaro es…',
          options: ['Un consumidor', 'Un productor', 'El Sol'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Parque local: encuentren un productor y un animal que podría comerlo.',
    },
  },
  {
    id: 'sci-crew-sun-energy',
    order: 2,
    ageBands: ['crew'],
    estMinutes: 14,
    standardsNote: 'Earth & human activity (Grades 3–5)',
    cardEmoji: '☀️',
    en: {
      title: 'Energy from the Sun',
      summary: 'Connect sunlight to weather, plants, and human tools like solar panels.',
      objectives: ['Describe sunlight as Earth’s main energy source for surface life', 'Name one human use of solar energy'],
      teachSections: [
        {
          heading: 'Big picture',
          body: 'Almost all energy in surface ecosystems traces back to the Sun — directly or stored in plants and fossil fuels formed long ago.',
        },
        {
          heading: 'Today’s tech',
          body: 'Solar panels turn light into electricity. Wind also comes from uneven heating by the Sun.',
        },
        {
          heading: 'Care',
          body: 'Sparki reminds: save energy, use power wisely, and learn how your community makes electricity.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-sun-q1',
          prompt: 'Green plants on Earth’s surface depend on the Sun for…',
          options: ['Energy to make food', 'Nothing at all', 'Only nighttime growth'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q2',
          prompt: 'Solar panels help people…',
          options: ['Turn sunlight into useful electricity', 'Remove gravity', 'Create new moons'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Compare a shaded vs sunny spot for a week — which dries faster after rain?',
    },
    es: {
      title: 'Energía del Sol',
      summary: 'Relacionar la luz solar con el clima, las plantas y paneles solares.',
      objectives: [
        'Describir la luz solar como fuente principal de energía en la superficie',
        'Nombrar un uso humano de energía solar',
      ],
      teachSections: [
        {
          heading: 'Panorama',
          body: 'Casi toda la energía en ecosistemas superficiales viene del Sol — directa o guardada en plantas y combustibles fósiles antiguos.',
        },
        {
          heading: 'Tecnología hoy',
          body: 'Los paneles solares convierten luz en electricidad. El viento también viene del calentamiento desigual del Sol.',
        },
        {
          heading: 'Cuidado',
          body: 'Sparki recuerda: ahorrar energía y aprender cómo tu comunidad produce electricidad.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-sun-q1',
          prompt: 'Las plantas verdes en la superficie dependen del Sol para…',
          options: ['Energía para producir alimento', 'Nada', 'Solo crecer de noche'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q2',
          prompt: 'Los paneles solares ayudan a…',
          options: ['Convertir luz solar en electricidad útil', 'Quitar la gravedad', 'Crear lunas nuevas'],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Comparen sombra vs sol una semana — ¿qué se seca más rápido tras la lluvia?',
    },
  },
]
