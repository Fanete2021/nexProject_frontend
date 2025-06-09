import styles from './ManageOrganization.module.scss';
import { fetchOrganizationInfo, getOrganizationData, OrganizationInfo } from '@/entities/organization';
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
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import Settings from './components/tabs/settings/Settings.tsx';

const ManageOrganization = () => {
  const { orgId, tab } = useParams<{ orgId?: string; teamId?: string; tab?: string; }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const organizations = useSelector(getOrganizationData)!;
  const teams = useSelector(getTeamData)!;

  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationInfo | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.MEMBERS);

  useEffect(() => {
    if (tab) {
      if (tab === Tabs.SETTINGS.toLowerCase()) {
        setCurrentTab(Tabs.SETTINGS);
      } else {
        setCurrentTab(Tabs.TEAMS);
      }
    } else {
      setCurrentTab(Tabs.MEMBERS);
    }
  }, [tab]);

  useEffect(() => {
    const loadOrganization = async () => {
      if (!orgId) {
        navigate(RoutePath.organization);
        return;
      }

      try {
        const response = await dispatch(
          fetchOrganizationInfo({ organizationId: orgId })
        ).unwrap();

        setSelectedOrganization(response);
      } catch (error) {
        console.error(error);
        navigate(RoutePath.organization);
      }
    };

    loadOrganization();
  }, [orgId, dispatch, navigate]);

  useEffect(() => {
    const loadTeam = async () => {
      if (!tab || !orgId || tab === Tabs.SETTINGS.toLowerCase()) return;

      try {
        const response = await dispatch(fetchTeamInfo({ teamId: tab })).unwrap();

        setSelectedTeam(response);
      } catch (error) {
        console.error(error);
        navigate(`${RoutePath.organization}/${orgId}`);
      }
    };

    if (currentTab === Tabs.TEAMS) {
      loadTeam();
    }
  }, [tab, orgId, currentTab, dispatch, navigate]);

  const changeTab = useCallback((tab: Tabs) => {
    if (!selectedOrganization) return;

    let path = `${RoutePath.organization}/${selectedOrganization.organizationId}`;

    switch (tab) {
      case Tabs.TEAMS:
        if (selectedTeam) {
          path += `/${selectedTeam.teamId}`;
        }
        break;
      case Tabs.SETTINGS:
        path += `/${Tabs.SETTINGS.toLowerCase()}`;
        break;
    }

    navigate(path);
    setCurrentTab(tab);
  }, [selectedOrganization, selectedTeam, navigate]);

  const selectOrganization = (org: OrganizationInfo) => {
    navigate(`${RoutePath.organization}/${org.organizationId}`);
    setSelectedOrganization(org);
    setSelectedTeam(null);
  };

  const onSelectTeamHandler = async (teamId: string) => {
    if (!selectedOrganization) return;

    try {
      const response = await dispatch(fetchTeamInfo({ teamId })).unwrap();

      setSelectedTeam(response);
      navigate(`${RoutePath.organization}/${selectedOrganization.organizationId}/${teamId}`);
      setCurrentTab(Tabs.TEAMS);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.ManageOrganization}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>
        
        <OrganizationPicker
          hasCreateOrganization
          organizations={organizations}
          onSelect={selectOrganization}
          defaultOrganizationId={orgId}
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

              {currentTab === Tabs.SETTINGS &&
                <Settings
                  organization={selectedOrganization}
                  changeOrganization={setSelectedOrganization}
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
