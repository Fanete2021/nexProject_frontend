import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskBoardInfo } from '../types/taskBoardInfo.ts';

export interface FetchTaskBoardInfoProps {
  teamId: string;
  boardId: string;
}

export const fetchTaskBoardInfo = createAsyncThunk<TaskBoardInfo, FetchTaskBoardInfoProps, ThunkConfig<string>> (
  'taskBoard/fetchBoardInfo',
  async (fetchTaskBoardInfoData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/board/getBoard', {
        params: fetchTaskBoardInfoData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
