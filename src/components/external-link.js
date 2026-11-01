import { html } from '../lib/html.js';

export const externalLink = ({ className, href, text, newTab }) =>
  html`<a${className && html` class="${className}"`} href="${href}" target="_blank">${text}<span class="visually-hidden"> ${newTab}</span></a>`;
