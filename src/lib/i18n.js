export const MISSING = '[…]';

export const createT = (lang) => {
  const t = (value, vars = {}) => {
    const text = value !== null && typeof value === 'object' ? value[lang] : value;
    if (text == null) return MISSING;
    return String(text).replace(/\{(\w+)\}/g, (match, key) => (Object.hasOwn(vars, key) ? vars[key] : match));
  };

  const rules = new Intl.PluralRules(lang);
  const plural = (forms, n) => {
    const byRule = forms?.[lang];
    if (byRule == null) return MISSING;
    return t(byRule[rules.select(n)] ?? byRule.other, { n });
  };

  return { t, plural };
};
