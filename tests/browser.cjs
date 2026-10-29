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
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await page.getByRole('alert').filter({ hasText: 'Selecciona una alternativa' }).waitFor();
    assert.equal(await page.locator('[name=frequency]').count(), 4);
    // 4 etiquetas estrés, 4 alegría, 2 miedo, 2 omisiones = 40/40/20.
    const labels = ['estres','estres','alegria','miedo','','alegria','estres','alegria','miedo','','estres','alegria'];
    for (let i = 0; i < 12; i++) {
      await page.locator(`[name=frequency][value="${i % 4}"]`).check();
      await page.locator(`[name=emotion][value="${labels[i]}"]`).check();
      if (i === 2) {
        await page.getByRole('button', { name: 'Anterior' }).click();
        assert.equal(await page.locator('[name=frequency][value="1"]').isChecked(), true);
        await page.getByRole('button', { name: 'Siguiente' }).click();
        assert.equal(await page.locator('[name=emotion][value="alegria"]').isChecked(), true);
      }
      await page.getByRole('button', { name: i === 11 ? 'Ver mis resultados' : 'Siguiente' }).click();
    }
    await page.getByRole('heading', { name: 'Así nombraste tus experiencias.' }).waitFor();
    assert.match(await page.locator('.results-summary h2').textContent(), /empate/);
    assert.match(await page.locator('.chart-caption').textContent(), /2 preguntas sin etiqueta/);
    assert.match(await page.locator('.legend-button[data-emotion=estres]').textContent(), /40 %/);
    assert.equal(await page.locator('.chart-segment').count(), 3);
    await page.locator('.chart-segment[data-emotion=miedo]').focus();
    await page.keyboard.press('Enter');
    assert.match(await page.locator('#support-panel h2').textContent(), /^Miedo/);
    assert.equal(await page.locator('.support-card').count(), 4);
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
    assert.equal(await page.locator('[name=frequency][value="3"]').isChecked(), true);
    await page.getByRole('button', { name: 'Ver mis resultados' }).click();
    page.once('dialog', d => d.accept());
    await page.getByRole('button', { name: 'Volver a responder', exact: true }).click();
    for (let i = 0; i < 12; i++) {
      await page.locator('[name=frequency][value="0"]').check();
      await page.getByRole('button', { name: i === 11 ? 'Ver mis resultados' : 'Siguiente' }).click();
    }
    assert.match(await page.locator('.results-summary h2').textContent(), /No elegiste/);
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
    console.log('PASS: cuestionario completo, validación, edición, empates, omisiones, gráfico por teclado, 4 ámbitos, reinicio, organizador CRUD/semanas/privacidad/PDF, navegación y tamaños 360/390/768/1280; sin errores JS/HTTP.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
