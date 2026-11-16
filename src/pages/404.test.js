import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { notFoundPage } from './404.js';
import { pagePath } from '../lib/paths.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const headScript = await readFile(new URL('src/scripts/head.js', root), 'utf8');
const { meta, ui } = data;
const markup = String(notFoundPage(data, { headScript }));

test('the 404 page is not indexed', () => {
  assert.ok(markup.includes('<meta name="robots" content="noindex">'));
  assert.ok(!markup.includes('rel="canonical"'));
});

test('the 404 page has one h1 and a home link for every language', () => {
  assert.equal(markup.match(/<h1\b/g).length, 1);
  const links = [...markup.matchAll(/<a class="button button--primary" href="([^"]+)">([^<]+)<\/a>/g)].map(
    ([, href, text]) => [href, text],
  );
  assert.deepEqual(
    links,
    meta.langs.map((lang) => [pagePath(meta, lang), ui.notFound.home[lang]]),
  );
});

test('the texts of other languages are marked with their lang', () => {
  for (const lang of meta.langs.filter((code) => code !== meta.defaultLang)) {
    assert.ok(markup.includes(`<div class="not-found__block" lang="${lang}">`));
  }
});
