// Organizador independiente: sin red, correo, dependencias ni persistencia obligatoria.
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const SCOPES = { laboral: 'Laboral', personal: 'Personal', academico: 'Académico', familiar: 'Familiar' };
const STORAGE_KEY = 'helpyouryc-organizador-v1';
const esc = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const isoDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1900 || year > 9998) return null;
  const date = new Date(year, month - 1, day, 12);
  return isoDate(date) === value ? date : null;
}
function mondayOf(value) {
  const date = typeof value === 'string' ? parseDate(value) : new Date(value);
  if (!date) return null;
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return isoDate(date);
}
function plusDays(value, offset) { const date = parseDate(value); date.setDate(date.getDate() + offset); return isoDate(date); }
function shortDate(value) { return parseDate(value).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }); }
function fullDate(value) { return parseDate(value).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }); }
function isEntry(entry) {
  return entry && typeof entry.id === 'string' && entry.id.length <= 100 && parseDate(entry.date) &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(entry.start) && /^([01]\d|2[0-3]):[0-5]\d$/.test(entry.end) &&
    entry.end > entry.start && Object.hasOwn(SCOPES, entry.scope) && typeof entry.title === 'string' &&
    entry.title.trim().length > 0 && entry.title.length <= 160;
}
function sortedForDate(entries, date) { return entries.filter(entry => entry.date === date).sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end) || a.title.localeCompare(b.title)); }
let state = { monday: mondayOf(new Date()), entries: [], save: false, editing: null };
let initialized = false;
let activeListeners;

