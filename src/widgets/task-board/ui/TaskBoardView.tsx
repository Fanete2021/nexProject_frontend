import { TaskBoardInfo } from '@/entities/task-board';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styles from './TaskBoardView.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from './model/types/column.ts';
import Column from './components/column/Column.tsx';
import { TaskInfo } from '@/entities/task';
import { TaskInfoCard } from '@/shared/ui/index.ts';
import { Scrollbar } from '@/shared/ui';

export interface TaskBoardViewProps {
  taskBoard: TaskBoardInfo;
  getTaskInfo: (taskId: string) => Promise<TaskInfo>;
  changeStatus?: (taskId: string, newStatusId: string) => void;
  className?: string;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = (props) => {
  const { taskBoard, className, changeStatus, getTaskInfo } = props;

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

  const handleDrop = (taskId: string, newStatusId: string) => {
    if (changeStatus) {
      changeStatus(taskId, newStatusId);
    }
  };

  const onClickTaskHandler = async (taskId: string) => {
    const taskInfo = await getTaskInfo(taskId);
    setSelectedTask(taskInfo);
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
          />
        )}
      </div>
    </div>
  );
};

export default TaskBoardView;
