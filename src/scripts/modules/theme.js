import { load, save } from './prefs.js';

const root = document.documentElement;

export const init = () => {
  let chosen = ['light', 'dark'].includes(load('theme'));

  for (const button of document.querySelectorAll('[data-theme-toggle]')) {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      chosen = true;
      save('theme', next);
    });
  }

  matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
    if (!chosen) root.dataset.theme = event.matches ? 'light' : 'dark';
  });
};
