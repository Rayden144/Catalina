import { domains, emotions, frequencies, questions, supports, summarizeLabels } from './content.js';
import { mountOrganizer } from './organizer.js';

const main = document.querySelector('main');
const answers = {};
let questionIndex = 0;
let selectedEmotion = '';
const formatPercent = n => `${n.toLocaleString('es-CL', { maximumFractionDigits: 1 })} %`;
const byId = id => emotions.find(e => e.id === id);
const domainOf = id => domains.find(d => d.id === id);
const answeredCount = () => questions.filter(q => Number.isInteger(answers[q.id]?.frequency)).length;

function focusHeading() {
  const heading = main.querySelector('#question-text') || main.querySelector('h1, h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function navigate(hash) { if (location.hash === hash) renderRoute(); else location.hash = hash; }
function topline(label) { return `<div class="page-topline"><a class="back-link" href="#inicio">← Volver al inicio</a><span class="eyebrow">${label}</span></div>`; }
function home() {
  main.innerHTML = `<section class="intro"><div class="eyebrow"><span class="status-dot"></span> TU TIEMPO. TUS EMOCIONES. TU APRENDIZAJE.</div><h1>Entre tantas cosas,<br><em>un espacio para ti.</em></h1><p>Estudiar, trabajar y atender tu vida personal y familiar puede ser un desafío. Reconoce cómo estás y encuentra un lugar para organizar tu semana.</p><div class="intro-flower" aria-hidden="true">${[0, 45, 90, 135].map(n => `<span style="--turn:${n}deg"></span>`).join('')}</div></section>
  <section class="home-actions" aria-label="Elige cómo comenzar"><article class="feature-card"><span class="eyebrow">01 · RECONOCER</span><h2>¿Cómo estás hoy?</h2><p>Recorre 12 preguntas sobre cuatro ámbitos de tu vida. Reconoce tus emociones y explora los focos de apoyo del proyecto.</p><button class="button" id="start-button">Iniciar <span aria-hidden="true">→</span></button></article><article class="feature-card"><span class="eyebrow">02 · ORGANIZAR</span><h2>Dale espacio a tu semana.</h2><p>Ordena tus actividades de lunes a domingo, agrega horarios y descarga tu organizador en PDF.</p><a href="#organizador" class="button secondary">Organizador <span aria-hidden="true">→</span></a></article></section>
  <div class="domain-strip" aria-label="Cuatro ámbitos">${domains.map(d => `<div><span class="domain-dot" style="--domain-color:${d.color}"></span>${d.name}</div>`).join('')}</div>
  <aside class="notice">Un recurso de apoyo psicopedagógico para estudiantes que compatibilizan estudio y trabajo. El recorrido ayuda a reconocer necesidades, no determina una emoción ni entrega un diagnóstico clínico.</aside>
  ${answeredCount() ? `<p class="quiet">Tu recorrido sigue en esta pestaña: ${answeredCount()} de 12 preguntas respondidas. <button class="text-button" id="resume-button">Continuar mi recorrido →</button></p>` : ''}`;
  document.querySelector('#start-button').addEventListener('click', () => { questionIndex = 0; navigate('#preguntas'); });
  document.querySelector('#resume-button')?.addEventListener('click', () => navigate('#preguntas'));
}
function renderQuestion() {
  const q = questions[questionIndex];
  const d = domainOf(q.domain);
  const saved = answers[q.id] || {};
  main.innerHTML = `<div class="quiz-layout">${topline('TU RECORRIDO')}<div class="page-heading"><span class="eyebrow">RECONOCER PARA ORGANIZAR</span><h1>Un momento para escucharte.</h1><p>Elige con qué frecuencia te ocurre cada situación. Después, si la reconoces, señala la emoción que tú asocias a esa experiencia.</p></div>
  <div class="quiz-progress"><div class="progress-label"><span>Pregunta ${questionIndex + 1} de 12</span><span>${answeredCount()} respondidas</span></div><div class="progress-track" role="progressbar" aria-label="Preguntas respondidas" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${answeredCount()}"><div class="progress-fill" style="width:${answeredCount() / 12 * 100}%"></div></div></div>
  <div class="domain-tabs" aria-label="Ámbitos del recorrido">${domains.map(domain => `<span class="domain-tab ${domain.id === q.domain ? 'current' : ''}" ${domain.id === q.domain ? 'aria-current="step"' : ''}>${domain.name}</span>`).join('')}</div>
  <form id="question-form" novalidate><section class="question-card"><span class="question-number">${d.name.toUpperCase()} · ${questionIndex % 3 + 1} DE 3</span><h2 id="question-text">${q.text}</h2>
  <fieldset class="answer-fieldset" aria-describedby="question-text"><legend>¿Con qué frecuencia te ocurre? <span class="quiet">(obligatorio)</span></legend><div class="frequency-options">${frequencies.map((f, index) => `<label class="choice"><input type="radio" name="frequency" value="${index}" required ${saved.frequency === index ? 'checked' : ''}><span>${f}</span></label>`).join('')}</div></fieldset>
  <fieldset class="answer-fieldset emotion-fieldset" aria-describedby="emotion-help"><legend>¿Qué emoción asocias tú a esta experiencia?</legend><p class="quiet" id="emotion-help">Esta etiqueta la eliges tú, no se deduce de tu respuesta anterior. Puedes omitirla si no la identificas.</p><div class="emotion-choices">${emotions.map(e => `<label class="choice" style="--emotion-light:${e.light}"><input type="radio" name="emotion" value="${e.id}" ${saved.emotion === e.id ? 'checked' : ''}><span>${e.name}</span></label>`).join('')}<label class="choice"><input type="radio" name="emotion" value="" ${!saved.emotion ? 'checked' : ''}><span>No la identifico / prefiero omitir</span></label></div></fieldset>
  <p class="question-source">Ítem ${q.sourceItem} del proyecto · página ${q.page}. La etiqueta emocional es una adaptación de esta web.</p></section><p id="question-error" class="error" role="alert"></p><div class="quiz-navigation"><button type="button" id="previous-button" class="button secondary" ${questionIndex === 0 ? 'disabled' : ''}>← Anterior</button><button type="submit" class="button">${questionIndex === 11 ? 'Ver mis resultados' : 'Siguiente'} →</button></div><p class="quiz-hint">Puedes volver y cambiar tus respuestas. No se guardan al cerrar o recargar la página.</p></form></div>`;
  const form = document.querySelector('#question-form');
  function save() {
    const data = new FormData(form);
    if (data.has('frequency')) answers[q.id] = { frequency: Number(data.get('frequency')), emotion: data.get('emotion') || '' };
  }
  form.addEventListener('change', () => {
    save();
    const count = answeredCount();
    main.querySelector('[role=progressbar]').setAttribute('aria-valuenow', count);
    main.querySelector('.progress-fill').style.width = `${count / 12 * 100}%`;
    main.querySelector('.progress-label span:last-child').textContent = `${count} respondidas`;
    document.querySelector('#question-error').textContent = '';
  });
  document.querySelector('#previous-button').addEventListener('click', () => { save(); questionIndex -= 1; renderQuestion(); focusHeading(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); save();
    if (!form.querySelector('[name=frequency]:checked')) {
      document.querySelector('#question-error').textContent = 'Selecciona una alternativa de frecuencia para continuar.';
      form.querySelector('[name=frequency]').focus(); return;
    }
    if (questionIndex < 11) { questionIndex += 1; renderQuestion(); focusHeading(); }
    else if (answeredCount() < 12) { questionIndex = questions.findIndex(q => !Number.isInteger(answers[q.id]?.frequency)); renderQuestion(); focusHeading(); }
    else navigate('#resultados');
  });
}
function renderSupports(id, shouldFocus = false) {
  const emotion = byId(id);
  const panel = document.querySelector('#support-panel');
  panel.innerHTML = `<div class="support-header"><span class="support-marker" style="background:${emotion.color}" aria-hidden="true"></span><h2 tabindex="-1">${emotion.name}: una mirada a tus cuatro ámbitos</h2></div><p>Has seleccionado ${emotion.name.toLowerCase()}. Estos son los focos generales de apoyo psicopedagógico del documento. Son comunes a las siete emociones: el proyecto disponible no define estrategias particulares para cada una.</p><div class="support-grid">${supports.map(s => { const domain = domainOf(s.domain); return `<article class="support-card"><span class="eyebrow"><span class="domain-dot" style="--domain-color:${domain.color}"></span>${domain.name.toUpperCase()}</span><h3>${s.title}</h3><p>${s.text}</p><p class="reflection-prompt">${s.reflection}</p><small>Para revisar tu semana · adaptación al organizador.<br>Base documental: ${s.source}.</small></article>`; }).join('')}</div><a class="button secondary" href="#organizador">Llevarlo a mi organizador →</a>`;
  document.querySelectorAll('.legend-button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.emotion === id)));
  if (shouldFocus) { panel.querySelector('h2').focus({ preventScroll: true }); panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }
}
function results() {
  if (answeredCount() !== 12) { main.innerHTML = `${topline('TU RECORRIDO')}<div class="page-heading"><h1>Aún hay preguntas por recorrer.</h1><p>Responde las 12 preguntas para ver el resumen de tus etiquetas.</p><a class="button" href="#preguntas">Continuar</a></div>`; return; }
  const summary = summarizeLabels(answers);
  const circumference = 2 * Math.PI * 70;
  let offset = 0;
  const segments = summary.rows.filter(e => e.count > 0).map(e => {
    const length = e.count / summary.total * circumference;
    const segment = `<circle class="chart-segment" cx="100" cy="100" r="70" stroke="${e.color}" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" data-emotion="${e.id}" role="button" tabindex="0" aria-label="${e.name}: ${formatPercent(e.percent)}, ver apoyo en los cuatro ámbitos"><title>${e.name}: ${formatPercent(e.percent)}</title></circle>`;
    offset += length; return segment;
  }).join('');
  const title = summary.leaders.length === 1 ? `La etiqueta que más elegiste: ${summary.leaders[0].name.toLowerCase()}.` : summary.leaders.length > 1 ? `Hay un empate entre tus etiquetas más elegidas.` : 'No elegiste etiquetas emocionales.';
  main.innerHTML = `${topline('TU RESUMEN')}<div class="page-heading"><span class="eyebrow">RECONOCER, SIN JUZGAR</span><h1>Así nombraste tus experiencias.</h1><p>Este gráfico representa las etiquetas que elegiste al responder. No indica la intensidad de una emoción ni la probabilidad de sentirla.</p></div><div class="results-layout"><section class="chart-panel" aria-label="Distribución de las etiquetas elegidas"><div class="chart-wrap"><svg class="emotion-chart" viewBox="0 0 200 200" role="group" aria-label="Gráfico circular interactivo de emociones"><circle cx="100" cy="100" r="70" fill="none" stroke="#e1e6da" stroke-width="26"/>${segments}</svg><div class="chart-center"><strong>${summary.total}</strong><span>etiquetas elegidas</span></div></div><p class="chart-caption">Porcentaje = veces que elegiste la etiqueta ÷ ${summary.total || 'total de etiquetas'} × 100.<br>${12 - summary.total} preguntas sin etiqueta, excluidas del cálculo. Los porcentajes se redondean a un decimal.</p></section><section class="results-summary"><h2>${title}</h2><p>${summary.leaders.length > 1 ? summary.leaders.map(e => e.name).join(' · ') + '. ' : ''}Selecciona una emoción en el gráfico o en la lista para revisar los cuatro ámbitos. También puedes explorar una que no hayas elegido.</p><div class="emotion-legend">${summary.rows.map(e => `<button class="legend-button" data-emotion="${e.id}" style="--emotion-light:${e.light}" aria-pressed="false" aria-controls="support-panel"><span class="domain-dot" style="--domain-color:${e.color}"></span><span>${e.name}</span><span class="legend-count">${e.count} de ${summary.total}</span><strong>${formatPercent(e.percent)}</strong></button>`).join('')}</div></section></div><div class="notice">Las frecuencias de los ítems no se convierten en emociones ni se suman como una escala clínica. El resultado es un autorregistro de tus elecciones, no una evaluación diagnóstica de burnout.</div><section id="support-panel" class="support-panel" aria-label="Focos de apoyo en los cuatro ámbitos"></section><details class="answer-details"><summary>Revisar mis 12 respuestas y sus fuentes</summary><ol class="answer-list">${questions.map((q, index) => `<li><strong>${index + 1}. ${domainOf(q.domain).name}</strong><p>${q.text}</p><p>${frequencies[answers[q.id].frequency]} · ${byId(answers[q.id].emotion)?.name || 'Sin etiqueta emocional'}</p><small>Ítem ${q.sourceItem} · p. ${q.page}</small></li>`).join('')}</ol></details><div class="result-actions"><button class="button secondary" id="review-button">Revisar respuestas</button><button class="button secondary" id="restart-button">Volver a responder</button><a class="button" href="#inicio">Volver al inicio</a></div>`;
  const choose = (id, focus) => { selectedEmotion = id; renderSupports(id, focus); };
  main.querySelectorAll('[data-emotion]').forEach(el => {
    el.addEventListener('click', () => choose(el.dataset.emotion, true));
    if (el.tagName.toLowerCase() === 'circle') el.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(el.dataset.emotion, true); } });
  });
  const initialEmotion = byId(selectedEmotion)?.id || summary.leaders[0]?.id;
  if (initialEmotion) renderSupports(initialEmotion);
  else document.querySelector('#support-panel').innerHTML = '<h2>Explora los cuatro ámbitos.</h2><p>No has elegido una etiqueta emocional. Puedes seleccionar cualquiera de la lista para consultar los focos generales de apoyo del proyecto.</p>';
  document.querySelector('#review-button').addEventListener('click', () => { questionIndex = 0; navigate('#preguntas'); });
  document.querySelector('#restart-button').addEventListener('click', () => {
    if (!window.confirm('¿Quieres borrar las 12 respuestas de este recorrido y comenzar de nuevo? Tu organizador no se borrará.')) return;
    for (const key of Object.keys(answers)) delete answers[key];
    questionIndex = 0; selectedEmotion = ''; navigate('#preguntas');
  });
}
function renderRoute() {
  const route = location.hash || '#inicio';
  if (route === '#preguntas') renderQuestion();
  else if (route === '#resultados') results();
  else if (route === '#organizador') {
    main.innerHTML = `${topline('TU SEMANA')}<div class="page-heading"><span class="eyebrow">ORGANIZAR PARA APRENDER</span><h1>Una semana con espacio para ti.</h1><p>Distribuye tus actividades entre los cuatro ámbitos. Agrega los horarios que necesites de lunes a domingo y descarga tu semana como PDF.</p></div><section id="organizer-container" aria-label="Organizador semanal"></section>`;
    mountOrganizer(document.querySelector('#organizer-container'));
  } else home();
  document.querySelectorAll('nav a').forEach(a => { if (a.hash === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  focusHeading();
}
const info = document.querySelector('#info-dialog');
document.querySelector('#about-button').addEventListener('click', () => info.showModal());
info.querySelector('.close-button').addEventListener('click', () => info.close());
info.addEventListener('click', event => {
  if (event.target !== info) return;
  const r = info.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) info.close();
});
window.addEventListener('hashchange', renderRoute);
renderRoute();
