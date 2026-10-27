import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validate } from './validate.js';

const meta = { langs: ['en', 'uk'], updated: '2026-10-19', repo: 'https://github.com/x/y' };

test('valid data has no errors and no missing fields', () => {
  const result = validate({ meta, basics: { name: { en: 'Yuliia', uk: 'Юлія' } }, projects: [] });
  assert.deepEqual(result, { errors: [], missing: [] });
});

test('a text without one of the languages is an error', () => {
  const { errors } = validate({ meta, basics: { name: { en: 'Yuliia' } } });
  assert.deepEqual(errors, ['basics.name: no "uk" text']);
});

test('a text with null in one language is an error', () => {
  const { errors } = validate({ meta, basics: { name: { en: 'Yuliia', uk: null } } });
  assert.deepEqual(errors, ['basics.name: no "uk" text']);
});

test('empty and whitespace-only texts are errors', () => {
  const { errors } = validate({ meta, basics: { name: { en: '', uk: '   ' } } });
  assert.deepEqual(errors, ['basics.name: no "en" text', 'basics.name: no "uk" text']);
});

test('a typo in the language code is an error', () => {
  const { errors } = validate({ meta, basics: { name: { en: 'Yuliia', ua: 'Юлія' } } });
  assert.deepEqual(errors, ['basics.name: no "uk" text', 'basics.name: unknown language "ua"']);
});

test('an empty object is an error', () => {
  const { errors } = validate({ meta, basics: { name: {} } });
  assert.deepEqual(errors, ['basics.name: empty object']);
});

test('plural forms count as a text in both languages', () => {
  const { errors } = validate({
    meta,
    ui: { more: { en: { one: '{n} group', other: '{n} groups' }, uk: { other: '{n} групи' } } },
  });
  assert.deepEqual(errors, []);
});

test('null fields and […] markers are listed as missing', () => {
  const { errors, missing } = validate({
    meta,
    basics: { profiles: [{ network: 'GitHub', url: null }] },
    work: [{ highlights: [{ en: 'Shipped [… features]', uk: 'Фічі [… за рік]' }] }],
  });
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, [
    'basics.profiles[0].url',
    'work[0].highlights[0].en',
    'work[0].highlights[0].uk',
  ]);
});

test('the ui.missing marker itself is not listed', () => {
  const { missing } = validate({ meta, ui: { missing: { en: '[…]', uk: '[…]' } } });
  assert.deepEqual(missing, []);
});

test('only https: and mailto: links are allowed', () => {
  const { errors } = validate({
    meta,
    basics: {
      profiles: [
        { url: 'https://github.com/x' },
        { url: 'mailto:a@b.c' },
        { url: 'javascript:alert(1)' },
        { url: 'http://example.com' },
      ],
    },
  });
  assert.deepEqual(errors, [
    'basics.profiles[2].url: only https: and mailto: links are allowed, got "javascript:alert(1)"',
    'basics.profiles[3].url: only https: and mailto: links are allowed, got "http://example.com"',
  ]);
});

test('updated, startDate and endDate are checked as dates', () => {
  const { errors, missing } = validate({
    meta: { ...meta, updated: '2026/10' },
    work: [
      { startDate: '2026/10', endDate: '2026/10' },
      { startDate: '2023-10', endDate: null },
    ],
  });
  assert.deepEqual(errors, [
    'meta.updated: dates must be YYYY-MM or YYYY-MM-DD, got "2026/10"',
    'work[0].startDate: dates must be YYYY-MM or YYYY-MM-DD, got "2026/10"',
    'work[0].endDate: dates must be YYYY-MM or YYYY-MM-DD, got "2026/10"',
  ]);
  assert.deepEqual(missing, ['work[1].endDate']);
});

test('a date that is not a string is an error, a localized label is not', () => {
  const { errors } = validate({
    meta,
    work: [{ startDate: 202310, endDate: { year: 2026 } }],
    ui: { footer: { updated: { en: 'Updated {date}', uk: 'Оновлено {date}' } } },
  });
  assert.deepEqual(errors, [
    'work[0].startDate: dates must be YYYY-MM or YYYY-MM-DD, got 202310',
    'work[0].endDate: dates must be YYYY-MM or YYYY-MM-DD, got {"year":2026}',
  ]);
});

test('meta.updated and meta.repo are required', () => {
  const { errors } = validate({ meta: { ...meta, updated: null, repo: undefined } });
  assert.deepEqual(errors, ['meta.updated: required', 'meta.repo: required']);
});

test('every project needs imageAlt in both languages', () => {
  const { errors } = validate({
    meta,
    projects: [{ imageAlt: { en: 'Screenshot', uk: 'Скріншот' } }, { imageAlt: null }, {}],
  });
  assert.deepEqual(errors, [
    'projects[2]: empty object',
    'projects[1].imageAlt: required for every project',
    'projects[2].imageAlt: required for every project',
  ]);
});

test('an empty imageAlt is an error', () => {
  const { errors } = validate({ meta, projects: [{ imageAlt: { en: '', uk: '' } }] });
  assert.deepEqual(errors, [
    'projects[0].imageAlt: no "en" text',
    'projects[0].imageAlt: no "uk" text',
  ]);
});
