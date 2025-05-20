import { Task as TaskType } from '@/entities/task';
import { useDrag } from 'react-dnd';
import { TaskCard } from '@/shared/ui';
import styles from './Task.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface TaskProps {
  task: TaskType;
  onDrop: (taskId: string, newStatusId: string) => void;
  onClick: (taskId: string) => void;
  className?: string;
}

const Task: React.FC<TaskProps> = (props) => {
  const { onDrop, task, onClick, className } = props;
  
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.taskId },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(item.id, dropResult.statusId);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onClick(task.taskId)}
    >
      <TaskCard task={task} className={classNames(styles.task, [className])}/>
    </div>
  );
};

export default Task;
