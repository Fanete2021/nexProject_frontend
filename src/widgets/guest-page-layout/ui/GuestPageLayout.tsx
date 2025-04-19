import React, { ReactNode } from 'react';
import styles from './GuestPageLayout.module.scss';
import { Logo } from '@/shared/ui';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { LanguageSwitcher } from '@/widgets/language-switcher';
import { ThemeSwitcher } from '@/widgets/theme-switcher';

export interface GuestPageLayoutProps {
    children?: ReactNode;
    className?: string;
}

const GuestPageLayout: React.FC<GuestPageLayoutProps> = (props) => {
  const { children, className } = props;

  return (
    <div className={classNames(styles.GuestPageLayout, [className], {})}>
      <div className={styles.settings}>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>

      <div className={styles.container}>
        <Logo />

        {children}
      </div>
    </div>
  );
};

export default GuestPageLayout;
