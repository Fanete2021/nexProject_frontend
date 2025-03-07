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
      <SvgIcon
        iconName={theme === Theme.MINIMALISTIC_LIGHT ? icons.MOON : icons.SUN}
        important={true}
      />
    </button>
  );
});

export default ThemeSwitcher;
