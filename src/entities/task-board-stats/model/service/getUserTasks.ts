import { Task } from '@/entities/task';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface GetUserTasksProps {
  userId: string;
  teamId: string;
}

interface GetUserTasksResponse {
  userId: string;
  userName: string;
  tasks: {
    boardId: string;
    boardName: string;
    userTasks: Task[]
  }[]
}

export const getUserTasks = createAsyncThunk<GetUserTasksResponse, GetUserTasksProps, ThunkConfig<string>> (
  'taskBoardStats/getUserTasks',
  async (getUserTasksData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/monitoring/userTasks', {
        params: getUserTasksData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
