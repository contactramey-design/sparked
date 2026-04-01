/**
 * Teaching notes after each quiz attempt (by question id). Used when `quiz[].feedback` is not set inline.
 */
export function getSchoolSubjectQuizFeedback(questionId: string, locale: 'en' | 'es'): string | undefined {
  const row = SCHOOL_SUBJECT_QUIZ_FEEDBACK[questionId]
  if (!row) return undefined
  return locale === 'es' ? row.es : row.en
}

const SCHOOL_SUBJECT_QUIZ_FEEDBACK: Record<string, { en: string; es: string }> = {
  "math-tots-count-1-5-q1": {
    "en": "Stable order means each object gets exactly one count word—no skipping or double-tagging. That is how the last number tells the true total.",
    "es": "El orden estable da un nombre de número a cada objeto, sin saltar ni repetir. Así el último número dice el total real."
  },
  "math-tots-count-1-5-q2": {
    "en": "If you counted three bears and did not skip, you end on “three,” and that last word names the amount.",
    "es": "Si contaste tres osos sin saltar, terminas en “tres” y esa palabra nombra la cantidad."
  },
  "math-tots-count-1-5-q3": {
    "en": "Cardinality: the final count word tells how many are in the whole set, not just the last object you touched.",
    "es": "Cardinalidad: la última palabra dice cuántos hay en el conjunto, no solo el último objeto."
  },
  "math-tots-count-1-5-q4": {
    "en": "You said five count words aligned to five objects, so the set has five items.",
    "es": "Dijiste cinco números alineados con cinco objetos, así que hay cinco."
  },
  "math-tots-count-1-5-q5": {
    "en": "One-to-one means touch once, say the next number once—keeps the count honest.",
    "es": "Uno a uno: un toque, un número — mantiene honesto el conteo."
  },
  "math-tots-patterns-q1": {
    "en": "A repeating core (like red-blue) is the smallest chunk that copies over and over.",
    "es": "El núcleo que se repite (rojo-azul) es el trozo mínimo que se copia una y otra vez."
  },
  "math-tots-patterns-q2": {
    "en": "“What comes next?” tests whether you see the full cycle, not only the last bead.",
    "es": "“¿Qué sigue?” prueba si ves el ciclo completo, no solo la última pieza."
  },
  "math-tots-patterns-q3": {
    "en": "Extending means continuing the same rule so the rhythm stays unchanged.",
    "es": "Extender es seguir la misma regla para que el ritmo no cambie."
  },
  "math-tots-patterns-q4": {
    "en": "Clapping a steady beat is a sound pattern with a repeating unit.",
    "es": "Aplaudir un pulso fijo es un patrón sonoro con unidad repetida."
  },
  "math-tots-patterns-q5": {
    "en": "Patterns let us predict; prediction is the math habit we are training.",
    "es": "Los patrones permiten predecir; es el hábito matemático que entrenamos."
  },
  "math-kids-add-q1": {
    "en": "5 + 2: start at five and count two more steps—six, seven—or combine groups and count all to get 7.",
    "es": "5 + 2: desde cinco cuenta dos más — seis, siete — o junta grupos y cuenta todo: 7."
  },
  "math-kids-add-q2": {
    "en": "3 + 4 means three stickers joined with four more stickers—parts put together into one whole amount.",
    "es": "3 + 4 son tres calcomanías unidas a cuatro más: partes juntadas en un todo."
  },
  "math-kids-add-q3": {
    "en": "Addition combines quantities; subtraction removes. The lesson focused on putting groups together.",
    "es": "Sumar combina cantidades; restar quita. La lección fue juntar grupos."
  },
  "math-kids-add-q4": {
    "en": "“Gives 2 more” signals joining: start with 6, add 2 → 6 + 2.",
    "es": "“Da 2 más” señala juntar: empiezas en 6 y sumas 2 → 6 + 2."
  },
  "math-kids-add-q5": {
    "en": "Counting on starts from the larger part and adds the smaller part in steps—efficient and matches the story.",
    "es": "Contar desde empieza en la parte mayor y suma la menor paso a paso — eficiente y cuadra con el cuento."
  },
  "math-kids-shapes-q1": {
    "en": "Three straight sides that close a region define a triangle in early geometry.",
    "es": "Tres lados rectos que cierran una región definen un triángulo."
  },
  "math-kids-shapes-q2": {
    "en": "A square is a quadrilateral with four equal sides and square corners.",
    "es": "Un cuadrado tiene cuatro lados iguales y esquinas cuadradas."
  },
  "math-kids-shapes-q3": {
    "en": "Rectangles (including squares) have four vertices—four corners where sides meet.",
    "es": "Rectángulos (y cuadrados) tienen cuatro vértices — esquinas donde se juntan lados."
  },
  "math-kids-shapes-q4": {
    "en": "A circle is a closed curve with no straight segments.",
    "es": "Un círculo es una curva cerrada sin segmentos rectos."
  },
  "math-kids-shapes-q5": {
    "en": "Size and orientation can change, but three straight sides still make a triangle.",
    "es": "Tamaño y giro cambian, pero tres lados rectos siguen siendo triángulo."
  },
  "math-crew-mult-q1": {
    "en": "Equal groups: multiplication tracks how many groups and how many in each.",
    "es": "Grupos iguales: la multiplicación lleva cuántos grupos y cuántos en cada uno."
  },
  "math-crew-mult-q2": {
    "en": "Arrays show rows and columns; the same total can be seen two ways (commutative thinking).",
    "es": "Las matrices muestran filas y columnas; el mismo total se ve de dos maneras."
  },
  "math-crew-mult-q3": {
    "en": "3 × 4 can mean 3 groups of 4 or 4 groups of 3; the product is 12 either way in pure number.",
    "es": "3 × 4 puede ser 3 grupos de 4 o 4 de 3; el producto es 12 en número puro."
  },
  "math-crew-mult-q4": {
    "en": "Word problems anchor factors to story roles—boxes, teams, rows—not just naked digits.",
    "es": "Los problemas anclan los factores al cuento — cajas, equipos, filas."
  },
  "math-crew-mult-q5": {
    "en": "Skip counting by one factor builds toward the product when models are not drawn.",
    "es": "Contar saltando por un factor acerca al producto sin dibujo."
  },
  "math-crew-frac-q1": {
    "en": "A fraction names one quantity: part relative to a defined whole.",
    "es": "Una fracción nombra una cantidad: parte respecto a un entero definido."
  },
  "math-crew-frac-q2": {
    "en": "Denominator tells how many equal parts; numerator how many of those parts.",
    "es": "El denominador dice en cuántas partes iguales; el numerador cuántas tomas."
  },
  "math-crew-frac-q3": {
    "en": "Same numerator and larger denominator means smaller pieces—each slice is tinier.",
    "es": "Mismo numerador y denominador mayor → pedazos más pequeños."
  },
  "math-crew-frac-q4": {
    "en": "Fair share means equal parts of the same whole; otherwise comparisons mislead.",
    "es": "Partes justas del mismo entero; si no, las comparaciones engañan."
  },
  "math-crew-frac-q5": {
    "en": "Half of a whole is one of two equal parts; language and picture should match.",
    "es": "La mitad es una de dos partes iguales; lenguaje y dibujo deben coincidir."
  },
  "eng-tots-rhyme-q1": {
    "en": "Rhyming words share ending sounds (rime), not always the same first letter.",
    "es": "Las palabras que riman comparten sonidos finales, no siempre la primera letra."
  },
  "eng-tots-rhyme-q2": {
    "en": "Listen to the tail of the word—cat / hat match on -at.",
    "es": "Escucha el final — gato / gato (cat/hat) comparten la rima en -at."
  },
  "eng-tots-rhyme-q3": {
    "en": "Nonsense words still count if the ending sound pattern matches the lesson goal.",
    "es": "Palabras inventadas cuentan si el patrón final coincide con la meta."
  },
  "eng-tots-rhyme-q4": {
    "en": "Rhyme is about sounds; spelling can differ (blue / shoe).",
    "es": "La rima es sonido; la ortografía puede variar."
  },
  "eng-tots-rhyme-q5": {
    "en": "Hearing a pattern prepares reading and spelling later.",
    "es": "Oír el patrón prepara leer y escribir después."
  },
  "eng-tots-sound-q1": {
    "en": "Initial sound is the first phoneme you hear, not the letter name alone.",
    "es": "El sonido inicial es el primer fonema, no solo el nombre de la letra."
  },
  "eng-tots-sound-q2": {
    "en": "Stretch the word slowly to hear the first puff of sound.",
    "es": "Estira la palabra despacio para oír el primer sonido."
  },
  "eng-tots-sound-q3": {
    "en": "Same sound can start different words (sun, snake).",
    "es": "El mismo sonido puede iniciar palabras distintas."
  },
  "eng-tots-sound-q4": {
    "en": "Pictures support linking sound to meaning while isolating the phoneme.",
    "es": "Las imágenes enlazan sonido y significado al aislar el fonema."
  },
  "eng-tots-sound-q5": {
    "en": "Mouth shapes differ by sound—good multisensory cue.",
    "es": "La boca cambia con cada sonido — pista multisensorial."
  },
  "eng-kids-main-q1": {
    "en": "Main idea is the author’s central point; details support it.",
    "es": "La idea principal es el punto central; los detalles la apoyan."
  },
  "eng-kids-main-q2": {
    "en": "A title hints at topic; the main idea still needs evidence from sentences.",
    "es": "El título sugiere tema; la idea principal necesita evidencia en el texto."
  },
  "eng-kids-main-q3": {
    "en": "Ask what single sentence would still matter if you removed the rest—that’s close to main idea.",
    "es": "¿Qué oración seguiría importando si quitas el resto? Se acerca a la idea principal."
  },
  "eng-kids-main-q4": {
    "en": "Details are interesting but should not replace the overarching point.",
    "es": "Los detalles interesan pero no reemplazan el punto general."
  },
  "eng-kids-main-q5": {
    "en": "Summaries lean on main idea; lists of facts without a point are weak summaries.",
    "es": "Los resúmenes se apoyan en la idea principal; solo hechos sueltos son débiles."
  },
  "eng-kids-sent-q1": {
    "en": "The subject tells who or what the sentence is about.",
    "es": "El sujeto dice de quién o de qué habla la oración."
  },
  "eng-kids-sent-q2": {
    "en": "The predicate tells what the subject does or is.",
    "es": "El predicado dice qué hace o qué es el sujeto."
  },
  "eng-kids-sent-q3": {
    "en": "A sentence needs both a subject and a predicate to stand alone.",
    "es": "Hace falta sujeto y predicado para una oración completa."
  },
  "eng-kids-sent-q4": {
    "en": "Fragments miss a key piece; run-ons glue too many without proper joins.",
    "es": "Los fragmentos faltan pieza; los encadenados pegan de más sin enlaces correctos."
  },
  "eng-kids-sent-q5": {
    "en": "Question order still has a subject and predicate, just different intonation or helpers.",
    "es": "Las preguntas también tienen sujeto y predicado, con otro orden o auxiliares."
  },
  "eng-crew-ev-q1": {
    "en": "Evidence must come from the text, not only opinion.",
    "es": "La evidencia sale del texto, no solo de opinión."
  },
  "eng-crew-ev-q2": {
    "en": "Quote or paraphrase, then explain the link to your claim.",
    "es": "Cita o parafrasea y explica el vínculo con tu afirmación."
  },
  "eng-crew-ev-q3": {
    "en": "Strong answers name where in the text they looked.",
    "es": "Las buenas respuestas dicen dónde miraron en el texto."
  },
  "eng-crew-ev-q4": {
    "en": "Irrelevant details may be true but do not prove the specific claim.",
    "es": "Detalles irrelevantes pueden ser ciertos pero no prueban la afirmación."
  },
  "eng-crew-ev-q5": {
    "en": "Multiple pieces of evidence beat one vague sentence.",
    "es": "Varias piezas de evidencia vencen a una frase vaga."
  },
  "eng-crew-cc-q1": {
    "en": "Context clues narrow meaning using nearby words and punctuation.",
    "es": "Las pistas del contexto acotan el sentido con palabras y puntuación cercanas."
  },
  "eng-crew-cc-q2": {
    "en": "A definition clue may follow a comma or “means.”",
    "es": "Una definición puede ir tras coma o “significa”."
  },
  "eng-crew-cc-q3": {
    "en": "Contrast words (but, unlike) signal antonym clues.",
    "es": "Palabras de contraste señalan antónimos."
  },
  "eng-crew-cc-q4": {
    "en": "Examples after “such as” help infer category or meaning.",
    "es": "Ejemplos tras “como” ayudan a inferir categoría o significado."
  },
  "eng-crew-cc-q5": {
    "en": "If clues fail, reread or use word parts—context is one tool, not magic.",
    "es": "Si fallan las pistas, relee o usa partes de palabra — el contexto es una herramienta."
  },
  "sci-tots-sens-q1": {
    "en": "Eyes detect light and color; they are not for tasting.",
    "es": "Los ojos detectan luz y color; no sirven para saborear."
  },
  "sci-tots-sens-q2": {
    "en": "Ears pick up vibrations we hear as sound.",
    "es": "Los oídos captan vibraciones que oímos como sonido."
  },
  "sci-tots-sens-q3": {
    "en": "Skin carries touch sensors for texture, temperature, pressure.",
    "es": "La piel tiene tacto: textura, temperatura, presión."
  },
  "sci-tots-sens-q4": {
    "en": "Tongue and nose often work together for flavor perception.",
    "es": "Lengua y nariz suelen trabajar juntas en el sabor."
  },
  "sci-tots-sens-q5": {
    "en": "Senses gather data about the world; science starts with observation.",
    "es": "Los sentidos recogen datos; la ciencia empieza observando."
  },
  "sci-tots-liv-q1": {
    "en": "Living things grow and respond using energy; a rock does not eat or grow like life does.",
    "es": "Lo vivo crece y responde con energía; una roca no come ni crece como la vida."
  },
  "sci-tots-liv-q2": {
    "en": "Plants are living—they grow, respond, reproduce.",
    "es": "Las plantas están vivas: crecen, responden, se reproducen."
  },
  "sci-tots-liv-q3": {
    "en": "A puppy shows life processes; a stuffed toy does not maintain life.",
    "es": "Un cachorro muestra procesos vitales; un peluche no mantiene vida."
  },
  "sci-tots-liv-q4": {
    "en": "Clouds move but are not alive in the biological sense used here.",
    "es": "Las nubes se mueven pero no están vivas en el sentido biológico de la lección."
  },
  "sci-tots-liv-q5": {
    "en": "Water is essential to life but is not itself a living organism.",
    "es": "El agua es esencial pero no es un organismo vivo."
  },
  "sci-kids-mat-q1": {
    "en": "Liquids take the shape of their container but keep volume (until evaporation etc.).",
    "es": "Los líquidos toman la forma del recipiente pero conservan volumen."
  },
  "sci-kids-mat-q2": {
    "en": "Solids keep both shape and volume under everyday conditions.",
    "es": "Los sólidos mantienen forma y volumen en condiciones normales."
  },
  "sci-kids-mat-q3": {
    "en": "Gases spread to fill space; particles move freely.",
    "es": "Los gases se expanden; las partículas se mueven con libertad."
  },
  "sci-kids-mat-q4": {
    "en": "Melting is solid → liquid with heat; different from dissolving sugar.",
    "es": "Fundir es sólido → líquido con calor; distinto de disolver azúcar."
  },
  "sci-kids-mat-q5": {
    "en": "Freezing is liquid → solid when energy is removed.",
    "es": "Congelar es líquido → sólido al quitar energía."
  },
  "sci-kids-pla-q1": {
    "en": "Light powers photosynthesis so plants can build food.",
    "es": "La luz impulsa la fotosíntesis para fabricar alimento."
  },
  "sci-kids-pla-q2": {
    "en": "Roots anchor and absorb water and minerals from soil.",
    "es": "Las raíces sujetan y absorben agua y minerales."
  },
  "sci-kids-pla-q3": {
    "en": "Leaves are major sites for catching light and exchanging gases.",
    "es": "Las hojas captan luz e intercambian gases."
  },
  "sci-kids-pla-q4": {
    "en": "Air supplies carbon dioxide for photosynthesis.",
    "es": "El aire aporta dióxido de carbono para la fotosíntesis."
  },
  "sci-kids-pla-q5": {
    "en": "Space keeps plants from overcrowding—resources compete.",
    "es": "El espacio evita amontonar — los recursos compiten."
  },
  "sci-crew-web-q1": {
    "en": "Plants and algae are producers capturing sunlight.",
    "es": "Plantas y algas son productores que captan luz."
  },
  "sci-crew-web-q2": {
    "en": "Consumers eat other organisms; birds in the chain eat prior links.",
    "es": "Los consumidores comen otros seres; el pájaro come eslabones previos."
  },
  "sci-crew-web-q3": {
    "en": "Most land energy enters from the Sun through producers.",
    "es": "En tierra la energía entra del Sol vía productores."
  },
  "sci-crew-web-q4": {
    "en": "Herbivores eat mainly plants.",
    "es": "Los herbívoros comen principalmente plantas."
  },
  "sci-crew-web-q5": {
    "en": "Webs show many links because diets overlap.",
    "es": "Las redes muestran muchos vínculos porque las dietas se cruzan."
  },
  "sci-crew-sun-q1": {
    "en": "Surface plants use sunlight in photosynthesis.",
    "es": "Las plantas de superficie usan luz en fotosíntesis."
  },
  "sci-crew-sun-q2": {
    "en": "Photovoltaics convert light to electricity.",
    "es": "Lo fotovoltaico convierte luz en electricidad."
  },
  "sci-crew-sun-q3": {
    "en": "Sun-driven temperature differences help create wind patterns.",
    "es": "Diferencias de temperatura por el Sol ayudan a crear vientos."
  },
  "sci-crew-sun-q4": {
    "en": "Ancient sunlight stored in organisms became part of fossil fuels.",
    "es": "Luz antigua en organismos pasó a combustibles fósiles."
  },
  "sci-crew-sun-q5": {
    "en": "Energy choices affect environment and cost—community literacy matters.",
    "es": "Las decisiones energéticas afectan ambiente y costo — importa la literacia comunitaria."
  },
  "hist-tots-then-q1": {
    "en": "“Long ago” places events in the past, not the immediate future.",
    "es": "“Hace mucho” sitúa en el pasado, no en el futuro inmediato."
  },
  "hist-tots-then-q2": {
    "en": "Photos are primary glimpses of how places and people looked.",
    "es": "Las fotos muestran cómo se veían lugares y personas."
  },
  "hist-tots-then-q3": {
    "en": "“Today” refers to the present period we live in.",
    "es": "“Hoy” es el presente en que vivimos."
  },
  "hist-tots-then-q4": {
    "en": "We describe change without ranking cultures as better/worse.",
    "es": "Describimos cambios sin jerarquizar culturas."
  },
  "hist-tots-then-q5": {
    "en": "Oral history from family is valid evidence for young learners.",
    "es": "La historia oral familiar es evidencia válida."
  },
  "hist-tots-fam-q1": {
    "en": "Family stories carry memories across generations.",
    "es": "Las historias familiares llevan memoria entre generaciones."
  },
  "hist-tots-fam-q2": {
    "en": "History includes ordinary lives, not only famous names.",
    "es": "La historia incluye vidas comunes, no solo famosos."
  },
  "hist-tots-fam-q3": {
    "en": "Listening respectfully preserves trust and detail.",
    "es": "Escuchar con respeto guarda confianza y detalle."
  },
  "hist-tots-fam-q4": {
    "en": "Families differ in structure but all can hold stories.",
    "es": "Las familias varían en forma pero pueden tener historias."
  },
  "hist-tots-fam-q5": {
    "en": "Drawing or telling a memory is a historical act at this age.",
    "es": "Dibujar o contar un recuerdo es acto histórico a esta edad."
  },
  "hist-kids-help-q1": {
    "en": "Librarians help find and evaluate information resources.",
    "es": "Los bibliotecarios ayudan a hallar y evaluar información."
  },
  "hist-kids-help-q2": {
    "en": "Helpers sustain shared life—safety, health, learning, services.",
    "es": "Los ayudantes sostienen vida común: salud, aprendizaje, servicios."
  },
  "hist-kids-help-q3": {
    "en": "Firefighters respond to fires and many emergencies.",
    "es": "Bomberos atienden incendios y muchas emergencias."
  },
  "hist-kids-help-q4": {
    "en": "Teachers facilitate student learning as their core role.",
    "es": "Los maestros facilitan el aprendizaje como rol central."
  },
  "hist-kids-help-q5": {
    "en": "Sanitation workers protect public health through waste and cleaning services.",
    "es": "Limpieza y basura protegen salud pública."
  },
  "hist-kids-map-q1": {
    "en": "Legends decode symbols on maps.",
    "es": "Las leyendas decodifican símbolos."
  },
  "hist-kids-map-q2": {
    "en": "Maps are plan views from above.",
    "es": "Los mapas son vistas desde arriba."
  },
  "hist-kids-map-q3": {
    "en": "Symbols mean what the legend says for this map.",
    "es": "Los símbolos valen lo que diga esta leyenda."
  },
  "hist-kids-map-q4": {
    "en": "Landmarks are noticeable reference points.",
    "es": "Los hitos son puntos de referencia visibles."
  },
  "hist-kids-map-q5": {
    "en": "Maps help plan routes and spatial decisions.",
    "es": "Los mapas ayudan a planear rutas y decisiones espaciales."
  },
  "hist-crew-time-q1": {
    "en": "Earlier times read left on many timelines.",
    "es": "Lo más antiguo suele ir a la izquierda en muchas líneas."
  },
  "hist-crew-time-q2": {
    "en": "Later in time is known; causation needs more evidence.",
    "es": "Saber “después” no prueba causa sola."
  },
  "hist-crew-time-q3": {
    "en": "Spacing encodes duration between events.",
    "es": "El espacio entre fechas marca duración."
  },
  "hist-crew-time-q4": {
    "en": "BCE/CE is a shared numbering convention around a reference point.",
    "es": "a.C./d.C. es convención numérica común."
  },
  "hist-crew-time-q5": {
    "en": "Good labels pair event + date/period for clarity.",
    "es": "Buenas etiquetas juntan evento y fecha."
  },
  "hist-crew-src-q1": {
    "en": "A photo from the event time is typically primary.",
    "es": "Una foto de la época suele ser primaria."
  },
  "hist-crew-src-q2": {
    "en": "Modern textbooks summarizing antiquity are secondary.",
    "es": "Libros actuales que resumen antigüedad son secundarios."
  },
  "hist-crew-src-q3": {
    "en": "Same-day diary entries are close to the moment.",
    "es": "Diarios del día están cerca del momento."
  },
  "hist-crew-src-q4": {
    "en": "Multiple sources reduce one-sided error.",
    "es": "Varias fuentes reducen error unilateral."
  },
  "hist-crew-src-q5": {
    "en": "Museum labels interpret objects—secondary text about primary things.",
    "es": "Las etiquetas interpretan — texto secundario sobre objetos primarios."
  }
}
