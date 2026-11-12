import { html } from '../lib/html.js';
import { formatMonth } from '../lib/dates.js';

const month = (value, lang) => html`<time datetime="${value}">${formatMonth(value, lang)}</time>`;

export const period = (start, end, lang) => html`${month(start, lang)} – ${month(end, lang)}`;
