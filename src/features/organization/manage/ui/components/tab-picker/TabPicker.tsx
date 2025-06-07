import { useSelector } from 'react-redux';
import { getMyRoleInOrganization, isAdminInOrganization, OrganizationInfo } from '@/entities/organization';
import { getUserData } from '@/entities/user';
import styles from './TabPicker.module.scss';
import { Avatar, icons, SvgIcon } from '@/shared/ui';
import { tabs, Tabs } from './model/tabs.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Team } from '@/entities/team';
import { CreateTeamFormModal } from '@/features/team/create';
import { useCallback, useState } from 'react';
import { convertObjectToArray } from '@/shared/lib/utils/convertObjectToArray.ts';
import { useParams } from 'react-router-dom';

export interface TabPickerProps {
  currentTab: Tabs;
  changeTab: (newTab: Tabs) => void;
  selectedOrganization: OrganizationInfo;
  teams: Team[];
  selectTeam: (teamId: string) => void;
}

export const tabsArray = convertObjectToArray(tabs);

const TabPicker: React.FC<TabPickerProps> = (props) => {
  const { currentTab, changeTab, selectedOrganization, teams, selectTeam } = props;

  const { teamId } = useParams<{ teamId?: string }>();
  
  const user = useSelector(getUserData)!;

  const canCreateTeam = isAdminInOrganization(getMyRoleInOrganization(selectedOrganization, user));

  const [isOpenCreatorTeam, setIsOpenCreatorTeam] = useState<boolean>(false);

  const filteredTeams = teams.filter((team) =>
    team.organizationId === selectedOrganization.organizationId
  );

  const onClickHandler = (newTab: Tabs) => {
    changeTab(newTab);
  };

  const selectTeamHandler = (teamId: string) => {
    changeTab(Tabs.TEAMS);
    selectTeam(teamId);
  };

  const closeCreatorTeamHandler = useCallback(() => setIsOpenCreatorTeam(false), []);
  const openCreatorTeamHandler = useCallback(() => {
    setIsOpenCreatorTeam(true);
  }, []);

  const onCreateTeamHandler = useCallback(() => {
    closeCreatorTeamHandler();
  }, []);

  return (
    <div className={styles.TabPicker}>
      {tabsArray
        .map((tab) => (
          <div
            key={tab.id}
            className={classNames(styles.tabWrapper)}
          >
            <div
              className={classNames(styles.tab, [], {
                [styles.selected]: currentTab === tab.id,
                [styles.canSelected]: tab.id !== Tabs.TEAMS
              })}
              onClick={tab.id !== Tabs.TEAMS ? () => onClickHandler(tab.id) : undefined}
            >
              <div className={styles.iconWrapper}>
                <SvgIcon
                  iconName={tab.icon}
                  applyHover={false}
                  className={styles.icon}
                  important={currentTab === tab.id}
                />
              </div>

              <span className={styles.title}>
                {tab.title}
              </span>
            </div>

            {tab.id === Tabs.TEAMS && (
              <div className={styles.teams}>
                {filteredTeams.map((team: Team) => (
                  <div
                    key={team.teamId}
                    className={classNames(styles.team, [styles.canSelected], {
                      [styles.selected]: team.teamId === teamId,
                    })}
                    onClick={() => selectTeamHandler(team.teamId)}
                  >
                    <Avatar
                      text={team.teamName}
                      width={30}
                      height={30}
                    />

                    <div className={styles.name}>
                      {team.teamName}
                    </div>
                  </div>
                ))}

                {canCreateTeam &&
                  <div
                    className={classNames(styles.team)}
                    onClick={openCreatorTeamHandler}
                  >
                    <SvgIcon
                      iconName={icons.TEAM_ADD}
                      applyHover={false}
                      className={styles.iconAddTeam}
                    />

                    <div className={styles.name}>
                      Создать команду
                    </div>
                  </div>
                }
              </div>
            )}
          </div>
        ))
      }

      {canCreateTeam && selectedOrganization &&
        <CreateTeamFormModal
          onClose={closeCreatorTeamHandler}
          isOpen={isOpenCreatorTeam}
          onCreateHandler={onCreateTeamHandler}
          organizationId={selectedOrganization.organizationId}
        />
      }
    </div>
    
  );
};

export default TabPicker;
