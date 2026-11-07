const english = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const DATE = /^(19|20)\d{2}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;

export const isDate = (value) => typeof value === 'string' && DATE.test(value);

const monthIndex = (value) => {
  const [year, month] = value.split('-');
  return year * 12 + (month - 1);
};

export const duration = (start, end) => {
  const months = monthIndex(end) - monthIndex(start) + 1;
  return { years: Math.floor(months / 12), months: months % 12 };
};

export const formatMonth = (value, lang) => {
  const [year, month] = value.split('-');
  return lang === 'en' ? english.format(Date.UTC(year, month - 1)) : `${month}.${year}`;
};
