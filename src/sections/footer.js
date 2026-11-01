import { html } from '../lib/html.js';
import { formatMonth, formatYear } from '../lib/dates.js';
import { externalLink } from '../components/external-link.js';

export const footer = ({ meta, basics, ui }, { lang, t }) => html`
  <footer class="footer">
    <p class="container dot-list">
      <span>© ${formatYear(meta.updated)} ${t(basics.name)}<span class="dot-list__dot" aria-hidden="true">·</span></span>
      <span>${externalLink({ href: meta.repo, text: t(ui.footer.code), newTab: t(ui.newTab) })}<span class="dot-list__dot" aria-hidden="true">·</span></span>
      <span>${t(ui.footer.updated, { date: formatMonth(meta.updated, lang) })}</span>
    </p>
  </footer>
`;
