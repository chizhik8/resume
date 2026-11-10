import { html } from '../lib/html.js';
import { assetPath } from '../lib/paths.js';
import { external } from '../components/icons.js';
import { externalLink } from '../components/external-link.js';
import { tagList } from '../components/tag-list.js';

const WIDTHS = [640, 1280];
const LARGEST = WIDTHS.at(-1);
const SIZES = '(min-width: 81em) 36.75rem, (min-width: 47.25em) calc((100vw - 7.5rem) / 2), calc(100vw - 2.5rem)';

export const projects = ({ meta, projects: items, ui }, { t }) => {
  const labels = ui.projects;
  const imageUrl = (name, width) => assetPath(meta, `images/${name}-${width}.webp`);
  const srcset = (name) => WIDTHS.map((width) => `${imageUrl(name, width)} ${width}w`).join(', ');

  return html`<ul class="projects card-grid">
  ${items.map(
    ({ name, description, keywords, url, nda, image, imageAlt }) => html`<li>
      <article class="project">
        <img
          class="project__shot"
          src="${imageUrl(image, LARGEST)}"
          srcset="${srcset(image)}"
          sizes="${SIZES}"
          width="${LARGEST}"
          height="${(LARGEST * 9) / 16}"
          alt="${t(imageAlt)}"
          loading="lazy"
          decoding="async">
        <div class="project__body">
          <h3 class="project__title">${t(name)}</h3>
          <p class="project__description">${t(description)}</p>
          ${tagList(keywords, { label: t(labels.stackLabel) })}
          <div class="project__links">
            ${externalLink({
              className: 'button button--primary button--compact',
              href: url,
              text: html`${t(labels.site)}<span class="visually-hidden"> — ${t(name)}</span>${external}`,
              newTab: t(ui.newTab),
            })}
            ${nda && html`<span class="project__nda">${t(labels.nda)}</span>`}
          </div>
        </div>
      </article>
    </li>`,
  )}
</ul>`;
};
