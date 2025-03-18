import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CustomCheckbox.module.scss';
import { icons, SvgIcon } from '@/shared/ui';

export interface CustomCheckboxProps extends React.ComponentPropsWithoutRef<'input'> {
    label?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, ...props }) => {
    const { t } = useTranslation();

    return (
        <label className={styles.CustomCheckbox}>
            <input
                type="checkbox"
                className={styles.input}
                {...props}
            />

            <span className={styles.checkmark}>
                <SvgIcon
                    className={styles.check}
                    iconName={icons.CHECK}
                    applyFill={false}
                    applyHover={false}
                    applyStroke
                />
            </span>

            {label && (
                <span className={styles.label}>{t(label)}</span>
            )}
        </label>
    );
};

export default CustomCheckbox;
