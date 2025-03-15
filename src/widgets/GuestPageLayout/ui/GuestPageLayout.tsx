import React, { ReactNode } from 'react';
import styles from './GuestPageLayout.module.scss';
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { Logo } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface GuestPageLayoutProps {
    children?: ReactNode;
    title: string;
    className?: string;
}

const GuestPageLayout: React.FC<GuestPageLayoutProps> = (props) => {
    const { children, title, className } = props;
    const { t } = useTranslation();

    return (
        <div className={classNames(styles.GuestPageLayout, [className], {})}>
            <div className={styles.settings}>
                <LanguageSwitcher />
                <ThemeSwitcher />
            </div>

            <div className={styles.container}>
                <Logo />

                <div className={styles.title}>
                    {t(title)}
                </div>

                {children}
            </div>
        </div>
    );
};

export default GuestPageLayout;
