import useDynamicSvgImport from '@/shared/lib/hooks/useDynamicSvgImport.ts';
import { icons } from './model/icons.ts';
import React, { memo } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './SvgIcon.module.scss';

export interface SvgIconProps {
  iconName: icons;
  svgProp?: React.SVGProps<SVGSVGElement>;
  className?: string;
  important?: boolean;
  applyFill?: boolean;
  applyStroke?: boolean;
  applyHover?: boolean;
}

const SvgIcon: React.FC<SvgIconProps> = memo((props) => {
    const {
        iconName,
        svgProp,
        className,
        important = false,
        applyFill = true,
        applyStroke = false,
        applyHover = true,
    } = props;
    const { loading, Icon } = useDynamicSvgImport(iconName);

    const mods: Record<string, boolean> = {
        [styles.applyFill]: applyFill && !important,
        [styles.applyStroke]: applyStroke && !important,
        [styles.applyImportantFill]: applyFill && important,
        [styles.applyImportantStroke]: applyStroke && important,
        [styles.applyHover]: applyHover,
    };

    return (
        <>
            {Icon && (
                <Icon className={classNames('', [className], mods)}/>
            )}
        </>
    );
});

export default SvgIcon;
