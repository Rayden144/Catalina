import test from 'node:test';
import assert from 'node:assert/strict';
import { questions, domains, emotions, summarizeAnswers } from '../content.js';
import { createOrganizerPDF } from '../organizer.js';

const emotionIds = emotions.map(emotion => emotion.id);
const countOf = (summary, id) => summary.rows.find(emotion => emotion.id === id).count;

test('12 preguntas, 3 por ámbito y 5 alternativas con experiencias positivas, neutras y difíciles', () => {
  assert.equal(questions.length, 12);
  assert.equal(new Set(questions.map(question => question.id)).size, 12);
  assert.deepEqual(emotionIds, ['tristeza', 'estres', 'enojo', 'alegria', 'angustia', 'miedo', 'preocupacion']);
  for (const domain of domains) {
    const group = questions.filter(question => question.domain === domain.id);
    assert.equal(group.length, 3);
    const associations = new Set(group.flatMap(question => question.options.map(option => option.emotion)));
    assert.ok(associations.has('alegria'));
    assert.ok(associations.has(null));
  }
  for (const question of questions) {
    assert.ok(question.page >= 1 && question.page <= 21);
    assert.equal(question.options.length, 5);
    assert.deepEqual(question.options.map(option => option.id), ['a', 'b', 'c', 'd', 'e']);
    assert.equal(new Set(question.options.map(option => option.text)).size, 5);
    assert.deepEqual(question.options.map(option => option.level), ['Muy positiva', 'Positiva', 'Neutra', 'Difícil', 'Muy difícil']);
    assert.equal(question.options[0].emotion, 'alegria');
    assert.equal(question.options[1].emotion, 'alegria');
    assert.equal(question.options[2].emotion, null);
    for (const option of question.options) {
      assert.ok(option.text.trim().length > 0);
      assert.ok(option.emotion === null || emotionIds.includes(option.emotion));
    }
  }
  const associations = questions.flatMap(question => question.options.map(option => option.emotion));
  assert.equal(associations.length, 60);
  assert.equal(associations.filter(emotion => emotion === null).length, 12);
});

test('las alternativas emocionales suman un punto y las neutras no atribuyen emociones', () => {
  for (const question of questions) {
    for (const option of question.options) {
      const summary = summarizeAnswers({ [question.id]: option.id });
      assert.equal(summary.total, option.emotion === null ? 0 : 1);
      assert.equal(summary.neutral, option.emotion === null ? 1 : 0);
      assert.equal(summary.answered, 1);
      assert.equal(summary.skipped, 0);
      assert.deepEqual(summary.leaders.map(emotion => emotion.id), option.emotion === null ? [] : [option.emotion]);
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
  const different = second.options.find(candidate => candidate.emotion !== null && candidate.emotion !== option.emotion);
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
  const [before, , , after] = question.options;
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
test('PDF conserva la semana completa en una página vacía o con cuatro actividades breves', () => {
  const empty = Buffer.from(createOrganizerPDF([], '2026-10-26')).toString('latin1');
  assert.ok(empty.includes('(PsicoIntegra)'));
  assert.equal(Number(empty.match(/\/Count (\d+)/)[1]), 1);
  assert.equal([...empty.matchAll(/Sin actividades planificadas/g)].length, 7);
  const entries = ['2026-10-26', '2026-10-27', '2026-10-29', '2026-10-30'].map((date, i) => ({
    id: String(i), date, start: '09:00', end: '10:00', scope: 'academico', title: `Actividad ${i}`
  }));
  const text = Buffer.from(createOrganizerPDF(entries, '2026-10-26')).toString('latin1');
  assert.equal(Number(text.match(/\/Count (\d+)/)[1]), 1);
  for (const entry of entries) assert.ok(text.includes(entry.title));
  assert.ok(text.includes('(1 / 1)'));
  assert.throws(() => createOrganizerPDF([], 'fecha inválida'));
});

test('PDF pagina sin perder actividades y mantiene offsets y longitudes válidos', () => {
  const entries = Array.from({ length: 80 }, (_, i) => ({ id: String(i), date: '2026-10-26', start: '09:00', end: '10:00', scope: 'personal', title: `Actividad ${i} ${'texto largo '.repeat(10)}` }));
  const text = Buffer.from(createOrganizerPDF(entries, '2026-10-26')).toString('latin1');
  const pageCount = Number(text.match(/\/Count (\d+)/)[1]);
  assert.ok(pageCount > 1);
  for (let i = 0; i < entries.length; i++) assert.equal([...text.matchAll(new RegExp(`Actividad ${i} `, 'g'))].length, 1);
  assert.ok(text.includes('continuación'));
  for (let i = 1; i <= pageCount; i++) assert.ok(text.includes(`(${i} / ${pageCount})`));
  for (const match of text.matchAll(/\/Length (\d+) >>\nstream\n/g)) {
    const contentStart = match.index + match[0].length;
    assert.equal(text.slice(contentStart + Number(match[1]), contentStart + Number(match[1]) + 10), '\nendstream');
  }
  const xref = text.slice(Number(text.match(/startxref\n(\d+)/)[1]));
  const offsets = [...xref.matchAll(/(\d{10}) 00000 n /g)];
  offsets.forEach((match, index) => assert.ok(text.slice(Number(match[1])).startsWith(`${index + 1} 0 obj\n`)));
});

test('12 respuestas neutras cuentan como respondidas sin porcentajes ni emoción dominante', () => {
  const summary = summarizeAnswers(Object.fromEntries(questions.map(q => [q.id, 'c'])));
  assert.equal(summary.answered, 12);
  assert.equal(summary.neutral, 12);
  assert.equal(summary.skipped, 0);
  assert.equal(summary.total, 0);
  assert.deepEqual(summary.leaders, []);
  assert.ok(summary.rows.every(row => row.count === 0 && row.percent === 0));
});

test('un recorrido mixto distingue respuestas positivas, neutras, difíciles y omitidas', () => {
  const summary = summarizeAnswers({ l1: 'b', l2: 'c', l3: 'd', p1: 'e', p2: 'skip' });
  assert.equal(summary.answered, 5);
  assert.equal(summary.neutral, 1);
  assert.equal(summary.skipped, 1);
  assert.equal(summary.total, 3);
  for (const id of ['alegria', 'enojo', 'estres']) assert.equal(countOf(summary, id), 1);
  assert.equal(summary.leaders.length, 3);
  assert.ok(summary.rows.every(row => Number.isFinite(row.percent)));
});
