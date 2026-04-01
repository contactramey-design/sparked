import type { SchoolSubjectLesson } from '../types'

export const SCIENCE_LESSONS: SchoolSubjectLesson[] = [
  {
    id: 'sci-tots-five-senses',
    order: 1,
    ageBands: ['tots'],
    estMinutes: 14,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Scientific Inquiry: observe and describe using the senses', 'Physical Sciences: properties of objects'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations science observation senses',
    },
    standardsNote: 'CA PTKLF Science — observation with senses (PK/TK)',
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
        {
          heading: 'Science practice',
          body: 'Observations can change when we get closer or add light. Scientists record what they notice, not what they wish.',
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
        {
          id: 'sci-tots-sens-q3',
          prompt: 'We use our eyes mainly to…',
          options: ['See', 'Taste', 'Hear'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q4',
          prompt: 'A safe science habit is…',
          options: [
            'Ask a grown-up before tasting unknown things',
            'Taste every plant outside',
            'Touch very hot pans to learn',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q5',
          prompt: 'Two students describe the same leaf differently. That can happen because…',
          options: [
            'They notice different attributes',
            'Science is only opinions with no facts',
            'Leaves have no real features',
          ],
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
        {
          heading: 'Práctica científica',
          body: 'Las observaciones pueden cambiar si nos acercamos o hay más luz. Anotamos lo que notamos, no lo que deseamos.',
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
        {
          id: 'sci-tots-sens-q3',
          prompt: 'Usamos los ojos principalmente para…',
          options: ['Ver', 'Gustar', 'Oír'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q4',
          prompt: 'Un hábito seguro es…',
          options: [
            'Preguntar a un adulto antes de probar cosas desconocidas',
            'Probar cada planta del patio',
            'Tocar ollas muy calientes para aprender',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-sens-q5',
          prompt: 'Dos niños describen distinto la misma hoja. Puede ser porque…',
          options: [
            'Notan atributos distintos',
            'La ciencia es solo opiniones',
            'Las hojas no tienen rasgos reales',
          ],
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
    caStandards: {
      framework: 'PTKLF',
      codes: ['Life Sciences: distinguish living from nonliving things'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations life sciences living nonliving',
    },
    standardsNote: 'CA PTKLF Science — living vs. nonliving (PK/TK)',
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
        {
          heading: 'Engineering connection',
          body: 'Toys and tools are designed by people; they do not eat and grow like animals or plants.',
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
        {
          id: 'sci-tots-liv-q3',
          prompt: 'A seed in soil that is starting to sprout is…',
          options: ['Living', 'Nonliving', 'Not real'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q4',
          prompt: 'Water in a bottle is best called…',
          options: ['Nonliving material humans use', 'A plant', 'An animal'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q5',
          prompt: 'Why is a stuffed bear nonliving?',
          options: [
            'It does not grow, eat, or breathe like a real bear',
            'It is too soft',
            'It has no color',
          ],
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
        {
          heading: 'Ingeniería',
          body: 'Juguetes y herramientas los diseñan personas; no comen ni crecen como plantas o animales.',
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
        {
          id: 'sci-tots-liv-q3',
          prompt: 'Una semilla en tierra que empieza a brotar es…',
          options: ['Viva', 'No viva', 'Irreal'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q4',
          prompt: 'El agua en una botella es mejor decir que es…',
          options: ['Material no vivo que usamos', 'Una planta', 'Un animal'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-liv-q5',
          prompt: '¿Por qué un oso de peluche no está vivo?',
          options: [
            'No crece, come ni respira como un oso real',
            'Es muy suave',
            'No tiene color',
          ],
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
    estMinutes: 16,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['2-PS1-1'],
      gradeSpan: '2',
      cdeSearchQuery: 'California NGSS 2-PS1-1 matter properties',
    },
    standardsNote: 'CA NGSS Gr.2; matter and its interactions; 2-PS1-1',
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
        {
          heading: 'Changes with temperature',
          body: 'Heating or cooling can change state: ice melts to liquid water; water can evaporate to invisible vapor.',
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
        {
          id: 'sci-kids-mat-q3',
          prompt: 'Steam above hot cocoa is mostly…',
          options: ['Water as a gas', 'Solid ice', 'A new element that is not water'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q4',
          prompt: 'A book keeps its shape easily because it is a…',
          options: ['Solid', 'Gas', 'Only a liquid'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q5',
          prompt: 'Pouring juice from a pitcher shows a liquid…',
          options: [
            'Takes the shape of its container',
            'Always stays in a cube',
            'Cannot move',
          ],
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
        {
          heading: 'Cambios con temperatura',
          body: 'Calentar o enfriar puede cambiar el estado: el hielo se derrite; el agua puede evaporarse a vapor.',
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
        {
          id: 'sci-kids-mat-q3',
          prompt: 'El vapor sobre chocolate caliente es en gran parte…',
          options: ['Agua como gas', 'Hielo sólido', 'Un elemento que no es agua'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q4',
          prompt: 'Un libro mantiene su forma con facilidad porque es un…',
          options: ['Sólido', 'Gas', 'Solo líquido'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-mat-q5',
          prompt: 'Servir jugo desde una jarra muestra que un líquido…',
          options: [
            'Toma la forma de su recipiente',
            'Siempre queda en cubo',
            'No puede moverse',
          ],
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
    estMinutes: 16,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['2-LS2-1'],
      gradeSpan: '2',
      cdeSearchQuery: 'California NGSS 2-LS2-1 plants sunlight water',
    },
    standardsNote: 'CA NGSS Gr.2; ecosystems; plant needs; 2-LS2-1',
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
        {
          heading: 'Soil role',
          body: 'Soil anchors roots and holds water and nutrients — a reason classroom plants need the right pot size.',
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
        {
          id: 'sci-kids-pla-q3',
          prompt: 'Leaves are important partly because they…',
          options: [
            'Interact with light and air for the plant',
            'Store all the water forever',
            'Replace the need for roots',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q4',
          prompt: 'A plant on a dark shelf for weeks might…',
          options: [
            'Grow weak or pale without enough light',
            'Grow best in total dark',
            'Become a mineral',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q5',
          prompt: 'Healthy plant systems depend on…',
          options: [
            'Several needs working together',
            'Only loud music',
            'Only paint color of the pot',
          ],
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
        {
          heading: 'Suelo',
          body: 'El suelo ancla raíces y guarda agua y nutrientes — por eso importa el tamaño de la maceta.',
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
        {
          id: 'sci-kids-pla-q3',
          prompt: 'Las hojas importan en parte porque…',
          options: [
            'Interactúan con luz y aire para la planta',
            'Guardan toda el agua para siempre',
            'Reemplazan la necesidad de raíces',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q4',
          prompt: 'Una planta en un estante oscuro por semanas podría…',
          options: [
            'Crecer débil o pálida sin suficiente luz',
            'Crecer mejor en oscuridad total',
            'Volverse un mineral',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-pla-q5',
          prompt: 'Una planta sana depende de…',
          options: [
            'Varias necesidades a la vez',
            'Solo música fuerte',
            'Solo el color de la maceta',
          ],
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
    estMinutes: 18,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['5-PS3-1', '5-LS2-1'],
      gradeSpan: '5',
      cdeSearchQuery: 'California NGSS 5-LS2-1 food web energy',
    },
    standardsNote: 'CA NGSS Gr.5; matter & energy in ecosystems; 5-LS2-1',
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
        {
          id: 'sci-crew-web-q3',
          prompt: 'Energy entering most land food webs starts with…',
          options: ['The Sun', 'Rocks only', 'Plastic bottles'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q4',
          prompt: 'An herbivore eats…',
          options: ['Mostly plants', 'Only lions', 'Only gases'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q5',
          prompt: 'A food web is more realistic than a single chain because…',
          options: [
            'Animals often eat more than one thing',
            'There is only one animal on Earth',
            'Producers never use sunlight',
          ],
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
        {
          id: 'sci-crew-web-q3',
          prompt: 'La energía que entra a muchas redes terrestres empieza con…',
          options: ['El Sol', 'Solo rocas', 'Botellas de plástico'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q4',
          prompt: 'Un herbívoro come…',
          options: ['Sobre todo plantas', 'Solo leones', 'Solo gases'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-web-q5',
          prompt: 'Una red es más realista que una sola cadena porque…',
          options: [
            'Los animales suelen comer más de una cosa',
            'Solo hay un animal en la Tierra',
            'Los productores nunca usan luz solar',
          ],
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
    estMinutes: 18,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['4-PS3-2', '4-ESS3-1'],
      gradeSpan: '4',
      cdeSearchQuery: 'California NGSS 4-ESS3-1 natural resources energy',
    },
    standardsNote: 'CA NGSS Gr.4; energy transfer & Earth systems; 4-ESS3-1',
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
        {
          heading: 'Heat and daily life',
          body: 'Sunlight warms air, water, and soil — that is why sunny spots dry faster and why seasons feel different.',
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
        {
          id: 'sci-crew-sun-q3',
          prompt: 'Wind patterns are strongly tied to…',
          options: [
            'Uneven heating of Earth by the Sun',
            'Only the Moon’s color',
            'Plants stopping all air movement',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q4',
          prompt: 'Fossil fuels store energy that originally came from…',
          options: [
            'Ancient plants and other organisms powered by sunlight long ago',
            'Lightning only from last Tuesday',
            'Rocks that never had living matter',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q5',
          prompt: 'A community reason to care about energy use is…',
          options: [
            'It connects to cost, pollution, and resource choices',
            'Energy is never important',
            'The Sun stops existing at night',
          ],
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
        {
          heading: 'Calor y vida diaria',
          body: 'La luz solar calienta aire, agua y suelo — por eso el sol seca más rápido y las estaciones se sienten distintas.',
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
        {
          id: 'sci-crew-sun-q3',
          prompt: 'Los vientos se relacionan mucho con…',
          options: [
            'El calentamiento desigual del Sol sobre la Tierra',
            'Solo el color de la Luna',
            'Las plantas deteniendo todo el aire',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q4',
          prompt: 'Los combustibles fósiles guardan energía que en origen vino de…',
          options: [
            'Plantas y organismos antiguos impulsados por luz solar',
            'Solo un rayo del martes pasado',
            'Rocas que nunca tuvieron materia viva',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-sun-q5',
          prompt: 'Una razón comunitaria para cuidar el uso de energía es…',
          options: [
            'Conecta con costo, contaminación y decisiones de recursos',
            'La energía nunca importa',
            'El Sol deja de existir de noche',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Comparen sombra vs sol una semana — ¿qué se seca más rápido tras la lluvia?',
    },
  },
  {
    id: 'sci-tots-weather-sun-cloud',
    order: 3,
    ageBands: ['tots'],
    estMinutes: 12,
    caStandards: {
      framework: 'PTKLF',
      codes: ['Physical Sciences: observe daily weather patterns; sun, clouds, rain'],
      gradeSpan: 'PK/TK',
      cdeSearchQuery: 'California preschool learning foundations science weather observe',
    },
    standardsNote: 'CA PTKLF Science — observe weather; sun, clouds, rain (PK/TK)',
    cardEmoji: '🌤️',
    en: {
      title: 'Sun, Clouds, and Rain',
      summary: 'Notice today’s weather and name sun, cloudy, and rainy days.',
      objectives: ['Describe weather in simple words', 'Connect clothing or activities to weather'],
      teachSections: [
        {
          heading: 'Look outside',
          body: 'Weather is what the sky and air are doing today. Is the sun bright? Are there gray clouds? Is water falling as rain?',
        },
        {
          heading: 'Safe observation',
          body: 'Never look straight at the sun. We notice sunlight on the ground and warmth on our skin.',
        },
        {
          heading: 'Words we use',
          body: 'Sunny, cloudy, rainy, windy—practice with a week-of-weather chart with stickers.',
        },
        {
          heading: 'Plans change',
          body: 'Rain might cancel outdoor recess; sun might mean hats. Weather affects choices.',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-wx-q1',
          prompt: 'Dark clouds often mean…',
          options: ['It might rain or storm', 'It is always night', 'There is no sky'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q2',
          prompt: 'The Sun gives Earth…',
          options: ['Light and warmth', 'Only shadows with no heat', 'Snow inside the classroom'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q3',
          prompt: 'A rainy day is usually…',
          options: ['Wet outside', 'Always dangerous to name', 'The same as a sunny day always'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q4',
          prompt: 'We describe weather by…',
          options: ['Observing sky, air, and what falls', 'Only guessing without looking', 'Closing the windows forever'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q5',
          prompt: 'Which is safe at school?',
          options: [
            'Look at the sky with your teacher—never stare at the sun',
            'Stare at the sun to see spots',
            'Run outside in lightning',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Morning circle: weather helper reports and picks a symbol card.',
    },
    es: {
      title: 'Sol, nubes y lluvia',
      summary: 'Observa el clima de hoy y nombra sol, nublado y lluvia.',
      objectives: ['Describir el clima con palabras simples', 'Relacionar ropa o actividades con el tiempo'],
      teachSections: [
        {
          heading: 'Mira afuera',
          body: 'El clima es lo que hacen el cielo y el aire hoy. ¿Brilla el sol? ¿Hay nubes grises? ¿Cae agua?',
        },
        {
          heading: 'Observar con seguridad',
          body: 'No mires directo al sol. Notamos la luz en el suelo y el calor en la piel.',
        },
        {
          heading: 'Palabras',
          body: 'Soleado, nublado, lluvioso, ventoso — cartel de la semana con calcomanías.',
        },
        {
          heading: 'Cambia planes',
          body: 'La lluvia puede cambiar el recreo; el sol puede pedir gorra.',
        },
      ],
      quiz: [
        {
          id: 'sci-tots-wx-q1',
          prompt: 'Nubes oscuras a menudo significan…',
          options: ['Puede llover o tormenta', 'Siempre es de noche', 'No hay cielo'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q2',
          prompt: 'El Sol da a la Tierra…',
          options: ['Luz y calor', 'Solo sombra sin calor', 'Nieve en el salón'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q3',
          prompt: 'Un día lluvioso suele ser…',
          options: ['Mojado afuera', 'Peligroso nombrar', 'Igual que soleado siempre'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q4',
          prompt: 'Describimos el clima…',
          options: ['Observando cielo, aire y lo que cae', 'Solo adivinando', 'Cerrando ventanas para siempre'],
          correctIndex: 0,
        },
        {
          id: 'sci-tots-wx-q5',
          prompt: '¿Qué es seguro en el cole?',
          options: [
            'Mirar el cielo con el docente — nunca fijarse en el sol',
            'Fijarse en el sol para ver manchas',
            'Salir con rayos',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Círculo matutino: ayudante del clima elige símbolo.',
    },
  },
  {
    id: 'sci-kids-pushes-pulls',
    order: 3,
    ageBands: ['kids'],
    estMinutes: 16,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['K-PS2-1'],
      gradeSpan: 'K–1',
      cdeSearchQuery: 'California NGSS K-PS2-1 push pull motion',
    },
    standardsNote: 'CA NGSS; plan and investigate pushes and pulls',
    cardEmoji: '🛝',
    en: {
      title: 'Pushes, Pulls, and Motion',
      summary: 'Explore how pushes and pulls change how things move or stop.',
      objectives: ['Compare stronger vs weaker pushes', 'Predict how a kick or pull changes speed or direction'],
      teachSections: [
        {
          heading: 'Forces as actions',
          body: 'A push moves something away from you; a pull brings it closer. Both can start, stop, or change motion.',
        },
        {
          heading: 'Strength matters',
          body: 'A gentle push might not move a heavy box; a stronger push might. Test with toy cars on the floor.',
        },
        {
          heading: 'Direction',
          body: 'Same strength, different angle—motion changes direction. Use arrows on a drawing to plan predictions.',
        },
        {
          heading: 'Fair tests',
          body: 'Change one thing at a time: same ramp, different push strength, to see a clear pattern.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-push-q1',
          prompt: 'A pull is a force that…',
          options: ['Brings something closer to you', 'Only works on the Moon', 'Means no motion'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q2',
          prompt: 'A harder push on the same toy car often…',
          options: ['Makes it speed up more', 'Always makes it stop instantly', 'Removes all friction'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q3',
          prompt: 'Which is a push?',
          options: ['Kicking a ball away from your foot', 'Dragging a wagon toward you', 'Holding still with two hands'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q4',
          prompt: 'In a fair test, we try to…',
          options: [
            'Change one variable at a time',
            'Change everything at once always',
            'Never write down results',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q5',
          prompt: 'Forces can…',
          options: [
            'Start motion, stop motion, or change direction',
            'Only work on living things',
            'Never be measured',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Playground: compare push on swing vs push on merry-go-round.',
    },
    es: {
      title: 'Empujes, tirones y movimiento',
      summary: 'Explora cómo empujar y tirar cambia el movimiento.',
      objectives: ['Comparar empujes fuertes y débiles', 'Predecir cómo cambia velocidad o dirección'],
      teachSections: [
        {
          heading: 'Fuerzas como acciones',
          body: 'Empujar aleja; tirar acerca. Ambas pueden iniciar, frenar o cambiar movimiento.',
        },
        {
          heading: 'La fuerza importa',
          body: 'Un empuje suave puede no mover una caja pesada; uno fuerte sí. Prueba con carritos.',
        },
        {
          heading: 'Dirección',
          body: 'Misma fuerza, distinto ángulo — cambia la dirección. Flechas en el dibujo.',
        },
        {
          heading: 'Pruebas justas',
          body: 'Cambia una cosa a la vez: misma rampa, distinta fuerza.',
        },
      ],
      quiz: [
        {
          id: 'sci-kids-push-q1',
          prompt: 'Un tirón es una fuerza que…',
          options: ['Acerca algo hacia ti', 'Solo funciona en la Luna', 'Significa cero movimiento'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q2',
          prompt: 'Un empujón más fuerte al mismo carrito suele…',
          options: ['Acelerarlo más', 'Pararlo siempre al instante', 'Quitar toda fricción'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q3',
          prompt: '¿Qué es un empuje?',
          options: ['Patear un balón lejos del pie', 'Arrastrar un carrito hacia ti', 'Quedarse quieto con dos manos'],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q4',
          prompt: 'En prueba justa intentamos…',
          options: [
            'Cambiar una variable a la vez',
            'Cambiar todo a la vez siempre',
            'Nunca anotar',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-kids-push-q5',
          prompt: 'Las fuerzas pueden…',
          options: [
            'Iniciar, detener o cambiar dirección',
            'Solo actuar en seres vivos',
            'Nunca medirse',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Patio: empuje en columpio vs en carrusel.',
    },
  },
  {
    id: 'sci-crew-human-body-systems',
    order: 3,
    ageBands: ['crew'],
    estMinutes: 18,
    caStandards: {
      framework: 'CA_NGSS',
      codes: ['4-LS1-1'],
      gradeSpan: '4',
      cdeSearchQuery: 'California NGSS 4-LS1-1 animal structures',
    },
    standardsNote: 'CA NGSS Gr.4; structures support survival, growth, behavior',
    cardEmoji: '🫀',
    en: {
      title: 'Body Systems Team Up',
      summary: 'See how digestive, respiratory, circulatory, and skeletal systems work together.',
      objectives: ['Name major systems and one job each', 'Explain why we need food, air, and water together'],
      teachSections: [
        {
          heading: 'Big idea',
          body: 'Organs are grouped into systems; systems interact. Your brain needs oxygen and sugar—respiratory and digestive systems supply them via blood.',
        },
        {
          heading: 'Digestive',
          body: 'Breaks food into nutrients your cells can use; waste leaves the body.',
        },
        {
          heading: 'Respiratory & circulatory',
          body: 'Lungs swap gases; heart and blood move oxygen and nutrients to cells and carry away wastes.',
        },
        {
          heading: 'Skeletal & muscular',
          body: 'Bones support and protect; muscles move bones so you can learn, play, and eat.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-body-q1',
          prompt: 'Which system mainly brings oxygen from air into blood?',
          options: ['Respiratory', 'Digestive only', 'Skeletal only'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q2',
          prompt: 'The digestive system helps the body…',
          options: [
            'Break down food into usable nutrients',
            'Pump blood only',
            'Produce sunlight',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q3',
          prompt: 'The heart is part of…',
          options: ['The circulatory system', 'The skeletal system only', 'The weather system'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q4',
          prompt: 'Bones work with muscles to…',
          options: ['Create movement and support the body', 'Digest sugar instantly', 'Make oxygen from food'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q5',
          prompt: 'Systems in the body…',
          options: [
            'Interact; one system affects others',
            'Never connect',
            'Only exist in plants',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'After recess: heart rate and breathing—feel circulatory + respiratory teamwork.',
    },
    es: {
      title: 'Los sistemas del cuerpo en equipo',
      summary: 'Cómo digestivo, respiratorio, circulatorio y esquelético colaboran.',
      objectives: ['Nombrar sistemas y una función', 'Explicar comida, aire y agua juntos'],
      teachSections: [
        {
          heading: 'Idea central',
          body: 'Los órganos forman sistemas que interactúan. El cerebro necesita oxígeno y glucosa — respiración y digestión aportan vía sangre.',
        },
        {
          heading: 'Digestivo',
          body: 'Descompone alimento en nutrientes; los desechos salen.',
        },
        {
          heading: 'Respiratorio y circulatorio',
          body: 'Pulmones intercambian gases; corazón y sangre mueven oxígeno y nutrientes.',
        },
        {
          heading: 'Esquelético y muscular',
          body: 'Huesos sostienen y protegen; músculos mueven huesos.',
        },
      ],
      quiz: [
        {
          id: 'sci-crew-body-q1',
          prompt: '¿Qué sistema lleva oxígeno del aire a la sangre sobre todo?',
          options: ['Respiratorio', 'Solo digestivo', 'Solo esquelético'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q2',
          prompt: 'El digestivo ayuda a…',
          options: [
            'Descomponer alimento en nutrientes útiles',
            'Solo bombear sangre',
            'Producir luz solar',
          ],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q3',
          prompt: 'El corazón es parte de…',
          options: ['El sistema circulatorio', 'Solo el esquelético', 'El clima'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q4',
          prompt: 'Huesos y músculos juntos…',
          options: ['Permiten movimiento y sostienen el cuerpo', 'Digerir azúcar al instante', 'Hacer oxígeno del alimento'],
          correctIndex: 0,
        },
        {
          id: 'sci-crew-body-q5',
          prompt: 'Los sistemas del cuerpo…',
          options: [
            'Interactúan; uno afecta a otros',
            'Nunca se conectan',
            'Solo existen en plantas',
          ],
          correctIndex: 0,
        },
      ],
      realWorldTip: 'Tras el recreo: pulso y respiración — equipo circulatorio + respiratorio.',
    },
  },
]
