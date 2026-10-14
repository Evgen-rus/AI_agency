import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.IMPECCABLE_BROWSER });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const errors = [];
await mkdir('.impeccable/review/revenue-os', { recursive: true });
try {
  for (const width of [1536, 1440, 1280, 1242, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1024 },
      reducedMotion: 'reduce',
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/revenue-os/`);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.r-flow').count(), 0);
    assert.equal(await page.locator('.r-flow-arrow').isVisible(), true);
    assert.ok(
      await page
        .locator('.r-recommendation-copy > p')
        .last()
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize) >= 14),
    );
    assert.ok(
      await page
        .locator('.r-table')
        .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize) >= 12),
    );
    if (width <= 900) {
      for (const link of await page.locator('.r-header nav a, .r-other').all())
        assert.ok((await link.boundingBox()).height >= 44);
    }
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll('body *')]
        .filter((element) => element.getBoundingClientRect().right > innerWidth + 1)
        .map((element) => element.className || element.tagName),
    );
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `overflow at ${width}: ${overflowing.join(', ')}`,
    );
    if (width === 1536) await page.screenshot({ path: '.impeccable/review/hero-repro.png' });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `.impeccable/review/revenue-os/${width === 1440 ? 'desktop' : 'mobile'}.png`,
        fullPage: true,
      });
    for (const [index, action] of [
      'Выяснить задачу компании',
      'Уточнить потребность и сроки',
      'Уточнить вопросы к предложению',
      'Согласовать следующий разговор',
    ].entries()) {
      await page.locator('.r-stages button').nth(index).click();
      assert.equal(await page.locator('.r-recommendation h2').textContent(), action);
      assert.equal(await page.locator('.r-stages [aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('#revenue-next').isVisible(), false);
      if (width === 1242 && index === 0)
        await page.screenshot({ path: '.impeccable/review/revenue-os/user-1242.png' });
    }
    await page.getByRole('button', { name: 'Показать шаг', exact: true }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#revenue-next').isVisible(), true);
    for (const [index, title] of [
      'Начните с тех, кому вы нужны.',
      'Узнайте, у кого есть потребность.',
      'Помогите сделке двигаться дальше.',
      'Сначала ваша задача. Затем AI.',
    ].entries()) {
      await page
        .locator(index === 3 ? '.r-custom-choice' : '.r-problem-options button')
        .nth(index === 3 ? 0 : index)
        .click();
      assert.equal(await page.locator('#revenue-product-title').textContent(), title);
      assert.ok(
        await page
          .locator('#revenue-product-title')
          .evaluate((element) => element === document.activeElement),
      );
    }
    const submissions = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') submissions.push(request.url());
    });
    await page.locator('#revenue-task').fill('   ');
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.equal(await page.locator('#revenue-error').isVisible(), true);
    const task = '<script>alert(1)</script> Проверить потерю лидов';
    await page.locator('#revenue-task').fill(task);
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.equal(await page.locator('.r-request-preview > p').first().textContent(), task);
    assert.equal(await page.locator('.r-request-preview script').count(), 0);
    assert.deepEqual(submissions, []);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.equal(await page.locator('#revenue-task').getAttribute('maxlength'), '1500');
    assert.deepEqual(
      await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .filter((link) => !document.getElementById(link.getAttribute('href').slice(1)))
            .map((link) => link.getAttribute('href')),
        ),
      [],
    );
    await page.reload();
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('#revenue-task').inputValue(), '');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS Revenue OS: 6 widths, stages/products, keyboard focus, draft validation/escaping, anchors, no submissions/storage, no overflow/page errors.',
  );
} finally {
  await browser.close();
}
