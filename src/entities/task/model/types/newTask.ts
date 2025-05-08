import { TaskPriorities } from './taskPriorities.ts';

export interface NewTask {
  boardId: string;
  taskName: string;
  taskDescription?: string;
  statusId: string;
  priority: TaskPriorities;
  executorId?: string;
  tagLabelIds?: string[];
  complexity?: string;
  subtaskIds?: string[];
  checkLists?: {
    checkListTaskName: string;
  }[];
}
