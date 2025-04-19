import useDynamicSvgImport from '@/shared/lib/hooks/useDynamicSvgImport.ts';
import { icons } from '../model/icons.ts';
import React, { memo, useEffect, useState } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './SvgIcon.module.scss';

export interface SvgIconProps extends React.SVGAttributes<SVGSVGElement> {
  iconName: icons;
  className?: string;
  important?: boolean;
  applyFill?: boolean;
  applyStroke?: boolean;
  applyHover?: boolean;
}

const SvgIcon: React.FC<SvgIconProps> = memo((props) => {
  const {
    iconName,
    className,
    important = false,
    applyFill = true,
    applyStroke = false,
    applyHover = true,
    ...rest
  } = props;
  const { loading, Icon } = useDynamicSvgImport(iconName);
  const [forceRender, setForceRender] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setForceRender(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const mods: Record<string, boolean> = {
    [styles.applyFill]: applyFill && !important,
    [styles.applyStroke]: applyStroke && !important,
    [styles.applyImportantFill]: applyFill && important,
    [styles.applyImportantStroke]: applyStroke && important,
    [styles.applyHoverStroke]: applyHover && applyStroke,
    [styles.applyHoverFill]: applyHover && applyFill,
  };

  return (
    <>
      {Icon && (
        <>
          <Icon
            {...rest}
            className={classNames(styles.SvgIcon, [className], mods)}
          />

          {forceRender && (
            <Icon
              {...rest}
              className={classNames(styles.SvgIcon, [className], mods)}
              style={{ display: 'none' }}
            />
          )}
        </>
      )}
    </>
  );
});

SvgIcon.displayName = 'SvgIcon';
export default SvgIcon;
