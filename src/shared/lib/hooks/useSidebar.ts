import { SidebarContext, SidebarContextType } from '@/app/providers/sidebar-provider';
import { useContext } from 'react';

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('');
  }

  return context;
};
