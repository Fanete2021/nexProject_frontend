import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';

interface GetUserTasksCompleteProps {
  userId: string;
  teamId: string;
  startDate: string; //милисекунды
  endDate: string;
}

interface GetUserTasksCompleteResponse {
  userId: string;
  userName: string;
  startDate: Date;
  endDate: Date;
  boards: {
    boardId: string;
    boardName: string;
    tasksCompletedCount: number;
  }
  totalTasksCompletedCount: number;
}

export const getUserTasksComplete = createAsyncThunk<
  GetUserTasksCompleteResponse, 
  GetUserTasksCompleteProps, 
  ThunkConfig<string>
> 
(
  'taskBoardStats/getUserTasksComplete',
  async (getUserTasksCompleteData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.get('/team/monitoring/userTaskComplete', {
        params: getUserTasksCompleteData
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
