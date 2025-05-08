import { TaskBoardInfo } from '@/entities/task-board';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styles from './TaskBoardView.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from './model/types/column.ts';
import Column from './components/column/Column.tsx';

export interface TaskBoardViewProps {
  taskBoard: TaskBoardInfo;
  changeStatus?: (taskId: string, newStatusId: string) => void;
  className?: string;
}

const TaskBoardView: React.FC<TaskBoardViewProps> = (props) => {
  const { taskBoard, className, changeStatus } = props;
  const [columns, setColumns] = useState<ColumnType[]>([]);

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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={classNames(styles.TaskBoardView, [className])}>
        {columns.map((column) => (
          <Column
            key={column.status.statusId}
            column={column}
            onDrop={handleDrop}
            className={styles.column}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default TaskBoardView;
