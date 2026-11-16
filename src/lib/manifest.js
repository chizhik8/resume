import { createT } from './i18n.js';
import { assetPath } from './paths.js';

export const MANIFEST = 'site.webmanifest';

export const ICONS = [
  { file: 'icons/icon-192.png', sizes: '192x192' },
  { file: 'icons/icon-512.png', sizes: '512x512' },
];

const BACKGROUND = '#111314';

export const manifest = ({ meta, seo, basics }) => {
  const { t } = createT(meta.defaultLang);

  return {
    name: t(seo.title),
    short_name: t(basics.name),
    lang: meta.defaultLang,
    start_url: meta.basePath,
    scope: meta.basePath,
    icons: ICONS.map(({ file, sizes }) => ({ src: assetPath(meta, file), sizes, type: 'image/png' })),
    theme_color: BACKGROUND,
    background_color: BACKGROUND,
    display: 'browser',
  };
};
