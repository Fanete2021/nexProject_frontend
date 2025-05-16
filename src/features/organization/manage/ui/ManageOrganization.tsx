import styles from './ManageOrganization.module.scss';
import {
  getOrganizationData,
  OrganizationInfo,
} from '@/entities/organization';
import TabPicker from './components/tab-picker/TabPicker.tsx';
import { useSelector } from 'react-redux';
import { Tabs } from './components/tab-picker/model/tabs.ts';
import { useCallback, useEffect, useState } from 'react';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import { OrganizationPicker } from '@/widgets/pickers/organization-picker';
import { fetchTeamInfo, getTeamData, TeamInfo } from '@/entities/team';
import { icons, SvgIcon } from '@/shared/ui';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import Members from './components/tabs/members/Members.tsx';
import Team from './components/tabs/team/Team.tsx';

const ManageOrganization = () => {
  const dispatch = useAppDispatch();
  
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

  const onSelectTeamHandler = async (teamId: string) => {
    try {
      const response = await dispatch(fetchTeamInfo({ teamId }));
      setSelectedTeam(response.payload);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div className={styles.ManageOrganization}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>
        
        <OrganizationPicker
          hasCreateOrganization
          organizations={organizations}
          onSelect={setSelectedOrganization}
        />
      </div>

      {selectedOrganization && selectedOrganization?.organizationDescription &&
        <div className={styles.orgDescription}>
          <SvgIcon
            iconName={icons.INFO}
            applyHover={false}
            important
            className={styles.iconInfo}
          />

          <div className={styles.text}>
            {selectedOrganization?.organizationDescription}
          </div>
        </div>
      }

      <div className={styles.content}>
        {!selectedOrganization &&
          <>
            <SvgIcon
              iconName={icons.ORGANIZATION_IDEAS}
              className={styles.iconOrganizationIdeas}
              important
              applyHover={false}
            />

            <div className={styles.withoutSelectedOrganization}>
              Чтобы управлять настройками и просматривать информацию, выберите организацию из списка.
            </div>
          </>
        }

        {selectedOrganization &&
          <>
            <div className={styles.leftPanel}>
              <TabPicker
                currentTab={currentTab}
                changeTab={changeTab}
                selectedOrganization={selectedOrganization}
                teams={teams}
                selectTeam={onSelectTeamHandler}
                selectedTeamId={selectedTeam?.teamId}
              />
            </div>

            <div className={styles.rightPanel}>
              {currentTab === Tabs.MEMBERS &&
                <Members
                  organization={selectedOrganization}
                  changeOrganization={setSelectedOrganization}
                />
              }

              {currentTab === Tabs.TEAMS && selectedTeam &&
                <Team
                  organization={selectedOrganization}
                  team={selectedTeam}
                  changeTeam={setSelectedTeam}
                />
              }
            </div>
          </>
        }
      </div>
    </div>
  );
};

export default ManageOrganization;
