import { html } from '../lib/html.js';
import { formatMonth, formatYear } from '../lib/dates.js';

export const footer = ({ meta, basics, ui }, { lang, t }) => html`
  <footer class="footer">
    <p class="container footer__inner">
      <span>© ${formatYear(meta.updated)} ${t(basics.name)}<span class="footer__dot" aria-hidden="true">·</span></span>
      <span><a href="${meta.repo}">${t(ui.footer.code)}</a><span class="footer__dot" aria-hidden="true">·</span></span>
      <span>${t(ui.footer.updated, { date: formatMonth(meta.updated, lang) })}</span>
    </p>
  </footer>
`;
