import { html, json, raw } from '../lib/html.js';
import { assetPath, rootFilePath } from '../lib/paths.js';
import { MANIFEST } from '../lib/manifest.js';

export const pageHead = ({ meta, ui }, { title, description, headScript, extra, analytics }) => {
  const asset = (file) => assetPath(meta, file);
  const palettes = Object.keys(ui.palette.names);

  return html`<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark light">
    <script>${raw(headScript.trim().replace('__PALETTES__', json(palettes)))}</script>
    <title>${title}</title>
    <meta name="description" content="${description}">
    ${extra}
    <link rel="preload" href="${asset('fonts/manrope.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${asset('fonts/unbounded-700.woff2')}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${asset('site.css')}">
    <link rel="icon" href="${asset('icons/favicon.ico')}" sizes="48x48">
    <link rel="icon" href="${asset('icons/favicon.svg')}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${asset('icons/apple-touch-icon.png')}">
    <link rel="manifest" href="${rootFilePath(meta, MANIFEST)}">
    <script type="module" src="${asset('scripts/main.js')}"></script>
    ${analytics && html`<script async data-goatcounter="https://${analytics}.goatcounter.com/count" src="https://gc.zgo.at/count.js"></script>`}
  </head>`;
};
