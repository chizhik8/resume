export const langDir = (meta, lang) => (lang === meta.defaultLang ? '' : `${lang}/`);

export const pagePath = (meta, lang) => meta.basePath + langDir(meta, lang);

export const assetPath = (meta, file) => `${meta.basePath}assets/${file}`;
