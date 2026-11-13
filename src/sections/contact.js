import { html } from '../lib/html.js';
import { contactActions } from '../components/contact-actions.js';

export const contact = (data, i18n) => html`<p class="contact__text">${i18n.t(data.ui.contact.text)}</p>
      <div class="contact__card">${contactActions(data, i18n)}</div>`;
