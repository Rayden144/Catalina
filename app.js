'use strict';

// Agrega o modifica emociones aquí. Los textos se insertan como texto, nunca como HTML.
const emotions = [
  { id: 'tristeza', name: 'Tristeza', symbol: '☂︎', color: '#e1e9f0', accent: '#5a7b99', teaser: 'Dale espacio a lo que sientes. No tienes que poder con todo.', title: 'Está bien sentir tristeza.', description: 'La tristeza puede aparecer ante una pérdida, un cambio o un día difícil. Reconocerla sin juzgarte es un primer paso.', steps: [
    ['Ponle palabras', 'Prueba completar: “Me siento triste porque…”. Si no sabes por qué, también está bien. Puedes dibujarlo o elegir una palabra que se acerque.'],
    ['Elige una tarea pequeña', 'Divide lo pendiente en un paso concreto: abrir el cuaderno, ordenar un objeto o beber agua. Date permiso para descansar después.'],
    ['Busca compañía', 'Acércate a alguien de confianza. Puedes decir: “Hoy me cuesta un poco, ¿puedes acompañarme?”. No necesitas resolverlo todo al hablar.']
  ] },
  { id: 'estres', name: 'Estrés', symbol: '〰︎', color: '#f1e7cf', accent: '#a1833e', teaser: 'Baja el ritmo. Un paso a la vez también es avanzar.', title: 'No necesitas hacerlo todo hoy.', description: 'Cuando las demandas se acumulan, puede costar concentrarse. Una pausa y un plan pequeño pueden ayudarte a recuperar claridad.', steps: [
    ['Saca lo pendiente de tu cabeza', 'Anota las tareas y elige solo una prioridad realista para ahora. Separa lo urgente de lo que puede esperar o compartirse.'],
    ['Divide y descansa', 'Haz una parte manejable durante 10 a 20 minutos y luego toma una pausa breve. Ajusta el tiempo a tu energía, sin exigirte un ritmo perfecto.'],
    ['Vuelve a tu cuerpo', 'Apoya los pies, afloja los hombros y respira sin forzar. Si la sobrecarga continúa, pide ayuda para ajustar las expectativas.']
  ] },
  { id: 'enojo', name: 'Enojo', symbol: '☄︎', color: '#efdad2', accent: '#ac6d54', teaser: 'Escucha lo que te dice tu enojo y encuentra cómo expresarlo.', title: 'Tu enojo merece ser escuchado.', description: 'El enojo puede señalar un límite o una necesidad. Puedes reconocerlo y elegir una forma de actuar que te cuide a ti y a los demás.', steps: [
    ['Haz una pausa segura', 'Si puedes, toma distancia de la discusión. Di: “Necesito unos minutos para calmarme y después conversamos”. Evita responder mensajes mientras estás muy activado.'],
    ['Identifica la necesidad', 'Pregúntate qué pasó, qué sentiste y qué necesitas: respeto, descanso, claridad o ayuda. Caminar suavemente puede darte espacio para pensarlo.'],
    ['Exprésalo con claridad', 'Prueba: “Cuando ocurre…, me siento…, y necesito…”. Habla de una situación concreta y escucha la respuesta cuando estés preparado.']
  ] },
  { id: 'felicidad', name: 'Felicidad', symbol: '☼︎', color: '#e5ead6', accent: '#778849', teaser: 'Disfruta este momento y descubre qué te hace bien.', title: 'Hazle un lugar a lo bueno.', description: 'Reconocer lo que disfrutas te ayuda a conocer tus intereses y los espacios en los que te sientes acompañado. No necesitas sentirte así todo el tiempo.', steps: [
    ['Detente a disfrutar', 'Observa qué está pasando y cómo lo sientes en el cuerpo. Dedica unos instantes a este momento, sin tener que convertirlo en algo productivo.'],
    ['Reconoce lo que contribuyó', '¿Fue una actividad, una persona o un logro? Anótalo para conocer mejor qué condiciones favorecen tu bienestar y tu aprendizaje.'],
    ['Comparte si te nace', 'Cuenta tu buena noticia, agradece un gesto o invita a alguien a una actividad que disfrutes. También puedes guardar este momento para ti.']
  ] },
  { id: 'angustia', name: 'Angustia', symbol: '☁︎', color: '#e7e2ee', accent: '#8c79a0', teaser: 'Vuelve al presente. No tienes que atravesarlo a solas.', title: 'Vamos de a poco, aquí y ahora.', description: 'La angustia puede sentirse intensa y dificultar pensar o aprender. Empieza por encontrar un lugar seguro y una presencia que te acompañe.', steps: [
    ['Oriéntate en el presente', 'Mira a tu alrededor y nombra tres cosas que ves, dos sonidos que escuchas y un punto de apoyo de tu cuerpo. Omite cualquier sensación que te incomode.'],
    ['Distingue el ahora del después', 'Pregúntate: “¿Qué necesito en los próximos cinco minutos?”. Elige algo sencillo: sentarte, beber agua o pedir compañía. No intentes resolver todo el futuro.'],
    ['Pide apoyo', 'Contacta a una persona de confianza. Si esto se repite, es muy intenso o afecta tu vida diaria, busca orientación de un profesional de salud mental.']
  ] }
];

