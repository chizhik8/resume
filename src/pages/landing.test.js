import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { page } from './landing.js';
import { assetPath, pagePath, pageUrl } from '../lib/paths.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const headScript = await readFile(new URL('src/scripts/head.js', root), 'utf8');
const { meta } = data;
const palettes = Object.keys(data.ui.palette.names);
const pages = Object.fromEntries(meta.langs.map((lang) => [lang, String(page(data, lang, { headScript }))]));
const head = (markup) => markup.slice(markup.indexOf('<head>'), markup.indexOf('</head>'));
const metaContent = (markup, property) =>
  markup.match(new RegExp(`<meta property="${property}" content="([^"]*)">`))?.[1];

test('the first palette is the default in the markup', () => {
  assert.ok(pages.en.includes(`data-palette="${palettes[0]}"`));
});

test('the analytics script is added only when a GoatCounter code is passed', () => {
  assert.ok(!pages.en.includes('goatcounter.com'));
  const withCode = String(page(data, 'en', { headScript, analytics: 'example' }));
  assert.ok(withCode.includes('data-goatcounter="https://example.goatcounter.com/count"'));
});

for (const lang of meta.langs) {
  test(`every local file in the ${lang} head exists in src/assets`, async () => {
    const assets = new URL('src/assets/', root);
    const prefix = assetPath(meta, '');
    const urls = [...head(pages[lang]).matchAll(/(?:href|src|content)="([^"]+)"/g)]
      .map(([, value]) => value.replace(meta.siteUrl, ''))
      .filter((value) => value.startsWith(prefix) && !/\.(css|js)$/.test(value));
    assert.ok(urls.length > 0);
    for (const url of urls) await access(new URL(url.slice(prefix.length), assets));
  });

  test(`canonical, hreflang and og:url on the ${lang} page`, () => {
    const markup = head(pages[lang]);
    assert.equal(markup.match(/<link rel="canonical" href="([^"]+)">/)[1], pageUrl(meta, lang));
    assert.equal(metaContent(markup, 'og:url'), pageUrl(meta, lang));
    const alternates = [...markup.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)].map(
      ([, code, href]) => [code, href],
    );
    assert.deepEqual(alternates, [
      ...meta.langs.map((code) => [code, pageUrl(meta, code)]),
      ['x-default', pageUrl(meta, meta.defaultLang)],
    ]);
    assert.equal(metaContent(markup, 'og:locale'), meta.locales[lang]);
  });

  test(`JSON-LD on the ${lang} page describes the person`, () => {
    const [, ld] = pages[lang].match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    const person = JSON.parse(ld);
    assert.equal(person['@type'], 'Person');
    assert.equal(person.name, data.basics.name[lang]);
    assert.equal(person.url, pageUrl(meta, lang));
    assert.deepEqual(
      person.sameAs,
      data.basics.profiles.map(({ url }) => url),
    );
  });

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
