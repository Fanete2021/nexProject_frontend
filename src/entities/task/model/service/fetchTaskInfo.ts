import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskInfo } from '../types/taskInfo.ts';

interface FetchTaskInfoProps {
  teamId: string;
  boardId: string;
  taskId: string;
}

export const fetchTaskInfo = createAsyncThunk<TaskInfo, FetchTaskInfoProps, ThunkConfig<string>> (
  'task/fetchTaskInfo',
  async (fetchTaskInfoData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/task/getTask', {
        params: fetchTaskInfoData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
