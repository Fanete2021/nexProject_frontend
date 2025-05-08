import { Task } from './task.ts';

export interface TaskInfo extends Task {
  boardId: string;
  boardName: string;
  taskDescription: string;
  authorId: string;
  authorName: string;
  labels: {
    labelId: string;
    labelName: string;
  }[];
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  complexity: string; //Оценка сложности
  subtasks: {
    taskId: string;
    taskName: string;
  };
  checkLists: {
    checkListTaskId: string;
    checkListTaskName: string;
    checkListTaskStatus: boolean;
  }
}
