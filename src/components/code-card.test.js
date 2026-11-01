import { test } from 'node:test';
import assert from 'node:assert/strict';
import { codeCard } from './code-card.js';

const fields = { role: 'A & "B"', stack: ['React', 'Next.js'], languages: 3, openToWork: true };
const card = String(codeCard(fields));

test('codeCard reads as the JSON of its fields', () => {
  const text = card
    .replace(/<\/(div|p)>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('{') || line.startsWith('"') || line.startsWith('}'));
  assert.deepEqual(text, [
    '{',
    '"role": "A & \\"B\\"",',
    '"stack": ["React", "Next.js"],',
    '"languages": 3,',
    '"openToWork": true',
    '}',
  ]);
});

test('codeCard colours keys, strings and literals', () => {
  assert.match(card, /<span class="code-card__key">&quot;role&quot;<\/span>/);
  assert.match(card, /<span class="code-card__string">&quot;Next.js&quot;<\/span>/);
  assert.match(card, /<span class="code-card__literal">3<\/span>/);
  assert.match(card, /<span class="code-card__literal">true<\/span>/);
});
