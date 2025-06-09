import { OrganizationInfo } from '@/entities/organization';
import { EditOrganizationForm } from '@/features/organization/edit';
import { icons, Scrollbar, SvgIcon } from '@/shared/ui';
import styles from './Settings.module.scss';

export interface SettingsProps {
  organization: OrganizationInfo;
  changeOrganization: (organization: OrganizationInfo) => void;
  deleteOrganization: (organizationId: string) => void;
}

const Settings: React.FC<SettingsProps> = (props) => {
  const { organization, changeOrganization, deleteOrganization } = props;

  return (
    <Scrollbar>
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
          onDeleteHandler={deleteOrganization}
        />
      </div>
    </Scrollbar>
  );
};

export default Settings;
