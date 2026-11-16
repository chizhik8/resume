import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assetPath, assetUrl, langDir, pagePath, pageUrl, rootFilePath } from './paths.js';

const meta = { siteUrl: 'https://chizhik8.github.io', basePath: '/resume/', defaultLang: 'en' };

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

test('files in the site root are absolute paths with the base', () => {
  assert.equal(rootFilePath(meta, 'CV.pdf'), '/resume/CV.pdf');
});

test('full URLs are siteUrl plus the path', () => {
  assert.equal(pageUrl(meta, 'en'), 'https://chizhik8.github.io/resume/');
  assert.equal(pageUrl(meta, 'uk'), 'https://chizhik8.github.io/resume/uk/');
  assert.equal(assetUrl(meta, 'og.png'), 'https://chizhik8.github.io/resume/assets/og.png');
});

test('a custom domain only changes basePath and siteUrl', () => {
  const domain = { ...meta, siteUrl: 'https://example.com', basePath: '/' };
  assert.equal(pagePath(domain, 'en'), '/');
  assert.equal(pagePath(domain, 'uk'), '/uk/');
  assert.equal(assetPath(domain, 'site.css'), '/assets/site.css');
  assert.equal(rootFilePath(domain, 'CV.pdf'), '/CV.pdf');
  assert.equal(pageUrl(domain, 'uk'), 'https://example.com/uk/');
});
