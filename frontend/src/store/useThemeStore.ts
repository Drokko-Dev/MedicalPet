import { create } from 'zustand';

type ThemeState = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
};

// Initial state checks localStorage or system preference
const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('pettrack-theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: getInitialTheme(),
  toggleDarkMode: () => set((state) => {
    const newIsDark = !state.isDarkMode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('pettrack-theme', newIsDark ? 'dark' : 'light');
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { isDarkMode: newIsDark };
  }),
  setDarkMode: (isDark) => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pettrack-theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return { isDarkMode: isDark };
  })
}));
