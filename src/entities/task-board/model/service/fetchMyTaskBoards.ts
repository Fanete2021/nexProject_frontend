import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskBoard } from '../types/taskBoard.ts';

export interface FetchMyTaskBoardsProps {
  teamId: string;
}

export const fetchMyTaskBoards = createAsyncThunk<TaskBoard[], FetchMyTaskBoardsProps, ThunkConfig<string>> (
  'taskBoard/fetchMyTaskBoards',
  async (fetchMyTaskBoardsData, thunkAPI) => {
    const {
      extra,
      rejectWithValue
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/board/getTeamBoards', {
        params: fetchMyTaskBoardsData
      });

      const { boards, teamId } = response.data;

      const result: TaskBoard[] = boards.map(board => ({
        boardId: board.boardId,
        boardName: board.boardName,
        teamId: teamId
      }));

      return result;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
