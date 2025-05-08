import { ManageTaskBoard } from '@/features/task-board/manage';
import styles from './TasksPage.module.scss';

const TasksPage = () => {
  return (
    <div className={styles.TasksPage}>
      <ManageTaskBoard />
    </div>
  );
};

export default TasksPage;
