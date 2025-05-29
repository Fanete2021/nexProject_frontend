import { TaskBoardInfo } from '@/entities/task-board';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styles from './TaskBoardView.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from './model/types/column.ts';
import Column from './components/column/Column.tsx';
import { EditTask, editTask, fetchTaskInfo, TaskInfo } from '@/entities/task';
import { TaskInfoCard } from '@/shared/ui/index.ts';
import { Scrollbar } from '@/shared/ui';
import { getUserData } from '@/entities/user';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';

export interface TaskBoardViewProps {
  taskBoard: TaskBoardInfo;
  className?: string;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const user = useSelector(getUserData)!;

  const [taskBoard, setTaskBoard] = useState<TaskBoardInfo>(props.taskBoard);
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [selectedTask, setSelectedTask] = useState<TaskInfo>();

  useEffect(() => {
    const newColumns: ColumnType[] = taskBoard.boardStatuses.map((status) => {
      const tasks = taskBoard.boardTasks.filter((task) => task.status.statusId === status.statusId);
      return {
        status: status,
        tasks: tasks,
      };
    });

    setColumns(newColumns);
  }, [taskBoard]);

  const updateTask = async (updatedTask: EditTask) => {
    const task = taskBoard.boardTasks.find(task => task.taskId === updatedTask.taskId);

    if (!task || (task.status.statusId === updatedTask.newTaskStatusId)) {
      return;
    }

    try {
      const response = await dispatch(editTask({
        editTask: updatedTask,
        teamId: taskBoard.teamId,
      }));

      const editableTask: TaskInfo = response.payload;

      const updatedTasks = taskBoard.boardTasks.map(task =>
        task.taskId === updatedTask.taskId
          ? editableTask
          : task
      );

      setTaskBoard({
        ...taskBoard,
        boardTasks: updatedTasks
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = (taskId: string, newStatusId: string) => {
    updateTask({
      taskId,
      newTaskStatusId: newStatusId,
    });
  };

  const onClickTaskHandler = async (taskId: string) => {
    try {
      const response = await dispatch(fetchTaskInfo({
        taskId,
        boardId: taskBoard.boardId,
        teamId: taskBoard.teamId
      }));

      setSelectedTask(response.payload);
      return response.payload;
    } catch (error) {
      console.log(error);
    }
  };

  const assignYourself = (taskId: string) => {
    updateTask({
      taskId,
      newExecutorId: user.userId,
    });
  };

  return (
    <div className={styles.TaskBoardViewWrapper}>
      <div className={styles.filters}>
        <div className={styles.title}>ФИЛЬТРЫ:</div>

        <div className={styles.filter}>
          Только мои задачи
        </div>
      </div>

      <div className={styles.TaskBoardView}>
        <Scrollbar>
          <DndProvider backend={HTML5Backend}>
            <div className={classNames(styles.columns, [className])}>
              {columns.map((column) => (
                <Column
                  key={column.status.statusId}
                  column={column}
                  onDrop={handleDrop}
                  className={styles.column}
                  onClickTask={onClickTaskHandler}
                  selectedTask={selectedTask}
                />
              ))}
            </div>
          </DndProvider>
        </Scrollbar>

        {selectedTask && (
          <TaskInfoCard
            taskInfo={selectedTask}
            className={styles.selectedTask}
            assignYourself={assignYourself}
          />
        )}
      </div>
    </div>
  );
};

export default TaskBoardView;
