import { html } from '../lib/html.js';
import { period } from '../components/period.js';

export const education = ({ education: items, languages, ui: { sections } }, { lang, t }) => html`<div class="education">
  <ul class="education__list">
    ${items.map(
      ({ institution, area, startDate, endDate }) => html`<li class="education__item">
        <div class="education__heading">
          <h3 class="education__title">${area}</h3>
          <p class="education__school">${institution}</p>
        </div>
        <p class="education__dates">${period(startDate, endDate, lang)}</p>
      </li>`,
    )}
  </ul>
  <div class="languages">
    <h3 class="card-label languages__title">${t(sections.languages.title)}</h3>
    <dl class="languages__list">
      ${languages.map(
        ({ language, fluency, cefr, level }) => html`<div class="languages__item">
          <dt class="languages__name">${t(language)}</dt>
          <dd class="languages__level">${t(fluency)}${cefr && html` <span class="languages__cefr">[${cefr}]</span>`}</dd>
          <dd class="languages__bar" aria-hidden="true" style="--level: ${level}%"></dd>
        </div>`,
      )}
    </dl>
  </div>
</div>`;
