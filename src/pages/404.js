import { html } from '../lib/html.js';
import { createT } from '../lib/i18n.js';
import { pagePath } from '../lib/paths.js';
import { pageHead } from '../components/page-head.js';
import { logo } from '../components/icons.js';

const block = ({ meta, ui }, lang) => {
  const { t } = createT(lang);
  const lead = lang === meta.defaultLang;
  const title = t(ui.notFound.title);

  return html`<div class="not-found__block"${lead ? '' : html` lang="${lang}"`}>
        ${lead ? html`<h1 class="not-found__title">${title}</h1>` : html`<p class="not-found__title">${title}</p>`}
        <p class="not-found__text">${t(ui.notFound.text)}</p>
        <a class="button button--primary" href="${pagePath(meta, lang)}">${t(ui.notFound.home)}</a>
      </div>`;
};

export const notFoundPage = (data, { headScript }) => {
  const { meta, ui } = data;
  const lang = meta.defaultLang;
  const { t } = createT(lang);
  const [defaultPalette] = Object.keys(ui.palette.names);

  return html`<!doctype html>
<html lang="${lang}" data-theme="dark" data-palette="${defaultPalette}">
  ${pageHead(data, {
    title: t(ui.notFound.title),
    description: t(ui.notFound.text),
    headScript,
    extra: html`<meta name="robots" content="noindex">`,
  })}
  <body>
    <main id="main" class="not-found">
      <div class="container not-found__content">
        ${logo}
        ${meta.langs.map((code) => block(data, code))}
      </div>
    </main>
  </body>
</html>
`;
};
