import React, { ReactNode } from 'react';
import styles from './AuthenticatedPageLayout.module.scss';
import { Sidebar } from '@/widgets/Sidebar';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher';

export interface AuthenticatedPageLayoutProps {
  children?: ReactNode;
}

const AuthenticatedPageLayout: React.FC<AuthenticatedPageLayoutProps> = (props) => {
    const { children } = props;

    return (
        <div className={styles.AuthenticatedPageLayout}>
            <Sidebar className={styles.sidebar}/>

            <div className={styles.content}>
                <ThemeSwitcher />
                <LanguageSwitcher />

                {children}
            </div>
        </div>
    );
};

export default AuthenticatedPageLayout;