const grid = document.querySelector('#emotion-grid');
for (const emotion of emotions) {
  const card = document.createElement('button');
  card.className = 'emotion-card';
  card.style.setProperty('--card', emotion.color);
  card.style.setProperty('--accent', emotion.accent);
  card.setAttribute('aria-haspopup', 'dialog');
  card.setAttribute('aria-label', `${emotion.name}: ver recomendaciones`);
  const symbol = document.createElement('span'); symbol.className = 'emotion-symbol'; symbol.textContent = emotion.symbol; symbol.setAttribute('aria-hidden', 'true');
  const arrow = document.createElement('span'); arrow.className = 'card-arrow'; arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true');
  const title = document.createElement('h3'); title.textContent = emotion.name;
  const teaser = document.createElement('p'); teaser.textContent = emotion.teaser;
  const action = document.createElement('span'); action.className = 'card-action'; action.textContent = 'Encuentra tu pequeño paso';
  card.append(symbol, arrow, title, teaser, action);
  card.addEventListener('click', () => openEmotion(emotion));
  grid.append(card);
}
const kindness = document.createElement('div');
kindness.className = 'kind-card';
kindness.innerHTML = '<span aria-hidden="true">♡</span><p>No hay emociones<br>correctas o incorrectas.</p><small>Lo que sientes importa.<br>Este es un espacio para escucharte.</small>';
grid.append(kindness);

function openEmotion(emotion) {
  document.querySelector('#dialog-symbol').textContent = emotion.symbol;
  document.querySelector('#dialog-symbol').style.color = emotion.accent;
  document.querySelector('#dialog-title').textContent = emotion.title;
  document.querySelector('#dialog-description').textContent = emotion.description;
  const container = document.querySelector('#recommendations');
  container.replaceChildren();
  emotion.steps.forEach(([heading, body], index) => {
    const item = document.createElement('section'); item.className = 'recommendation';
    const number = document.createElement('span'); number.className = 'step-number'; number.textContent = `0${index + 1}`; number.setAttribute('aria-hidden', 'true');
    const content = document.createElement('div');
    const h3 = document.createElement('h3'); h3.textContent = heading;
    const p = document.createElement('p'); p.textContent = body;
    content.append(h3, p); item.append(number, content); container.append(item);
  });
  document.querySelector('#reflection-input').value = '';
  const dialog = document.querySelector('#emotion-dialog');
  dialog.showModal(); dialog.scrollTop = 0;
}

