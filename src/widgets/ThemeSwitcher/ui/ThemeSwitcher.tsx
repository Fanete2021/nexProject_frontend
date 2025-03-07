import React, {memo} from 'react';
import {Theme, useTheme} from "@/app/providers/theme-provider";
import {classNames} from "@/shared/lib/utils/classNames.ts";
import {icons, SvgIcon} from "@/shared/ui";

interface ThemeSwitcherProps {
  className?: string;
}

const ThemeSwitcher = memo(({ className }: ThemeSwitcherProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={classNames('', [ className ])}
      onClick={toggleTheme}
    >
      {theme === Theme.MINIMALISTIC_LIGHT
        ? <SvgIcon iconName={icons.MOON} />
        : <SvgIcon iconName={icons.SUN} />
      }
    </button>
  );
});

export default ThemeSwitcher;
