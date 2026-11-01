import { html } from '../lib/html.js';

const token = (kind, text) => html`<span class="code-card__${kind}">${text}</span>`;

const value = (item) => {
  if (Array.isArray(item)) {
    return [
      token('punct', '['),
      item.map((entry, i) => [i > 0 && token('punct', ', '), value(entry)]),
      token('punct', ']'),
    ];
  }
  return token(typeof item === 'string' ? 'string' : 'literal', JSON.stringify(item));
};

export const codeCard = (fields) => {
  const entries = Object.entries(fields);
  return html`<div class="code-card">
    <p class="code-card__bar">
      <span class="code-card__dot"></span><span class="code-card__dot"></span><span class="code-card__dot"></span>
      <span class="code-card__file">resume.json</span>
    </p>
    <div class="code-card__line">${token('punct', '{')}</div>
    ${entries.map(
      ([key, item], i) => html`<div class="code-card__line code-card__line--nested">${token('key', JSON.stringify(key))}${token('punct', ': ')}${value(item)}${i < entries.length - 1 && token('punct', ',')}</div>`,
    )}
    <div class="code-card__line">${token('punct', '}')}<span class="code-card__cursor"></span></div>
  </div>`;
};
