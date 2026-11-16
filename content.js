// Temas base: ENTREGABLE I_ Avance I, páginas físicas 1–21.
// Preguntas, alternativas y asociaciones reformuladas con autorización del usuario.
// Es una propuesta orientativa para revisión, no una escala validada ni diagnóstico.
// No convierte la frecuencia de los ítems originales en emociones.
export const domains = [
  { id: 'laboral', name: 'Laboral', short: 'El trabajo', color: '#f8e9b8' },
  { id: 'personal', name: 'Personal', short: 'Tu espacio', color: '#f5dbe6' },
  { id: 'academico', name: 'Académico', short: 'El aprendizaje', color: '#d9edf8' },
  { id: 'familiar', name: 'Familiar', short: 'Los vínculos', color: '#f3e1eb' }
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
    text: "Al terminar tu jornada laboral, ¿cómo te sientes en este momento?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mucho lo que logré y termino con ánimo para mis otras actividades.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con mi jornada y con lo que pude hacer.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Termino mi jornada como un día habitual, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Termino con presión por los pendientes y me cuesta desconectarme.", emotion: 'estres' },
      { id: 'e', level: "Muy difícil", text: "La jornada me sobrepasa y me cuesta ordenar lo que siento.", emotion: 'angustia' }
    ]
  },
  {
    id: 'l2', domain: 'laboral', page: 12, sourceItem: 8,
    text: "¿Cómo estás viviendo las tareas y responsabilidades de tu trabajo?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mis tareas y me da mucha satisfacción cómo estoy respondiendo a ellas.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento conforme con la forma en que voy resolviendo mis tareas.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Realizo mis tareas como parte de mi rutina, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me inquietan los pendientes y pienso con frecuencia en lo que podría salir mal.", emotion: 'preocupacion' },
      { id: 'e', level: "Muy difícil", text: "La presión de las tareas es tanta que me cuesta detenerme incluso al terminar.", emotion: 'estres' }
    ]
  },
  {
    id: 'l3', domain: 'laboral', page: 13, sourceItem: 10,
    text: "¿Cómo te sientes con la forma en que enfrentas las situaciones de tu trabajo?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me da mucha satisfacción cómo las enfrento y disfruto reconocer lo que aprendo.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con la forma en que voy resolviendo las situaciones del trabajo.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Las vivo como parte de mi día a día, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me molesta lo que ocurre y me cuesta dejar de pensar en lo injusto que me parece.", emotion: 'enojo' },
      { id: 'e', level: "Muy difícil", text: "Lo que ocurre me sobrepasa y me cuesta ordenar lo que siento.", emotion: 'angustia' }
    ]
  },
  {
    id: 'p1', domain: 'personal', page: 17, sourceItem: 17,
    text: "¿Cómo estás viviendo tus momentos de descanso y las actividades que disfrutas?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mucho mis momentos de descanso y las actividades que me gustan.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con los momentos que puedo dedicar a descansar o hacer algo para mí.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Tengo algunos momentos libres y los vivo como parte de mi rutina.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me desanima tener poco tiempo para las actividades que disfruto.", emotion: 'tristeza' },
      { id: 'e', level: "Muy difícil", text: "La presión de las obligaciones es tanta que ni al descansar logro desconectarme.", emotion: 'estres' }
    ]
  },
  {
    id: 'p2', domain: 'personal', page: 17, sourceItem: 18,
    text: "Al pensar en tus experiencias recientes, ¿cómo te sientes contigo en este momento?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me siento muy a gusto con lo que he vivido y disfruto recordarlo.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento conforme con cómo me he sentido en estos días.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Mis días han sido habituales; no hay una sensación que destaque ahora.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me inquieta lo que podría ocurrir y me cuesta dejar de anticipar problemas.", emotion: 'preocupacion' },
      { id: 'e', level: "Muy difícil", text: "Lo que siento me sobrepasa y me cuesta encontrar claridad en mis actividades cotidianas.", emotion: 'angustia' }
    ]
  },
  {
    id: 'p3', domain: 'personal', page: 18, sourceItem: 20,
    text: "¿Cómo te sientes con el espacio que das a tus necesidades personales?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me da mucha satisfacción dedicarme tiempo y atender lo que necesito.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con los momentos que puedo dedicar a mis necesidades.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Atiendo mis necesidades como parte de mi rutina, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me frustra dejar mis necesidades para después y a veces reacciono con irritación.", emotion: 'enojo' },
      { id: 'e', level: "Muy difícil", text: "Intentar atender mis necesidades me sobrepasa y me cuesta incluso expresar lo que necesito.", emotion: 'angustia' }
    ]
  },
  {
    id: 'a1', domain: 'academico', page: 8, sourceItem: 2,
    text: "¿Cómo estás viviendo tus actividades de estudio y aprendizaje?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mucho lo que aprendo y me entusiasma reconocer mis avances.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con lo que voy aprendiendo y con mis avances.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Estudiar es parte de mi rutina; ahora no me genera una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me desanima estudiar y me cuesta recuperar el interés.", emotion: 'tristeza' },
      { id: 'e', level: "Muy difícil", text: "Las actividades de estudio me abruman y me cuesta ordenar lo que tengo que hacer.", emotion: 'angustia' }
    ]
  },
  {
    id: 'a2', domain: 'academico', page: 9, sourceItem: 3,
    text: "¿Cómo te sientes al seguir las clases o concentrarte cuando estudias?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mucho seguir las clases o estudiar y me da satisfacción poder concentrarme.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto con la forma en que sigo las clases o me concentro al estudiar.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Mi concentración es la habitual; no me genera una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me inquietan los posibles resultados y esos pensamientos me distraen al estudiar.", emotion: 'preocupacion' },
      { id: 'e', level: "Muy difícil", text: "El temor a enfrentar una evaluación es tan fuerte que evito acercarme a la actividad.", emotion: 'miedo' }
    ]
  },
  {
    id: 'a3', domain: 'academico', page: 11, sourceItem: 6,
    text: "¿Cómo te sientes con la organización de tus trabajos, evaluaciones y tareas?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me da mucha satisfacción ver mis avances y me entusiasma organizar mis próximas actividades.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento conforme con la forma en que voy organizando mis tareas y entregas.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Organizo mis tareas como parte de mi rutina, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me desanima ver lo pendiente y me cuesta empezar a organizarlo.", emotion: 'tristeza' },
      { id: 'e', level: "Muy difícil", text: "El temor al resultado de mis entregas me lleva a evitar incluso comenzar a ordenarlas.", emotion: 'miedo' }
    ]
  },
  {
    id: 'f1', domain: 'familiar', page: 14, sourceItem: 12,
    text: "¿Cómo estás viviendo la combinación de tus responsabilidades familiares y tus estudios?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me da mucha satisfacción cómo combino mis responsabilidades y disfruto el espacio para ambas.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento conforme con la forma en que voy combinando mi vida familiar y mis estudios.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Combinar ambas responsabilidades es parte de mi rutina, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me molesta cómo se reparten las responsabilidades y a veces reacciono con irritación.", emotion: 'enojo' },
      { id: 'e', level: "Muy difícil", text: "La presión de responder a la familia y al estudio es tanta que me cuesta detenerme o descansar.", emotion: 'estres' }
    ]
  },
  {
    id: 'f2', domain: 'familiar', page: 15, sourceItem: 13,
    text: "¿Cómo te sientes al compartir momentos con tu familia?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Disfruto mucho los momentos compartidos y me entusiasma acercarme a mi familia.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto en los momentos que comparto con mi familia.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Los momentos en familia son parte de mi rutina, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Lo que ocurre en mi familia me desanima y me cuesta interesarme en mis actividades.", emotion: 'tristeza' },
      { id: 'e', level: "Muy difícil", text: "Una situación familiar me resulta tan amenazante que evito enfrentarla.", emotion: 'miedo' }
    ]
  },
  {
    id: 'f3', domain: 'familiar', page: 16, sourceItem: 16,
    text: "¿Cómo te sientes al compartir lo que te pasa con alguien de tu familia?",
    options: [
      { id: 'a', level: "Muy positiva", text: "Me da mucha satisfacción poder expresarme y disfrutar de esa cercanía.", emotion: 'alegria' },
      { id: 'b', level: "Positiva", text: "Me siento a gusto al conversar sobre lo que me pasa con alguien de mi familia.", emotion: 'alegria' },
      { id: 'c', level: "Neutra", text: "Conversar sobre lo que me pasa es algo cotidiano, sin una sensación que destaque.", emotion: null },
      { id: 'd', level: "Difícil", text: "Me inquieta cómo responderán y me cuesta dejar de anticipar problemas antes de conversar.", emotion: 'preocupacion' },
      { id: 'e', level: "Muy difícil", text: "Lo que necesito contar me sobrepasa y me cuesta ordenar mis sentimientos para expresarlo.", emotion: 'angustia' }
    ]
  }
];
// Cada opción no neutra aporta un punto a su asociación interna. No es una
// probabilidad clínica ni una medida de intensidad. Omitir no añade puntos.
// Las respuestas neutras se registran aparte, sin atribuirles una emoción.
export function summarizeAnswers(answers) {
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) answers = {};
  const counts = Object.fromEntries(emotions.map(e => [e.id, 0]));
  let answered = 0;
  let skipped = 0;
  let neutral = 0;
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
    if (option.emotion === null) neutral += 1;
    else counts[option.emotion] += 1;
  }
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const maximum = Math.max(0, ...Object.values(counts));
  return {
    total, answered, skipped, neutral,
    rows: emotions.map(e => ({ ...e, count: counts[e.id], percent: total ? counts[e.id] / total * 100 : 0 })),
    leaders: maximum ? emotions.filter(e => counts[e.id] === maximum) : []
  };
}
