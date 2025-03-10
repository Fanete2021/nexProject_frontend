import React from 'react';
import { icons, SvgIcon } from '@/shared/ui';

export interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = (props) => {
    const { className } = props;

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
};

export default Logo;
