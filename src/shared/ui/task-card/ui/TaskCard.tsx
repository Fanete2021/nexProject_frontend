import { Avatar } from '@/shared/ui';
import { Task } from '@/entities/task';
import styles from './TaskCard.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { getPriorityElement } from '@/shared/lib/utils/getPriorityElement.tsx';

export interface TaskCardProps extends React.HTMLProps<HTMLDivElement> {
  task: Task;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = (props) => {
  const { task, className, ...rest } = props;

  return (
    <div
      {...rest}
      className={classNames(styles.task, [className])}
    >
      <div className={styles.leftPanel}>
        <div className={styles.name}>{task.taskName}</div>

        <div className={styles.priority}>
          {getPriorityElement(task.priority)}
        </div>
      </div>

      <div className={styles.rightPanel}>
        {task.executorName && <Avatar text={task.executorName} width={30} height={30} />}
      </div>
    </div>
  );
};

export default TaskCard;
