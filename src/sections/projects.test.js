import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projects } from './projects.js';
import { createT } from '../lib/i18n.js';
import { assetPath } from '../lib/paths.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const assets = assetPath(data.meta, '');

const webpWidth = (file) => {
  const chunk = file.toString('latin1', 12, 16);
  if (chunk === 'VP8 ') return file.readUInt16LE(26) & 0x3fff;
  if (chunk === 'VP8L') return (file.readUInt16LE(21) & 0x3fff) + 1;
  if (chunk === 'VP8X') return file.readUIntLE(24, 3) + 1;
  throw new Error(`not a WebP file: ${chunk}`);
};

const cards = (lang) =>
  [...String(projects(data, createT(lang))).matchAll(/<article class="project">([\s\S]*?)<\/article>/g)].map(([, card]) => ({
    images: [
      [card.match(/ src="([^"]+)"/)[1], Number(card.match(/ width="(\d+)"/)[1])],
      ...card
        .match(/srcset="([^"]+)"/)[1]
        .split(', ')
        .map((item) => item.split(' '))
        .map(([path, width]) => [path, parseInt(width, 10)]),
    ],
    link: card
      .match(/<a [^>]*>([\s\S]*?)<\/a>/)[1]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
  }));

test('every project image is a file in src/assets as wide as the markup says', async () => {
  for (const [path, width] of cards('en').flatMap(({ images }) => images)) {
    assert.ok(path.startsWith(assets), path);
    const file = await readFile(new URL(`src/assets/${path.slice(assets.length)}`, root));
    assert.equal(webpWidth(file), width, path);
  }
});

for (const lang of data.meta.langs) {
  test(`each ${lang} site link names its project`, () => {
    const { t } = createT(lang);
    assert.deepEqual(
      cards(lang).map(({ link }) => link),
      data.projects.map(({ name }) => `${t(data.ui.projects.site)} — ${t(name)} ${t(data.ui.newTab)}`),
    );
  });
}
