import { TaskPriorities } from './taskPriorities.ts';

export interface EditTask {
  taskId: string;
  newTaskName?: string;
  newTaskDescription?: string;
  newTaskStatusId?: string;
  newTaskPriority?: TaskPriorities;
  newExecutorId?: string;
  newLabel?: string | string[];
  newComment?: string;
  newSubtaskIds?: string[];
  checkLists?: {
    checkListTaskName: string;
    checkListTaskStatus: boolean;
  }[];
}
