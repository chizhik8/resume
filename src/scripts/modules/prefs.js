const KEYS = { theme: 'resume:theme', palette: 'resume:palette', menu: 'resume:menu' };

export const load = (name) => {
  try {
    return sessionStorage.getItem(KEYS[name]);
  } catch {
    return null;
  }
};

export const save = (name, value) => {
  try {
    sessionStorage.setItem(KEYS[name], value);
  } catch {}
};
