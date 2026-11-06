import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { about } from './about.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));

for (const lang of data.meta.langs) {
  test(`the ${lang} stat cards keep spaces between their parts`, () => {
    const cards = [...String(about(data, createT(lang))).matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(([, inner]) =>
      inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(),
    );
    assert.deepEqual(
      cards,
      data.about.stats.map(({ value, unit, label }) => `${value} ${unit[lang]} ${label[lang]}`),
    );
  });
}
