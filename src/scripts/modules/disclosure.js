export const init = () => {
  for (const button of document.querySelectorAll('[data-disclosure]')) {
    button.addEventListener('click', () => {
      button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') !== 'true');
    });
  }
};
