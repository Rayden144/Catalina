// NODE_PATH=/ruta/a/node_modules node tests/browser.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
    const errors = []; const badResponses = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) badResponses.push(`${r.status()} ${r.url()}`); });
    await page.goto(process.env.APP_URL || 'http://127.0.0.1:8123/');
    assert.match(await page.title(), /HelpyouRYC/);
    await page.screenshot({ path: '/tmp/helpyou-home-desktop.png', fullPage: true });
    await page.getByRole('button', { name: 'Iniciar', exact: true }).click();
    await page.locator('#question-form').waitFor();
    await page.locator('.skip-link').focus();
    await page.keyboard.press('Enter');
    assert.equal(new URL(page.url()).hash, '#preguntas');
    assert.equal(await page.locator('#question-form').count(), 1);
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.getByRole('alert').filter({ hasText: 'Selecciona una alternativa' }).waitFor();
    const emotionNames = /\b(?:tristeza|estrés|enojo|alegría|angustia|miedo|preocupación)\b/i;
    assert.equal(await page.locator('[name=response]').count(), 4);
    // Elegir a salvo p2 y f1 omitidas suma 10 respuestas, con cuatro emociones empatadas al 20 %.
    for (let i = 0; i < 12; i++) {
      assert.equal(await page.locator('[name=response]').count(), 4);
      assert.equal(await page.locator('[name=emotion], [data-emotion]').count(), 0);
      assert.doesNotMatch(await page.locator('main').innerText(), emotionNames);
      assert.deepEqual(await page.locator('[name=response]').evaluateAll(inputs => inputs.map(input => input.value)), ['a', 'b', 'c', 'd']);
      if (i === 0) {
        for (const width of [360, 390, 768, 1280]) {
          await page.setViewportSize({ width, height: 844 });
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Cuestionario sin overflow en ${width}`);
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/tmp/helpyou-question-mobile.png', fullPage: true });
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.getByRole('button', { name: 'Esta situación no se ajusta a mí' }).click();
        assert.equal(await page.locator('#skip-question').getAttribute('aria-pressed'), 'true');
        await page.locator('[name=response][value="a"]').check();
        assert.equal(await page.locator('#skip-question').getAttribute('aria-pressed'), 'false');
        assert.equal(await page.locator('#skip-status').textContent(), '');
      } else if ([4, 9].includes(i)) {
        await page.getByRole('button', { name: 'Esta situación no se ajusta a mí' }).click();
        assert.equal(await page.locator('[name=response]:checked').count(), 0);
      } else {
        await page.locator('[name=response][value="a"]').check();
      }
      if (i === 2) {
        await page.getByRole('button', { name: 'Anterior' }).click();
        assert.equal(await page.locator('[name=response][value="a"]').isChecked(), true);
        await page.getByRole('button', { name: 'Siguiente' }).click();
        assert.equal(await page.locator('[name=response][value="a"]').isChecked(), true);
      }
      if (i === 5) {
        await page.getByRole('button', { name: 'Anterior' }).click();
        assert.equal(await page.locator('#skip-question').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('[name=response]:checked').count(), 0);
        await page.locator('[name=response][value="b"]').check();
        assert.equal(await page.locator('#skip-question').getAttribute('aria-pressed'), 'false');
        assert.equal(await page.locator('#skip-status').textContent(), '');
        await page.getByRole('button', { name: 'Esta situación no se ajusta a mí' }).click();
        await page.getByRole('button', { name: 'Siguiente' }).click();
        assert.equal(await page.locator('[name=response][value="a"]').isChecked(), true);
      }
      await page.getByRole('button', { name: i === 11 ? 'Ver mis resultados' : 'Siguiente' }).click();
    }
    await page.getByRole('heading', { name: 'Un vistazo a cómo estás.' }).waitFor();
    assert.match(await page.locator('.results-summary h2').textContent(), /misma presencia/);
    assert.match(await page.locator('.chart-caption').textContent(), /2 preguntas omitidas/);
    assert.equal(await page.locator('.chart-center strong').textContent(), '10');
    const expectedPercent = { tristeza: 10, estres: 20, enojo: 20, alegria: 0, angustia: 20, miedo: 10, preocupacion: 20 };
    for (const [id, percent] of Object.entries(expectedPercent)) {
      assert.equal(await page.locator(`.legend-button[data-emotion=${id}] strong`).textContent(), `${percent} %`);
    }
    assert.equal(await page.locator('.chart-segment').count(), 6);
    assert.equal(await page.locator('[name=emotion]').count(), 0);
    assert.doesNotMatch(await page.locator('.results-layout').textContent(), /etiquetas elegidas|que elegiste/i);
    await page.getByText('Revisar mis 12 respuestas', { exact: true }).click();
    assert.equal(await page.locator('.answer-list li').count(), 12);
    assert.doesNotMatch(await page.locator('.answer-list').textContent(), emotionNames);
    assert.match(await page.locator('.answer-list').textContent(), /Situación omitida/);
    await page.getByText('Revisar mis 12 respuestas', { exact: true }).click();
    await page.locator('.chart-segment[data-emotion=miedo]').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#support-panel h2').textContent(), /^Miedo/);
    assert.equal(await page.locator('.support-card').count(), 4);
    assert.doesNotMatch(await page.locator('#support-panel').textContent(), /Base documental|adaptación al organizador/i);
    await page.locator('.legend-button[data-emotion=tristeza]').click();
    assert.match(await page.locator('#support-panel h2').textContent(), /^Tristeza/);
    await page.screenshot({ path: '/tmp/helpyou-results-desktop.png', fullPage: true });
    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Resultados sin overflow en ${width}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: '/tmp/helpyou-results-mobile.png', fullPage: true });
    await page.getByRole('link', { name: 'Llevarlo a mi organizador' }).click();
    await page.locator('.org-calendar').waitFor();
    assert.equal(await page.locator('.org-day').count(), 7);
    await page.locator('#org-week').fill('2026-10-28');
    await page.locator('#org-week').dispatchEvent('change');
    assert.equal(await page.locator('#org-week').inputValue(), '2026-10-26');
    await page.locator('#org-title').fill('Revisión de evaluación y organización');
    await page.locator('#org-start').fill('11:00');
    await page.locator('#org-end').fill('10:00');
    await page.getByRole('button', { name: 'Añadir al organizador' }).click();
    assert.equal(await page.locator('.org-event').count(), 0);
    await page.locator('#org-end').fill('12:00');
    await page.getByRole('button', { name: 'Añadir al organizador' }).click();
    assert.equal(await page.locator('.org-event').count(), 1);
    await page.getByRole('button', { name: /^Editar Revisión/ }).click();
    await page.locator('#org-title').fill('Actividad académica <sin HTML>');
    await page.getByRole('button', { name: 'Guardar cambios' }).click();
    assert.match(await page.locator('.org-event h4').textContent(), /<sin HTML>/);
    await page.getByRole('button', { name: 'Semana siguiente' }).click();
    assert.equal(await page.locator('.org-event').count(), 0);
    await page.getByRole('button', { name: 'Semana anterior' }).click();
    assert.equal(await page.locator('.org-event').count(), 1);
    await page.locator('#org-save').check();
    assert.ok(await page.evaluate(() => !!localStorage.getItem('helpyouryc-organizador-v1')));
    await page.locator('#org-save').uncheck();
    assert.equal(await page.evaluate(() => localStorage.getItem('helpyouryc-organizador-v1')), null);
    for (const width of [360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 844 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Organizador sin overflow en ${width}`);
    }
    await page.screenshot({ path: '/tmp/helpyou-organizer-desktop.png', fullPage: true });
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar PDF' }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), 'HelpyouRYC-semana-2026-10-26.pdf');
    await download.saveAs('/tmp/helpyou-week-test.pdf');
    assert.ok(fs.statSync('/tmp/helpyou-week-test.pdf').size > 1000);
    await page.getByRole('link', { name: /Volver al inicio/ }).click();
    await page.getByRole('button', { name: 'Continuar mi recorrido' }).click();
    assert.equal(await page.locator('[name=response][value="a"]').isChecked(), true);
    await page.getByRole('button', { name: 'Ver mis resultados' }).click();
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Volver a responder', exact: true }).click();
    for (let i = 0; i < 12; i++) {
      await page.getByRole('button', { name: 'Esta situación no se ajusta a mí' }).click();
      await page.getByRole('button', { name: i === 11 ? 'Ver mis resultados' : 'Siguiente' }).click();
    }
    await page.getByRole('heading', { name: 'Un vistazo a cómo estás.' }).waitFor();
    assert.equal(await page.locator('.results-summary h2').textContent(), 'No hay respuestas para calcular un resultado.');
    assert.match(await page.locator('.chart-caption').textContent(), /12 preguntas omitidas/);
    assert.equal(await page.locator('.chart-center strong').textContent(), '0');
    assert.equal(await page.locator('#support-panel .support-marker').count(), 0);
    assert.equal(await page.locator('#support-panel h2').textContent(), 'Explora los cuatro ámbitos.');
    assert.equal(await page.locator('.chart-segment').count(), 0);
    assert.ok(!(await page.locator('main').textContent()).includes('NaN'));
    await page.getByRole('link', { name: 'Organizador', exact: true }).first().click();
    await page.locator('.org-calendar').waitFor();
    assert.equal(await page.locator('.org-event').count(), 1);
    await page.getByRole('button', { name: /^Eliminar Actividad/ }).click();
    assert.equal(await page.locator('.org-event').count(), 0);
    await page.getByRole('button', { name: 'Sobre el proyecto' }).click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    assert.deepEqual(errors, []); assert.deepEqual(badResponses, []);
    console.log('PASS: cuestionario completo sin etiquetas visibles, asociación automática, validación, edición, empates, omisiones, gráfico por teclado, 4 ámbitos, reinicio, organizador CRUD/semanas/privacidad/PDF, navegación y tamaños 360/390/768/1280, sin errores JS/HTTP.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
