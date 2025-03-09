import React, { FC, useMemo, useState } from 'react';
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from '../lib/ThemeContext';

const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || Theme.MINIMALISTIC_LIGHT;

interface ThemeProviderProps {
  initialTheme?: Theme;
}

const ThemeProvider: FC<ThemeProviderProps> = (props) => {
    const {
        initialTheme = defaultTheme,
        children
    } = props;

    const [ theme, setTheme ] = useState<Theme>(initialTheme);

    const defaultProps = useMemo(() => ({
        theme: theme,
        setTheme: setTheme
    }), [ theme ]);

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
