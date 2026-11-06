import { html } from '../lib/html.js';

export const about = ({ about: { stats, paragraphs } }, { t }) => html`<div class="about">
  <ul class="about__stats">
    ${stats.map(
      ({ value, unit, label }) => html`<li class="about__stat">
        <span class="about__value">${value}</span>
        <span class="about__unit">${t(unit)}</span>
        <span class="about__label">${t(label)}</span>
      </li>`,
    )}
  </ul>
  <div class="about__text">
    ${paragraphs.map((paragraph) => html`<p class="about__paragraph">${t(paragraph)}</p>`)}
  </div>
</div>`;
