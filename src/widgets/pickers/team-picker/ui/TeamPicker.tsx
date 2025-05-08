import { Avatar, SvgIcon, icons, Picker, PickerProps, PickerItem } from '@/shared/ui';
import styles from './teamPicker.module.scss';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { fetchTeamInfo, Team, TeamInfo } from '@/entities/team';
import { CreateTeamFormModal } from '@/features/team/create';

export interface TeamPickerProps {
  organizationId?: string;
  hasCreateTeam?: boolean;
  onSelect?: (selectedteam: TeamInfo) => void;
  teams: Team[];
  classes?: PickerProps['classes'] & {
    image?: string;
  };
}

const TeamPicker: React.FC<TeamPickerProps> = (props) => {
  const {
    hasCreateTeam = false,
    organizationId,
    classes = {
      container: styles.team,
      text: styles.title,
      iconArrow: styles.iconArrow,
      image: styles.image
    },
    onSelect,
    teams
  } = props;

  const dispatch = useAppDispatch();

  const [isOpenCreatorTeam, setIsOpenCreatorTeam] = useState<boolean>(false);
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>();

  const filteredTeams = useMemo(() => {
    return teams.filter(team => !organizationId || team.organizationId === organizationId);
  }, [teams, organizationId]);

  const onSelectHandler = async (teamId: string) => {
    try {
      const response = await dispatch(fetchTeamInfo({ teamId }));
      setSelectedTeamId(teamId);
      onSelect?.(response.payload);
    } catch (error) {
      console.log(error);
    }
  };

  const closeCreatorTeamHandler = useCallback(() => setIsOpenCreatorTeam(false), []);
  const openCreatorTeamHandler = useCallback(() => {
    setIsOpenCreatorTeam(true);
  }, []);

  const onCreateTeamHandler = useCallback(() => {
    closeCreatorTeamHandler();
  }, []);

  useEffect(() => {
    const newPickerItems: PickerItem[] = filteredTeams.map((team) => ({
      label: team.teamName,
      value: team.teamId,
      image: (
        <Avatar
          text={team.teamName}
          className={classNames(styles.image, [classes.image])}
        />
      )
    }));

    if (hasCreateTeam) {
      newPickerItems.push({
        label: 'Создать команду',
        canChoose: false,
        onClick: openCreatorTeamHandler,
        image: (
          <SvgIcon
            iconName={icons.TEAM}
            important
            applyHover={false}
            className={classNames(styles.image, [classes.image])}
          />
        ),
      });
    }

    setPickerItems(newPickerItems);
  }, [filteredTeams]);

  const defaultItemPicker: PickerItem = useMemo(() => ({
    label: 'Выберите команду',
    image: (
      <SvgIcon
        iconName={icons.TEAM}
        important
        applyHover={false}
        className={classNames(styles.image, [classes.image])}
      />
    ),
  }), []);

  return (
    <>
      <Picker
        classes={classes}
        items={pickerItems}
        onSelect={onSelectHandler}
        defaultItem={defaultItemPicker}
        selectedValue={selectedTeamId}
      />

      {hasCreateTeam && organizationId &&
        <CreateTeamFormModal
          onClose={closeCreatorTeamHandler}
          isOpen={isOpenCreatorTeam}
          onCreateHandler={onCreateTeamHandler}
          organizationId={organizationId}
        />
      }
    </>
  );
};

export default TeamPicker;
