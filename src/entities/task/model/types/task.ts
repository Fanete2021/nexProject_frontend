import { TaskStatus } from './taskStatus.ts';
import { TaskPriorities } from './taskPriorities.ts';

export interface Task {
  taskId: string;
  taskName: string;
  status: TaskStatus;
  priority: TaskPriorities;
  executorId: string;
  executorName: string;
}
