import { html } from '../lib/html.js';
import { rootFilePath } from '../lib/paths.js';
import { download } from './icons.js';
import { copyEmail } from './copy-email.js';
import { profiles } from './profiles.js';

export const contactActions = ({ meta, basics, ui }, { t }) => html`<div class="contact-actions">
  <address class="contact-actions__address">
    ${profiles(basics.profiles, { label: t(ui.hero.profilesLabel), newTab: t(ui.newTab) })}
  </address>
  <div class="contact-actions__buttons">
    ${copyEmail({ email: basics.email, labels: ui.contact, t })}
    <a class="button button--outline" href="${rootFilePath(meta, t(meta.pdf))}" download>${download}${t(ui.hero.downloadPdf)}</a>
  </div>
</div>`;