for (const button of document.querySelectorAll('[data-close]')) {
  button.addEventListener('click', () => button.closest('dialog').close());
}
for (const dialog of document.querySelectorAll('dialog')) {
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
document.querySelector('#emotion-dialog').addEventListener('close', () => { document.querySelector('#reflection-input').value = ''; });

const breathingDialog = document.querySelector('#breathing-dialog');
const toggle = document.querySelector('#breathing-toggle');
const phase = document.querySelector('#breathing-phase');
const progress = document.querySelector('#breathing-progress');
const orbit = document.querySelector('#breathing-orbit');
let breathingTimer = null;
let running = false;
function stopBreathing() {
  clearTimeout(breathingTimer); breathingTimer = null; running = false;
  orbit.className = 'breathing-orbit';
  toggle.textContent = 'Comenzar';
}
function resetBreathing() {
  stopBreathing(); phase.textContent = 'Cuando quieras'; progress.textContent = 'Cuatro ciclos para hacer una pausa.';
}
document.querySelector('#breathe-button').addEventListener('click', () => { resetBreathing(); breathingDialog.showModal(); });
toggle.addEventListener('click', () => {
  if (running) { resetBreathing(); return; }
  running = true; toggle.textContent = 'Detener';
  let cycle = 1;
  function inhale() {
    phase.textContent = 'Inhala suave'; orbit.className = 'breathing-orbit inhale'; progress.textContent = `Ciclo ${cycle} de 4 · Sigue tu propio ritmo`;
    breathingTimer = setTimeout(exhale, 4000);
  }
  function exhale() {
    phase.textContent = 'Exhala despacio'; orbit.className = 'breathing-orbit exhale';
    breathingTimer = setTimeout(() => {
      if (cycle < 4) { cycle += 1; inhale(); }
      else { stopBreathing(); phase.textContent = 'Gracias por parar'; progress.textContent = 'La pausa terminó. ¿Cómo te sientes ahora?'; toggle.textContent = 'Repetir'; }
    }, 6000);
  }
  inhale();
});
breathingDialog.addEventListener('close', resetBreathing);
// No continuar un ejercicio con temporizadores pausados en un teléfono bloqueado.
document.addEventListener('visibilitychange', () => { if (document.hidden && running) resetBreathing(); });

const infoDialog = document.querySelector('#info-dialog');
function showInfo(title, paragraphs) {
  document.querySelector('#info-title').textContent = title;
  const content = document.querySelector('#info-content'); content.replaceChildren();
  for (const [text, highlight] of paragraphs) { const p = document.createElement('p'); p.textContent = text; if (highlight) p.className = 'support-box'; content.append(p); }
  infoDialog.showModal(); infoDialog.scrollTop = 0;
}
document.querySelector('#about-button').addEventListener('click', () => showInfo('Un espacio para escucharte.', [
  ['HelpyouRYC ofrece orientación educativa general inspirada en prácticas de reconocimiento emocional, autorregulación y organización del aprendizaje. Puedes elegir una emoción, explorar un paso pequeño o hacer una pausa.'],
  ['No es una evaluación psicopedagógica ni atención psicológica. Las sugerencias no están personalizadas y no sustituyen el acompañamiento profesional. Antes de usarla en una comunidad educativa, conviene revisar el contenido con su equipo de psicopedagogía y salud mental.'],
  ['Tu privacidad: esta versión no usa cuentas, cookies, analítica ni servicios externos. Lo que escribes en el espacio de reflexión no se guarda ni se envía y se borra al cerrar la tarjeta. Como en cualquier sitio, el servidor puede registrar visitas técnicas.'],
  ['Si eres menor de edad y algo te preocupa, busca a una persona adulta de confianza o al equipo de orientación de tu centro educativo.']
]));
document.querySelector('#help-button').addEventListener('click', () => showInfo('Pedir ayuda también es cuidarte.', [
  ['Habla con alguien de confianza o con el equipo de orientación de tu centro educativo. Si el malestar persiste, es intenso o interfiere con tus actividades, consulta a un profesional de salud mental.'],
  ['Si estás en peligro inmediato, crees que podrías hacerte daño o dañar a otra persona, contacta al servicio de emergencias de tu país o acude a urgencias. Busca compañía de una persona de confianza mientras recibes ayuda.', true],
  ['Si tienes dolor de pecho, dificultad importante para respirar u otros síntomas físicos nuevos o intensos, solicita atención médica; no asumas que se deben solo a una emoción.']
]));
