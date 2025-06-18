import { useSelector } from 'react-redux';
import { getMyRoleInOrganization, isAdminInOrganization, OrganizationInfo } from '@/entities/organization';
import { getUserData } from '@/entities/user';
import styles from './TabPicker.module.scss';
import { Avatar, icons, Scrollbar, SvgIcon } from '@/shared/ui';
import { tabs, Tabs } from './model/tabs.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { Team } from '@/entities/team';
import { CreateTeamFormModal } from '@/features/team/create';
import {useCallback, useRef, useState} from 'react';
import { convertObjectToArray } from '@/shared/lib/utils/convertObjectToArray.ts';
import { useParams } from 'react-router-dom';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import useClickOutside from "@/shared/lib/hooks/useClickOutside.ts";

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

  const { tab: teamId } = useParams<{ tab?: string }>();
  
  const user = useSelector(getUserData)!;
  const windowWidth = useWindowWidth();

  const canCreateTeam = isAdminInOrganization(getMyRoleInOrganization(selectedOrganization, user));

  const [isOpenCreatorTeam, setIsOpenCreatorTeam] = useState<boolean>(false);
  const [isOpenTeamTab, setIsOpenTeamTab] = useState<boolean>(false);

  const teamsRef = useRef<HTMLDivElement>([]);

  const filteredTeams = teams.filter((team) =>
    team.organizationId === selectedOrganization.organizationId
  );

  const onClickHandler = (newTab: Tabs) => {
    changeTab(newTab);
  };

  const selectTeamHandler = (teamId: string) => {
    selectTeam(teamId);
    setIsOpenTeamTab(false);
  };

  const closeCreatorTeamHandler = useCallback(() => setIsOpenCreatorTeam(false), []);
  const openCreatorTeamHandler = useCallback(() => {
    setIsOpenCreatorTeam(true);
  }, []);

  const onCreateTeamHandler = useCallback(() => {
    closeCreatorTeamHandler();
  }, []);

  useClickOutside(teamsRef, isOpenTeamTab, () => setIsOpenTeamTab(false));

  const teamList = () => {
    return (
      <div className={styles.scrollbarWrapper}>
        <Scrollbar autoHeight autoHeightMax={300}>
          <div className={styles.teams} ref={teamsRef}>
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
                  className={styles.avatar}
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
        </Scrollbar>
      </div>
    );
  };

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
                [styles.canSelected]: tab.id !== Tabs.TEAMS,
                [styles.openedTeamTab]: windowWidth <= 640 && tab.id === Tabs.TEAMS && isOpenTeamTab
              })}
              onClick={tab.id !== Tabs.TEAMS
                ? () => onClickHandler(tab.id)
                : () => setIsOpenTeamTab(true)
              }
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

            {tab.id === Tabs.TEAMS && (windowWidth > 640 || isOpenTeamTab) && teamList()}
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
