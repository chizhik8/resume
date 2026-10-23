const LINK_KEYS = new Set(['url', 'repository', 'repo', 'siteUrl']);
const ALLOWED_LINK = /^(https:|mailto:)/;
const MARKER = '[…';
const MARKER_DEFINITION = 'ui.missing';

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

export const validate = (data) => {
  const langs = data.meta.langs;
  const errors = [];
  const missing = [];

  const isLocalized = (value) =>
    isPlainObject(value) && Object.keys(value).some((key) => langs.includes(key));

  const isEmptyText = (text) => text == null || (typeof text === 'string' && text.trim() === '');

  const walk = (value, path) => {
    if (value === null) {
      missing.push(path);
      return;
    }
    if (typeof value === 'string') {
      if (value.includes(MARKER) && !path.startsWith(MARKER_DEFINITION)) missing.push(path);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`));
      return;
    }
    if (!isPlainObject(value)) return;

    if (Object.keys(value).length === 0) {
      errors.push(`${path}: empty object`);
      return;
    }

    if (isLocalized(value)) {
      for (const lang of langs) {
        if (isEmptyText(value[lang])) errors.push(`${path}: no "${lang}" text`);
      }
      for (const key of Object.keys(value)) {
        if (!langs.includes(key)) errors.push(`${path}: unknown language "${key}"`);
      }
    }

    for (const [key, child] of Object.entries(value)) {
      const childPath = path ? `${path}.${key}` : key;
      if (LINK_KEYS.has(key) && typeof child === 'string' && !ALLOWED_LINK.test(child)) {
        errors.push(`${childPath}: only https: and mailto: links are allowed, got "${child}"`);
      }
      walk(child, childPath);
    }
  };

  walk(data, '');

  (data.projects ?? []).forEach((project, i) => {
    if (!isLocalized(project.imageAlt)) errors.push(`projects[${i}].imageAlt: required for every project`);
  });

  return { errors, missing };
};
