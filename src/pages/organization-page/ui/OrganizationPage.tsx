import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';
import styles from './OrganizationPage.module.scss';
import { CreateOrganizationForm } from '@/features/organization/create';
import { useSelector } from 'react-redux';
import { getOrganizationData } from '@/entities/organization';
import { ManageOrganization } from '@/features/organization/manage';
import { SidebarOpener } from '@/widgets/sidebar-opener';

const OrganizationPage = () => {
  const { openSidebar } = useSidebar();
  const organizations = useSelector(getOrganizationData)!;

  if (organizations.length === 0) {
    return (
      <div className={styles.OrganizationPage}>
        <SidebarOpener className={styles.sidebarOpener}/>

        <SvgIcon
          iconName={icons.BUSINESS_MEETING}
          className={styles.iconBackground}
          applyHover={false}
        />

        <CreateOrganizationForm
          className={styles.form}
        />
      </div>
    );
  }

  return (
    <div className={styles.OrganizationPage}>
      <ManageOrganization />
    </div>
  );
};

export default OrganizationPage;
