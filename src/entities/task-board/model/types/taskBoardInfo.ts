import { TaskBoardStatus } from './taskBoardStatus.ts';
import { Task } from '@/entities/task';

export interface TaskBoardInfo {
  boardId: string;
  boardName: string;
  boardDescription: string;
  teamId: string;
  teamName: string;
  boardStatuses: TaskBoardStatus[];
  boardTasks: Task[];
}
