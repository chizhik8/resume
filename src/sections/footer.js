import { html } from '../lib/html.js';
import { externalLink } from '../components/external-link.js';
import { logo } from '../components/icons.js';
import { dot } from '../components/dot-list.js';

export const footer = ({ meta, basics, ui }, { t }) => html`
  <footer class="footer">
    <p class="container dot-list">
      <span><span class="footer__owner">${logo}${t(basics.name)}</span>${dot('·')}</span>
      <span>${externalLink({ href: meta.repo, text: t(ui.footer.code), newTab: t(ui.newTab) })}</span>
    </p>
  </footer>
`;
