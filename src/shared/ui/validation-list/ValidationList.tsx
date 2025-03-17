import React, { memo, ReactNode } from 'react';
import styles from './ValidationList.module.scss';
import { icons, SvgIcon } from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ValidationListItem } from './model/ValidationListItem.ts';
import { useTranslation } from 'react-i18next';

const CheckIcon = memo(() => (
    <div className={styles.iconWrapper}>
        <SvgIcon
            iconName={icons.CHECK}
            important
            applyFill={false}
            applyStroke
            applyHover={false}
            className={styles.icon}
        />
    </div>
));
CheckIcon.displayName = 'CheckIcon';

export interface ValidationListProps {
    children?: ReactNode;
    isError?: boolean;
    items: ValidationListItem[];
}

const ValidationList: React.FC<ValidationListProps> = (props) => {
    const {
        children,
        isError = false,
        items
    } = props;
    
    const { t } = useTranslation();

    const mods: Record<string, boolean> = {
        [styles.errorValidationList]: isError
    };

    return (
        <div className={styles.wrapper}>
            {children}

            <ul className={classNames(styles.validationList,[], mods)}>
                {items.map(item => (
                    <li 
                        className={item.isError ? '' : styles.valid}
                        key={item.text}
                    >
                        <CheckIcon />
                        {t(item.text)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ValidationList;
