import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskBoard } from '../types/taskBoard.ts';

interface CreateTaskBoardProps {
  teamId: string;
  boardName: string;
}

export const createTaskBoard = createAsyncThunk<TaskBoard, CreateTaskBoardProps, ThunkConfig<string>> (
  'taskBoard/createTaskBoard',
  async (createTaskBoardData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/team/board/createBoard', createTaskBoardData, {
        params: {
          teamId: createTaskBoardData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
