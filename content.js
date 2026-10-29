// Única fuente documental: ENTREGABLE I_ Avance I, páginas físicas 1–21.
// No hay una clave documental que permita inferir emociones desde frecuencias.
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
export const frequencies = ['Nunca', 'A veces', 'Frecuentemente', 'Siempre'];
export const questions = [
  { id: 'l1', domain: 'laboral', page: 11, sourceItem: 7, text: 'Me siento emocionalmente agotado/a al finalizar mi jornada laboral.' },
  { id: 'l2', domain: 'laboral', page: 12, sourceItem: 8, text: 'Las exigencias laborales me generan estrés o preocupación.' },
  { id: 'l3', domain: 'laboral', page: 13, sourceItem: 10, text: 'Logro manejar mis emociones cuando enfrento situaciones difíciles en mi trabajo.' },
  { id: 'p1', domain: 'personal', page: 17, sourceItem: 17, text: 'Siento que tengo poco tiempo para descansar y realizar actividades que disfruto.' },
  { id: 'p2', domain: 'personal', page: 17, sourceItem: 18, text: 'Reconozco cuándo mis emociones afectan mi bienestar.' },
  { id: 'p3', domain: 'personal', page: 18, sourceItem: 20, text: 'Me doy tiempo para atender mis necesidades personales y emocionales.' },
  { id: 'a1', domain: 'academico', page: 8, sourceItem: 2, text: 'Me siento emocionalmente agotado/a al cumplir con las exigencias académicas.' },
  { id: 'a2', domain: 'academico', page: 9, sourceItem: 3, text: 'El estrés académico dificulta mi concentración durante las clases o actividades de estudio.' },
  { id: 'a3', domain: 'academico', page: 11, sourceItem: 6, text: 'Organizo mi tiempo de manera adecuada para cumplir con trabajos, evaluaciones y tareas académicas.' },
  { id: 'f1', domain: 'familiar', page: 14, sourceItem: 12, text: 'Las responsabilidades familiares dificultan que pueda dedicar tiempo a mis estudios.' },
  { id: 'f2', domain: 'familiar', page: 15, sourceItem: 13, text: 'Siento que las preocupaciones familiares afectan mi estado emocional.' },
  { id: 'f3', domain: 'familiar', page: 16, sourceItem: 16, text: 'Puedo expresar mis emociones y preocupaciones a algún integrante de mi familia.' }
];
// Síntesis de los focos de apoyo explicitados en la fuente. No son técnicas
// específicas para una emoción: no se inventan correspondencias ni tratamientos.
export const supports = [
  { domain: 'laboral', title: 'Equilibrio entre trabajo y estudio', text: 'El proyecto identifica el autocuidado y el equilibrio entre las exigencias laborales y los estudios como focos de apoyo psicopedagógico.', reflection: 'Revisa en el organizador el tiempo destinado al trabajo y a tus actividades académicas.', source: 'p. 20' },
  { domain: 'personal', title: 'Un lugar para tus necesidades', text: 'El proyecto destaca el descanso, la recreación, el autocuidado y el reconocimiento del impacto de las emociones en el bienestar.', reflection: 'Revisa si tu semana contempla tiempo de descanso y actividades que disfrutas.', source: 'pp. 17–19 y 21' },
  { domain: 'academico', title: 'Condiciones para aprender', text: 'El enfoque psicopedagógico busca favorecer la concentración, la motivación, la organización del tiempo y la disposición hacia las actividades académicas.', reflection: 'Revisa cómo distribuyes el tiempo para trabajos, evaluaciones y tareas académicas.', source: 'pp. 3, 11 y 20' },
  { domain: 'familiar', title: 'Apoyo y equilibrio familiar', text: 'El proyecto considera el apoyo familiar, la expresión de emociones y preocupaciones y el equilibrio entre responsabilidades familiares, académicas y laborales.', reflection: 'Reconoce con quién puedes expresar tus preocupaciones y revisa el tiempo dedicado a las responsabilidades familiares.', source: 'pp. 15–16 y 21' }
];

export function summarizeLabels(answers) {
  const counts = Object.fromEntries(emotions.map(e => [e.id, 0]));
  for (const answer of Object.values(answers)) {
    if (answer && Object.hasOwn(counts, answer.emotion)) counts[answer.emotion] += 1;
  }
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const maximum = Math.max(0, ...Object.values(counts));
  return { total, rows: emotions.map(e => ({ ...e, count: counts[e.id], percent: total ? counts[e.id] / total * 100 : 0 })), leaders: maximum ? emotions.filter(e => counts[e.id] === maximum) : [] };
}
