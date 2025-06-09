import styles from './ManageOrganization.module.scss';
import {
  fetchOrganizationInfo,
  getOrganizationData,
  organizationActions,
  OrganizationInfo
} from '@/entities/organization';
import TabPicker from './components/tab-picker/TabPicker.tsx';
import { useSelector } from 'react-redux';
import { Tabs } from './components/tab-picker/model/tabs.ts';
import { useCallback, useEffect, useState } from 'react';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import { OrganizationPicker } from '@/widgets/pickers/organization-picker';
import { fetchTeamInfo, getTeamData, teamActions, TeamInfo } from '@/entities/team';
import { Arrow, ArrowDirections, icons, SvgIcon } from '@/shared/ui';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import Members from './components/tabs/members/Members.tsx';
import Team from './components/tabs/team/Team.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig.tsx';
import Settings from './components/tabs/settings/Settings.tsx';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';

const ManageOrganization = () => {
  const { orgId, tab } = useParams<{ orgId?: string; tab?: string; }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const windowWidth = useWindowWidth();

  const organizations = useSelector(getOrganizationData)!;
  const teams = useSelector(getTeamData)!;

  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationInfo | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [currentTab, setCurrentTab] = useState<Tabs>(Tabs.MEMBERS);
  const [isShowDescription, setIsShowDescription] = useState<boolean>(false);

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
        setSelectedTeam(null);
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

  const updateTeamHandler = (team: TeamInfo) => {
    setSelectedTeam(team);
    dispatch(teamActions.updateTeam(team));
  };

  const deleteOrganization = (organizationId: string) => {
    if (organizationId === selectedOrganization?.organizationId) {
      setSelectedOrganization(null);
    }

    dispatch(organizationActions.deleteOrganization(organizationId));
  };

  const deleteTeam = (teamId: string) => {
    if (teamId === selectedTeam?.teamId) {
      setSelectedTeam(null);
    }

    dispatch(teamActions.deleteTeam(teamId));
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
          classes={{
            container: styles.containerPicker,
            text: styles.text,
            image: styles.image,
            iconArrow: styles.arrow
          }}
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

          {windowWidth > 640
            ?
            <div className={styles.text}>
              {selectedOrganization?.organizationDescription}
            </div>
            :
            <div className={styles.descriptionWrapper}>
              <div
                className={classNames(styles.showDescription, [], {
                  [styles.activeShowDescription]: isShowDescription
                })}
                onClick={() => setIsShowDescription(prev => !prev)}
              >
                Описание
                <Arrow
                  className={styles.iconArrow}
                  direction={isShowDescription ? ArrowDirections.UP : ArrowDirections.DOWN}
                />
              </div>

              <div className={classNames(styles.text, [], {
                [styles.showText]: isShowDescription
              })}>
                {selectedOrganization?.organizationDescription}
              </div>
            </div>
          }
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
                  changeTeam={updateTeamHandler}
                  deleteTeam={deleteTeam}
                />
              }

              {currentTab === Tabs.SETTINGS &&
                <Settings
                  organization={selectedOrganization}
                  changeOrganization={setSelectedOrganization}
                  deleteOrganization={deleteOrganization}
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
