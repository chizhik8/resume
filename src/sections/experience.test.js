import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { experience } from './experience.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));

const jobs = (lang) =>
  [...String(experience(data, createT(lang))).matchAll(/<article class="job">([\s\S]*?)<\/article>/g)].map(([, job]) => ({
    dates: [...job.matchAll(/<time datetime="([^"]+)">([^<]+)<\/time>/g)].map(([, datetime, text]) => [datetime, text]),
    duration: job.match(/<span class="job__duration">([^<]*)<\/span>/)[1],
    controls: job.match(/aria-controls="([^"]+)"/)[1],
    panel: job.match(/<div class="job__details" id="([^"]+)">/)[1],
    stack: [
      ...job
        .match(/<div class="job__details"[\s\S]*<ul class="job__stack"[^>]*>([\s\S]*?)<\/ul>\s*<\/div>\s*$/)[1]
        .matchAll(/<li class="tag">([^<]+)<\/li>/g),
    ].map(([, item]) => item),
  }));

test('the en jobs show month names and LinkedIn-style durations', () => {
  assert.deepEqual(
    jobs('en').map(({ dates, duration }) => [dates, duration]),
    [
      [[['2023-10', 'Oct 2023'], ['2026-09', 'Sep 2026']], '3 yr'],
      [[['2022-03', 'Mar 2022'], ['2023-10', 'Oct 2023']], '1 yr 8 mo'],
    ],
  );
});

test('the uk jobs show numeric months and LinkedIn-style durations', () => {
  assert.deepEqual(
    jobs('uk').map(({ dates, duration }) => [dates, duration]),
    [
      [[['2023-10', '10.2023'], ['2026-09', '09.2026']], '3 р.'],
      [[['2022-03', '03.2022'], ['2023-10', '10.2023']], '1 р. 8 міс.'],
    ],
  );
});

test('each toggle controls its own job details', () => {
  for (const { controls, panel } of jobs('en')) assert.equal(controls, panel);
});

test('each job details end with its stack tags', () => {
  assert.deepEqual(
    jobs('uk').map(({ stack }) => stack),
    data.work.map(({ stack }) => stack),
  );
});
