import { createContext, useState, useEffect, useCallback } from 'react';

export const ThemeContext = createContext(null);

function resolveSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'system');

  const applyTheme = useCallback((value) => {
    const resolved = value === 'system' ? resolveSystemTheme() : value;
    document.documentElement.setAttribute('data-bs-theme', resolved);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // React live to OS theme changes when in "system" mode
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    }
  }, [theme, applyTheme]);

  const setTheme = (value) => setThemeState(value);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
