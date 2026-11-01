export const langDir = (meta, lang) => (lang === meta.defaultLang ? '' : `${lang}/`);

export const rootFilePath = (meta, file) => meta.basePath + file;

export const pagePath = (meta, lang) => rootFilePath(meta, langDir(meta, lang));

export const assetPath = (meta, file) => rootFilePath(meta, `assets/${file}`);
