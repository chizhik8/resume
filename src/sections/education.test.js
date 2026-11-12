import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { education } from './education.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));

const render = (lang) => String(education(data, createT(lang)));

const periods = (lang) =>
  [...render(lang).matchAll(/<li class="education__item">([\s\S]*?)<\/li>/g)].map(([, item]) =>
    [...item.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time>/g)].map(([, datetime, text]) => [datetime, text]),
  );

const languages = (lang) =>
  [...render(lang).matchAll(/<div class="languages__item">([\s\S]*?)<\/div>/g)].map(([, item]) => ({
    level: item.match(/style="--level: ([^"]+)"/)[1],
    cefr: item.match(/<span class="languages__cefr">([^<]*)<\/span>/)?.[1],
  }));

test('the en education periods show month names', () => {
  assert.deepEqual(periods('en'), [
    [['2021-12', 'Dec 2021'], ['2022-02', 'Feb 2022']],
    [['2020-09', 'Sep 2020'], ['2021-07', 'Jul 2021']],
  ]);
});

test('the uk education periods show numeric months', () => {
  assert.deepEqual(periods('uk'), [
    [['2021-12', '12.2021'], ['2022-02', '02.2022']],
    [['2020-09', '09.2020'], ['2021-07', '07.2021']],
  ]);
});

test('the language bars take their width from the data', () => {
  assert.deepEqual(
    languages('en').map(({ level }) => level),
    data.languages.map(({ level }) => `${level}%`),
  );
});

test('the languages show a CEFR level only where the data has one', () => {
  assert.deepEqual(
    languages('en').map(({ cefr }) => cefr),
    data.languages.map(({ cefr }) => cefr && `[${cefr}]`),
  );
});
