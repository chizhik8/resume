import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hero } from './hero.js';
import { createT } from '../lib/i18n.js';

const data = JSON.parse(await readFile(new URL('../../data/resume.json', import.meta.url), 'utf8'));
const { meta } = data;
const heroMarkup = (lang, source = data) => String(hero(source, createT(lang)));

test('the open-to-work badge follows basics.openToWork', () => {
  const badge = 'class="hero__badge hero__badge--status"';
  assert.ok(heroMarkup('en').includes(badge));
  const closed = { ...data, basics: { ...data.basics, openToWork: false } };
  assert.ok(!heroMarkup('en', closed).includes(badge));
});

test('the hero headline renders **…** as <strong>', () => {
  const marked = { ...data, basics: { ...data.basics, headline: { en: 'Build with **React**', uk: 'На **React**' } } };
  assert.ok(heroMarkup('en', marked).includes('<strong>React</strong>'));
});

for (const lang of meta.langs) {
  test(`the ${lang} h1 keeps the space between the names`, () => {
    const [, inner] = heroMarkup(lang).match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    assert.ok(inner.includes('<br>'), inner);
    assert.equal(inner.replace(/<[^>]+>/g, ''), data.basics.name[lang]);
  });

  test(`hero links on the ${lang} page`, () => {
    const links = [...heroMarkup(lang).matchAll(/<a class="([^"]*)" href="([^"]*)"([^>]*)>/g)].map(
      ([, className, href, rest]) => [className, href, rest.includes(' download')],
    );
    assert.deepEqual(links, [
      ['button button--primary', `mailto:${data.basics.email}`, false],
      ['button button--outline', meta.basePath + meta.pdf[lang], true],
      ...data.basics.profiles.map(({ url }) => ['button button--compact profiles__link', url, false]),
    ]);
  });
}
