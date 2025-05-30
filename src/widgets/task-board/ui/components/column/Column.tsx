import React from 'react';
import { useDrop } from 'react-dnd';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from '../../model/types/column.ts';
import Task from '../task/Task.tsx';
import styles from './Column.module.scss';
import { useTranslation } from 'react-i18next';
import { TaskInfo } from '@/entities/task';

export interface ColumnProps {
  column: ColumnType;
  onDrop: (taskId: string, newStatusId: string) => void;
  className?: string;
  onClickTask: (taskId: string) => void;
  selectedTask?: TaskInfo;
}

const Column: React.FC<ColumnProps> = (props) => {
  const { column, onDrop, className, onClickTask, selectedTask  } = props;

  const { status, tasks } = column;

  const { t } = useTranslation();

  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: () => ({ statusId: column.status.statusId }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={classNames(styles.column, [className], { [styles.isOver]: isOver })}
    >
      <div className={styles.header}>
        {t(status.statusName) as string}
      </div>

      <div className={styles.tasks}>
        {tasks.map((task) => (
          <Task
            key={task.taskId}
            task={task}
            onDrop={onDrop}
            onClick={onClickTask}
            className={classNames('', [], {
              [styles.selectedTask]: task.taskId === selectedTask?.taskId
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
