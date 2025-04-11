import React, { memo } from 'react';
import { Theme, useTheme } from '@/app/providers/theme-provider';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { icons, SvgIcon } from '@/shared/ui';
import styles from './ThemeSwitcher.module.scss';

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={classNames(styles.iconWrapper, [ className ])}
      onClick={toggleTheme}
    >
      <SvgIcon
        iconName={theme === Theme.MINIMALISTIC_LIGHT ? icons.MOON : icons.SUN}
        important={true}
      />
    </button>
  );
});

ThemeSwitcher.displayName = 'ThemeSwitcher';
export default ThemeSwitcher;
