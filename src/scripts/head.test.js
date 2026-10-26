import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { page } from '../pages/landing.js';

const root = new URL('../../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const headScript = await readFile(new URL('src/scripts/head.js', root), 'utf8');
const html = String(page(data, 'en', { headScript }));
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const initial = html.match(/data-palette="([^"]+)"/)[1];
const other = Object.keys(data.ui.palette.names).find((name) => name !== initial);

const run = ({ stored = {}, system = 'dark', blocked = false }) => {
  const dataset = { palette: initial };
  const sessionStorage = {
    getItem: (key) => {
      if (blocked) throw new Error('blocked');
      return stored[key] ?? null;
    },
  };
  const matchMedia = (query) => ({ matches: query === '(prefers-color-scheme: light)' && system === 'light' });
  runInNewContext(script, { document: { documentElement: { dataset } }, sessionStorage, matchMedia });
  return dataset;
};

const cases = [
  ['a stored light theme wins over the system', { stored: { 'resume:theme': 'light' } }, { theme: 'light' }],
  ['a stored dark theme wins over the system', { stored: { 'resume:theme': 'dark' }, system: 'light' }, {}],
  ['no stored theme gives the system theme', {}, {}],
  ['an empty theme gives the system theme', { stored: { 'resume:theme': '' }, system: 'light' }, { theme: 'light' }],
  ['an unknown theme gives the system theme', { stored: { 'resume:theme': 'blue' }, system: 'light' }, { theme: 'light' }],
  ['a known palette is applied', { stored: { 'resume:palette': other } }, { palette: other }],
  ['an empty palette keeps the initial one', { stored: { 'resume:palette': '' } }, {}],
  ['an unknown palette keeps the initial one', { stored: { 'resume:palette': 'old' } }, {}],
  ['a stored open menu is marked', { stored: { 'resume:menu': 'open' } }, { menuOpen: '' }],
  ['a stored closed menu is not marked', { stored: { 'resume:menu': 'closed' } }, {}],
  ['blocked storage gives the system theme and the initial palette', { blocked: true, system: 'light' }, { theme: 'light' }],
];

for (const [name, input, changes] of cases) {
  test(`head script: ${name}`, () => {
    assert.deepEqual(run(input), { js: '', theme: 'dark', palette: initial, ...changes });
  });
}
