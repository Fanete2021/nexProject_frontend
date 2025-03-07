import { createContext } from 'react';

export enum Theme {
  MINIMALISTIC_LIGHT = 'app_minimalistic_light_theme',
  MINIMALISTIC_DARK = 'app_minimalistic_dark_theme',
}

export interface ThemeContextProps {
  theme?: Theme;
  setTheme?: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({});

export const LOCAL_STORAGE_THEME_KEY = 'theme';
