import { html } from '../lib/html.js';
import { duration } from '../lib/dates.js';
import { chevron } from '../components/icons.js';
import { dot } from '../components/dot-list.js';
import { period } from '../components/period.js';
import { tagList } from '../components/tag-list.js';

export const experience = ({ work, ui: { experience: labels, projects: { stackLabel } } }, { lang, t }) => {
  const formatDuration = (start, end) => {
    const { years, months } = duration(start, end);
    return [years && t(labels.duration.years, { n: years }), months && t(labels.duration.months, { n: months })]
      .filter(Boolean)
      .join(' ');
  };

  return html`<ol class="experience">
  ${work.map(
    ({ id, position, name, remote, startDate, endDate, summary, highlights, stack }) => html`<li class="experience__item">
      <article class="job">
        <div class="job__head">
          <div class="job__heading">
            <h3 class="job__title">${position}</h3>
            <p class="job__meta dot-list">
              <span>${name}${dot('|')}</span>
              ${remote && html`<span>${t(labels.remote)}${dot('|')}</span>`}
              <span class="job__dates">${period(startDate, endDate, lang)}</span>
            </p>
          </div>
          <span class="job__duration">${formatDuration(startDate, endDate)}</span>
        </div>
        <p class="job__summary">${t(summary)}</p>
        <button class="job__toggle js-only" type="button" aria-expanded="false" aria-controls="${id}-details" data-disclosure>
          ${chevron}
          <span class="only-collapsed">${t(labels.showDetails)}</span>
          <span class="only-expanded">${t(labels.hideDetails)}</span>
          <span class="visually-hidden">— ${position}, ${name}</span>
        </button>
        <div class="job__details" id="${id}-details">
          <ul class="job__highlights">
            ${highlights.map((highlight) => html`<li>${t(highlight)}</li>`)}
          </ul>
          ${tagList(stack, { label: t(stackLabel), className: 'job__stack' })}
        </div>
      </article>
    </li>`,
  )}
</ol>`;
};
