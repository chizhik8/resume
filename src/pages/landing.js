import { html, raw } from '../lib/html.js';
import { createT } from '../lib/i18n.js';
import { assetPath } from '../lib/paths.js';
import { section } from '../components/section.js';
import { header } from '../sections/header.js';

const SECTIONS = ['about', 'skills', 'experience', 'projects', 'education', 'timeline', 'contact'];

export const page = (data, lang, { headScript }) => {
  const { meta, seo, basics, ui } = data;
  const { t } = createT(lang);
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
    ${header(data, { lang, t, defaultPalette })}
    <main id="main">
      <section id="top" class="section" aria-labelledby="top-title">
        <div class="container">
          <h1 id="top-title">${t(basics.name)}</h1>
        </div>
      </section>
      ${SECTIONS.map((id, i) =>
        section({
          id,
          eyebrow: ui.sections[id].eyebrow,
          title: t(ui.sections[id].title),
          alt: i % 2 === 0,
        }),
      )}
    </main>
  </body>
</html>
`;
};
