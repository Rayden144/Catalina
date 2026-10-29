import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, domains, emotions, summarizeAnswers } from '../content.js';
import { createOrganizerPDF } from '../organizer.js';

const emotionIds = emotions.map(emotion => emotion.id);
const countOf = (summary, id) => summary.rows.find(emotion => emotion.id === id).count;

test('12 preguntas, 3 por ámbito y 4 alternativas distintas con asociación interna válida', () => {
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map(question => question.id)).size, 12);
  assert.deepEqual(emotionIds, ['tristeza', 'estres', 'enojo', 'alegria', 'angustia', 'miedo', 'preocupacion']);
  for (const domain of domains) {
    const group = questions.filter(question => question.domain === domain.id);
    assert.equal(group.length, 3);
    const associations = new Set(group.flatMap(question => question.options.map(option => option.emotion)));
    for (const id of emotionIds) assert.ok(associations.has(id), `${domain.id} incluye ${id}`);
  }
  for (const question of questions) {
    assert.ok(question.page >= 1 && question.page <= 21);
    assert.equal(question.options.length, 4);
    assert.deepEqual(question.options.map(option => option.id), ['a', 'b', 'c', 'd']);
    assert.equal(new Set(question.options.map(option => option.text)).size, 4);
    assert.equal(new Set(question.options.map(option => option.emotion)).size, 4);
    for (const option of question.options) {
      assert.ok(option.text.trim().length > 0);
      assert.ok(emotionIds.includes(option.emotion));
    }
  }
  const associations = questions.flatMap(question => question.options.map(option => option.emotion));
  assert.equal(associations.length, 48);
  for (const id of emotionIds) assert.ok([6, 7].includes(associations.filter(emotion => emotion === id).length), `Exposición de ${id}`);
});

test('las 48 alternativas suman exactamente un punto a su asociación interna', () => {
  for (const question of questions) {
    for (const option of question.options) {
      const summary = summarizeAnswers({ [question.id]: option.id });
      assert.equal(summary.total, 1);
      assert.equal(summary.answered, 1);
      assert.equal(summary.skipped, 0);
      assert.deepEqual(summary.leaders.map(emotion => emotion.id), [option.emotion]);
      for (const row of summary.rows) {
        assert.equal(row.count, row.id === option.emotion ? 1 : 0);
        assert.equal(row.percent, row.id === option.emotion ? 100 : 0);
      }
    }
  }
});

test('omite situaciones no aplicables del denominador y muestra todos los empates', () => {
  const first = questions[0];
  const option = first.options[0];
  const second = questions[1];
  const different = second.options.find(candidate => candidate.emotion !== option.emotion);
  const summary = summarizeAnswers({ [first.id]: option.id, [second.id]: different.id, [questions[2].id]: 'skip' });
  assert.equal(summary.total, 2);
  assert.equal(summary.answered, 3);
  assert.equal(summary.skipped, 1);
  assert.deepEqual(new Set(summary.leaders.map(emotion => emotion.id)), new Set([option.emotion, different.emotion]));
  assert.equal(summary.rows.reduce((total, row) => total + row.percent, 0), 100);
  assert.equal(summary.rows.find(row => row.id === option.emotion).percent, 50);
  const empty = summarizeAnswers({});
  assert.equal(empty.total, 0);
  assert.equal(empty.answered, 0);
  assert.equal(empty.skipped, 0);
  assert.deepEqual(empty.leaders, []);
  assert.ok(empty.rows.every(row => row.count === 0 && row.percent === 0));
  const skipped = summarizeAnswers(Object.fromEntries(questions.map(question => [question.id, 'skip'])));
  assert.equal(skipped.total, 0);
  assert.equal(skipped.answered, 12);
  assert.equal(skipped.skipped, 12);
  assert.deepEqual(skipped.leaders, []);
  assert.ok(skipped.rows.every(row => row.percent === 0 && Number.isFinite(row.percent)));
});

test('ignora claves y opciones inválidas, sin aceptar emociones inyectadas ni propiedades heredadas', () => {
  const first = questions[0];
  const invalid = summarizeAnswers({
    inexistente: first.options[0].id,
    [first.id]: { emotion: 'alegria', choice: first.options[0].id },
    [questions[1].id]: 'opcion-inexistente',
    [questions[2].id]: null,
    [questions[3].id]: 0,
    [questions[4].id]: [first.options[0].id],
    [questions[5].id]: true,
    [questions[6].id]: undefined
  });
  assert.equal(invalid.total, 0);
  assert.equal(invalid.answered, 0);
  assert.equal(invalid.skipped, 0);
  assert.equal(summarizeAnswers(Object.create({ [first.id]: first.options[0].id })).total, 0);
  for (const value of [null, undefined, 123, 'a', true, []]) assert.equal(summarizeAnswers(value).total, 0);
});

test('cambiar una respuesta reemplaza el punto anterior y las 12 respuestas suman 12', () => {
  const question = questions[0];
  const [before, after] = question.options;
  const answers = { [question.id]: before.id };
  assert.equal(countOf(summarizeAnswers(answers), before.emotion), 1);
  answers[question.id] = after.id;
  const changed = summarizeAnswers(answers);
  assert.equal(changed.total, 1);
  assert.equal(changed.answered, 1);
  assert.equal(countOf(changed, before.emotion), 0);
  assert.equal(countOf(changed, after.emotion), 1);
  const all = summarizeAnswers(Object.fromEntries(questions.map(item => [item.id, item.options[0].id])));
  assert.equal(all.total, 12);
  assert.equal(all.answered, 12);
  assert.equal(all.skipped, 0);
  assert.equal(all.rows.reduce((total, row) => total + row.count, 0), 12);
  assert.ok(Math.abs(all.rows.reduce((total, row) => total + row.percent, 0) - 100) < 1e-9);
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
