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
      <div class="org-privacy"><label class="org-save-label"><input type="checkbox" id="org-save" ${state.save ? 'checked' : ''}> Guardar mi organizador en este dispositivo</label><p>Opcional. Se guarda solo en este navegador y no se envía a un servidor. En un equipo compartido, déjalo desmarcado. Al desmarcarlo, se elimina la copia guardada, las actividades siguen disponibles hasta recargar o cerrar esta sesión.</p></div>
      <p class="org-export-note">El PDF se descarga directamente. No necesitas ingresar un correo. Guarda la descarga si quieres conservar tu semana. El PDF admite texto en español, los emojis y otros símbolos no compatibles se reemplazan por ?.</p>
      <p class="org-status" role="status" aria-live="polite">${esc(message)}</p>`;
    message = '';
  }
  function commitMessage(text) {
    const saved = persist();
    message = saved ? text : `${text} El navegador no permitió guardar los datos, descarga tu PDF para conservarlos.`;
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
        const link = document.createElement('a'); link.href = url; link.download = `PsicoIntegra-semana-${state.monday}.pdf`;
        document.body.append(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        announce('PDF generado. Revisa las descargas de tu navegador.');
      } catch { announce('No se pudo generar el PDF. Inténtalo nuevamente.'); }
    }
  }, { signal });
  render();
}

// Helvetica con WinAnsi mantiene los acentos españoles. Los símbolos que no existen
// en esa codificación se sustituyen por "?", la web conserva la entrada original.
function winAnsi(text) {
  const extra = { '€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135, 'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159 };
  return Array.from(String(text).normalize('NFC')).map(char => {
    const code = char.charCodeAt(0);
    return String.fromCharCode((code >= 32 && code <= 126) || (code >= 160 && code <= 255) ? code : extra[char] || 63);
  }).join('');
}
function pdfLiteral(text) { return winAnsi(text).replace(/([\\()])/g, '\\$1'); }
// Anchuras de Helvetica (AFM), para ajustar el texto sin cortarlo en el PDF.
const HELVETICA_WIDTHS = [278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
function pdfTextWidth(value, size) {
  return Array.from(winAnsi(value)).reduce((width, char) => {
    const base = char.normalize('NFD')[0].charCodeAt(0);
    return width + (HELVETICA_WIDTHS[base - 32] || 600) * size / 1000;
  }, 0);
}
function wrapText(text, width, size) {
  const lines = [];
  let line = '';
  for (const char of Array.from(String(text).normalize('NFC').replace(/\s+/g, ' ').trim())) {
    if (line && pdfTextWidth(line + char, size) > width) {
      const lastSpace = line.lastIndexOf(' ');
      if (lastSpace > 0) {
        lines.push(line.slice(0, lastSpace));
        line = line.slice(lastSpace + 1) + char;
      } else { lines.push(line); line = char; }
    } else line += char;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}
export function createOrganizerPDF(entries, monday) {
  if (!parseDate(monday)) throw new Error('Fecha inválida');
  const pages = [];
  const palette = {
    ink: '#38465b', muted: '#657086', line: '#e7dfe7', paper: '#fffafb',
    rose: '#f6dce8', sky: '#dceefa', yellow: '#fff0bd', white: '#ffffff'
  };
  const scopeColors = { laboral: palette.yellow, personal: palette.rose, academico: palette.sky, familiar: '#ece2f5' };
  const weekEntries = entries.filter(isEntry).filter(entry => entry.date >= monday && entry.date <= plusDays(monday, 6));
  let commands = [];
  let y = 0;
  const rgb = hex => [1, 3, 5].map(offset => (parseInt(hex.slice(offset, offset + 2), 16) / 255).toFixed(3)).join(' ');
  function text(value, x, baseline, size = 10, bold = false, color = palette.ink) {
    commands.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb(color)} rg 1 0 0 1 ${x} ${baseline} Tm (${pdfLiteral(value)}) Tj ET`);
  }
  function box(x, top, width, height, fill, radius = 0, stroke = null) {
    const bottom = top - height;
    commands.push('q', `${rgb(fill)} rg`);
    if (stroke) commands.push(`${rgb(stroke)} RG 0.7 w`);
    if (!radius) commands.push(`${x} ${bottom} ${width} ${height} re`);
    else {
      const r = Math.min(radius, height / 2, width / 2), k = r * 0.552285;
      commands.push(`${x + r} ${bottom} m ${x + width - r} ${bottom} l`,
        `${x + width - r + k} ${bottom} ${x + width} ${bottom + r - k} ${x + width} ${bottom + r} c`,
        `${x + width} ${top - r} l ${x + width} ${top - r + k} ${x + width - r + k} ${top} ${x + width - r} ${top} c`,
        `${x + r} ${top} l ${x + r - k} ${top} ${x} ${top - r + k} ${x} ${top - r} c`,
        `${x} ${bottom + r} l ${x} ${bottom + r - k} ${x + r - k} ${bottom} ${x + r} ${bottom} c h`);
    }
    commands.push(stroke ? 'B' : 'f', 'Q');
  }
  function rule(x1, x2, baseline, color = palette.line) {
    commands.push(`${rgb(color)} RG 0.6 w ${x1} ${baseline} m ${x2} ${baseline} l S`);
  }
  function newPage() {
    if (commands.length) pages.push(commands.join('\n'));
    commands = [];
    box(0, 842, 595, 842, palette.paper);
    box(40, 805, 515, 104, palette.rose, 17);
    text('PsicoIntegra', 58, 778, 22, true);
    text('MI ORGANIZADOR SEMANAL', 58, 758, 10, true, palette.muted);
    const count = `${weekEntries.length} ${weekEntries.length === 1 ? 'actividad' : 'actividades'}`;
    const countWidth = Math.max(82, pdfTextWidth(count, 9) + 24);
    box(537 - countWidth, 786, countWidth, 25, palette.yellow, 12);
    text(count, 549 - countWidth, 770, 9);
    box(58, 744, 479, 28, palette.white, 9);
    text(`${fullDate(monday)} al ${fullDate(plusDays(monday, 6))}`, 70, 726, 10);
    text('Trabajo, estudio, tiempo personal y familia.', 42, 684, 9, false, palette.muted);
    y = 669;
  }
  newPage();
  DAYS.forEach((day, index) => {
    const date = plusDays(monday, index);
    const events = sortedForDate(weekEntries, date).map(entry => {
      const lines = wrapText(entry.title, 353, 11);
      return { entry, lines, height: Math.max(44, lines.length * 15 + 27) };
    });
    let offset = 0;
    let continued = false;
    do {
      const minimum = 44 + (events[offset]?.height || 16);
      if (y - minimum < 60) newPage();
      let height = 44;
      const chunk = [];
      while (offset < events.length && y - height - events[offset].height >= 60) {
        const event = events[offset++];
        chunk.push(event);
        height += event.height;
      }
      if (!events.length) height += 16;
      box(40, y, 515, height, palette.white, 12, palette.line);
      box(48, y - 8, 499, 27, index % 2 ? palette.rose : palette.sky, 7);
      text(`${day}${continued ? ' · continuación' : ''}`, 59, y - 26, 11, true);
      const dateLabel = shortDate(date);
      text(dateLabel, 535 - pdfTextWidth(dateLabel, 9), y - 25, 9, false, palette.muted);
      let rowTop = y - 43;
      if (!events.length) {
        text('Sin actividades planificadas.', 59, rowTop - 12, 10, false, palette.muted);
      }
      chunk.forEach(({ entry, lines, height: rowHeight }, rowIndex) => {
        text(`${entry.start}–${entry.end}`, 59, rowTop - 13, 10, true);
        const scope = SCOPES[entry.scope];
        const chipWidth = Math.max(62, pdfTextWidth(scope, 8) + 18);
        box(58, rowTop - 21, chipWidth, 18, scopeColors[entry.scope], 7);
        text(scope, 67, rowTop - 33, 8);
        lines.forEach((line, lineIndex) => text(line, 174, rowTop - 13 - lineIndex * 15, 11));
        rowTop -= rowHeight;
        if (rowIndex < chunk.length - 1) rule(59, 535, rowTop + 4);
      });
      y -= height + 9;
      continued = true;
    } while (offset < events.length);
  });
  pages.push(commands.join('\n'));
  pages.forEach((content, index) => {
    commands = [content];
    rule(40, 555, 46);
    text('PsicoIntegra · Mi semana, a mi ritmo.', 40, 30, 8, false, palette.muted);
    text(`${index + 1} / ${pages.length}`, 520, 30, 8, true, palette.muted);
    pages[index] = commands.join('\n');
  });
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
