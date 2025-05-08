import { TaskBoardStatus } from '@/entities/task-board';
import { Task } from '@/entities/task';

export type ColumnType = {
  status: TaskBoardStatus;
  tasks: Task[];
}
