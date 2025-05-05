import { icons, SvgIcon } from '@/shared/ui';
import styles from './SidebarOpener.module.scss';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface SidebarOpenerProps {
  className?: string;
  applyMobileStyles?: boolean;
}

const SidebarOpener: React.FC<SidebarOpenerProps> = (props) => {
  const { className, applyMobileStyles = true } = props;

  const { openSidebar } = useSidebar();
  
  return (
    <SvgIcon
      iconName={icons.MENU}
      onClick={openSidebar}
      className={classNames(
        styles.SidebarOpener,
        [className],
        {
          [styles.mobileStyles]: applyMobileStyles
        }
      )}
      important
    />
  );
};

export default SidebarOpener;
