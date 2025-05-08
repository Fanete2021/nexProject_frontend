import { TaskBoardInfo } from '@/entities/task-board';
import { useEffect, useState } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import styles from './TaskBoardView.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from './model/types/column.ts';
import Column from './components/column/Column.tsx';
import { TaskInfo } from '@/entities/task';

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

  console.log(selectedTask)

  return (
    <div className={styles.TaskBoardView}>
      <DndProvider backend={HTML5Backend}>
        <div className={classNames(styles.columns, [className])}>
          {columns.map((column) => (
            <Column
              key={column.status.statusId}
              column={column}
              onDrop={handleDrop}
              className={styles.column}
              onClickTask={onClickTaskHandler}
            />
          ))}
        </div>
      </DndProvider>

      {selectedTask && (
        <div className={styles.selectedTask}>
          <div>
            {selectedTask.taskName}
          </div>

          <div>
            {selectedTask.status.statusName}
          </div>

          <div>
            {selectedTask.priority}
          </div>

          <div>
            {selectedTask.taskDescription}
          </div>

          <div>
            Автор: {selectedTask.authorName ? selectedTask.authorName : '-'}
          </div>

          <div>
            Исполнитель: {selectedTask.executorName ? selectedTask.executorName : '-'}
          </div>

          <div>
            {selectedTask.labels.map(label => (
              <span key={label.labelId}>{label.labelName} </span>
            ))}
          </div>

          <div>
            Создана: {selectedTask.createdAt.toLocaleString()}
          </div>

          <div>
            Обновлена: {selectedTask.updatedAt.toLocaleString() ? selectedTask.updatedAt.toLocaleString() : '-'}
          </div>

          <div>
            Завершена: {selectedTask.completedAt ? selectedTask.completedAt.toLocaleString() : '-'}
          </div>

          <div>
            Оценка сложности: {selectedTask.complexity ? selectedTask.complexity : '-'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoardView;
