import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetPath, langDir, pagePath } from './paths.js';

const meta = { basePath: '/resume/', defaultLang: 'en' };

test('default language lives at the base path', () => {
  assert.equal(langDir(meta, 'en'), '');
  assert.equal(pagePath(meta, 'en'), '/resume/');
});

test('other languages live in their own folder', () => {
  assert.equal(langDir(meta, 'uk'), 'uk/');
  assert.equal(pagePath(meta, 'uk'), '/resume/uk/');
});

test('assets are absolute paths with the base', () => {
  assert.equal(assetPath(meta, 'site.css'), '/resume/assets/site.css');
});

test('a custom domain only changes basePath', () => {
  const domain = { ...meta, basePath: '/' };
  assert.equal(pagePath(domain, 'en'), '/');
  assert.equal(pagePath(domain, 'uk'), '/uk/');
  assert.equal(assetPath(domain, 'site.css'), '/assets/site.css');
});
