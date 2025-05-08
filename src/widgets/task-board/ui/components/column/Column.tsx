import React from 'react';
import { useDrop } from 'react-dnd';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { ColumnType } from '../../model/types/column.ts';
import Task from '../task/Task.tsx';
import styles from './Column.module.scss';

export interface ColumnProps {
  column: ColumnType;
  onDrop: (taskId: string, newStatusId: string) => void;
  className?: string;
  onClickTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = (props) => {
  const { column, onDrop, className, onClickTask  } = props;

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
        {column.status.statusName}
      </div>

      <div className={styles.tasks}>
        {column.tasks.map((task) => (
          <Task key={task.taskId} task={task} onDrop={onDrop} onClick={onClickTask}/>
        ))}
      </div>
    </div>
  );
};

export default Column;
