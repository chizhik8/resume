import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escape, html, raw } from './html.js';

test('escape replaces HTML special characters', () => {
  assert.equal(escape(`<a href="x">Tom & Jerry's</a>`), '&lt;a href=&quot;x&quot;&gt;Tom &amp; Jerry&#39;s&lt;/a&gt;');
});

test('html escapes values from data', () => {
  assert.equal(String(html`<p>${'<script>'}</p>`), '<p>&lt;script&gt;</p>');
});

test('html does not escape nested templates twice', () => {
  const item = html`<li>${'a & b'}</li>`;
  assert.equal(String(html`<ul>${item}</ul>`), '<ul><li>a &amp; b</li></ul>');
});

test('html joins arrays and skips null, undefined and false', () => {
  const items = ['a', 'b'].map((x) => html`<li>${x}</li>`);
  assert.equal(String(html`<ul>${items}${null}${undefined}${false}</ul>`), '<ul><li>a</li><li>b</li></ul>');
});

test('html escapes plain strings inside arrays', () => {
  assert.equal(String(html`<p>${['<b>', 'a & b']}</p>`), '<p>&lt;b&gt;a &amp; b</p>');
});

test('html keeps the number 0', () => {
  assert.equal(String(html`<span>${0}</span>`), '<span>0</span>');
});

test('raw inserts trusted markup as is', () => {
  assert.equal(String(html`<span>${raw('<svg></svg>')}</span>`), '<span><svg></svg></span>');
});
