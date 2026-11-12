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
  test(`external links on the ${lang} page open in a new tab and say so`, () => {
    const external = [...pages[lang].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([, attrs]) =>
      attrs.includes('href="https:'),
    );
    assert.ok(external.length > 0);
    for (const [, attrs, inner] of external) {
      assert.ok(attrs.includes('target="_blank"'), attrs);
      assert.ok(inner.includes(`<span class="visually-hidden"> ${data.ui.newTab[lang]}</span>`), inner);
    }
  });

  test(`language links on the ${lang} page`, () => {
    const links = [...pages[lang].matchAll(/<a class="lang-switch__link" href="([^"]*)"[^>]*>/g)].map(([tag, href]) => [
      href,
      tag.includes('aria-current="page"'),
    ]);
    const row = meta.langs.map((code) => [pagePath(meta, code), code === lang]);
    assert.deepEqual(links, [...row, ...row]);
  });

  const ids = [...pages[lang].matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);

  test(`ids on the ${lang} page are unique`, () => {
    assert.deepEqual(
      ids.filter((id, i) => ids.indexOf(id) !== i),
      [],
    );
  });

  test(`aria-labelledby on the ${lang} page points to an existing id`, () => {
    const refs = [...pages[lang].matchAll(/\saria-labelledby="([^"]+)"/g)].flatMap(([, value]) => value.split(/\s+/));
    assert.ok(refs.length > 0);
    for (const ref of refs) assert.equal(ids.filter((id) => id === ref).length, 1, ref);
  });
}
