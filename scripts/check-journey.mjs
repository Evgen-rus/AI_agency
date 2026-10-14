import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: process.env.IMPECCABLE_BROWSER });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const errors = [];
await mkdir('.impeccable/review/sales-journey', { recursive: true });
await mkdir('.impeccable/review/ai-agency', { recursive: true });
try {
  for (const width of [1536, 1440, 1280, 1242, 768, 390, 320]) {
    const page = await browser.newPage({
      viewport: { width, height: 1024 },
      reducedMotion: 'reduce',
    });
    page.on('pageerror', (error) => errors.push(error.message));
    const submissions = [];
    page.on('request', (request) => {
      if (request.method() !== 'GET') submissions.push(request.url());
    });
    await page.goto(`${base}/sales-journey/`);
    await page.locator('h1').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('.j-chapter').count(), 4);
    assert.equal(await page.locator('.j-product').count(), 4);
    assert.equal(
      await page.locator('.j-demo-notice').textContent(),
      'Демонстрационный сценарий · данные вымышлены',
    );
    assert.ok(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `initial overflow ${width}`,
    );
    if (width === 1536) await page.screenshot({ path: '.impeccable/review/hero-repro.png' });
    if ([1440, 390, 1242].includes(width))
      await page.screenshot({
        path: `.impeccable/review/sales-journey/${width === 1440 ? 'desktop' : width === 390 ? 'mobile' : 'user-1242'}.png`,
        fullPage: true,
      });
    if (width === 1440)
      await page.screenshot({ path: '.impeccable/review/desktop.png', fullPage: true });
    if (width === 390)
      await page.screenshot({ path: '.impeccable/review/mobile.png', fullPage: true });
    for (const [index, fragment] of [
      'Интерес ещё',
      'Есть потребность',
      'Предложение отправлено',
      'Следующий шаг согласован',
    ].entries()) {
      await page.locator('.j-rail button').nth(index).focus();
      await page.keyboard.press('Enter');
      assert.ok((await page.locator('.j-scene-title').textContent()).startsWith(fragment));
      assert.equal(await page.locator('.j-rail [aria-pressed="true"]').count(), 1);
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `stage ${index} overflow ${width}`,
      );
    }
    await page.getByRole('button', { name: 'Назад', exact: true }).click();
    assert.ok(
      (await page.locator('.j-scene-title').textContent()).startsWith('Предложение отправлено'),
    );
    await page.getByRole('button', { name: 'Далее: договориться о шаге' }).click();
    assert.ok(
      (await page.locator('.j-scene-title').textContent()).startsWith('Следующий шаг согласован'),
    );
    if (width === 1440) {
      await page.locator('#journey-chapter-1').scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () =>
          document.querySelectorAll('.j-rail button')[1].getAttribute('aria-pressed') === 'true',
      );
    }
    await page.locator('#journey-task').fill('   ');
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.ok(await page.locator('#journey-error').isVisible());
    const task = '<script>alert(1)</script> Помощь менеджерам';
    await page.locator('#journey-task').fill(task);
    await page.getByRole('button', { name: 'Подготовить описание' }).click();
    assert.equal(await page.locator('.j-draft > p').first().textContent(), task);
    assert.equal(await page.locator('.j-draft script').count(), 0);
    assert.deepEqual(submissions, []);
    assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
    assert.equal(await page.locator('#journey-task').getAttribute('maxlength'), '1500');
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
    for (const path of ['/', '/revenue-os/', '/sales-journey/']) {
      await page.goto(`${base}${path}`);
      await page.locator('h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (path === '/' && [1440, 390].includes(width)) {
        await page.screenshot({
          path: `.impeccable/review/ai-agency/${width === 1440 ? 'desktop' : 'mobile'}.png`,
          fullPage: true,
        });
      }
      const navigation = page.getByRole('navigation', { name: 'Сравнить концепции', exact: true });
      assert.equal(await navigation.locator('a').count(), 3);
      assert.equal(
        await navigation.evaluate((element) => getComputedStyle(element).position),
        'relative',
      );
      assert.ok(
        await navigation.locator('a').evaluateAll((links) =>
          links.every((link) => {
            const box = link.getBoundingClientRect();
            return box.left >= 0 && box.right <= innerWidth;
          }),
        ),
        `clipped concept link ${path} ${width}`,
      );
      assert.equal(await navigation.locator('a[aria-current="page"]').getAttribute('href'), path);
      assert.ok(
        await navigation
          .locator('a')
          .evaluateAll((links) => links.every((link) => link.getBoundingClientRect().height >= 44)),
      );
      assert.ok(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `${path} overflow ${width}`,
      );
      const target =
        path === '/' ? '/revenue-os/' : path === '/revenue-os/' ? '/sales-journey/' : '/';
      await navigation.locator(`a[href="${target}"]`).click();
      await page.locator('h1').waitFor();
      assert.equal(new URL(page.url()).pathname, target);
    }
    await page.goto(`${base}/sales-journey/`);
    await page.locator('h1').waitFor();
    assert.equal(await page.locator('#journey-task').inputValue(), '');
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log(
    'PASS Sales Journey: 7 widths; four stages, next/back, keyboard, scroll-driven state; safe local draft; reciprocal navigation across all routes; no overflow/errors/submissions/storage.',
  );
} finally {
  await browser.close();
}
