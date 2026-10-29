import { domains, emotions, questions, supports, summarizeAnswers } from './content.js?v=20261029-auto1';
import { mountOrganizer } from './organizer.js';

const main = document.querySelector('main');
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView({ behavior: 'instant', block: 'start' });
});
const answers = {};
let questionIndex = 0;
let selectedEmotion = '';
const formatPercent = n => `${n.toLocaleString('es-CL', { maximumFractionDigits: 1 })} %`;
const byId = id => emotions.find(e => e.id === id);
const domainOf = id => domains.find(d => d.id === id);
const answeredCount = () => summarizeAnswers(answers).answered;

function focusHeading() {
  const heading = main.querySelector('#question-text') || main.querySelector('h1, h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function navigate(hash) { if (location.hash === hash) renderRoute(); else location.hash = hash; }
function topline(label) { return `<div class="page-topline"><a class="back-link" href="#inicio">← Volver al inicio</a><span class="eyebrow">${label}</span></div>`; }
function home() {
  main.innerHTML = `<section class="intro"><div class="eyebrow"><span class="status-dot"></span> TU TIEMPO. TUS EMOCIONES. TU APRENDIZAJE.</div><h1>Entre tantas cosas,<br><em>un espacio para ti.</em></h1><p>Estudiar, trabajar y atender tu vida personal y familiar puede ser un desafío. Reconoce cómo estás y encuentra un lugar para organizar tu semana.</p><div class="intro-flower" aria-hidden="true">${[0, 45, 90, 135].map(n => `<span style="--turn:${n}deg"></span>`).join('')}</div></section>
  <section class="home-actions" aria-label="Elige cómo comenzar"><article class="feature-card"><span class="eyebrow">01 · RECONOCER</span><h2>¿Cómo estás hoy?</h2><p>Responde 12 preguntas sobre cuatro ámbitos de tu vida y conoce con qué emociones se relacionan tus respuestas.</p><button class="button" id="start-button">Iniciar <span aria-hidden="true">→</span></button></article><article class="feature-card"><span class="eyebrow">02 · ORGANIZAR</span><h2>Dale espacio a tu semana.</h2><p>Ordena tus actividades de lunes a domingo, agrega horarios y descarga tu organizador en PDF.</p><a href="#organizador" class="button secondary">Organizador <span aria-hidden="true">→</span></a></article></section>
  <div class="domain-strip" aria-label="Cuatro ámbitos">${domains.map(d => `<div><span class="domain-dot" style="--domain-color:${d.color}"></span>${d.name}</div>`).join('')}</div>
  <aside class="notice">Un recurso de apoyo psicopedagógico para estudiantes que compatibilizan estudio y trabajo. El resumen de emociones es orientativo y no constituye un diagnóstico clínico.</aside>
  ${answeredCount() ? `<p class="quiet">Tu recorrido sigue en esta pestaña: ${answeredCount()} de 12 preguntas respondidas. <button class="text-button" id="resume-button">Continuar mi recorrido →</button></p>` : ''}`;
  document.querySelector('#start-button').addEventListener('click', () => { questionIndex = 0; navigate('#preguntas'); });
  document.querySelector('#resume-button')?.addEventListener('click', () => navigate('#preguntas'));
}
function renderQuestion() {
  const q = questions[questionIndex];
  const d = domainOf(q.domain);
  const saved = answers[q.id];
  main.innerHTML = `<div class="quiz-layout">${topline('TU RECORRIDO')}<div class="page-heading"><span class="eyebrow">RECONOCER PARA ORGANIZAR</span><h1>Un momento para escucharte.</h1><p>Piensa en cómo vives cada situación en este momento y elige la alternativa que más se acerca a tu experiencia. No hay respuestas correctas o incorrectas.</p></div>
  <div class="quiz-progress"><div class="progress-label"><span>Pregunta ${questionIndex + 1} de 12</span><span>${answeredCount()} respondidas</span></div><div class="progress-track" role="progressbar" aria-label="Preguntas respondidas" aria-valuemin="0" aria-valuemax="12" aria-valuenow="${answeredCount()}"><div class="progress-fill" style="width:${answeredCount() / 12 * 100}%"></div></div></div>
  <div class="domain-tabs" aria-label="Ámbitos del recorrido">${domains.map(domain => `<span class="domain-tab ${domain.id === q.domain ? 'current' : ''}" ${domain.id === q.domain ? 'aria-current="step"' : ''}>${domain.name}</span>`).join('')}</div>
  <form id="question-form" novalidate><section class="question-card"><span class="question-number">${d.name.toUpperCase()} · ${questionIndex % 3 + 1} DE 3</span><h2 id="question-text">${q.text}</h2>
  <fieldset class="answer-fieldset" aria-describedby="question-text"><legend>¿Cuál se acerca más a lo que te ocurre?</legend><div class="response-options">${q.options.map(option => `<label class="choice"><input type="radio" name="response" value="${option.id}" ${saved === option.id ? 'checked' : ''}><span>${option.text}</span></label>`).join('')}</div></fieldset>
  <div class="skip-question"><button type="button" id="skip-question" class="text-button" aria-pressed="${saved === 'skip'}">Esta situación no se ajusta a mí</button><p id="skip-status" class="quiet" role="status">${saved === 'skip' ? 'Esta pregunta se omitirá del cálculo. Puedes elegir una alternativa si cambias de opinión.' : ''}</p></div>
  </section><p id="question-error" class="error" role="alert"></p><div class="quiz-navigation"><button type="button" id="previous-button" class="button secondary" ${questionIndex === 0 ? 'disabled' : ''}>← Anterior</button><button type="submit" class="button">${questionIndex === 11 ? 'Ver mis resultados' : 'Siguiente'} →</button></div><p class="quiz-hint">Puedes volver y cambiar tus respuestas. No se guardan al cerrar o recargar la página.</p></form></div>`;
  const form = document.querySelector('#question-form');
  function save() {
    const response = new FormData(form).get('response');
    if (q.options.some(option => option.id === response)) answers[q.id] = response;
  }
  function updateProgress() {
    const count = answeredCount();
    main.querySelector('[role=progressbar]').setAttribute('aria-valuenow', count);
    main.querySelector('.progress-fill').style.width = `${count / 12 * 100}%`;
    main.querySelector('.progress-label span:last-child').textContent = `${count} respondidas`;
    document.querySelector('#question-error').textContent = '';
  }
  form.addEventListener('change', () => {
    save(); updateProgress();
    document.querySelector('#skip-question').setAttribute('aria-pressed', 'false');
    document.querySelector('#skip-status').textContent = '';
  });
  document.querySelector('#skip-question').addEventListener('click', () => {
    answers[q.id] = 'skip';
    form.querySelectorAll('[name=response]').forEach(input => { input.checked = false; });
    document.querySelector('#skip-question').setAttribute('aria-pressed', 'true');
    document.querySelector('#skip-status').textContent = 'Esta pregunta se omitirá del cálculo. Puedes elegir una alternativa si cambias de opinión.';
    updateProgress();
  });
  document.querySelector('#previous-button').addEventListener('click', () => { save(); questionIndex -= 1; renderQuestion(); focusHeading(); });
  form.addEventListener('submit', event => {
    event.preventDefault(); save();
    if (answers[q.id] !== 'skip' && !q.options.some(option => option.id === answers[q.id])) {
      document.querySelector('#question-error').textContent = 'Selecciona una alternativa o indica que esta situación no se ajusta a ti.';
      form.querySelector('[name=response]').focus(); return;
    }
    if (questionIndex < 11) { questionIndex += 1; renderQuestion(); focusHeading(); }
    else if (answeredCount() < 12) { questionIndex = questions.findIndex(q => answers[q.id] !== 'skip' && !q.options.some(option => option.id === answers[q.id])); renderQuestion(); focusHeading(); }
    else { selectedEmotion = ''; navigate('#resultados'); }
  });
}
function renderSupports(id, shouldFocus = false) {
  const emotion = byId(id);
  const panel = document.querySelector('#support-panel');
  panel.innerHTML = `<div class="support-header"><span class="support-marker" style="background:${emotion.color}" aria-hidden="true"></span><h2 tabindex="-1">${emotion.name}: una mirada a tus cuatro ámbitos</h2></div><p>Revisa cómo se conectan el trabajo, tu vida personal, el aprendizaje y la familia. Estos focos de apoyo psicopedagógico son generales y puedes consultarlos para cualquiera de las emociones.</p><div class="support-grid">${supports.map(s => { const domain = domainOf(s.domain); return `<article class="support-card"><span class="eyebrow"><span class="domain-dot" style="--domain-color:${domain.color}"></span>${domain.name.toUpperCase()}</span><h3>${s.title}</h3><p>${s.text}</p><p class="reflection-prompt">${s.reflection}</p></article>`; }).join('')}</div><a class="button secondary" href="#organizador">Llevarlo a mi organizador →</a>`;
  document.querySelectorAll('.legend-button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.emotion === id)));
  if (shouldFocus) { panel.querySelector('h2').focus({ preventScroll: true }); panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }
}
function results() {
  if (answeredCount() !== 12) { main.innerHTML = `${topline('TU RECORRIDO')}<div class="page-heading"><h1>Aún hay preguntas por recorrer.</h1><p>Completa las 12 preguntas para ver tu resumen.</p><a class="button" href="#preguntas">Continuar</a></div>`; return; }
  const summary = summarizeAnswers(answers);
  const circumference = 2 * Math.PI * 70;
  let offset = 0;
  const segments = summary.rows.filter(e => e.count > 0).map(e => {
    const length = e.count / summary.total * circumference;
    const segment = `<circle class="chart-segment" cx="100" cy="100" r="70" stroke="${e.color}" stroke-dasharray="${length} ${circumference - length}" stroke-dashoffset="${-offset}" data-emotion="${e.id}" role="button" tabindex="0" aria-label="${e.name}: ${formatPercent(e.percent)}, ver apoyo en los cuatro ámbitos"><title>${e.name}: ${formatPercent(e.percent)}</title></circle>`;
    offset += length; return segment;
  }).join('');
  const title = summary.leaders.length === 1 ? `Tus respuestas se relacionan más con ${summary.leaders[0].name.toLowerCase()}.` : summary.leaders.length > 1 ? 'Varias emociones tienen la misma presencia en tus respuestas.' : 'No hay respuestas para calcular un resultado.';
  main.innerHTML = `${topline('TU RESUMEN')}<div class="page-heading"><span class="eyebrow">RECONOCER, SIN JUZGAR</span><h1>Un vistazo a cómo estás.</h1><p>A partir de las alternativas que seleccionaste, este resumen muestra con qué emociones se relacionan tus respuestas.</p></div><div class="results-layout"><section class="chart-panel" aria-label="Distribución orientativa de emociones"><div class="chart-wrap"><svg class="emotion-chart" viewBox="0 0 200 200" role="group" aria-label="Gráfico circular interactivo de emociones"><circle cx="100" cy="100" r="70" fill="none" stroke="#e1e6da" stroke-width="26"/>${segments}</svg><div class="chart-center"><strong>${summary.total}</strong><span>respuestas consideradas</span></div></div><p class="chart-caption">${summary.total ? `Cada porcentaje corresponde a la proporción de respuestas asociadas a esa emoción.` : 'No se calculan porcentajes cuando todas las preguntas se omiten.'}<br>${summary.skipped} preguntas omitidas, excluidas del cálculo. Porcentajes redondeados a un decimal.</p></section><section class="results-summary"><h2>${title}</h2><p>${summary.leaders.length > 1 ? summary.leaders.map(e => e.name).join(' · ') + '. ' : ''}Selecciona una emoción en el gráfico o en la lista para consultar los cuatro ámbitos.</p><div class="emotion-legend">${summary.rows.map(e => `<button class="legend-button" data-emotion="${e.id}" style="--emotion-light:${e.light}" aria-pressed="false" aria-controls="support-panel"><span class="domain-dot" style="--domain-color:${e.color}"></span><span>${e.name}</span><span class="legend-count">${e.count} de ${summary.total}</span><strong>${formatPercent(e.percent)}</strong></button>`).join('')}</div></section></div><div class="notice">Resultado orientativo basado en correspondencias entre alternativas y emociones. No mide su intensidad ni constituye una evaluación clínica o un diagnóstico de burnout.</div><section id="support-panel" class="support-panel" aria-label="Focos de apoyo en los cuatro ámbitos"></section><details class="answer-details"><summary>Revisar mis 12 respuestas</summary><ol class="answer-list">${questions.map((q, index) => `<li><strong>${index + 1}. ${domainOf(q.domain).name}</strong><p>${q.text}</p><p>${q.options.find(option => option.id === answers[q.id])?.text || 'Situación omitida'}</p></li>`).join('')}</ol></details><div class="result-actions"><button class="button secondary" id="review-button">Revisar respuestas</button><button class="button secondary" id="restart-button">Volver a responder</button><a class="button" href="#inicio">Volver al inicio</a></div>`;
  const choose = (id, focus) => { selectedEmotion = id; renderSupports(id, focus); };
  main.querySelectorAll('[data-emotion]').forEach(el => {
    el.addEventListener('click', () => choose(el.dataset.emotion, true));
    if (el.tagName.toLowerCase() === 'circle') el.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(el.dataset.emotion, true); } });
  });
  const initialEmotion = byId(selectedEmotion)?.id || summary.leaders[0]?.id;
  if (initialEmotion) renderSupports(initialEmotion);
  else document.querySelector('#support-panel').innerHTML = '<h2>Explora los cuatro ámbitos.</h2><p>Puedes elegir una emoción de la lista para consultar los focos generales de apoyo del proyecto.</p>';
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
