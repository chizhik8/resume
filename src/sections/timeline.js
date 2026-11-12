import { html } from '../lib/html.js';
import { briefcase, graduationCap } from '../components/icons.js';
import { period } from '../components/period.js';

const ICONS = { work: briefcase, education: graduationCap };

const entry = (kind, title, place, { startDate, endDate }) => ({ kind, title, place, startDate, endDate });

export const timeline = ({ work, education, ui: { timeline: labels } }, { lang, t }) => {
  const entries = [
    ...work.map((job) => entry('work', job.position, job.name, job)),
    ...education.map((item) => entry('education', item.area, item.institution, item)),
  ].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return html`<ol class="timeline">
  ${entries.map(
    ({ kind, title, place, startDate, endDate }) => html`<li class="timeline__item">
      <article class="timeline__card">
        <span class="timeline__icon">${ICONS[kind]}</span>
        <h3 class="timeline__title"><span class="visually-hidden">${t(labels[kind])}: </span>${title}</h3>
        <p class="timeline__place">${place}</p>
        <p class="timeline__dates">${period(startDate, endDate, lang)}</p>
      </article>
    </li>`,
  )}
</ol>`;
};
