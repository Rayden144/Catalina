import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, domains, emotions, frequencies, summarizeLabels } from '../content.js';
import { createOrganizerPDF } from '../organizer.js';

test('12 ítems documentales, 3 por ámbito y 4 frecuencias', () => {
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map(q => q.id)).size, 12);
  for (const domain of domains) assert.equal(questions.filter(q => q.domain === domain.id).length, 3);
  assert.equal(frequencies.length, 4);
  for (const q of questions) assert.ok(q.page >= 1 && q.page <= 21);
  assert.deepEqual(emotions.map(e => e.id), ['tristeza', 'estres', 'enojo', 'alegria', 'angustia', 'miedo', 'preocupacion']);
});
test('etiquetas explícitas: denominador excluye omisiones, no usa frecuencia y conserva empates', () => {
  const summary = summarizeLabels({ a: { frequency: 0, emotion: 'alegria' }, b: { frequency: 3, emotion: 'miedo' }, c: { frequency: 3, emotion: '' }, d: { frequency: 1, emotion: 'inexistente' } });
  assert.equal(summary.total, 2);
  assert.deepEqual(summary.leaders.map(e => e.id), ['alegria', 'miedo']);
  assert.equal(summary.rows.find(e => e.id === 'miedo').percent, 50);
  assert.equal(summarizeLabels({}).total, 0);
  assert.deepEqual(summarizeLabels({}).leaders, []);
});
test('PDF real: español, semana seleccionada, texto escapado y referencias de objetos correctas', () => {
  const pdf = createOrganizerPDF([
    { id: '1', date: '2026-10-26', start: '09:00', end: '10:00', scope: 'academico', title: 'Revisión (evaluación) \\ práctica' },
    { id: '2', date: '2026-11-02', start: '09:00', end: '10:00', scope: 'laboral', title: 'OTRA_SEMANA' }
  ], '2026-10-26');
  const text = Buffer.from(pdf).toString('latin1');
  assert.ok(text.startsWith('%PDF-1.4'));
  assert.ok(text.includes('Revisión \\(evaluación\\) \\\\ práctica'));
  assert.ok(!text.includes('OTRA_SEMANA'));
  for (const day of ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']) assert.ok(text.includes(day));
  const start = Number(text.match(/startxref\n(\d+)/)[1]);
  assert.equal(text.slice(start, start + 4), 'xref');
  for (const match of text.matchAll(/(\d+) 0 obj/g)) assert.ok(text.slice(match.index).startsWith(`${match[1]} 0 obj`));
});
test('PDF puede exportar una semana vacía y paginar muchas actividades', () => {
  assert.ok(createOrganizerPDF([], '2026-10-26').length > 1000);
  const entries = Array.from({ length: 80 }, (_, i) => ({ id: String(i), date: '2026-10-26', start: '09:00', end: '10:00', scope: 'personal', title: `Actividad ${i} ${'texto largo '.repeat(10)}` }));
  const text = Buffer.from(createOrganizerPDF(entries, '2026-10-26')).toString('latin1');
  assert.ok(Number(text.match(/\/Count (\d+)/)[1]) > 1);
  assert.ok(text.includes('Actividad 79'));
  assert.throws(() => createOrganizerPDF([], 'fecha inválida'));
});
