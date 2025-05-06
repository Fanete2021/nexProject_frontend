import styles from './ManageOrganization.module.scss';
import {
  getMyRoleInOrganization,
  getOrganizationSelectedOrganization, 
  isAdminInOrganization,
} from '@/entities/organization';
import TabPicker from './components/tab-picker/TabPicker.tsx';
import { useSelector } from 'react-redux';
import { Tabs } from './components/tab-picker/model/tabs.ts';
import { useCallback, useEffect, useState } from 'react';
import Members from './components/members/Members.tsx';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import Teams from './components/teams/Teams.tsx';
import { getTeamSelectedTeam } from '@/entities/team';
import { getUserData } from '@/entities/user';
import { TeamPicker } from '@/features/team/select';
import { OrganizationPicker } from '@/features/organization/select';

const ManageOrganization = () => {
  const selectedOrganization = useSelector(getOrganizationSelectedOrganization);
  const selectedTeam = useSelector(getTeamSelectedTeam);
  const user = useSelector(getUserData)!;
  
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.MEMBERS);

  useEffect(() => {
    setCurrentTab(Tabs.MEMBERS);
  }, [selectedOrganization]);
  
  const changeTab = useCallback((tab: Tabs) => {
    setCurrentTab(tab);
  }, []);
  
  return (
    <div className={styles.ManageOrganization}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>
        
        <OrganizationPicker hasCreateOrganization />

        {selectedOrganization &&
          <>
            <TabPicker
              currentTab={currentTab}
              changeTab={changeTab}
            />

            {currentTab === Tabs.TEAMS &&
              <TeamPicker
                organizationId={selectedOrganization?.organizationId}
                hasCreateTeam={isAdminInOrganization(
                  getMyRoleInOrganization(selectedOrganization, user)
                )}
              />
            }
          </>
        }
      </div>

      {selectedOrganization &&
        <div className={styles.content}>
          {currentTab === Tabs.MEMBERS && <Members />}

          {currentTab === Tabs.TEAMS && selectedTeam && <Teams />}
        </div>
      }
    </div>
  );
};

export default ManageOrganization;
