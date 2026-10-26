import { raw } from '../lib/html.js';

export const logo = raw(`<svg class="logo" viewBox="0 0 64 64" width="40" height="40" aria-hidden="true" focusable="false" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="currentColor" d="M51.7 16.61A25 25 0 1 0 51.7 47.39"/>
  <path class="logo__accent" d="M16.61 12.3L32 34L47.39 12.3M32 34V57"/>
</svg>`);

export const sun = raw(`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
</svg>`);

export const moon = raw(`<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>
</svg>`);

export const burger = raw(`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
  <path d="M4 7h16M4 12h16M4 17h16"/>
</svg>`);

export const close = raw(`<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
  <path d="M6 6l12 12M18 6L6 18"/>
</svg>`);

export const arrow = raw(`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 12h14M13 6l6 6-6 6"/>
</svg>`);
