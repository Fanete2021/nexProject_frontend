import React, { memo } from 'react';
import { icons, SvgIcon } from '@/shared/ui';

export interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = memo(({ className }) => {
    return (
        <SvgIcon
            className={className}
            iconName={icons.LOGO}
            important
            applyStroke
            applyFill={false}
            applyHover={false}
        />
    );
});

Logo.displayName = 'Logo';
export default Logo;
