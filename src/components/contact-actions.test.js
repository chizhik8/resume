import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { contactActions } from './contact-actions.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));
const { meta, basics } = data;

const render = (lang) => String(contactActions(data, createT(lang)));

for (const lang of meta.langs) {
  test(`the ${lang} contact actions copy basics.email`, () => {
    assert.equal(render(lang).match(/data-copy-email="([^"]+)"/)[1], basics.email);
  });

  test(`the ${lang} contact actions link the profiles, then the ${lang} PDF`, () => {
    const links = [...render(lang).matchAll(/<a\b[^>]*href="([^"]+)"([^>]*)>/g)].map(([, href, rest]) => [href, rest.includes(' download')]);
    assert.deepEqual(links, [...basics.profiles.map(({ url }) => [url, false]), [meta.basePath + meta.pdf[lang], true]]);
  });
}
