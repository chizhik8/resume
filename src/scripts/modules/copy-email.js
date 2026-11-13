const RESET_DELAY = 2000;

export const init = () => {
  const status = document.querySelector('[data-copy-status]');
  let statusTimer;

  const announce = (message) => {
    status.textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => {
      status.textContent = '';
    }, RESET_DELAY);
  };

  for (const button of document.querySelectorAll('[data-copy-email]')) {
    let stateTimer;

    const show = (state, message) => {
      button.dataset.copyState = state;
      clearTimeout(stateTimer);
      stateTimer = setTimeout(() => {
        delete button.dataset.copyState;
      }, RESET_DELAY);
      announce(message);
    };

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(button.dataset.copyEmail);
        show('copied', button.dataset.announceCopied);
      } catch {
        show('failed', button.dataset.announceFailed);
      }
    });
  }
};
