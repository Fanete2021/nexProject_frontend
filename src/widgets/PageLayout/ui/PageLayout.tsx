import React, { ReactNode } from 'react';
import styles from './PageLayout.module.scss';
import { Sidebar } from '@/widgets/Sidebar';
import { ThemeSwitcher } from '@/widgets/ThemeSwitcher';
import { LanguageSwitcher } from '@/widgets/LanguageSwitcher';

export interface PageLayoutProps {
  children?: ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = (props) => {
    const { children } = props;

    return (
        <div className={styles.PageLayout}>
            <Sidebar className={styles.sidebar}/>

            <div className={styles.content}>
                <ThemeSwitcher />
                <LanguageSwitcher />

                {children}
            </div>
        </div>
    );
};

export default PageLayout;