function loadSaved() {
  if (initialized) return;
  initialized = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (saved?.consent === true && Array.isArray(saved.entries)) {
      state.entries = saved.entries.filter(isEntry).map(entry => ({ ...entry }));
      state.save = true;
    }
  } catch { /* El modo privado puede impedir el acceso al almacenamiento. */ }
}
function persist() {
  try {
    if (state.save) localStorage.setItem(STORAGE_KEY, JSON.stringify({ consent: true, entries: state.entries }));
    else localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch { return false; }
}

export function mountOrganizer(container) {
  loadSaved();
  activeListeners?.abort();
  activeListeners = new AbortController();
  const { signal } = activeListeners;
  let message = '';
  const announce = value => { const status = container.querySelector('.org-status'); if (status) status.textContent = value; };
  function render() {
    const dates = DAYS.map((_, i) => plusDays(state.monday, i));
    const edit = state.entries.find(entry => entry.id === state.editing);
    container.innerHTML = `
      <div class="org-toolbar">
        <div class="org-week-controls"><button type="button" class="secondary-button" data-org="prev" aria-label="Semana anterior">←</button>
        <label for="org-week">Semana del lunes<input id="org-week" type="date" min="1900-01-08" max="9998-12-20" value="${state.monday}" required></label>
        <button type="button" class="secondary-button" data-org="next" aria-label="Semana siguiente">→</button></div>
        <button type="button" class="pill-button" data-org="pdf">Descargar PDF</button>
      </div>
      <p class="org-range">${esc(fullDate(state.monday))} — ${esc(fullDate(dates[6]))}</p>
      <div class="org-workspace"><form class="org-form" id="org-form">
        <h3>${edit ? 'Editar actividad' : 'Añadir una actividad'}</h3>
        <label for="org-title">¿Qué realizarás?<input id="org-title" name="title" type="text" maxlength="160" required placeholder="Escribe tu actividad" value="${esc(edit?.title || '')}"></label>
        <label for="org-day">Día<select id="org-day" name="date">${dates.map((date, i) => `<option value="${date}" ${edit?.date === date ? 'selected' : ''}>${DAYS[i]} · ${esc(shortDate(date))}</option>`).join('')}</select></label>
        <div class="org-times"><label for="org-start">Desde<input id="org-start" name="start" type="time" required value="${esc(edit?.start || '09:00')}"></label><label for="org-end">Hasta<input id="org-end" name="end" type="time" required value="${esc(edit?.end || '10:00')}"></label></div>
        <label for="org-scope">Ámbito<select id="org-scope" name="scope">${Object.entries(SCOPES).map(([id, name]) => `<option value="${id}" ${edit?.scope === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label>
        <div class="org-actions"><button class="pill-button" type="submit">${edit ? 'Guardar cambios' : 'Añadir al organizador'}</button>${edit ? '<button type="button" class="secondary-button" data-org="cancel">Cancelar edición</button>' : ''}</div>
        <p class="org-form-note">Puedes incluir estudio, trabajo, actividades familiares y tiempo personal. Para una actividad que cruza medianoche, crea un tramo en cada día.</p>
      </form>
      <div class="org-calendar" aria-label="Organizador de lunes a domingo">${dates.map((date, i) => {
        const events = sortedForDate(state.entries, date);
        return `<section class="org-day" aria-labelledby="org-day-${i}"><h3 id="org-day-${i}">${DAYS[i]}<span>${esc(shortDate(date))}</span></h3><div class="org-day-events">${events.length ? events.map(event => `<article class="org-event" data-scope="${event.scope}"><span class="org-event-time">${event.start}–${event.end}</span><h4>${esc(event.title)}</h4><span class="org-event-scope">${SCOPES[event.scope]}</span><div class="org-event-actions"><button type="button" data-org="edit" data-id="${esc(event.id)}" aria-label="Editar ${esc(event.title)} del ${DAYS[i]}">Editar</button><button type="button" data-org="delete" data-id="${esc(event.id)}" aria-label="Eliminar ${esc(event.title)} del ${DAYS[i]}">Eliminar</button></div></article>`).join('') : '<p class="org-empty">Sin actividades.<br>Un espacio por organizar.</p>'}</div><button class="org-add-day" type="button" data-org="day" data-date="${date}" aria-label="Añadir actividad el ${DAYS[i]}">+ Añadir</button></section>`;
      }).join('')}</div></div>
      <div class="org-privacy"><label class="org-save-label"><input type="checkbox" id="org-save" ${state.save ? 'checked' : ''}> Guardar mi organizador en este dispositivo</label><p>Opcional. Se guarda solo en este navegador y no se envía a un servidor. En un equipo compartido, déjalo desmarcado. Al desmarcarlo, se elimina la copia guardada; las actividades siguen disponibles hasta recargar o cerrar esta sesión.</p></div>
      <p class="org-export-note">El PDF se descarga directamente. No necesitas ingresar un correo. Guarda la descarga si quieres conservar tu semana. El PDF admite texto en español; los emojis y otros símbolos no compatibles se reemplazan por ?.</p>
      <p class="org-status" role="status" aria-live="polite">${esc(message)}</p>`;
    message = '';
  }
  function commitMessage(text) {
    const saved = persist();
    message = saved ? text : `${text} El navegador no permitió guardar los datos; descarga tu PDF para conservarlos.`;
    render();
  }
  function changeWeek(value) {
    const monday = mondayOf(value);
    if (!monday || monday < '1900-01-08' || monday > '9998-12-20') { announce('Elige una fecha válida entre 1900 y 9998.'); return; }
    state.monday = monday; state.editing = null; render();
    container.querySelector('#org-week').focus();
    announce(`Semana del ${fullDate(monday)}.`);
  }
  container.addEventListener('submit', event => {
    if (event.target.id !== 'org-form') return;
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const start = String(data.get('start') || '');
    const end = String(data.get('end') || '');
    if (!title) { form.elements.title.setCustomValidity('Escribe una actividad.'); form.elements.title.reportValidity(); return; }
    if (end <= start) { form.elements.end.setCustomValidity('La hora de término debe ser posterior a la de inicio.'); form.elements.end.reportValidity(); return; }
    const entry = { id: state.editing || globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, start, end, date: String(data.get('date')), scope: String(data.get('scope')) };
    if (!isEntry(entry)) { announce('Revisa el día, las horas, el ámbito y el texto de tu actividad.'); return; }
    const editing = !!state.editing;
    state.entries = state.entries.filter(item => item.id !== entry.id).concat(entry);
    state.editing = null;
    commitMessage(editing ? 'Actividad actualizada.' : 'Actividad añadida a tu semana.');
    container.querySelector('#org-title').focus();
  }, { signal });
  container.addEventListener('input', event => { if (event.target.matches('#org-title, #org-end, #org-start')) { container.querySelector('#org-title').setCustomValidity(''); container.querySelector('#org-end').setCustomValidity(''); } }, { signal });
  container.addEventListener('change', event => {
    if (event.target.id === 'org-week') changeWeek(event.target.value);
    if (event.target.id === 'org-save') {
      state.save = event.target.checked;
      if (!persist()) { state.save = false; event.target.checked = false; announce('Este navegador no permite guardar el organizador. Puedes descargar el PDF.'); }
      else announce(state.save ? 'Guardado local activado. Solo este navegador conserva tus actividades.' : 'Copia guardada eliminada. Las actividades continúan en esta sesión.');
    }
  }, { signal });
  container.addEventListener('click', event => {
    const button = event.target.closest('[data-org]');
    if (!button || !container.contains(button)) return;
    const action = button.dataset.org;
    if (action === 'prev' || action === 'next') changeWeek(plusDays(state.monday, action === 'prev' ? -7 : 7));
    if (action === 'cancel') { state.editing = null; render(); container.querySelector('#org-title').focus(); }
    if (action === 'day') { state.editing = null; render(); container.querySelector('#org-day').value = button.dataset.date; container.querySelector('#org-title').focus(); }
    if (action === 'edit') { state.editing = button.dataset.id; render(); container.querySelector('#org-title').focus(); }
    if (action === 'delete') {
      const entry = state.entries.find(item => item.id === button.dataset.id);
      if (!entry) return;
      state.entries = state.entries.filter(item => item.id !== entry.id);
      if (state.editing === entry.id) state.editing = null;
      commitMessage('Actividad eliminada.');
      container.querySelector('#org-title').focus();
    }
    if (action === 'pdf') {
      try {
        const bytes = createOrganizerPDF(state.entries, state.monday);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = `HelpyouRYC-semana-${state.monday}.pdf`;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        announce('PDF generado. Revisa las descargas de tu navegador.');
      } catch { announce('No se pudo generar el PDF. Inténtalo nuevamente.'); }
    }
  }, { signal });
  render();
}

// Helvetica con WinAnsi mantiene los acentos españoles. Los símbolos que no existen
// en esa codificación se sustituyen por "?"; la web conserva la entrada original.
function winAnsi(text) {
  const extra = { '€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135, 'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159 };
  return Array.from(String(text).normalize('NFC')).map(char => {
    const code = char.charCodeAt(0);
    return String.fromCharCode((code >= 32 && code <= 126) || (code >= 160 && code <= 255) ? code : extra[char] || 63);
  }).join('');
}
function pdfLiteral(text) { return winAnsi(text).replace(/([\\()])/g, '\\$1'); }
function wrapText(text, limit = 50) {
  const chars = Array.from(String(text).normalize('NFC').replace(/\s+/g, ' ').trim());
  const lines = [];
  while (chars.length > limit) {
    let cut = chars.slice(0, limit + 1).lastIndexOf(' ');
    if (cut < limit * 0.4) cut = limit;
    lines.push(chars.splice(0, cut).join(''));
    if (chars[0] === ' ') chars.shift();
  }
  if (chars.length) lines.push(chars.join(''));
  return lines;
}
export function createOrganizerPDF(entries, monday) {
  if (!parseDate(monday)) throw new Error('Fecha inválida');
  const pages = [];
  let commands = [];
  let y = 0;
  function text(value, x, baseline, size = 10, bold = false) {
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf 0.16 0.24 0.21 rg 1 0 0 1 ${x} ${baseline} Tm (${pdfLiteral(value)}) Tj ET`);
  }
  function newPage() {
    if (commands.length) pages.push(commands.join('\n'));
    commands = [];
    text('HelpyouRYC', 40, 800, 21, true);
    text('Mi organizador semanal', 40, 778, 13);
    text(`${fullDate(monday)} al ${fullDate(plusDays(monday, 6))}`, 40, 759, 10);
    commands.push('0.8 0.84 0.77 RG 0.7 w 40 745 m 555 745 l S');
    text('Organización del tiempo · Laboral, personal, académico y familiar', 40, 31, 8);
    text(`Página ${pages.length + 1}`, 500, 31, 8);
    y = 724;
  }
  newPage();
  DAYS.forEach((day, index) => {
    const date = plusDays(monday, index);
    if (y < 105) newPage();
    text(`${day} · ${fullDate(date)}`, 40, y, 12, true); y -= 21;
    const events = sortedForDate(entries.filter(isEntry), date);
    if (!events.length) { text('Sin actividades planificadas.', 48, y); y -= 21; }
    for (const entry of events) {
      const lines = wrapText(entry.title, 50);
      const height = 18 + lines.length * 14 + 9;
      if (y - height < 55) { newPage(); text(`${day} (continuación)`, 40, y, 12, true); y -= 21; }
      text(`${entry.start}–${entry.end}  |  ${SCOPES[entry.scope]}`, 48, y, 10, true); y -= 16;
      for (const line of lines) { text(line, 55, y, 10); y -= 14; }
      y -= 11;
    }
    y -= 12;
  });
  pages.push(commands.join('\n'));
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  ];
  const pageIds = [];
  for (const content of pages) {
    const pageId = objects.length + 1;
    const streamId = pageId + 1;
    pageIds.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${streamId} 0 R >>`);
    objects.push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  }
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Uint8Array.from(pdf, char => char.charCodeAt(0));
}
