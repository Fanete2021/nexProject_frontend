import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from './ThemeContext';
import { useContext } from 'react';

interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeResult {
    const { theme, setTheme } = useContext(ThemeContext);

    const toggleTheme = () => {
        let newTheme: Theme;

        switch (theme) {
            case Theme.MINIMALISTIC_DARK:
                newTheme = Theme.MINIMALISTIC_LIGHT;
                break;
            case Theme.MINIMALISTIC_LIGHT:
                newTheme = Theme.MINIMALISTIC_DARK;
                break;
            default:
                newTheme = Theme.MINIMALISTIC_DARK;
        }

        setTheme?.(newTheme);
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
    };

    return {
        theme: theme || Theme.MINIMALISTIC_LIGHT,
        toggleTheme
    };
}
