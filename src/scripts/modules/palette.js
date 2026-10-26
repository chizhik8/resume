import { save } from './prefs.js';

const root = document.documentElement;

export const init = () => {
  const button = document.querySelector('[data-palette-drum]');
  const status = document.querySelector('[data-palette-status]');
  if (!button) return;

  const names = JSON.parse(button.dataset.names);
  const order = Object.keys(names);
  const fill = (template, palette) => template.replace('{name}', names[palette]);
  let turn = 0;

  const apply = (palette) => {
    root.dataset.palette = palette;
    button.setAttribute('aria-label', fill(button.dataset.label, palette));
  };

  apply(root.dataset.palette);

  button.addEventListener('click', () => {
    const next = order[(order.indexOf(root.dataset.palette) + 1) % order.length];
    turn += 90;
    button.style.setProperty('--drum-turn', `${turn}deg`);
    apply(next);
    save('palette', next);
    if (status) status.textContent = fill(button.dataset.announce, next);
  });
};
