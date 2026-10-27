import { html } from '../lib/html.js';
import { pagePath } from '../lib/paths.js';
import { arrow, burger, close, logo, moon, sun } from '../components/icons.js';

export const header = ({ meta, basics, ui }, { lang, t, defaultPalette }) => {
  const name = t(basics.name);
  const { langSwitch, palette, theme, menu } = ui;
  const paletteNames = Object.fromEntries(
    Object.entries(palette.names).map(([key, value]) => [key, t(value)]),
  );

  const langLinks = (className) => html`
    <ul class="lang-switch ${className}" aria-label="${t(langSwitch.label)}">
      ${meta.langs.map(
        (code) => html`<li>
          <a class="lang-switch__link" href="${pagePath(meta, code)}" hreflang="${code}" lang="${code}"${code === lang && html` aria-current="page"`}>
            ${langSwitch.codes[code]}<span class="visually-hidden"> ${langSwitch.names[code]}</span>
          </a>
        </li>`,
      )}
    </ul>`;

  return html`<a class="skip-link" href="#main">${t(ui.skipLink)}</a>
    <header class="header">
      <div class="container header__inner">
        <a class="header__brand" href="#top" aria-label="${t(ui.homeLink, { name })}">
          ${logo}
          <span class="header__name">${name}</span>
        </a>
        <nav class="header__nav header__wide" aria-label="${t(ui.navLabel)}">
          <ul class="header__menu">
            ${ui.nav.map(
              (id) => html`<li><a class="header__link" href="#${id}">${t(ui.navLabels[id])}</a></li>`,
            )}
          </ul>
        </nav>
        <div class="header__controls">
          ${langLinks('header__wide')}
          <button
            class="header__button drum js-only"
            type="button"
            data-palette-drum
            data-names="${JSON.stringify(paletteNames)}"
            data-label="${t(palette.label)}"
            data-announce="${t(palette.announce)}"
            aria-label="${t(palette.label, { name: paletteNames[defaultPalette] })}"
          >
            <span class="drum__disc" aria-hidden="true"></span>
          </button>
          <button class="header__button header__wide js-only" type="button" data-theme-toggle>
            <span class="only-dark">${sun}<span class="visually-hidden">${t(theme.toLight)}</span></span>
            <span class="only-light">${moon}<span class="visually-hidden">${t(theme.toDark)}</span></span>
          </button>
          <button
            class="header__button header__burger js-only"
            type="button"
            aria-expanded="false"
            aria-controls="menu"
            data-menu-toggle
          >
            <span class="header__burger-open">${burger}<span class="visually-hidden">${t(menu.open)}</span></span>
            <span class="header__burger-close">${close}<span class="visually-hidden">${t(menu.close)}</span></span>
          </button>
        </div>
      </div>
      <div class="menu" id="menu" hidden>
        <nav aria-label="${t(menu.label)}">
          <ul class="menu__list">
            ${ui.nav.map(
              (id) => html`<li>
                <a class="menu__link" href="#${id}">
                  <span class="menu__number" aria-hidden="true">${ui.sections[id].number}</span>
                  ${t(ui.navLabels[id])}
                </a>
              </li>`,
            )}
          </ul>
        </nav>
        <div class="menu__row">
          <span class="menu__label" aria-hidden="true">${t(menu.language)}</span>
          ${langLinks('lang-switch--large')}
        </div>
        <div class="menu__row">
          <span class="menu__label" aria-hidden="true">${t(theme.label)}</span>
          <button class="theme-pill" type="button" data-theme-toggle>
            <span class="only-dark">${moon}${t(theme.dark)}<span class="visually-hidden">. ${t(theme.toLight)}</span></span>
            <span class="only-light">${sun}${t(theme.light)}<span class="visually-hidden">. ${t(theme.toDark)}</span></span>
          </button>
        </div>
        <a class="menu__cta" href="#contact">${t(ui.hero.writeMe)}${arrow}</a>
      </div>
      <p class="visually-hidden" aria-live="polite" data-palette-status></p>
    </header>`;
};
