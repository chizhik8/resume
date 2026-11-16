import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { ICONS, manifest } from './manifest.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const { meta } = data;

test('the manifest takes its names from the data in the default language', () => {
  const { name, short_name, lang, start_url } = manifest(data);
  assert.deepEqual(
    { name, short_name, lang, start_url },
    {
      name: data.seo.title[meta.defaultLang],
      short_name: data.basics.name[meta.defaultLang],
      lang: meta.defaultLang,
      start_url: meta.basePath,
    },
  );
});

test('every manifest icon exists in src/assets', async () => {
  for (const { file } of ICONS) await access(new URL(`src/assets/${file}`, root));
});
