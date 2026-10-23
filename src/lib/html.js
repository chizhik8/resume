const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);

class SafeHtml {
  constructor(value) {
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

const render = (value) => {
  if (value == null || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return escape(value);
};

export const html = (strings, ...values) =>
  new SafeHtml(strings.reduce((out, string, i) => out + render(values[i - 1]) + string));

export const raw = (value) => new SafeHtml(String(value));
