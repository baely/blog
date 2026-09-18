(() => {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  const label = toggle.querySelector('[data-theme-label]');

  const states = ['system', 'dark', 'light'];
  const labels = { system: 'System', dark: 'Dark', light: 'Light' };
  let current = 'system';

  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') current = stored;
  } catch {}

  const apply = (theme) => {
    current = theme;

    if (theme === 'system') {
      delete document.documentElement.dataset.theme;
      try { localStorage.removeItem('theme'); } catch {}
    } else {
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem('theme', theme); } catch {}
    }

    const next = states[(states.indexOf(theme) + 1) % states.length];
    toggle.dataset.themeState = theme;
    if (label) label.textContent = labels[theme];
    toggle.setAttribute('aria-label', `Theme: ${labels[theme]}. Switch to ${labels[next]}`);
    toggle.title = `Theme: ${labels[theme]}`;
  };

  toggle.addEventListener('click', () => {
    apply(states[(states.indexOf(current) + 1) % states.length]);
  });

  apply(current);
})();
