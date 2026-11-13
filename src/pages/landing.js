import { html, raw } from '../lib/html.js';
import { createT } from '../lib/i18n.js';
import { assetPath } from '../lib/paths.js';
import { section } from '../components/section.js';
import { header } from '../sections/header.js';
import { hero } from '../sections/hero.js';
import { about } from '../sections/about.js';
import { skills } from '../sections/skills.js';
import { experience } from '../sections/experience.js';
import { projects } from '../sections/projects.js';
import { education } from '../sections/education.js';
import { timeline } from '../sections/timeline.js';
import { contact } from '../sections/contact.js';
import { footer } from '../sections/footer.js';

const SECTIONS = Object.entries({ about, skills, experience, projects, education, timeline, contact });

const NUMBERS = Object.fromEntries(SECTIONS.map(([id], i) => [id, String(i + 1).padStart(2, '0')]));

export const page = (data, lang, { headScript }) => {
  const { meta, seo, ui } = data;
  const i18n = createT(lang);
  const { t } = i18n;
  const asset = (file) => assetPath(meta, file);
  const palettes = Object.keys(ui.palette.names);
  const [defaultPalette] = palettes;

  return html`<!doctype html>
<html lang="${lang}" data-theme="dark" data-palette="${defaultPalette}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark light">
    <script>${raw(headScript.trim().replace('__PALETTES__', JSON.stringify(palettes)))}</script>
    <title>${t(seo.title)}</title>
    <meta name="description" content="${t(seo.description)}">
    <link rel="preload" href="${asset('fonts/manrope.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${asset('fonts/unbounded-700.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${asset('site.css')}">
    <link rel="icon" href="${asset('icons/favicon.svg')}" type="image/svg+xml">
    <script type="module" src="${asset('scripts/main.js')}"></script>
  </head>
  <body>
    ${header(data, { ...i18n, defaultPalette, numbers: NUMBERS })}
    <main id="main">
      ${hero(data, i18n)}
      ${SECTIONS.map(([id, content], i) =>
        section({
          id,
          number: NUMBERS[id],
          title: t(ui.sections[id].title),
          alt: i % 2 === 0,
          content: content(data, i18n),
        }),
      )}
    </main>
    ${footer(data, i18n)}
  </body>
</html>
`;
};
