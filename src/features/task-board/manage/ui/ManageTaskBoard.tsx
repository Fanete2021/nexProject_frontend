import styles from './ManageTaskBoard.module.scss';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import { useSelector } from 'react-redux';
import { getTeamData, TeamInfo } from '@/entities/team';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { TaskBoard, TaskBoardInfo, fetchMyTaskBoards } from '@/entities/task-board';
import { TeamPicker } from '@/widgets/pickers/team-picker';
import { TaskBoardPicker } from '@/widgets/pickers/task-board-picker';
import { CreateTaskFormModal } from '@/features/task/create';
import { TaskBoardView } from '@/widgets/task-board';
import { editTask, TaskInfo, fetchTaskInfo } from '@/entities/task';

const ManageTaskBoard = () => {
  const dispatch = useAppDispatch();
  
  const teams = useSelector(getTeamData)!;

  const [taskBoards, setTaskBoards] = useState<TaskBoard[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo>();
  const [selectedTaskBoard, setSelectedTaskBoard] = useState<TaskBoardInfo>();
  const [isOpenCreatorTask, setIsOpenCreatorTask] = useState<boolean>(false);

  useEffect(() => {
    const setupBoards = async () => {
      try {
        const response = await dispatch(fetchMyTaskBoards({ teamId: selectedTeam!.teamId }));

        setTaskBoards(response.payload);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedTeam) {
      setupBoards();
    }
  }, [selectedTeam]);

  const closeCreatorTaskHandler = useCallback(() => setIsOpenCreatorTask(false), []);
  const openCreatorTaskHandler = useCallback(() => {
    setIsOpenCreatorTask(true);
  }, []);

  const onCreateTaskHandler = useCallback(() => {
    closeCreatorTaskHandler();
  }, []);
  
  const updateTaskStatus = async (taskId: string, newStatusId: string) => {
    const task = selectedTaskBoard!.boardTasks.find(task => task.taskId === taskId);

    if (task && task.status.statusId === newStatusId) {
      return;
    }

    try {
      const response = await dispatch(editTask({
        editTask: {
          taskId: taskId,
          newTaskStatusId: newStatusId
        },
        teamId: selectedTeam!.teamId,
      }));
      
      const editableTask: TaskInfo = response.payload;

      const updatedTasks = selectedTaskBoard!.boardTasks.map(task =>
        task.taskId === taskId
          ? editableTask
          : task
      );

      setSelectedTaskBoard({
        ...selectedTaskBoard!,
        boardTasks: updatedTasks
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTaskInfo = async (taskId: string) => {
    try {
      const response = await dispatch(fetchTaskInfo({
        taskId,
        boardId: selectedTaskBoard!.boardId,
        teamId: selectedTeam!.teamId
      }));

      return response.payload;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.ManageBoard}>
      <div className={styles.header}>
        <SidebarOpener className={styles.sidebarOpener}/>

        <TeamPicker
          teams={teams}
          onSelect={setSelectedTeam}
          classes={{
            image: styles.teamPickerImage,
            text: styles.teamPickerText,
            iconArrow: styles.teamPickerIconArrow,
          }}
        />

        {selectedTeam &&
          <TaskBoardPicker
            teamId={selectedTeam.teamId}
            boards={taskBoards}
            hasCreateBoard
            onSelect={setSelectedTaskBoard}
          />
        }

        {selectedTaskBoard && selectedTeam &&
          <>
            <button onClick={openCreatorTaskHandler}>Создать задачу</button>

            <CreateTaskFormModal
              board={selectedTaskBoard}
              teamId={selectedTeam.teamId}
              isOpen={isOpenCreatorTask}
              onClose={closeCreatorTaskHandler}
              onCreateHandler={onCreateTaskHandler}
            />
          </>
        }
      </div>

      {selectedTaskBoard && (
        <TaskBoardView
          taskBoard={selectedTaskBoard}
          changeStatus={updateTaskStatus}
          getTaskInfo={getTaskInfo}
        />
      )}
    </div>
  );
};

export default ManageTaskBoard;
