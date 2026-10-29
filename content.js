// Temas base: ENTREGABLE I_ Avance I, páginas físicas 1–21.
// Preguntas, alternativas y asociaciones reformuladas con autorización del usuario.
// Es una propuesta orientativa para revisión, no una escala validada ni diagnóstico.
// No convierte la frecuencia de los ítems originales en emociones.
export const domains = [
  { id: 'laboral', name: 'Laboral', short: 'El trabajo', color: '#eadbcf' },
  { id: 'personal', name: 'Personal', short: 'Tu espacio', color: '#e0e8d4' },
  { id: 'academico', name: 'Académico', short: 'El aprendizaje', color: '#e0e8ef' },
  { id: 'familiar', name: 'Familiar', short: 'Los vínculos', color: '#e8e0ed' }
];
// Las siete etiquetas y sus colores son requisitos de diseño del usuario,
// no categorías ni puntuaciones clínicas extraídas del documento.
export const emotions = [
  { id: 'tristeza', name: 'Tristeza', color: '#a4bed3', light: '#e1e9f0' },
  { id: 'estres', name: 'Estrés', color: '#ddbb70', light: '#f1e7cf' },
  { id: 'enojo', name: 'Enojo', color: '#cc927d', light: '#efdad2' },
  { id: 'alegria', name: 'Alegría', color: '#9cad72', light: '#e5ead6' },
  { id: 'angustia', name: 'Angustia', color: '#b2a0c7', light: '#e7e2ee' },
  { id: 'miedo', name: 'Miedo', color: '#98b9ae', light: '#dfebe5' },
  { id: 'preocupacion', name: 'Preocupación', color: '#d2a586', light: '#efdfd3' }
];
export const questions = [
  {
    id: 'l1', domain: 'laboral', page: 11, sourceItem: 7,
    text: 'Al pensar en cómo terminas tu jornada laboral, ¿qué experiencia se acerca más a la tuya ahora?',
    options: [
      { id: 'a', text: 'Siento que sigo corriendo entre tareas y me cuesta desconectarme de las exigencias del día.', emotion: 'estres' },
      { id: 'b', text: 'Termino sin ánimo y me cuesta encontrar interés en lo que haré después.', emotion: 'tristeza' },
      { id: 'c', text: 'Disfruto lo que logré y me dan ganas de compartir algo bueno de mi jornada.', emotion: 'alegria' },
      { id: 'd', text: 'Lo vivido en la jornada se me hace abrumador y no sé por dónde empezar a ordenar lo que siento.', emotion: 'angustia' }
    ]
  },
  {
    id: 'l2', domain: 'laboral', page: 12, sourceItem: 8,
    text: 'Al pensar en las exigencias de tu trabajo, ¿qué se parece más a tu experiencia actual?',
    options: [
      { id: 'a', text: 'Me dan ganas de alejarme de una tarea porque temo no poder enfrentar lo que ocurra.', emotion: 'miedo' },
      { id: 'b', text: 'Me molesta cómo se distribuyen las tareas y me cuesta responder sin irritarme.', emotion: 'enojo' },
      { id: 'c', text: 'Le doy vueltas a los pendientes y a todo lo que podría salir mal más adelante.', emotion: 'preocupacion' },
      { id: 'd', text: 'Siento presión por resolver varias cosas a la vez y me cuesta bajar el ritmo.', emotion: 'estres' }
    ]
  },
  {
    id: 'l3', domain: 'laboral', page: 13, sourceItem: 10,
    text: 'Al recordar una situación difícil en tu trabajo, ¿qué experiencia reconoces más en este momento?',
    options: [
      { id: 'a', text: 'Sigo pensando en sus consecuencias y anticipando problemas que todavía no han ocurrido.', emotion: 'preocupacion' },
      { id: 'b', text: 'Siento satisfacción al reconocer cómo la enfrenté y lo que pude aprender.', emotion: 'alegria' },
      { id: 'c', text: 'La situación me sobrepasa y me cuesta poner en orden lo que estoy sintiendo.', emotion: 'angustia' },
      { id: 'd', text: 'Sigo dándole vueltas a lo injusto de lo ocurrido y tengo ganas de reclamar.', emotion: 'enojo' }
    ]
  },
  {
    id: 'p1', domain: 'personal', page: 17, sourceItem: 17,
    text: 'Al mirar el tiempo que tienes para descansar y disfrutar, ¿qué se parece más a tu experiencia actual?',
    options: [
      { id: 'a', text: 'Me irrita que otras obligaciones ocupen el espacio que quería dedicarme.', emotion: 'enojo' },
      { id: 'b', text: 'Me entusiasma pensar en una actividad que disfruto y en el momento que tendré para hacerla.', emotion: 'alegria' },
      { id: 'c', text: 'Me desanima ver lo poco que he podido dedicar a las cosas que antes disfrutaba.', emotion: 'tristeza' },
      { id: 'd', text: 'Siento que debo aprovechar cada minuto y que ni al descansar logro dejar de correr.', emotion: 'estres' }
    ]
  },
  {
    id: 'p2', domain: 'personal', page: 17, sourceItem: 18,
    text: 'Al observar cómo tus experiencias afectan tu bienestar, ¿qué reconoces más en ti ahora?',
    options: [
      { id: 'a', text: 'Me siento a gusto con una experiencia reciente y disfruto recordarla.', emotion: 'alegria' },
      { id: 'b', text: 'Hay algo que percibo como una amenaza y me dan ganas de evitarlo.', emotion: 'miedo' },
      { id: 'c', text: 'Mi atención se queda en lo que podría pasar y en cómo prevenir cada posible problema.', emotion: 'preocupacion' },
      { id: 'd', text: 'Lo que siento ahora se me hace difícil de contener y me cuesta encontrar claridad.', emotion: 'angustia' }
    ]
  },
  {
    id: 'p3', domain: 'personal', page: 18, sourceItem: 20,
    text: 'Al pensar en atender tus necesidades personales, ¿qué experiencia se acerca más a la tuya ahora?',
    options: [
      { id: 'a', text: 'Me siento sobrepasado/a al intentar reconocer lo que necesito y no sé cómo expresarlo.', emotion: 'angustia' },
      { id: 'b', text: 'Me cuesta dar un paso para atenderme porque temo enfrentar algo que me resulta amenazante.', emotion: 'miedo' },
      { id: 'c', text: 'Las demandas se acumulan y siento presión por atenderlas antes de poder dedicarme tiempo.', emotion: 'estres' },
      { id: 'd', text: 'Me frustra que mis necesidades queden al final y reacciono con irritación cuando pasa.', emotion: 'enojo' }
    ]
  },
  {
    id: 'a1', domain: 'academico', page: 8, sourceItem: 2,
    text: 'Al pensar en las exigencias de tus estudios, ¿qué experiencia se parece más a la tuya en este momento?',
    options: [
      { id: 'a', text: 'Me siento desanimado/a y me cuesta encontrar interés para retomar lo que estoy estudiando.', emotion: 'tristeza' },
      { id: 'b', text: 'Siento satisfacción por lo que estoy aprendiendo y disfruto reconocer mis avances.', emotion: 'alegria' },
      { id: 'c', text: 'Las tareas me parecen demasiadas y siento que debo resolverlas todas al mismo tiempo.', emotion: 'estres' },
      { id: 'd', text: 'Lo que tengo por delante me abruma y me cuesta ordenar lo que estoy viviendo.', emotion: 'angustia' }
    ]
  },
  {
    id: 'a2', domain: 'academico', page: 9, sourceItem: 3,
    text: 'Al intentar concentrarte en clases o al estudiar, ¿qué experiencia reconoces más en ti ahora?',
    options: [
      { id: 'a', text: 'Siento tanta presión por avanzar que salto de una tarea a otra sin poder bajar el ritmo.', emotion: 'estres' },
      { id: 'b', text: 'Me irritan los obstáculos o las interrupciones y me dan ganas de protestar.', emotion: 'enojo' },
      { id: 'c', text: 'Me cuesta acercarme a una actividad porque la evaluación me parece amenazante.', emotion: 'miedo' },
      { id: 'd', text: 'Me distraigo imaginando resultados desfavorables y pensando cómo evitar cada uno.', emotion: 'preocupacion' }
    ]
  },
  {
    id: 'a3', domain: 'academico', page: 11, sourceItem: 6,
    text: 'Al mirar la organización de tus trabajos, evaluaciones y tareas, ¿qué experiencia se parece más a la tuya ahora?',
    options: [
      { id: 'a', text: 'Repaso una y otra vez los plazos y los problemas que podrían aparecer más adelante.', emotion: 'preocupacion' },
      { id: 'b', text: 'Me desanima ver lo pendiente y me cuesta recuperar el interés para organizarlo.', emotion: 'tristeza' },
      { id: 'c', text: 'Me cuesta comenzar a ordenar una entrega porque temo enfrentar su resultado.', emotion: 'miedo' },
      { id: 'd', text: 'Me da satisfacción ver mis avances y me entusiasma distribuir mis próximas actividades.', emotion: 'alegria' }
    ]
  },
  {
    id: 'f1', domain: 'familiar', page: 14, sourceItem: 12,
    text: 'Al combinar tus responsabilidades familiares con el estudio, ¿qué experiencia se acerca más a la tuya ahora?',
    options: [
      { id: 'a', text: 'Me desanima sentir que he dejado de lado actividades importantes para mí.', emotion: 'tristeza' },
      { id: 'b', text: 'Me quedo pensando en los compromisos futuros y en cómo podría fallar en alguno.', emotion: 'preocupacion' },
      { id: 'c', text: 'Me molesta cómo se reparten las responsabilidades y me cuesta evitar la irritación.', emotion: 'enojo' },
      { id: 'd', text: 'Siento que tengo que responder a varias demandas a la vez y que el tiempo no alcanza.', emotion: 'estres' }
    ]
  },
  {
    id: 'f2', domain: 'familiar', page: 15, sourceItem: 13,
    text: 'Al pensar en lo que ocurre en tu entorno familiar, ¿qué experiencia reconoces más en este momento?',
    options: [
      { id: 'a', text: 'Lo que ocurre me abruma ahora y me cuesta encontrar una forma de expresar lo que siento.', emotion: 'angustia' },
      { id: 'b', text: 'Un encuentro o una experiencia compartida me hace disfrutar y querer acercarme a mi familia.', emotion: 'alegria' },
      { id: 'c', text: 'Lo que ocurre me deja sin ánimo y siento menos interés en mis actividades habituales.', emotion: 'tristeza' },
      { id: 'd', text: 'Percibo una situación como amenazante y me dan ganas de evitar enfrentarla.', emotion: 'miedo' }
    ]
  },
  {
    id: 'f3', domain: 'familiar', page: 16, sourceItem: 16,
    text: 'Al pensar en expresar lo que te pasa a alguien de tu familia, ¿qué experiencia se parece más a la tuya ahora?',
    options: [
      { id: 'a', text: 'Me irrita pensar que no me escuchan y siento ganas de reclamar antes de conversar.', emotion: 'enojo' },
      { id: 'b', text: 'Le doy vueltas a cómo responderán y a los problemas que podrían surgir después.', emotion: 'preocupacion' },
      { id: 'c', text: 'Temo la reacción de esa persona y prefiero evitar la conversación.', emotion: 'miedo' },
      { id: 'd', text: 'Lo que necesito contar me sobrepasa y me cuesta ordenar mis sentimientos para expresarlos.', emotion: 'angustia' }
    ]
  }
];
// Síntesis de los focos de apoyo explicitados en la fuente.
// Se conservan como apoyos generales comunes a las siete emociones.
export const supports = [
  { domain: 'laboral', title: 'Equilibrio entre trabajo y estudio', text: 'El proyecto identifica el autocuidado y el equilibrio entre las exigencias laborales y los estudios como focos de apoyo psicopedagógico.', reflection: 'Revisa en el organizador el tiempo destinado al trabajo y a tus actividades académicas.', source: 'p. 20' },
  { domain: 'personal', title: 'Un lugar para tus necesidades', text: 'El proyecto destaca el descanso, la recreación, el autocuidado y el reconocimiento del impacto de las emociones en el bienestar.', reflection: 'Revisa si tu semana contempla tiempo de descanso y actividades que disfrutas.', source: 'pp. 17–19 y 21' },
  { domain: 'academico', title: 'Condiciones para aprender', text: 'El enfoque psicopedagógico busca favorecer la concentración, la motivación, la organización del tiempo y la disposición hacia las actividades académicas.', reflection: 'Revisa cómo distribuyes el tiempo para trabajos, evaluaciones y tareas académicas.', source: 'pp. 3, 11 y 20' },
  { domain: 'familiar', title: 'Apoyo y equilibrio familiar', text: 'El proyecto considera el apoyo familiar, la expresión de emociones y preocupaciones y el equilibrio entre responsabilidades familiares, académicas y laborales.', reflection: 'Reconoce con quién puedes expresar tus preocupaciones y revisa el tiempo dedicado a las responsabilidades familiares.', source: 'pp. 15–16 y 21' }
];

// Cada opción válida aporta un punto a su asociación interna. No es una
// probabilidad clínica ni una medida de intensidad. Omitir no añade puntos.
// La exposición es de 6 o 7 opciones por emoción, no una calibración psicométrica.
export function summarizeAnswers(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) answers = {};
  const counts = Object.fromEntries(emotions.map(e => [e.id, 0]));
  let answered = 0;
  let skipped = 0;
  for (const question of questions) {
    if (!answers || !Object.hasOwn(answers, question.id)) continue;
    const choice = answers[question.id];
    if (choice === 'skip') {
      answered += 1;
      skipped += 1;
      continue;
    }
    const option = question.options.find(item => item.id === choice);
    if (!option) continue;
    answered += 1;
    counts[option.emotion] += 1;
  }
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const maximum = Math.max(0, ...Object.values(counts));
  return {
    total, answered, skipped,
    rows: emotions.map(e => ({ ...e, count: counts[e.id], percent: total ? counts[e.id] / total * 100 : 0 })),
    leaders: maximum ? emotions.filter(e => counts[e.id] === maximum) : []
  };
}
