import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskInfo } from '../types/taskInfo.ts';
import { NewTask } from '../types/newTask.ts';

interface CreateTaskProps {
  teamId: string;
  newTask: NewTask;
}

export const createTask = createAsyncThunk<TaskInfo, CreateTaskProps, ThunkConfig<string>> (
  'task/createTask',
  async (createTaskData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.post('/team/task/createTask', createTaskData.newTask, {
        params: {
          teamId: createTaskData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
