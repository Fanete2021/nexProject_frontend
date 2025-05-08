import { Avatar, icons, Picker, PickerItem, PickerProps, SvgIcon } from '@/shared/ui';
import { TaskBoard, TaskBoardInfo, fetchTaskBoardInfo } from '@/entities/task-board';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import styles from './TaskBoardPicker.module.scss';
import { CreateTaskBoardFormModal } from '@/features/task-board/create';

export interface TaskBoardPickerProps {
  teamId: string;
  hasCreateBoard?: boolean;
  onSelect?: (selectedBoard: TaskBoardInfo) => void;
  boards: TaskBoard[];
  classes?: PickerProps['classes'] & {
    image?: string;
  };
}

const TaskBoardPicker: React.FC<TaskBoardPickerProps> = (props) => {
  const {
    teamId,
    hasCreateBoard = false,
    classes = {
      container: styles.board,
      text: styles.title,
      iconArrow: styles.iconArrow,
      image: styles.image
    },
    onSelect,
    boards
  } = props;

  const dispatch = useAppDispatch();

  const [isOpenCreatorBoard, setIsOpenCreatorBoard] = useState<boolean>(false);
  const [pickerItems, setPickerItems] = useState<PickerItem[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string>();

  const onSelectHandler = async (boardId: string) => {
    try {
      const response = await dispatch(fetchTaskBoardInfo({
        boardId,
        teamId
      }));
      setSelectedBoardId(boardId);
      onSelect?.(response.payload);
    } catch (error) {
      console.log(error);
    }
  };

  const closeCreatorBoardHandler = useCallback(() => setIsOpenCreatorBoard(false), []);
  const openCreatorBoardHandler = useCallback(() => {
    setIsOpenCreatorBoard(true);
  }, []);

  const onCreateBoardHandler = useCallback(() => {
    closeCreatorBoardHandler();
  }, []);

  useEffect(() => {
    const newPickerItems: PickerItem[] = boards.map((board) => ({
      label: board.boardName,
      value: board.boardId,
      image: (
        <Avatar
          text={board.boardName}
          className={classNames(styles.image, [classes.image])}
        />
      )
    }));

    if (hasCreateBoard) {
      newPickerItems.push({
        label: 'Создать доску',
        canChoose: false,
        onClick: openCreatorBoardHandler,
        image: (
          <SvgIcon
            iconName={icons.TASK_BOARD}
            important
            applyHover={false}
            className={classNames(styles.image, [classes.image])}
          />
        ),
      });
    }

    setPickerItems(newPickerItems);
  }, [boards]);

  const defaultItemPicker: PickerItem = useMemo(() => ({
    label: 'Выберите доску',
    image: (
      <SvgIcon
        iconName={icons.TASK_BOARD}
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
        selectedValue={selectedBoardId}
      />

      {hasCreateBoard &&
        <CreateTaskBoardFormModal
          onClose={closeCreatorBoardHandler}
          isOpen={isOpenCreatorBoard}
          onCreateHandler={onCreateBoardHandler}
          teamId={teamId}
        />
      }
    </>
  );
};

export default TaskBoardPicker;
