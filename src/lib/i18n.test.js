import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createT, MISSING } from './i18n.js';

const { t } = createT('uk');

test('t picks the language from a { en, uk } object', () => {
  assert.equal(t({ en: 'About', uk: 'Про мене' }), 'Про мене');
});

test('t returns plain strings as is', () => {
  assert.equal(t('React'), 'React');
});

test('t shows the missing marker for null', () => {
  assert.equal(t(null), MISSING);
  assert.equal(t({ en: 'x', uk: null }), MISSING);
});

test('t fills {placeholders} and keeps unknown ones', () => {
  assert.equal(t({ uk: '{name}, на початок {x}' }, { name: 'Юлія' }), 'Юлія, на початок {x}');
});

test('t keeps placeholders named after Object.prototype keys', () => {
  assert.equal(t('{constructor} {toString}'), '{constructor} {toString}');
});

test('plural shows the missing marker when the language is missing', () => {
  const { plural } = createT('uk');
  assert.equal(plural({ en: { one: '{n} group', other: '{n} groups' } }, 2), MISSING);
  assert.equal(plural({ en: { other: 'x' }, uk: null }, 2), MISSING);
  assert.equal(plural(null, 2), MISSING);
});

test('plural uses Ukrainian forms', () => {
  const { plural } = createT('uk');
  const forms = { uk: { one: '{n} група', few: '{n} групи', many: '{n} груп', other: '{n} групи' } };
  assert.equal(plural(forms, 1), '1 група');
  assert.equal(plural(forms, 4), '4 групи');
  assert.equal(plural(forms, 5), '5 груп');
  assert.equal(plural(forms, 0), '0 груп');
  assert.equal(plural(forms, 11), '11 груп');
  assert.equal(plural(forms, 21), '21 група');
  assert.equal(plural(forms, 22), '22 групи');
  assert.equal(plural(forms, 25), '25 груп');
});

test('plural falls back to "other" when a form is missing', () => {
  const { plural } = createT('uk');
  const forms = { uk: { one: '{n} група', other: '{n} груп(и)' } };
  assert.equal(plural(forms, 1), '1 група');
  assert.equal(plural(forms, 4), '4 груп(и)');
  assert.equal(plural(forms, 5), '5 груп(и)');
});

test('plural uses English forms', () => {
  const { plural } = createT('en');
  const forms = { en: { one: '{n} group', other: '{n} groups' } };
  assert.equal(plural(forms, 1), '1 group');
  assert.equal(plural(forms, 4), '4 groups');
});
