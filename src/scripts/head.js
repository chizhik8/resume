{
  const root = document.documentElement;
  const palettes = __PALETTES__;
  const stored = (key) => {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const theme = stored('resume:theme');
  const palette = stored('resume:palette');
  const systemTheme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.js = '';
  root.dataset.theme = theme === 'light' || theme === 'dark' ? theme : systemTheme;
  if (palettes.includes(palette)) root.dataset.palette = palette;
  if (stored('resume:menu') === 'open') root.dataset.menuOpen = '';
}
