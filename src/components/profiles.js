import { html } from '../lib/html.js';
import { externalLink } from './external-link.js';

export const profiles = (items, { label, newTab }) => html`
  <ul class="profiles" aria-label="${label}">
    ${items.map(
      ({ network, url }) => html`<li>${externalLink({ className: 'button button--compact profiles__link', href: url, text: network, newTab })}</li>`,
    )}
  </ul>`;
