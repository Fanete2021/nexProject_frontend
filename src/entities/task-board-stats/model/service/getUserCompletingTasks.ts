import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface getUserCompletingTasksProps {
  userId: string;
  teamId: string;
}

interface getUserCompletingTasksResponse {
  userId: string;
  userName: string;
  taskCompletedCount: number;
  tasks: {
    boardId: string;
    boardName: string;
    completedTasks: {
      taskId: string;
      taskName: string;
      timeSpentOnCompletingTask: number;
    }
  }[]
}

export const getUserCompletingTasks = createAsyncThunk<
  getUserCompletingTasksResponse,
  getUserCompletingTasksProps,
  ThunkConfig<string>
>
(
  'taskBoardStats/getUserCompletingTasks',
  async (getUserCompletingTasksData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/monitoring/userCompletingTasks', {
        params: getUserCompletingTasksData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
