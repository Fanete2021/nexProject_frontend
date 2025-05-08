import {TaskPriorities} from "@/entities/task";

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
