import { html } from '../lib/html.js';

export const section = ({ id, eyebrow, title, alt = false, content }) => html`
  <section id="${id}" class="section${alt ? ' section--alt' : ''}" aria-labelledby="${id}-title">
    <div class="container">
      <div class="section__head">
        <p class="section__eyebrow" aria-hidden="true">${eyebrow}</p>
        <h2 class="section__title" id="${id}-title">${title}</h2>
      </div>
      ${content}
    </div>
  </section>`;
