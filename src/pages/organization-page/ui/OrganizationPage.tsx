import { icons, SvgIcon } from '@/shared/ui';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';
import styles from './OrganizationPage.module.scss';
import { CreateOrganizationForm } from '@/features/organization/create';

const OrganizationPage = () => {
  const { openSidebar } = useSidebar();

  return (
    <div className={styles.OrganizationPage}>
      <SvgIcon
        iconName={icons.MENU}
        onClick={openSidebar}
        className={styles.iconOpenSidebar}
        important
      />

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
};

export default OrganizationPage;
