import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

// QA uses the host's existing Playwright/browser; it is not shipped with the site.
const browser = await chromium.launch({ executablePath: process.env.IMPECCABLE_BROWSER });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
await mkdir('.impeccable/review', { recursive: true });
const errors = [];
try {
  for (const width of [1536, 1440, 1280, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1024 },
      reducedMotion: 'reduce',
    });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      `overflow at ${width}`,
    );
    if (width === 1536) await page.screenshot({ path: '.impeccable/review/hero-repro.png' });
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: `.impeccable/review/${width === 1440 ? 'desktop' : 'mobile'}.png`,
        fullPage: true,
      });
    for (const [index, title] of [
      'Начните с тех, кому вы нужны.',
      'Узнайте, у кого есть потребность.',
      'Помогите сделке двигаться дальше.',
      'Сначала ваша задача. Затем AI.',
    ].entries()) {
      await page.locator('.product').nth(index).click();
      assert.equal(await page.locator('#solution-title').textContent(), title);
      assert.equal(await page.locator('.product[aria-pressed="true"]').count(), 1);
      assert.equal(await page.locator('#next-step').isVisible(), false);
    }
    await page.getByRole('button', { name: 'Показать следующий шаг' }).focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#next-step').isVisible(), true);
    const submissions = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') submissions.push(request.url());
    });
    await page.locator('#task').fill('   ');
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.equal(await page.locator('#task-error').isVisible(), true);
    const task = '<script>alert(1)</script> Проверить потерю лидов';
    await page.locator('#task').fill(task);
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.equal(await page.locator('.request-preview > p').first().textContent(), task);
    assert.equal(await page.locator('.request-preview script').count(), 0);
    assert.deepEqual(submissions, []);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.equal(await page.locator('#task').getAttribute('maxlength'), '1500');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS: 5 widths, product selection, keyboard, validation, escaped preview, no submissions/storage, no page errors.',
  );
} finally {
  await browser.close();
}
