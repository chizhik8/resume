import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMonth, formatYear, isDate } from './dates.js';

test('A date is YYYY-MM or YYYY-MM-DD with year 19xx or 20xx, month 01–12 and day 01–31', () => {
  assert.equal(isDate('2023-10'), true);
  assert.equal(isDate('2026-10-19'), true);
  for (const value of [
    '2023',
    '2026/10',
    '2023-13',
    '2024-1',
    '2026-10-00',
    '2026-10-32',
    '0026-10',
    ['2026-10-19'],
    202310,
  ]) {
    assert.equal(isDate(value), false, JSON.stringify(value));
  }
});

test('The year is taken from a month or a full date', () => {
  assert.equal(formatYear('2023-10'), '2023');
  assert.equal(formatYear('2026-01-19'), '2026');
});

test('English dates show the short month name and the year', () => {
  assert.equal(formatMonth('2023-10', 'en'), 'Oct 2023');
  assert.equal(formatMonth('2026-01-19', 'en'), 'Jan 2026');
});

test('Ukrainian dates show the month number and the year', () => {
  assert.equal(formatMonth('2023-10', 'uk'), '10.2023');
  assert.equal(formatMonth('2026-01-19', 'uk'), '01.2026');
});
