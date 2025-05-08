import styles from './ManageOrganization.module.scss';
import {
  getMyRoleInOrganization, getOrganizationData,
  isAdminInOrganization, OrganizationInfo,
} from '@/entities/organization';
import TabPicker from './components/tab-picker/TabPicker.tsx';
import { useSelector } from 'react-redux';
import { Tabs } from './components/tab-picker/model/tabs.ts';
import { useCallback, useEffect, useState } from 'react';
import Members from './components/members/Members.tsx';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import Team from './components/team/Team.tsx';
import { getUserData } from '@/entities/user';
import { OrganizationPicker } from '@/widgets/pickers/organization-picker';
import { getTeamData, TeamInfo } from '@/entities/team';
import { TeamPicker } from '@/widgets/pickers/team-picker';

const ManageOrganization = () => {
  const user = useSelector(getUserData)!;
  const organizations = useSelector(getOrganizationData)!;
  const teams = useSelector(getTeamData)!;

  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationInfo | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.MEMBERS);

  useEffect(() => {
    setCurrentTab(Tabs.MEMBERS);
  }, [selectedOrganization]);

  useEffect(() => {
    setSelectedTeam(null);
  }, [currentTab]);
  
  const changeTab = useCallback((tab: Tabs) => {
    setCurrentTab(tab);
  }, []);
  
  return (
    <div className={styles.ManageOrganization}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>
        
        <OrganizationPicker
          hasCreateOrganization
          organizations={organizations}
          onSelect={setSelectedOrganization}
        />

        {selectedOrganization &&
          <>
            <TabPicker
              currentTab={currentTab}
              changeTab={changeTab}
              selectedOrganization={selectedOrganization}
            />

            {currentTab === Tabs.TEAMS &&
              <TeamPicker
                organizationId={selectedOrganization.organizationId}
                hasCreateTeam={isAdminInOrganization(
                  getMyRoleInOrganization(selectedOrganization, user)
                )}
                teams={teams}
                onSelect={setSelectedTeam}
              />
            }
          </>
        }
      </div>

      {selectedOrganization &&
        <div className={styles.content}>
          {currentTab === Tabs.MEMBERS && <Members organization={selectedOrganization} />}

          {currentTab === Tabs.TEAMS && selectedTeam && <Team team={selectedTeam} organization={selectedOrganization}/>}
        </div>
      }
    </div>
  );
};

export default ManageOrganization;
