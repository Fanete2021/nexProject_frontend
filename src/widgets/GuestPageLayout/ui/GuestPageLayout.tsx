import React, { ReactNode } from 'react';
import styles from './GuestPageLayout.module.scss';
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { Logo } from '@/shared/ui';
import { useTranslation } from 'react-i18next';

export interface GuestPageLayoutProps {
    children?: ReactNode;
    title: string;
}

const GuestPageLayout: React.FC<GuestPageLayoutProps> = (props) => {
    const { children, title } = props;
    const { t } = useTranslation();

    return (
        <div className={styles.GuestPageLayout}>
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
