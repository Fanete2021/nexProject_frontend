import React, {ReactNode, useState} from 'react';
import styles from './AuthenticatedPageLayout.module.scss';
import { Sidebar } from '@/widgets/sidebar';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { DESKTOP_MIN_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { Modal } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar';

export interface AuthenticatedPageLayoutProps {
  children?: ReactNode;
}

const AuthenticatedPageLayout: React.FC<AuthenticatedPageLayoutProps> = (props) => {
  const { children } = props;
  const windowWidth = useWindowWidth();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  return (
    <div className={styles.AuthenticatedPageLayout}>
      {windowWidth >= DESKTOP_MIN_BREAKPOINT
        ?
        <Sidebar className={styles.sidebar} />
        :
        <Modal isOpen={isSidebarOpen} onClose={closeSidebar} hasOverlayBlackout={false}>
          <Sidebar className={styles.sidebar} />
        </Modal>
      }

      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default AuthenticatedPageLayout;
