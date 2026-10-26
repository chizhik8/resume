import { load, save } from './prefs.js';

const root = document.documentElement;
const tablet = matchMedia('(min-width: 47.25em)');

export const init = () => {
  delete root.dataset.menuOpen;

  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = toggle && document.getElementById(toggle.getAttribute('aria-controls'));
  if (!menu) return;

  const page = document.querySelectorAll('main, footer');

  const setOpen = (open, target = menu.querySelector('a')) => {
    toggle.setAttribute('aria-expanded', open);
    menu.hidden = !open;
    for (const element of page) element.inert = open;
    save('menu', open ? 'open' : 'closed');
    if (open) target?.focus();
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a[href^="#"]')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || menu.hidden) return;
    setOpen(false);
    toggle.focus();
  });

  tablet.addEventListener('change', (event) => {
    if (event.matches && !menu.hidden) setOpen(false);
  });

  if (load('menu') === 'open' && !tablet.matches) setOpen(true, menu.querySelector('[aria-current="page"]'));
};
