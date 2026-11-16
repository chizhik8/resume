import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { page } from '../src/pages/landing.js';
import { notFoundPage } from '../src/pages/404.js';
import { MANIFEST, manifest } from '../src/lib/manifest.js';
import { langDir } from '../src/lib/paths.js';
import { validate } from '../src/lib/validate.js';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const scripts = new URL('src/scripts/', root);
const prod = process.argv.includes('--prod');

const sectionStyles = (await readdir(new URL('src/styles/sections/', root)))
  .filter((file) => file.endsWith('.css'))
  .sort()
  .map((file) => `sections/${file}`);
const styles = ['palettes.css', 'settings.css', 'base.css', 'layout.css', 'components.css', ...sectionStyles];

const data = JSON.parse(await readFile(new URL('data/resume.json', root), 'utf8'));
const { meta } = data;

const { errors, missing } = validate(data);
if (errors.length > 0) {
  console.error(`data/resume.json has ${errors.length} error(s):`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

const css = await Promise.all(styles.map((file) => readFile(new URL(`src/styles/${file}`, root), 'utf8')));
const headScript = await readFile(new URL('head.js', scripts), 'utf8');
const analytics = prod ? meta.analytics.goatcounter : null;
const pages = meta.langs.map((lang) => ({
  dir: new URL(langDir(meta, lang), dist),
  html: String(page(data, lang, { headScript, analytics })),
}));

await rm(dist, { recursive: true, force: true });
await cp(new URL('src/assets/', root), new URL('assets/', dist), { recursive: true });
await cp(new URL('main.js', scripts), new URL('assets/scripts/main.js', dist));
await cp(new URL('modules/', scripts), new URL('assets/scripts/modules/', dist), {
  recursive: true,
  filter: (source) => !source.endsWith('.test.js'),
});

for (const { dir, html } of pages) {
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), html);
}

await writeFile(new URL('404.html', dist), String(notFoundPage(data, { headScript })));
await writeFile(new URL(MANIFEST, dist), `${JSON.stringify(manifest(data), null, 2)}\n`);
await writeFile(new URL('assets/site.css', dist), css.join('\n'));

console.log(`Built dist/${prod ? ' (production)' : ''}`);
if (prod && !analytics) console.log('meta.analytics.goatcounter is null: no analytics script');

if (missing.length > 0) {
  console.log(`\nNot filled yet in data/resume.json (${missing.length}):`);
  for (const path of missing) console.log(`  ${path}`);
}
