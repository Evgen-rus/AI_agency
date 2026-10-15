import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const output = '.impeccable/review/director-reference';
const browser = await chromium.launch({ executablePath: process.env.IMPECCABLE_BROWSER });
const failures = [];
const measurements = [];
await mkdir(output, { recursive: true });

try {
  for (const route of ['agency', 'neurorop']) {
    for (const width of [320, 390, 768, 1024, 1280, 1440, 1536]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        reducedMotion: 'reduce',
      });
      const writes = [];
      page.on('pageerror', (error) => failures.push(`${route}/${width}: ${error.message}`));
      page.on('request', (request) => {
        if (!['GET', 'HEAD'].includes(request.method())) writes.push(request.url());
      });
      page.on('response', (response) => {
        if (response.status() >= 400) failures.push(`${response.status()}: ${response.url()}`);
      });
      await page.goto(`${base}/${route}/`);
      await page.locator('h1').waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page
        .locator('img')
        .evaluateAll((images) => Promise.all(images.map((image) => image.decode())));
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('a a').count(), 0);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        true,
        `${route}: overflow at ${width}`,
      );
      const brokenAnchors = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .map((link) => link.hash)
            .filter((hash) => !document.getElementById(decodeURIComponent(hash.slice(1)))),
        );
      assert.deepEqual(brokenAnchors, [], `${route}: missing anchor targets`);
      const legacyLinks = await page
        .locator('a[href*="revenue-os"], a[href*="sales-journey"]')
        .count();
      assert.equal(legacyLinks, 0, `${route}: links to removed routes`);
      if (width === 1440 || width === 390) {
        const contrast = await page.evaluate(() => {
          function luminance(color) {
            const channels = color
              .match(/[\d.]+/g)
              .slice(0, 3)
              .map(Number)
              .map((value) => {
                const channel = value / 255;
                return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
              });
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
          }
          const paper = getComputedStyle(document.querySelector('.brand-site')).backgroundColor;
          return [
            ['body', getComputedStyle(document.querySelector('.brand-intro')).color, paper],
            [
              'header action',
              getComputedStyle(document.querySelector('.brand-header-cta')).color,
              getComputedStyle(document.querySelector('.brand-header-cta')).backgroundColor,
            ],
            [
              'form hint',
              getComputedStyle(document.querySelector('.brand-form-hint')).color,
              getComputedStyle(document.querySelector('.brand-contact-form')).backgroundColor,
            ],
            [
              'placeholder',
              getComputedStyle(document.querySelector('input'), '::placeholder').color,
              getComputedStyle(document.querySelector('input')).backgroundColor,
            ],
            ['product button top', 'rgb(255, 255, 255)', 'rgb(22, 115, 206)'],
            ['product button bottom', 'rgb(255, 255, 255)', 'rgb(12, 85, 160)'],
          ].map(([name, foreground, background]) => {
            const l1 = luminance(foreground);
            const l2 = luminance(background);
            return { name, ratio: (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) };
          });
        });
        for (const sample of contrast)
          assert.ok(sample.ratio >= 4.5, `${route}: ${sample.name} contrast ${sample.ratio}`);
      }
      measurements.push(
        await page.evaluate(
          ({ route, width }) => ({
            route,
            width,
            h1: getComputedStyle(document.querySelector('h1')).fontSize,
            height: document.documentElement.scrollHeight,
            contactVisible: Boolean(document.querySelector('#contact')),
            overflow: document.documentElement.scrollWidth - innerWidth,
          }),
          { route, width },
        ),
      );

      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `${output}/${route}-${width}-hero.png` });
        await page.screenshot({ path: `${output}/${route}-${width}-full.png`, fullPage: true });
        if (route === 'agency')
          await page
            .locator('.agency-mosaic')
            .screenshot({ path: `${output}/mosaic-${width}.png` });
        else
          await page
            .locator('.neuro-process')
            .screenshot({ path: `${output}/process-${width}.png` });
      }
      if (width < 768) {
        const menu = page.getByRole('button', { name: 'Меню', exact: true });
        const nav = page.locator('.brand-nav');
        assert.equal(await nav.isVisible(), false);
        await menu.focus();
        await page.keyboard.press('Enter');
        assert.equal(await nav.isVisible(), true);
        await page.keyboard.press('Escape');
        assert.equal(await nav.isVisible(), false);
        assert.equal(await menu.evaluate((element) => element === document.activeElement), true);
        await menu.click();
        await nav.locator('a').first().click();
        assert.equal(await nav.isVisible(), false);
      }
      if (route === 'agency') {
        assert.equal(await page.locator('.agency-product').count(), 4);
        assert.equal(await page.locator('.agency-product-2').getAttribute('href'), '/neurorop/');
        assert.equal(
          await page
            .locator('.agency-floating-ui')
            .evaluate((element) => getComputedStyle(element).animationName),
          'none',
        );
        if (width === 1440) {
          const hero = await page.locator('.agency-hero').boundingBox();
          const products = await page.locator('#products').boundingBox();
          assert.ok(products.y >= hero.y + hero.height - 1, 'Product mosaic must follow the hero');
        }
      } else {
        assert.equal(await page.locator('.neuro-process-card').count(), 4);
        const stageTops = await page
          .locator('.neuro-process-card')
          .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));
        if (width >= 768)
          assert.ok(
            stageTops.every((top, index) => index === 0 || top < stageTops[index - 1]),
            'Process must ascend',
          );
        else
          assert.ok(
            stageTops.every((top, index) => index === 0 || top > stageTops[index - 1]),
            'Mobile process must read top to bottom',
          );
        const choices = page.locator('.neuro-situation-buttons button');
        for (const [index, text] of [
          'Связаться с клиентом',
          'Уточнить, актуальна ли задача',
          'Подготовить ответ на вопрос клиента',
        ].entries()) {
          await choices.nth(index).focus();
          await page.keyboard.press('Enter');
          assert.equal(await choices.nth(index).getAttribute('aria-pressed'), 'true');
          assert.ok((await page.locator('.neuro-recommendation').textContent()).includes(text));
          assert.equal(
            await page.locator('.neuro-situation-buttons [aria-pressed="true"]').count(),
            1,
          );
        }
        await page.getByRole('button', { name: 'Для менеджера', exact: true }).click();
        assert.match(await page.locator('#role-detail').textContent(), /Вернуться в сделку/);
        await page.getByRole('button', { name: 'Для РОПа', exact: true }).click();
        assert.match(await page.locator('#role-detail').textContent(), /Увидеть, где команда/);
        const question = page.locator('.neuro-faq summary').first();
        await question.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('.neuro-faq details').first().getAttribute('open'), '');
      }
      const submit = page.getByRole('button', { name: 'Подготовить обращение', exact: true });
      await submit.click();
      assert.equal(await page.locator('.brand-field-error').count(), 3);
      await page.locator('[name="name"]').fill('   ');
      await page.locator('[name="contact"]').fill('   ');
      await page.locator('[name="task"]').fill('   ');
      await submit.click();
      assert.equal(await page.locator('.brand-field-error').count(), 3);
      await page.locator('[name="name"]').fill('Тест');
      await page.locator('[name="contact"]').fill('test@example.invalid');
      const injection = '<script>alert(1)</script> Проверить процесс';
      await page.locator('[name="task"]').fill(injection);
      await submit.click();
      assert.equal(await page.locator('.brand-field-error').count(), 0);
      assert.ok((await page.locator('.brand-draft').textContent()).includes(injection));
      assert.equal(await page.locator('.brand-draft script').count(), 0);
      await page.locator('[name="task"]').fill('Новая задача');
      assert.equal(await page.locator('.brand-draft').count(), 0);
      assert.deepEqual(writes, []);
      assert.equal(await page.evaluate(() => localStorage.length + sessionStorage.length), 0);
      await page.reload();
      assert.equal(await page.locator('[name="task"]').inputValue(), '');
      await page.close();
    }
  }
  const page = await browser.newPage();
  await page.goto(`${base}/agency/`);
  await page.locator('.agency-product-2').click();
  assert.equal(new URL(page.url()).pathname, '/neurorop/');
  await page.locator('.brand-header .brand-wordmark').click();
  assert.equal(new URL(page.url()).pathname, '/agency/');
  await page.close();

  // Root HTML redirects to /agency/, preserving query and hash via a replacement navigation.
  const redirect = await browser.newPage();
  await redirect.goto(`${base}/agency/?start=1`);
  const depth = await redirect.evaluate(() => history.length);
  await redirect.goto(`${base}/?from=root#stay`);
  await redirect.locator('.agency-product-2').waitFor();
  assert.equal(new URL(redirect.url()).pathname, '/agency/');
  assert.equal(new URL(redirect.url()).search, '?from=root');
  assert.equal(new URL(redirect.url()).hash, '#stay');
  assert.equal(
    await redirect.evaluate(() => history.length),
    depth + 1,
    'root redirect must replace, not stack, history',
  );
  await redirect.close();

  // Removed and unknown paths must not resolve to either page.
  for (const path of ['/revenue-os/', '/sales-journey/', '/not-a-page/']) {
    const missing = await browser.newPage();
    await missing.goto(`${base}${path}`);
    assert.equal(new URL(missing.url()).pathname, path, `${path}: must not redirect`);
    assert.equal(await missing.locator('.agency-product').count(), 0, `${path}: agency visible`);
    assert.equal(await missing.locator('.neuro-process-card').count(), 0, `${path}: neuro visible`);
    assert.match(await missing.locator('body').innerText(), /404/, `${path}: missing 404`);
    assert.equal(
      (await missing.locator('a[href="/agency/"]').count()) >= 1,
      true,
      `${path}: no home link`,
    );
    await missing.close();
  }

  // The build must no longer contain the removed entries or their bundles.
  assert.equal(existsSync('dist/revenue-os'), false, 'dist/revenue-os must be removed');
  assert.equal(existsSync('dist/sales-journey'), false, 'dist/sales-journey must be removed');
  const chunks = await readdir('dist/assets');
  assert.deepEqual(
    chunks.filter((name) => /revenue|journey|concept/i.test(name)),
    [],
    'obsolete concept chunks in dist/assets',
  );

  assert.deepEqual(failures, []);
  await writeFile(`${output}/measurements.json`, JSON.stringify(measurements, null, 2));
  console.log(
    'PASS: agency + NeuroROP, 7 widths, reciprocal links, anchors, ascending/vertical process, keyboard/menu/FAQ, demo/roles, validation, escaped draft, no writes/storage, clean reload, reduced motion, no browser/HTTP errors; root redirect with query/hash and replaced history; unknown and removed routes show 404; removed entries absent from dist.',
  );
} finally {
  await browser.close();
}
