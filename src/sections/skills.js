import { html } from '../lib/html.js';

export const skills = ({ skills: groups }, { t }) => html`<ul class="skills">
  ${groups.map(
    ({ name, keywords }) => html`<li class="skills__group">
      <h3 class="skills__name">${t(name)}</h3>
      <ul class="skills__chips">
        ${keywords.map((keyword) => html`<li class="chip">${t(keyword)}</li>`)}
      </ul>
    </li>`,
  )}
</ul>`;
