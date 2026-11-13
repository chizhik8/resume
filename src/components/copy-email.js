import { html } from '../lib/html.js';

export const copyEmail = ({ email, labels, t }) => html`<button
  class="button button--primary copy-email js-only"
  type="button"
  data-copy-email="${email}"
  data-announce-copied="${t(labels.copiedAnnounce)}"
  data-announce-failed="${t(labels.copyFailed)}"
>
  <span class="copy-email__idle">${t(labels.copy)}</span>
  <span class="copy-email__copied">${t(labels.copied)}</span>
  <span class="copy-email__failed">${t(labels.copyFailed)}</span>
</button>`;
