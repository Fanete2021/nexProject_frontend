import { useSelector } from 'react-redux';
import { Arrow, ArrowDirections, Avatar, Popover, SvgIcon, icons } from '@/shared/ui';
import styles from './TeamPicker.module.scss';
import { usePopover } from '@/shared/lib/hooks/usePopover.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { fetchTeamInfo, getTeamData, getTeamSelectedTeam } from '@/entities/team';
import { CreateTeamFormModal } from '@/features/team/create';
import { useCallback, useState } from 'react';

export interface TeamPickerProps {
  organizationId?: string;
  hasCreateTeam?: boolean;
}

const TeamPicker: React.FC<TeamPickerProps> = (props) => {
  const { organizationId, hasCreateTeam = false } = props;

  const dispatch = useAppDispatch();

  const teams = useSelector(getTeamData)!;
  const selectedTeam = useSelector(getTeamSelectedTeam);

  const [isOpenCreatorTeam, setIsOpenCreatorTeam] = useState<boolean>(false);

  const { anchorEl, openPopover, isOpenPopover, closePopover } = usePopover();

  const filteredTeams = teams.filter(team => !organizationId || team.organizationId === organizationId);

  const onSelectHandler = (teamId: string) => {
    closePopover();

    dispatch(fetchTeamInfo({
      teamId
    }));
  };

  const closeCreatorTeamHandler = useCallback(() => setIsOpenCreatorTeam(false), []);
  const openCreatorTeamHandler = useCallback(() => {
    closePopover();
    setIsOpenCreatorTeam(true);
  }, []);

  const onCreateTeamHandler = useCallback(() => {
    closeCreatorTeamHandler();
  }, []);

  return (
    <>
      <div className={styles.team} onClick={openPopover}>
        {(selectedTeam && (organizationId && selectedTeam.organizationId === organizationId))
          ?
          <>
            <Avatar
              text={selectedTeam.teamName}
              height={30}
              width={30}
              className={styles.avatar}
            />

            <span className={styles.title}>
              {selectedTeam.teamName}
            </span>
          </>
          :
          <>
            <SvgIcon
              iconName={icons.TEAM}
              important
              applyHover={false}
              className={styles.iconTeam}
            />

            <span className={styles.title}>
              Выберите команду
            </span>
          </>
        }

        <Arrow
          className={styles.iconArrow}
          direction={isOpenPopover ? ArrowDirections.UP : ArrowDirections.DOWN}
        />
      </div>

      <Popover
        open={isOpenPopover}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={{
          paper: styles.popover
        }}
      >
        {filteredTeams
          .filter(t => t.teamId !== selectedTeam?.teamId)
          .map((team) => (
            <div
              key={team.teamId}
              className={styles.team}
              onClick={() => onSelectHandler(team.teamId)}
            >
              <Avatar
                text={team.teamName}
                height={30}
                width={30}
                className={styles.avatar}
              />

              <span className={styles.title}>
                {team.teamName}
              </span>
            </div>
          ))}

        {hasCreateTeam && organizationId &&
          <div className={styles.team} onClick={openCreatorTeamHandler}>
            <SvgIcon
              iconName={icons.TEAM_ADD}
              important
              applyHover={false}
              className={styles.iconTeamAdd}
            />

            <span className={styles.title}>
              Создать команду
            </span>
          </div>
        }
      </Popover>

      {hasCreateTeam && organizationId &&
        <CreateTeamFormModal
          isOpen={isOpenCreatorTeam}
          onClose={closeCreatorTeamHandler}
          organizationId={organizationId}
          onCreateHandler={onCreateTeamHandler}
        />
      }
    </>
  );
};

export default TeamPicker;
