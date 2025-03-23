import React, { ReactNode } from 'react';
import styles from './AuthenticatedPageLayout.module.scss';
import { Sidebar } from '@/widgets/sidebar';
import { ThemeSwitcher } from '@/widgets/theme-switcher';
import { LanguageSwitcher } from '@/widgets/language-switcher';

export interface AuthenticatedPageLayoutProps {
  children?: ReactNode;
}

const AuthenticatedPageLayout: React.FC<AuthenticatedPageLayoutProps> = (props) => {
    const { children } = props;

    return (
        <div className={styles.AuthenticatedPageLayout}>
            <Sidebar className={styles.sidebar}/>

            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default AuthenticatedPageLayout;
