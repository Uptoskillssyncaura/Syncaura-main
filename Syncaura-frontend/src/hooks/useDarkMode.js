import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThemeMethod } from '../redux/slices/themeSlice';

export function useDarkMode() {
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.theme.isDark);
  const theme = isDark ? 'dark' : 'light';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty('--bg-primary', '#000000');
      root.style.setProperty('--bg-secondary', '#1a1a1a');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#a3a3a3');
      root.style.setProperty('--border-color', '#333333');
      root.style.setProperty('--card-bg', '#1f1f1f');
      root.style.setProperty('--accent-color','#73FBFD');
    } else {
      root.classList.remove("dark");
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f5f5f5');
      root.style.setProperty('--text-primary', '#000000');
      root.style.setProperty('--text-secondary', '#666666');
      root.style.setProperty('--border-color', '#e5e5e5');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--accent-color', '#2563eb');
    }
  }, [isDark]);

  const toggleTheme = () => {
    dispatch(toggleThemeMethod());
  };

  return { theme, toggleTheme };
}