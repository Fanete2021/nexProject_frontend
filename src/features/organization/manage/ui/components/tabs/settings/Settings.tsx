import { OrganizationInfo } from '@/entities/organization';
import { EditOrganizationForm } from '@/features/organization/edit';
import { icons, SvgIcon } from '@/shared/ui';
import styles from './Settings.module.scss';

export interface SettingsProps {
  organization: OrganizationInfo;
  changeOrganization: (organization: OrganizationInfo) => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const { organization, changeOrganization } = props;

  return (
    <div className={styles.Settings}>
      <SvgIcon
        iconName={icons.ORGANIZATION_IDEAS}
        className={styles.iconOrganizationIdeas}
        important
        applyHover={false}
      />

      <EditOrganizationForm
        organization={organization}
        onEditHandler={changeOrganization}
        className={styles.form}
      />
    </div>
  );
};

export default Settings;
