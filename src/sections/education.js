import { html } from '../lib/html.js';
import { period } from '../components/period.js';
import { sectionHead } from '../components/section.js';

export const education = ({ education: items, languages, ui: { sections } }, { lang, t }) => {
  const head = (id, level) => sectionHead({ id, number: sections[id].number, title: t(sections[id].title), level });

  return html`<div class="education">
  <div class="education__column">
    ${head('education')}
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
  </div>
  <div class="education__column">
    ${head('languages', 3)}
    <dl class="languages">
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
};
