import { html } from '../lib/html.js';

export const sectionHead = ({ id, number, title, level = 2 }) => html`<div class="section__head">
        <p class="section__eyebrow" aria-hidden="true">${number} / ${id}</p>
        <h${level} class="section__title" id="${id}-title">${title}</h${level}>
      </div>`;

export const section = ({ id, number, title, alt = false, head = true, content }) => html`
  <section id="${id}" class="section${alt ? ' section--alt' : ''}" aria-labelledby="${id}-title">
    <div class="container">
      ${head && sectionHead({ id, number, title })}
      ${content}
    </div>
  </section>`;
