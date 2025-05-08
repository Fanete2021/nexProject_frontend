import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/store-provider';
import { TaskInfo } from '../types/taskInfo.ts';
import { EditTask } from '../types/editTask.ts';

interface EditTaskProps {
  teamId: string;
  editTask: EditTask;
}

export const editTask = createAsyncThunk<TaskInfo, EditTaskProps, ThunkConfig<string>> (
  'task/editTask',
  async (editTaskData, thunkAPI) => {
    const {
      extra,
      rejectWithValue,
    } = thunkAPI;

    try {
      const response = await extra.api.put('/team/task/editTask', editTaskData.editTask, {
        params: {
          teamId: editTaskData.teamId
        }
      });

      return response.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
