import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { timeline } from './timeline.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));

const entries = (lang) =>
  [...String(timeline(data, createT(lang))).matchAll(/<article class="timeline__card">([\s\S]*?)<\/article>/g)].map(
    ([, card]) => [
      card.match(/<span class="visually-hidden">([^<]*)<\/span>/)[1],
      [...card.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time>/g)].map(([, datetime, text]) => [datetime, text]),
    ],
  );

test('the en timeline goes from newest to oldest and names each kind', () => {
  assert.deepEqual(entries('en'), [
    ['Work: ', [['2023-10', 'Oct 2023'], ['2026-09', 'Sep 2026']]],
    ['Work: ', [['2022-03', 'Mar 2022'], ['2023-10', 'Oct 2023']]],
    ['Education: ', [['2021-12', 'Dec 2021'], ['2022-02', 'Feb 2022']]],
    ['Education: ', [['2020-09', 'Sep 2020'], ['2021-07', 'Jul 2021']]],
  ]);
});

test('the uk timeline goes from newest to oldest and names each kind', () => {
  assert.deepEqual(entries('uk'), [
    ['Робота: ', [['2023-10', '10.2023'], ['2026-09', '09.2026']]],
    ['Робота: ', [['2022-03', '03.2022'], ['2023-10', '10.2023']]],
    ['Навчання: ', [['2021-12', '12.2021'], ['2022-02', '02.2022']]],
    ['Навчання: ', [['2020-09', '09.2020'], ['2021-07', '07.2021']]],
  ]);
});
