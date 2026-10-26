import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { page } from './landing.js';
import { pagePath } from '../lib/paths.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const headScript = await readFile(new URL('src/scripts/head.js', root), 'utf8');
const { meta } = data;
const palettes = Object.keys(data.ui.palette.names);
const pages = Object.fromEntries(meta.langs.map((lang) => [lang, String(page(data, lang, { headScript }))]));

test('the first palette is the default in the markup', () => {
  assert.ok(pages.en.includes(`data-palette="${palettes[0]}"`));
});

for (const lang of meta.langs) {
  test(`language links on the ${lang} page`, () => {
    const links = [...pages[lang].matchAll(/<a class="lang-switch__link" href="([^"]*)"[^>]*>/g)].map(([tag, href]) => [
      href,
      tag.includes('aria-current="page"'),
    ]);
    const row = meta.langs.map((code) => [pagePath(meta, code), code === lang]);
    assert.deepEqual(links, [...row, ...row]);
  });
}
