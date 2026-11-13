import { html, raw, strong } from '../lib/html.js';
import { codeCard } from '../components/code-card.js';
import { contactActions } from '../components/contact-actions.js';
import { dot } from '../components/dot-list.js';

export const hero = (data, i18n) => {
  const { basics, ui } = data;
  const { t } = i18n;
  const labels = ui.hero.metaLabels;
  const facts = [
    [labels.location, `${t(basics.location.city)}, ${t(basics.location.country)}`],
    [labels.workFormat, t(basics.workFormat)],
    [labels.experience, t(basics.experience)],
  ];

  return html`<section id="top" class="hero" aria-labelledby="top-title">
    <div class="container hero__inner">
      <div class="hero__content">
        <p class="hero__badges">
          <span class="hero__badge">${basics.label}</span>
          ${basics.openToWork && html`<span class="hero__badge hero__badge--status">${t(ui.hero.openToWork)}</span>`}
        </p>
        <h1 id="top-title">${t(basics.name)
          .split(' ')
          .map((word, i) => [i > 0 && raw(' <br>'), word])}</h1>
        <p class="hero__lead">${strong(t(basics.headline))}</p>
        <dl class="hero__meta dot-list">
          ${facts.map(
            ([label, value], i) => html`<div>
              <dt class="visually-hidden">${t(label)}</dt>
              <dd>${value}${i < facts.length - 1 && dot('·')}</dd>
            </div>`,
          )}
        </dl>
        ${contactActions(data, i18n)}
      </div>
      <div class="hero__panel" aria-hidden="true">
        ${codeCard({
          role: basics.label,
          stack: basics.stack,
          aiTools: basics.aiTools,
          focus: basics.focus,
          openToWork: basics.openToWork,
        })}
      </div>
    </div>
  </section>`;
};
