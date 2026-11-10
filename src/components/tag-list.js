import { html } from '../lib/html.js';

export const tagList = (items, { label, className }) => html`<ul class="${className && `${className} `}tag-list" aria-label="${label}">
  ${items.map((item) => html`<li class="tag">${item}</li>`)}
</ul>`;
