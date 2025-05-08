import { TaskBoard } from './model/types/taskBoard.ts';
import { TaskBoardInfo } from './model/types/taskBoardInfo.ts';
import { TaskBoardStatus } from './model/types/taskBoardStatus.ts';
import { fetchMyTaskBoards } from './model/service/fetchMyTaskBoards.ts';
import { fetchTaskBoardInfo } from './model/service/fetchTaskBoardInfo.ts';
import { createTaskBoard } from './model/service/createTaskBoard.ts';

export type {
  TaskBoard,
  TaskBoardInfo,
  TaskBoardStatus
};

export {
  fetchMyTaskBoards,
  fetchTaskBoardInfo,
  createTaskBoard
};
