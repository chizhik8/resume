import { html, raw, strong } from '../lib/html.js';
import { rootFilePath } from '../lib/paths.js';
import { arrow, download } from '../components/icons.js';
import { codeCard } from '../components/code-card.js';
import { profiles } from '../components/profiles.js';

export const hero = ({ meta, basics, ui }, { t }) => {
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
              <dd>${value}${i < facts.length - 1 && html`<span class="dot-list__dot" aria-hidden="true">·</span>`}</dd>
            </div>`,
          )}
        </dl>
        <div class="hero__actions">
          <a class="button button--primary" href="mailto:${basics.email}">${t(ui.hero.writeMe)}${arrow}</a>
          <a class="button button--outline" href="${rootFilePath(meta, t(meta.pdf))}" download>${download}${t(ui.hero.downloadPdf)}</a>
        </div>
        ${profiles(basics.profiles, { label: t(ui.hero.profilesLabel), newTab: t(ui.newTab) })}
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
